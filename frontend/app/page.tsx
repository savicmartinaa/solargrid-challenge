"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EquipmentCard } from "@/components/equipment-card";
import { SearchBar } from "@/components/search-bar";
import { FilterControls } from "@/components/filter-controls";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Equipment, EquipmentType, Manufacturer } from "@/lib/types";

export default function CatalogPage() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<EquipmentType | "">("");
  const [manufacturerFilter, setManufacturerFilter] = useState<number | "">("");
  const [loading, setLoading] = useState(true);

  const handleSearchChange = (value: string) => {
    setLoading(true);
    setSearch(value);
  };

  const handleTypeChange = (value: EquipmentType | "") => {
    setLoading(true);
    setTypeFilter(value);
  };

  const handleManufacturerChange = (value: number | "") => {
    setLoading(true);
    setManufacturerFilter(value);
  };

  useEffect(() => {
    api<Manufacturer[]>("/api/manufacturers").then(setManufacturers);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (typeFilter) params.set("type", typeFilter);
    if (manufacturerFilter) params.set("manufacturer_id", String(manufacturerFilter));

    const query = params.toString();
    api<Equipment[]>(`/api/equipment${query ? `?${query}` : ""}`)
      .then(setEquipment)
      .finally(() => setLoading(false));
  }, [search, typeFilter, manufacturerFilter]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">SolarGrid Equipment Catalog</h1>

      <div className="flex flex-col gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap lg:flex-1">
          <SearchBar value={search} onChange={handleSearchChange} />
          <FilterControls
            selectedType={typeFilter}
            onTypeChange={handleTypeChange}
            selectedManufacturer={manufacturerFilter}
            onManufacturerChange={handleManufacturerChange}
            manufacturers={manufacturers}
          />
        </div>

        {(user?.role === "admin" || user?.role === "editor") && (
          <Link href="/admin" className="lg:ml-auto">
            <Button className="w-full bg-emerald-700 text-white hover:bg-emerald-800 sm:w-auto">
              Manage Equipment
            </Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading equipment...
        </div>
      ) : equipment.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No equipment found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equipment.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>
      )}
    </main>
  );
}
