import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  customerType: 'Individual' | 'Business' | 'Restaurant' | 'School' | 'Hospital';
  status: 'Active' | 'Inactive' | 'Suspended';
  registrationDate: Date;
  lastPurchaseDate?: Date;
  totalPurchases: number;
  totalAmount: number;
  preferredDeliveryTime: string;
  notes?: string;
  avatar?: string;
  pricePerLiter?: number;
  relationshipId?: string;
  averageSupplyQuantity?: number;
  relationshipStatus?: string;
  userCode?: string;
  accountCode?: string;
  accountName?: string;
}

export interface MilkSale {
  id: string;
  customerId: string;
  customerName: string;
  date: Date;
  quantity: number; // in liters
  pricePerLiter: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Mobile Money' | 'Bank Transfer' | 'Credit';
  paymentStatus: 'Paid' | 'Pending' | 'Overdue';
  deliveryMethod: 'Pickup' | 'Delivery';
  deliveryAddress?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customers: Customer[] = [];
  private milkSales: MilkSale[] = [];

  constructor(private apiService: ApiService) {
    // Load initial data from API
    this.loadCustomersFromAPI();
  }

  // Customer methods
  getCustomers(): Customer[] {
    return this.customers;
  }

  getCustomersFromAPI(): Observable<any> {
    return this.apiService.post<any>('/customers/get', {});
  }

  getCustomerById(id: string): Customer | undefined {
    return this.customers.find(customer => customer.id === id);
  }

