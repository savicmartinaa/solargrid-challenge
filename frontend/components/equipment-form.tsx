"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import { EquipmentDetail, EquipmentType, Manufacturer } from "@/lib/types";

interface EquipmentFormProps {
  equipment?: EquipmentDetail;
}

const EQUIPMENT_TYPES: { value: EquipmentType; label: string }[] = [
  { value: "panel", label: "Panel" },
  { value: "inverter", label: "Inverter" },
  { value: "battery", label: "Battery" },
  { value: "ev_charger", label: "EV Charger" },
];

export function EquipmentForm({ equipment }: EquipmentFormProps) {
  const router = useRouter();
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    model_name: equipment?.model_name || "",
    equipment_type: equipment?.equipment_type || ("panel" as EquipmentType),
    manufacturer_id: equipment?.manufacturer_id || 0,
    power_rating_w: equipment?.power_rating_w || 0,
    efficiency_percent: equipment?.efficiency_percent || 0,
    warranty_years: equipment?.warranty_years || 0,
    weight_kg: equipment?.weight_kg || 0,
    dimensions: equipment?.dimensions || { w: 0, h: 0, d: 0 },
    price: equipment?.price || 0,
    certification: equipment?.certification || "",
    release_year: equipment?.release_year || new Date().getFullYear(),
    image_url: equipment?.image_url || "",
    description: equipment?.description || "",
  });

  useEffect(() => {
    api<Manufacturer[]>("/api/manufacturers").then(setManufacturers);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      let imageUrl = form.image_url || null;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);

        const uploaded = await api<{ image_url: string }>(
          "/api/equipment/upload-image",
          {
            method: "POST",
            body: uploadData,
          }
        );
        imageUrl = uploaded.image_url;
      }

      const payload = {
        ...form,
        image_url: imageUrl,
        extra_fields: null,
      };

      if (equipment) {
        await api(`/api/equipment/${equipment.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/api/equipment", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const parseNumberInput = (value: string) =>
    value === "" ? "" : Number(value);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model_name">Model Name</Label>
          <Input
            id="model_name"
            value={form.model_name}
            onChange={(e) => updateField("model_name", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Equipment Type</Label>
          <Select
            value={form.equipment_type}
            onValueChange={(val) => updateField("equipment_type", val)}
          >
            <SelectTrigger>
              <SelectValue>
                {(value: string) =>
                  EQUIPMENT_TYPES.find((t) => t.value === value)?.label ?? value
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {EQUIPMENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Manufacturer</Label>
          <Select
            value={form.manufacturer_id ? String(form.manufacturer_id) : ""}
            onValueChange={(val) => updateField("manufacturer_id", Number(val))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select manufacturer">
                {(value: string) =>
                  manufacturers.find((m) => String(m.id) === value)?.name ?? value
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {manufacturers.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="power_rating_w">Power Rating (W)</Label>
          <Input
            id="power_rating_w"
            type="number"
            value={form.power_rating_w}
            onChange={(e) => updateField("power_rating_w", parseNumberInput(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="efficiency_percent">Efficiency (%)</Label>
          <Input
            id="efficiency_percent"
            type="number"
            step="0.1"
            value={form.efficiency_percent}
            onChange={(e) => updateField("efficiency_percent", parseNumberInput(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="warranty_years">Warranty (years)</Label>
          <Input
            id="warranty_years"
            type="number"
            value={form.warranty_years}
            onChange={(e) => updateField("warranty_years", parseNumberInput(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight_kg">Weight (kg)</Label>
          <Input
            id="weight_kg"
            type="number"
            step="0.1"
            inputMode="decimal"
            value={form.weight_kg}
            onChange={(e) => updateField("weight_kg", parseNumberInput(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (EUR)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => updateField("price", parseNumberInput(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="release_year">Release Year</Label>
          <Input
            id="release_year"
            type="number"
            value={form.release_year}
            onChange={(e) => updateField("release_year", parseNumberInput(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="certification">Certification</Label>
          <Input
            id="certification"
            value={form.certification}
            onChange={(e) => updateField("certification", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Dimensions (mm)</Label>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label htmlFor="dimensions_w" className="text-xs text-muted-foreground">
              Width
            </Label>
            <Input
              id="dimensions_w"
              type="number"
              value={form.dimensions.w}
              onChange={(e) =>
                updateField("dimensions", { ...form.dimensions, w: parseNumberInput(e.target.value) })
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="dimensions_h" className="text-xs text-muted-foreground">
              Height
            </Label>
            <Input
              id="dimensions_h"
              type="number"
              value={form.dimensions.h}
              onChange={(e) =>
                updateField("dimensions", { ...form.dimensions, h: parseNumberInput(e.target.value) })
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="dimensions_d" className="text-xs text-muted-foreground">
              Depth
            </Label>
            <Input
              id="dimensions_d"
              type="number"
              value={form.dimensions.d}
              onChange={(e) =>
                updateField("dimensions", { ...form.dimensions, d: parseNumberInput(e.target.value) })
              }
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL (optional)</Label>
        <div className="flex gap-2">
          <Input
            id="image_url"
            type="url"
            value={form.image_url}
            onChange={(e) => updateField("image_url", e.target.value)}
            placeholder="https://..."
          />
          <Input
            id="image_file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
          <span className="flex h-8 shrink-0 items-center text-sm text-muted-foreground">
            or
          </span>
          <Label
            htmlFor="image_file"
            className="h-8 shrink-0 cursor-pointer rounded-lg border border-border bg-muted px-3 text-sm font-medium hover:bg-muted/80"
          >
            Upload image
          </Label>
        </div>
        {imageFile && (
          <p className="text-sm text-muted-foreground">{imageFile.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={4}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : equipment ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
