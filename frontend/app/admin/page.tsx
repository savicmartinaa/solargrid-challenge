"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { Equipment } from "@/lib/types";

const TYPE_LABELS: Record<string, string> = {
  panel: "Panel",
  inverter: "Inverter",
  battery: "Battery",
  ev_charger: "EV Charger",
};

const TYPE_BADGE_CLASSES: Record<string, string> = {
  panel: "border-amber-200 bg-amber-50 text-amber-800",
  inverter: "border-indigo-200 bg-indigo-50 text-indigo-800",
  battery: "border-emerald-200 bg-emerald-50 text-emerald-800",
  ev_charger: "border-sky-200 bg-sky-50 text-sky-800",
};

export default function AdminPage() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEquipment = () => {
    return api<Equipment[]>("/api/equipment")
      .then(setEquipment)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setLoading(true);
    try {
      await api(`/api/equipment/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      await fetchEquipment();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Equipment Management</h1>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="border-emerald-900 bg-white text-emerald-900 shadow-sm hover:border-emerald-950 hover:bg-emerald-50 hover:text-emerald-950 hover:shadow-md"
            >
              View catalog
            </Button>
          </Link>
          <Link href="/admin/create">
            <Button className="bg-emerald-700 text-white hover:bg-emerald-800">
              Add New Equipment
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="border rounded-lg">
          <Table className="[&_td]:px-4 [&_th]:px-4">
            <TableHeader>
              <TableRow>
                <TableHead className="px-4">Model</TableHead>
                <TableHead className="px-4">Type</TableHead>
                <TableHead className="px-4">Manufacturer</TableHead>
                <TableHead className="px-4">Price</TableHead>
                <TableHead className="px-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-4 font-medium">
                    {item.model_name}
                  </TableCell>
                  <TableCell className="px-4">
                    <Badge
                      variant="outline"
                      className={TYPE_BADGE_CLASSES[item.equipment_type]}
                    >
                      {TYPE_LABELS[item.equipment_type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4">{item.manufacturer.name}</TableCell>
                  <TableCell>€{Number(item.price).toLocaleString()}</TableCell>
                  <TableCell className="px-4 text-right space-x-2">
                    <Link href={`/admin/${item.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    {user?.role === "admin" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteTarget(item)}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Equipment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.model_name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
