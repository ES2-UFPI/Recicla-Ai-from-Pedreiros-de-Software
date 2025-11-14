// dados mockados para testes ou desenvolvimento
import { InventoryItem } from "@/types/inventoryItem";
import { PackageComponent } from "./types/packageComponent";
import { useState } from "react";

export const mockInventory: InventoryItem[] = [
    {
      id: 1,
      user_id: 1,
      item_id: 1,
      quantity: 15,
      available_quantity: 15,
      total_weight: 7.5,
      created_at: new Date().toISOString(),
      excluded: 0,
      item: {
        id: 1,
        nome: 'Garrafa PET',
        value: 0.5,
        weight: 0.1,
        excluded: 0,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 2,
      user_id: 1,
      item_id: 2,
      quantity: 20,
      available_quantity: 20,
      total_weight: 10,
      created_at: new Date().toISOString(),
      excluded: 0,
      item: {
        id: 2,
        nome: 'Lata de Alumínio',
        value: 1.0,
        weight: 0.2,
        excluded: 0,
        created_at: new Date().toISOString(),
      },
    },
    {
      id: 3,
      user_id: 1,
      item_id: 3,
      quantity: 8,
      available_quantity: 8,
      total_weight: 16,
      created_at: new Date().toISOString(),
      excluded: 0,
      item: {
        id: 3,
        nome: 'Papelão',
        value: 0.3,
        weight: 0.3,
        excluded: 0,
        created_at: new Date().toISOString(),
      },
    },
];
export const mockPackages: PackageComponent[] = [];
export function setInventoryData(newInventory: InventoryItem[]) {
    mockInventory.length = 0;
    mockInventory.push(...newInventory);
}