  addCustomer(customerData: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    pricePerLiter: number;
  }): Observable<any> {
    return this.apiService.post('/customers/create', {
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email,
      address: customerData.address,
      price_per_liter: customerData.pricePerLiter
    });
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...updates };
      return this.customers[index];
    }
    return null;
  }

  deleteCustomer(id: string): boolean {
    const index = this.customers.findIndex(customer => customer.id === id);
    if (index !== -1) {
      this.customers.splice(index, 1);
      return true;
    }
    return false;
  }

  // Milk sales methods
  getMilkSales(): MilkSale[] {
    return this.milkSales;
  }

  getMilkSalesByCustomer(customerId: string): MilkSale[] {
    return this.milkSales.filter(sale => sale.customerId === customerId);
  }

  addMilkSale(sale: Omit<MilkSale, 'id'>): MilkSale {
    const newSale: MilkSale = {
      ...sale,
      id: this.generateId()
    };
    this.milkSales.push(newSale);
    
    // Update customer stats
    const customer = this.getCustomerById(sale.customerId);
    if (customer) {
      customer.totalPurchases += 1;
      customer.totalAmount += sale.totalAmount;
      customer.lastPurchaseDate = sale.date;
    }
    
    return newSale;
  }

  updateMilkSale(id: string, updates: Partial<MilkSale>): MilkSale | null {
    const index = this.milkSales.findIndex(sale => sale.id === id);
    if (index !== -1) {
      this.milkSales[index] = { ...this.milkSales[index], ...updates };
      return this.milkSales[index];
    }
    return null;
  }

  deleteMilkSale(id: string): boolean {
    const index = this.milkSales.findIndex(sale => sale.id === id);
    if (index !== -1) {
      this.milkSales.splice(index, 1);
      return true;
    }
    return false;
  }

  // Statistics
  getCustomerStats() {
    const totalCustomers = this.customers.length;
    const activeCustomers = this.customers.filter(c => c.status === 'Active').length;
    const totalSales = this.milkSales.length;
    const totalRevenue = this.milkSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    return {
      totalCustomers,
      activeCustomers,
      totalSales,
      totalRevenue,
      averageOrderValue
    };
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private loadCustomersFromAPI() {
    this.getCustomersFromAPI().subscribe({
      next: (response: any) => {
        if (response.code === 200 || response.status === 'success') {
          this.customers = this.transformApiCustomers(response.data || []);
        }
      },
      error: (error) => {
        console.error('Failed to load customers from API:', error);
        // Fallback to mock data if API fails
        this.loadMockData();
      }
    });
  }

  private transformApiCustomers(apiCustomers: any[]): Customer[] {
    return apiCustomers.map(apiCustomer => ({
      id: apiCustomer.relationship_id || apiCustomer.id,
      name: apiCustomer.customer?.name || apiCustomer.name,
      email: apiCustomer.customer?.email || apiCustomer.email,
      phone: apiCustomer.customer?.phone || apiCustomer.phone,
      address: apiCustomer.customer?.address || apiCustomer.address,
      city: apiCustomer.customer?.city || 'Kigali',
      region: apiCustomer.customer?.region || 'Kigali',
      customerType: this.mapCustomerType(apiCustomer.customer?.type || 'Individual'),
      status: this.mapStatus(apiCustomer.relationship_status || 'active'),
      registrationDate: new Date(apiCustomer.created_at || new Date()),
      lastPurchaseDate: apiCustomer.last_purchase_date ? new Date(apiCustomer.last_purchase_date) : undefined,
      totalPurchases: apiCustomer.total_purchases || 0,
      totalAmount: apiCustomer.total_amount || 0,
      preferredDeliveryTime: apiCustomer.preferred_delivery_time || 'Morning (8:00-10:00)',
      notes: apiCustomer.notes,
      avatar: apiCustomer.avatar || 'assets/img/user.png',
      pricePerLiter: apiCustomer.price_per_liter || 0,
      relationshipId: apiCustomer.relationship_id,
      averageSupplyQuantity: apiCustomer.average_supply_quantity || 0,
      relationshipStatus: apiCustomer.relationship_status,
      userCode: apiCustomer.customer?.code || apiCustomer.user_code,
      accountCode: apiCustomer.customer?.account?.code || apiCustomer.account_code,
      accountName: apiCustomer.customer?.account?.name || apiCustomer.account_name
    }));
  }

  private mapCustomerType(type: string): 'Individual' | 'Business' | 'Restaurant' | 'School' | 'Hospital' {
    const typeMap: { [key: string]: 'Individual' | 'Business' | 'Restaurant' | 'School' | 'Hospital' } = {
      'individual': 'Individual',
      'business': 'Business',
      'restaurant': 'Restaurant',
      'school': 'School',
      'hospital': 'Hospital'
    };
    return typeMap[type.toLowerCase()] || 'Individual';
  }

  private mapStatus(status: string): 'Active' | 'Inactive' | 'Suspended' {
    const statusMap: { [key: string]: 'Active' | 'Inactive' | 'Suspended' } = {
      'active': 'Active',
      'inactive': 'Inactive',
      'suspended': 'Suspended'
    };
    return statusMap[status.toLowerCase()] || 'Inactive';
  }

  private loadMockData() {
    // Mock customers
    this.customers = [
      {
        id: '1',
        name: 'John Mukamana',
        email: 'john.mukamana@email.com',
        phone: '+250788123456',
        address: 'KG 123 St, Kigali',
        city: 'Kigali',
        region: 'Kigali',
        customerType: 'Individual',
        status: 'Active',
        registrationDate: new Date('2024-01-15'),
        lastPurchaseDate: new Date('2024-09-20'),
        totalPurchases: 45,
        totalAmount: 225000,
        preferredDeliveryTime: 'Morning (8:00-10:00)',
        notes: 'Prefers fresh milk, regular customer',
        avatar: 'assets/img/user.png'
      },
      {
        id: '2',
        name: 'Rwanda School Complex',
        email: 'admin@rwandaschool.rw',
        phone: '+250788234567',
        address: 'KG 456 St, Kigali',
        city: 'Kigali',
        region: 'Kigali',
        customerType: 'School',
        status: 'Active',
        registrationDate: new Date('2024-02-10'),
        lastPurchaseDate: new Date('2024-09-22'),
        totalPurchases: 120,
        totalAmount: 600000,
        preferredDeliveryTime: 'Early Morning (6:00-8:00)',
        notes: 'Large quantity orders for school meals',
        avatar: 'assets/img/user.png'
      },
      {
        id: '3',
        name: 'Marie Uwimana',
        email: 'marie.uwimana@email.com',
        phone: '+250788345678',
        address: 'KG 789 St, Kigali',
        city: 'Kigali',
        region: 'Kigali',
        customerType: 'Individual',
        status: 'Active',
        registrationDate: new Date('2024-03-05'),
        lastPurchaseDate: new Date('2024-09-18'),
        totalPurchases: 28,
        totalAmount: 140000,
        preferredDeliveryTime: 'Evening (17:00-19:00)',
        notes: 'Prefers organic milk',
        avatar: 'assets/img/user.png'
      },
      {
        id: '4',
        name: 'Hotel des Mille Collines',
        email: 'purchasing@millecollines.rw',
        phone: '+250788456789',
        address: 'KG 321 St, Kigali',
        city: 'Kigali',
        region: 'Kigali',
        customerType: 'Business',
        status: 'Active',
        registrationDate: new Date('2024-01-20'),
        lastPurchaseDate: new Date('2024-09-23'),
        totalPurchases: 200,
        totalAmount: 1000000,
        preferredDeliveryTime: 'Morning (7:00-9:00)',
        notes: 'Premium hotel, requires high quality milk',
        avatar: 'assets/img/user.png'
      },
      {
        id: '5',
        name: 'Kigali Hospital',
        email: 'supplies@kigalihospital.rw',
        phone: '+250788567890',
        address: 'KG 654 St, Kigali',
        city: 'Kigali',
        region: 'Kigali',
        customerType: 'Hospital',
        status: 'Active',
        registrationDate: new Date('2024-02-15'),
        lastPurchaseDate: new Date('2024-09-21'),
        totalPurchases: 150,
        totalAmount: 750000,
        preferredDeliveryTime: 'Early Morning (5:00-7:00)',
        notes: 'Medical facility, requires pasteurized milk',
        avatar: 'assets/img/user.png'
      }
    ];

    // Mock milk sales
    this.milkSales = [
      {
        id: 's1',
        customerId: '1',
        customerName: 'John Mukamana',
        date: new Date('2024-09-20'),
        quantity: 5,
        pricePerLiter: 1000,
        totalAmount: 5000,
        paymentMethod: 'Mobile Money',
        paymentStatus: 'Paid',
        deliveryMethod: 'Delivery',
        deliveryAddress: 'KG 123 St, Kigali',
        notes: 'Regular order'
      },
      {
        id: 's2',
        customerId: '2',
        customerName: 'Rwanda School Complex',
        date: new Date('2024-09-22'),
        quantity: 20,
        pricePerLiter: 1000,
        totalAmount: 20000,
        paymentMethod: 'Bank Transfer',
        paymentStatus: 'Paid',
        deliveryMethod: 'Delivery',
        deliveryAddress: 'KG 456 St, Kigali',
        notes: 'Weekly school order'
      },
      {
        id: 's3',
        customerId: '4',
        customerName: 'Hotel des Mille Collines',
        date: new Date('2024-09-23'),
        quantity: 15,
        pricePerLiter: 1200,
        totalAmount: 18000,
        paymentMethod: 'Bank Transfer',
        paymentStatus: 'Paid',
        deliveryMethod: 'Delivery',
        deliveryAddress: 'KG 321 St, Kigali',
        notes: 'Premium quality milk'
      }
    ];
  }
}
