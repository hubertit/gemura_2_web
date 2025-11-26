import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  InventoryItem, 
  StockMovement, 
  InventoryStats, 
  StockAdjustment, 
  ImportResult 
} from '../models/inventory.models';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'Dairy Feed Premium',
      sku: 'DF-001',
      category: 'Animal Feed',
      quantity: 500,
      unit: 'kg',
      unitPrice: 1200,
      reorderLevel: 100,
      supplier: 'Rwanda Feeds Ltd',
      location: 'Warehouse A',
      status: 'In Stock',
      lastRestocked: new Date('2025-11-20'),
      description: 'High-quality dairy cattle feed'
    },
    {
      id: '2',
      name: 'Milk Containers (20L)',
      sku: 'MC-020',
      category: 'Equipment',
      quantity: 45,
      unit: 'pieces',
      unitPrice: 8500,
      reorderLevel: 20,
      supplier: 'Kigali Plastics',
      location: 'Storage Room B',
      status: 'In Stock',
      lastRestocked: new Date('2025-11-15')
    },
    {
      id: '3',
      name: 'Veterinary Antibiotics',
      sku: 'VA-101',
      category: 'Medicine',
      quantity: 15,
      unit: 'bottles',
      unitPrice: 25000,
      reorderLevel: 20,
      supplier: 'VetCare Rwanda',
      location: 'Medicine Cabinet',
      status: 'Low Stock',
      lastRestocked: new Date('2025-11-10'),
      expiryDate: new Date('2026-06-15')
    },
    {
      id: '4',
      name: 'Milking Machine Parts',
      sku: 'MMP-050',
      category: 'Equipment',
      quantity: 0,
      unit: 'sets',
      unitPrice: 150000,
      reorderLevel: 5,
      supplier: 'AgriTech Solutions',
      location: 'Warehouse A',
      status: 'Out of Stock',
      lastRestocked: new Date('2025-10-01')
    },
    {
      id: '5',
      name: 'Mineral Supplements',
      sku: 'MS-025',
      category: 'Animal Feed',
      quantity: 200,
      unit: 'kg',
      unitPrice: 3500,
      reorderLevel: 50,
      supplier: 'Rwanda Feeds Ltd',
      location: 'Warehouse A',
      status: 'In Stock',
      lastRestocked: new Date('2025-11-18')
    },
    {
      id: '6',
      name: 'Cleaning Detergent',
      sku: 'CD-010',
      category: 'Supplies',
      quantity: 30,
      unit: 'liters',
      unitPrice: 4500,
      reorderLevel: 25,
      supplier: 'Clean Pro Rwanda',
      location: 'Storage Room B',
      status: 'In Stock',
      lastRestocked: new Date('2025-11-12')
    },
    {
      id: '7',
      name: 'Rubber Gloves (Box)',
      sku: 'RG-100',
      category: 'Supplies',
      quantity: 8,
      unit: 'boxes',
      unitPrice: 12000,
      reorderLevel: 10,
      supplier: 'Medical Supplies Co',
      location: 'Storage Room B',
      status: 'Low Stock',
      lastRestocked: new Date('2025-11-05')
    },
    {
      id: '8',
      name: 'Hay Bales',
      sku: 'HB-500',
      category: 'Animal Feed',
      quantity: 150,
      unit: 'bales',
      unitPrice: 5000,
      reorderLevel: 30,
      supplier: 'Local Farmers Coop',
      location: 'Barn Storage',
      status: 'In Stock',
      lastRestocked: new Date('2025-11-22')
    },
    {
      id: '9',
      name: 'Water Trough',
      sku: 'WT-200',
      category: 'Equipment',
      quantity: 12,
      unit: 'pieces',
      unitPrice: 45000,
      reorderLevel: 5,
      supplier: 'Farm Equipment Ltd',
      location: 'Warehouse A',
      status: 'In Stock',
      lastRestocked: new Date('2025-10-28')
    },
    {
      id: '10',
      name: 'Deworming Medicine',
      sku: 'DM-050',
      category: 'Medicine',
      quantity: 25,
      unit: 'doses',
      unitPrice: 8000,
      reorderLevel: 15,
      supplier: 'VetCare Rwanda',
      location: 'Medicine Cabinet',
      status: 'In Stock',
      lastRestocked: new Date('2025-11-08'),
      expiryDate: new Date('2026-03-20')
    }
  ];

  private stockMovements: StockMovement[] = [
    {
      id: '1',
      itemId: '1',
      itemName: 'Dairy Feed Premium',
      type: 'IN',
      quantity: 200,
      previousQuantity: 300,
      newQuantity: 500,
      reason: 'Restocking from supplier',
      date: new Date('2025-11-20'),
      performedBy: 'John Doe'
    },
    {
      id: '2',
      itemId: '3',
      itemName: 'Veterinary Antibiotics',
      type: 'OUT',
      quantity: 5,
      previousQuantity: 20,
      newQuantity: 15,
      reason: 'Used for cattle treatment',
      date: new Date('2025-11-19'),
      performedBy: 'Jane Smith'
    },
    {
      id: '3',
      itemId: '4',
      itemName: 'Milking Machine Parts',
      type: 'OUT',
      quantity: 3,
      previousQuantity: 3,
      newQuantity: 0,
      reason: 'Equipment maintenance',
      date: new Date('2025-11-18'),
      performedBy: 'John Doe'
    }
  ];

  private inventorySubject = new BehaviorSubject<InventoryItem[]>(this.inventoryItems);

  getInventoryItems(): InventoryItem[] {
    return [...this.inventoryItems];
  }

  getInventoryItems$(): Observable<InventoryItem[]> {
    return this.inventorySubject.asObservable();
  }

  getItemById(id: string): InventoryItem | undefined {
    return this.inventoryItems.find(item => item.id === id);
  }

  addItem(item: Omit<InventoryItem, 'id' | 'status'>): InventoryItem {
    const newItem: InventoryItem = {
      ...item,
      id: (this.inventoryItems.length + 1).toString(),
      status: this.calculateStatus(item.quantity, item.reorderLevel)
    };
    this.inventoryItems.push(newItem);
    this.inventorySubject.next(this.inventoryItems);
    return newItem;
  }

  updateItem(id: string, updates: Partial<InventoryItem>): InventoryItem | null {
    const index = this.inventoryItems.findIndex(item => item.id === id);
    if (index !== -1) {
      this.inventoryItems[index] = {
        ...this.inventoryItems[index],
        ...updates,
        status: this.calculateStatus(
          updates.quantity ?? this.inventoryItems[index].quantity,
          updates.reorderLevel ?? this.inventoryItems[index].reorderLevel
        )
      };
      this.inventorySubject.next(this.inventoryItems);
      return this.inventoryItems[index];
    }
    return null;
  }

  deleteItem(id: string): boolean {
    const index = this.inventoryItems.findIndex(item => item.id === id);
    if (index !== -1) {
      this.inventoryItems.splice(index, 1);
      this.inventorySubject.next(this.inventoryItems);
      return true;
    }
    return false;
  }

  adjustStock(itemId: string, adjustment: StockAdjustment): boolean {
    const item = this.inventoryItems.find(i => i.id === itemId);
    if (!item) return false;

    const previousQuantity = item.quantity;
    let newQuantity: number;

    if (adjustment.type === 'IN') {
      newQuantity = previousQuantity + adjustment.quantity;
    } else if (adjustment.type === 'OUT') {
      newQuantity = Math.max(0, previousQuantity - adjustment.quantity);
    } else {
      newQuantity = adjustment.quantity;
    }

    const movement: StockMovement = {
      id: (this.stockMovements.length + 1).toString(),
      itemId: item.id,
      itemName: item.name,
      type: adjustment.type,
      quantity: adjustment.quantity,
      previousQuantity,
      newQuantity,
      reason: adjustment.reason,
      date: new Date(),
      performedBy: 'Current User'
    };
    this.stockMovements.push(movement);

    this.updateItem(itemId, { 
      quantity: newQuantity,
      lastRestocked: adjustment.type === 'IN' ? new Date() : item.lastRestocked
    });

    return true;
  }

  getStockMovements(itemId?: string): StockMovement[] {
    if (itemId) {
      return this.stockMovements.filter(m => m.itemId === itemId);
    }
    return [...this.stockMovements];
  }

  getCategories(): string[] {
    return [...new Set(this.inventoryItems.map(item => item.category))];
  }

  getStats(): InventoryStats {
    const items = this.inventoryItems;
    return {
      totalItems: items.length,
      totalValue: items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      lowStockItems: items.filter(item => item.status === 'Low Stock').length,
      outOfStockItems: items.filter(item => item.status === 'Out of Stock').length
    };
  }

  private calculateStatus(quantity: number, reorderLevel: number): 'In Stock' | 'Low Stock' | 'Out of Stock' {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= reorderLevel) return 'Low Stock';
    return 'In Stock';
  }

  exportToCSV(): string {
    const headers = ['SKU', 'Name', 'Category', 'Quantity', 'Unit', 'Unit Price (RWF)', 'Reorder Level', 'Supplier', 'Location', 'Status', 'Last Restocked'];
    const rows = this.inventoryItems.map(item => [
      item.sku,
      item.name,
      item.category,
      item.quantity.toString(),
      item.unit,
      item.unitPrice.toString(),
      item.reorderLevel.toString(),
      item.supplier,
      item.location,
      item.status,
      item.lastRestocked.toISOString().split('T')[0]
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  importFromCSV(csvContent: string): ImportResult {
    const lines = csvContent.trim().split('\n');
    const errors: string[] = [];
    let success = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',');
        if (values.length < 10) {
          errors.push(`Row ${i + 1}: Invalid number of columns`);
          continue;
        }

        const item: Omit<InventoryItem, 'id' | 'status'> = {
          sku: values[0].trim(),
          name: values[1].trim(),
          category: values[2].trim(),
          quantity: parseInt(values[3].trim(), 10),
          unit: values[4].trim(),
          unitPrice: parseFloat(values[5].trim()),
          reorderLevel: parseInt(values[6].trim(), 10),
          supplier: values[7].trim(),
          location: values[8].trim(),
          lastRestocked: new Date(values[10]?.trim() || new Date())
        };

        this.addItem(item);
        success++;
      } catch (e) {
        errors.push(`Row ${i + 1}: Failed to parse data`);
      }
    }

    return { success, errors };
  }
}

