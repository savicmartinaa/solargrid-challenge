"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { EquipmentDetail } from "@/lib/types";
import { getEquipmentImage, isUploadedEquipmentImage } from "@/lib/images";

const TYPE_LABELS: Record<string, string> = {
  panel: "Panel",
  inverter: "Inverter",
  battery: "Battery",
  ev_charger: "EV Charger",
};

const EXTRA_FIELD_LABELS: Record<string, string> = {
  capacity_kwh: "Capacity (kWh)",
  chemistry: "Chemistry",
  connector_type: "Connector Type",
  cable_length_m: "Cable Length (m)",
};

export default function EquipmentDetailPage() {
  const params = useParams();
  const [equipment, setEquipment] = useState<EquipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<EquipmentDetail>(`/api/equipment/${params.id}`)
      .then(setEquipment)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600 mb-4">{error || "Equipment not found"}</p>
        <Link href="/">
          <Button variant="outline">Back to catalog</Button>
        </Link>
      </div>
    );
  }

  const imageSrc = getEquipmentImage(equipment.image_url, equipment.equipment_type);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          &lt;- Back to catalog
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          <Image
            src={imageSrc}
            alt={equipment.model_name}
            fill
            unoptimized={isUploadedEquipmentImage(imageSrc)}
            className="object-contain p-8"
          />
        </div>

        <div className="space-y-4">
          <div>
            <Badge variant="secondary" className="mb-2">
              {TYPE_LABELS[equipment.equipment_type]}
            </Badge>
            <h1 className="text-3xl font-bold">{equipment.model_name}</h1>
          </div>

          <p className="text-2xl font-semibold">
            EUR {Number(equipment.price).toLocaleString()}
          </p>

          <p className="text-muted-foreground">{equipment.description}</p>

          <Separator />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Power Rating</span>
              <p className="font-medium">
                {equipment.power_rating_w >= 1000
                  ? `${(equipment.power_rating_w / 1000).toFixed(1)} kW`
                  : `${equipment.power_rating_w} W`}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Efficiency</span>
              <p className="font-medium">{equipment.efficiency_percent}%</p>
            </div>
            <div>
              <span className="text-muted-foreground">Warranty</span>
              <p className="font-medium">{equipment.warranty_years} years</p>
            </div>
            <div>
              <span className="text-muted-foreground">Weight</span>
              <p className="font-medium">{equipment.weight_kg} kg</p>
            </div>
            <div>
              <span className="text-muted-foreground">Dimensions (mm)</span>
              <p className="font-medium">
                {equipment.dimensions.w} x {equipment.dimensions.h} x {equipment.dimensions.d}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Release Year</span>
              <p className="font-medium">{equipment.release_year}</p>
            </div>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">Certification</span>
            <p className="text-sm font-medium">{equipment.certification}</p>
          </div>

          {equipment.extra_fields && Object.keys(equipment.extra_fields).length > 0 && (
            <>
              <Separator />
              <section className="space-y-3">
                <h2 className="font-semibold">Type-specific fields</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(equipment.extra_fields).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-muted-foreground">
                        {EXTRA_FIELD_LABELS[key] || key}
                      </span>
                      <p className="font-medium">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          <Separator />

          <section className="space-y-4">
            <div className="flex items-start gap-4">
              <Image
                src={equipment.manufacturer.logo_url}
                alt={`${equipment.manufacturer.name} logo`}
                width={64}
                height={64}
                className="rounded border bg-background"
              />
              <div className="min-w-0">
                <h2 className="font-semibold">{equipment.manufacturer.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {equipment.manufacturer.city}, {equipment.manufacturer.country}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {equipment.manufacturer.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Founded</span>
                <p className="font-medium">{equipment.manufacturer.founded_year}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Country</span>
                <p className="font-medium">{equipment.manufacturer.country}</p>
              </div>
              <div>
                <span className="text-muted-foreground">City</span>
                <p className="font-medium">{equipment.manufacturer.city}</p>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Website URL</span>
                <p className="font-medium break-all">{equipment.manufacturer.website}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
