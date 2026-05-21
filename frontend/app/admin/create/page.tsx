"use client";

import { EquipmentForm } from "@/components/equipment-form";

export default function CreateEquipmentPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create Equipment</h1>
      <EquipmentForm />
    </main>
  );
}
