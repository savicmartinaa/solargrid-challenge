"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EquipmentForm } from "@/components/equipment-form";
import { api } from "@/lib/api";
import { EquipmentDetail } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function EditEquipmentPage() {
  const params = useParams();
  const [equipment, setEquipment] = useState<EquipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<EquipmentDetail>(`/api/equipment/${params.id}`)
      .then(setEquipment)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12 text-center text-muted-foreground">
        Loading...
      </main>
    );
  }

  if (!equipment) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12 text-center text-red-600">
        Equipment not found
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit: {equipment.model_name}</h1>
      <EquipmentForm equipment={equipment} />
    </main>
  );
}
