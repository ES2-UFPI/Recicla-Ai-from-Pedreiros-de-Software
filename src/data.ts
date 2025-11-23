// dados mockados para testes ou desenvolvimento
import { InventoryItem } from "@/types/inventoryItem";
import { PackageComponent } from "./types/packageComponent";
import { CollectionPoint } from "@/types/collectionPoint";
import { Offer } from "./types/offer";
import { History } from "./types/history";
// Try to load raw JSON data if available. We use require(...) so this keeps
// working even if `resolveJsonModule` is not enabled in tsconfig.
let rawData: any = {};
try {
  rawData = require('./data.json');
} catch {
  rawData = {};
}

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
export const mockPoints: CollectionPoint[] = [
  {
    id: "1",
    latitude: -5.0892,
    longitude: -42.8019,
    address: "Praça Pedro II, Centro, Teresina - PI",
    createdAt: new Date("2025-01-15"),
    distance: 2.5,
  },
  {
    id: "2",
    latitude: -5.0950,
    longitude: -42.7890,
    address: "Av. Frei Serafim, 2000, Centro, Teresina - PI",
    createdAt: new Date("2025-01-20"),
    distance: 3.2,
  },
  {
    id: "3",
    latitude: -5.0820,
    longitude: -42.8100,
    address: "Shopping Rio Poty, Av. Maranhão, Teresina - PI",
    createdAt: new Date("2025-02-01"),
    distance: 4.1,
  },
  {
    id: "4",
    latitude: -5.0750,
    longitude: -42.7950,
    address: "Parque da Cidadania, Teresina - PI",
    createdAt: new Date("2025-02-10"),
    distance: 5.8,
  },
];
const USER = "PRODUCER";

// Initialize mockOffers from data.json if available. Dates in JSON are ISO strings;
// convert them to Date objects for in-memory usage.
export const mockOffers: Offer[] = (rawData?.mockOffers || []).map((o: any) => ({
  creator: o.creator,
  date: o.date ? new Date(o.date) : new Date(),
  status: o.status,
  package: o.package,
}));

/**
 * Add an offer to the in-memory `mockOffers` and attempt to persist it to `src/data.json`.
 * Writing to the JSON file only works when running in Node (e.g., during development).
 */
export async function addOffer(offer: Offer): Promise<void> {
  mockOffers.push(offer);

  try {
    // Only attempt to write when running in a Node environment where 'fs' is available
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    const filePath = path.resolve(__dirname, 'data.json');

    let fileData: any = {};
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      fileData = raw ? JSON.parse(raw) : {};
    } catch {
      fileData = {};
    }

    const serializableOffers = mockOffers.map(o => ({
      ...o,
      date: o.date instanceof Date ? o.date.toISOString() : o.date,
    }));

    fileData.mockOffers = serializableOffers;
    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
  } catch (error) {
    // Ignore write errors in environments without fs (mobile runtime); keep in-memory data.
  }
}

export function getUserRole() {
  return USER;
}
export const mockHistory: History[] = [];
export function addHistory(history: History): void {
  mockHistory.push(history);
}