import { InventoryComponent } from './inventoryComponent';

export class PackageComponent implements InventoryComponent {
  private name: string;
  private id!: number;
  private children: InventoryComponent[] = [];

  constructor(name: string) {
    this.name = name;
  }
  add(component: InventoryComponent) {
    this.children.push(component);
  }

  remove(component: InventoryComponent) {
    this.children = this.children.filter(c => c !== component);
  }

  getValue(): number {
    return this.children.reduce((sum, c) => sum + c.getValue(), 0);
  }

  getName(): string {
    return this.name;
  }
  getChildren(): InventoryComponent[] {
    return this.children;
  }
  setChildren(children: InventoryComponent[]) {
    this.children = children;
  }
  setId(id: number) {
    this.id = id;
  }
  getId(): number { 
    return this.id;
  }
}