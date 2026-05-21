import { EquipmentType } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const DEFAULT_IMAGES: Record<EquipmentType, string> = {
  panel: "/images/panel.svg",
  inverter: "/images/inverter.svg",
  battery: "/images/battery.svg",
  ev_charger: "/images/ev_charger.svg",
};

export function getEquipmentImage(
  imageUrl: string | null,
  type: EquipmentType
): string {
  if (imageUrl?.startsWith("/uploads/")) {
    return `${API_BASE}${imageUrl}`;
  }
  if (imageUrl && (imageUrl.startsWith("/") || imageUrl.startsWith("http"))) {
    return imageUrl;
  }
  return DEFAULT_IMAGES[type];
}

export function isUploadedEquipmentImage(src: string): boolean {
  return src.startsWith(`${API_BASE}/uploads/`);
}
