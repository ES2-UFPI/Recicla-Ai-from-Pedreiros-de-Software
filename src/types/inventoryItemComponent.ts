import { InventoryComponent } from "./inventoryComponent";
import { InventoryItem } from "./inventoryItem";

export class InventoryItemComponent implements InventoryComponent {
    public item: InventoryItem;
    constructor(item: InventoryItem) {
        this.item = item;
    }

    getValue(): number {
        return this.item.quantity * this.item.item.value;
    }

    getName(): string {
        return this.item.item.name;
    }
}