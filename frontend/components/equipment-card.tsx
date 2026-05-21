"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Equipment } from "@/lib/types";
import { getEquipmentImage, isUploadedEquipmentImage } from "@/lib/images";

interface EquipmentCardProps {
  equipment: Equipment;
}

const TYPE_LABELS: Record<string, string> = {
  panel: "Panel",
  inverter: "Inverter",
  battery: "Battery",
  ev_charger: "EV Charger",
};

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const imageSrc = getEquipmentImage(equipment.image_url, equipment.equipment_type);

  return (
    <Link href={`/equipment/${equipment.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          <Image
            src={imageSrc}
            alt={equipment.model_name}
            fill
            unoptimized={isUploadedEquipmentImage(imageSrc)}
            className="object-contain p-4"
          />
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {TYPE_LABELS[equipment.equipment_type]}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {equipment.release_year}
            </span>
          </div>
          <h3 className="font-semibold text-lg leading-tight">
            {equipment.model_name}
          </h3>
          <div className="flex items-center gap-2">
            <Image
              src={equipment.manufacturer.logo_url}
              alt={equipment.manufacturer.name}
              width={20}
              height={20}
              className="rounded"
            />
            <span className="text-sm text-muted-foreground">
              {equipment.manufacturer.name}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm">
              {equipment.power_rating_w >= 1000
                ? `${(equipment.power_rating_w / 1000).toFixed(1)} kW`
                : `${equipment.power_rating_w} W`}
            </span>
            <span className="text-sm">{equipment.efficiency_percent}%</span>
            <span className="font-semibold">€{Number(equipment.price).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
