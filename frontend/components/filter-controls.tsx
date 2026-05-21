"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EquipmentType, Manufacturer } from "@/lib/types";

interface FilterControlsProps {
  selectedType: EquipmentType | "";
  onTypeChange: (type: EquipmentType | "") => void;
  selectedManufacturer: number | "";
  onManufacturerChange: (id: number | "") => void;
  manufacturers: Manufacturer[];
}

const EQUIPMENT_TYPES: { value: EquipmentType; label: string }[] = [
  { value: "panel", label: "Panels" },
  { value: "inverter", label: "Inverters" },
  { value: "battery", label: "Batteries" },
  { value: "ev_charger", label: "EV Chargers" },
];

export function FilterControls({
  selectedType,
  onTypeChange,
  selectedManufacturer,
  onManufacturerChange,
  manufacturers,
}: FilterControlsProps) {
  return (
    <div className="flex gap-3">
      <Select
        value={selectedType || "all"}
        onValueChange={(val) => onTypeChange(val === "all" ? "" : (val as EquipmentType))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All types">
            {(value: string) => {
              if (!value || value === "all") return "All types";
              return EQUIPMENT_TYPES.find((t) => t.value === value)?.label ?? value;
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          {EQUIPMENT_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedManufacturer ? String(selectedManufacturer) : "all"}
        onValueChange={(val) =>
          onManufacturerChange(val === "all" ? "" : Number(val))
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All manufacturers">
            {(value: string) => {
              if (!value || value === "all") return "All manufacturers";
              return manufacturers.find((m) => String(m.id) === value)?.name ?? value;
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All manufacturers</SelectItem>
          {manufacturers.map((m) => (
            <SelectItem key={m.id} value={String(m.id)}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
