export type EquipmentType = "panel" | "inverter" | "battery" | "ev_charger";
export type Role = "admin" | "editor" | "viewer";

export interface Manufacturer {
  id: number;
  name: string;
  slug: string;
  country: string;
  city: string;
  founded_year: number;
  website: string;
  logo_url: string;
  description: string;
}

export interface ManufacturerBrief {
  id: number;
  name: string;
  logo_url: string;
}

export interface Equipment {
  id: number;
  model_name: string;
  equipment_type: EquipmentType;
  power_rating_w: number;
  efficiency_percent: number;
  warranty_years: number;
  weight_kg: number;
  dimensions: { w: number; h: number; d: number };
  price: number;
  certification: string;
  release_year: number;
  image_url: string | null;
  description: string;
  extra_fields: Record<string, unknown> | null;
  manufacturer: ManufacturerBrief;
}

export interface EquipmentDetail extends Equipment {
  manufacturer_id: number;
  manufacturer: Manufacturer;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export interface LoginResponse {
  message: string;
  user: User;
}
