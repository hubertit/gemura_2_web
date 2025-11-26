# Accounting Module - Additional Database Tables

## Current Database Analysis

Based on the existing `gemura.sql` database structure, the following tables are already available:
- `accounts` - For tenant/branch management
- `users` - User management
- `suppliers_customers` - Supplier-customer relationships with pricing
- `milk_sales` - Milk sales transactions
- `orders` and `order_items` - Order management
- `products` and `product_categories` - Product catalog
- `notifications` - Notification system

## Additional Tables Required for Accounting Module

### 1. Chart of Accounts Tables

#### `chart_of_accounts`
```sql
CREATE TABLE `chart_of_accounts` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `account_code` varchar(20) NOT NULL UNIQUE,
  `account_name` varchar(150) NOT NULL,
  `account_type` enum('asset','liability','equity','income','expense') NOT NULL,
  `parent_account_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_active` boolean DEFAULT true,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`parent_account_id`) REFERENCES `chart_of_accounts`(`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`)
);
```

### 2. Transaction Management Tables

#### `accounting_transactions`
```sql
CREATE TABLE `accounting_transactions` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `transaction_number` varchar(50) NOT NULL UNIQUE,
  `transaction_date` date NOT NULL,
  `description` text NOT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `status` enum('draft','posted','cancelled') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`)
);
```

#### `accounting_transaction_entries`
```sql
CREATE TABLE `accounting_transaction_entries` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `transaction_id` bigint(20) UNSIGNED NOT NULL,
  `account_id` bigint(20) UNSIGNED NOT NULL,
  `debit_amount` decimal(15,2) DEFAULT 0.00,
  `credit_amount` decimal(15,2) DEFAULT 0.00,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`transaction_id`) REFERENCES `accounting_transactions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`account_id`) REFERENCES `chart_of_accounts`(`id`)
);
```

### 3. Supplier Ledger Tables

#### `supplier_ledger`
```sql
CREATE TABLE `supplier_ledger` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `supplier_account_id` bigint(20) UNSIGNED NOT NULL,
  `transaction_id` bigint(20) UNSIGNED DEFAULT NULL,
  `entry_type` enum('debit','credit') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `balance` decimal(15,2) NOT NULL,
  `description` text NOT NULL,
  `reference` varchar(100) DEFAULT NULL,
  `transaction_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`supplier_account_id`) REFERENCES `accounts`(`id`),
  FOREIGN KEY (`transaction_id`) REFERENCES `accounting_transactions`(`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
);
```

### 4. Fee/Deduction Management Tables

#### `fee_types`
```sql
CREATE TABLE `fee_types` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `fee_code` varchar(20) NOT NULL UNIQUE,
  `fee_name` varchar(150) NOT NULL,
  `fee_name_kinyarwanda` varchar(150) DEFAULT NULL,
  `calculation_type` enum('fixed','percentage','per_liter') NOT NULL,
  `default_amount` decimal(10,2) DEFAULT 0.00,
  `is_active` boolean DEFAULT true,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`)
);
```

#### `supplier_fee_rules`
```sql
CREATE TABLE `supplier_fee_rules` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `supplier_account_id` bigint(20) UNSIGNED NOT NULL,
  `fee_type_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `is_active` boolean DEFAULT true,
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`supplier_account_id`) REFERENCES `accounts`(`id`),
  FOREIGN KEY (`fee_type_id`) REFERENCES `fee_types`(`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`)
);
```

#### `supplier_deductions`
```sql
CREATE TABLE `supplier_deductions` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `supplier_account_id` bigint(20) UNSIGNED NOT NULL,
  `milk_sale_id` bigint(20) UNSIGNED DEFAULT NULL,
  `fee_type_id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `deduction_date` date NOT NULL,
  `description` text DEFAULT NULL,
  `is_processed` boolean DEFAULT false,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`supplier_account_id`) REFERENCES `accounts`(`id`),
  FOREIGN KEY (`milk_sale_id`) REFERENCES `milk_sales`(`id`),
  FOREIGN KEY (`fee_type_id`) REFERENCES `fee_types`(`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`)
);
```

### 5. Invoice and Receipt Tables

#### `invoices`
```sql
CREATE TABLE `invoices` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(50) NOT NULL UNIQUE,
  `supplier_account_id` bigint(20) UNSIGNED NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `tax_amount` decimal(15,2) DEFAULT 0.00,
  `total_amount` decimal(15,2) NOT NULL,
  `paid_amount` decimal(15,2) DEFAULT 0.00,
  `balance_amount` decimal(15,2) NOT NULL,
  `status` enum('draft','sent','paid','overdue','cancelled') DEFAULT 'draft',
  `payment_terms` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`supplier_account_id`) REFERENCES `accounts`(`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`)
);
```

#### `invoice_items`
```sql
CREATE TABLE `invoice_items` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint(20) UNSIGNED NOT NULL,
  `description` text NOT NULL,
  `quantity` decimal(10,2) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_amount` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE
);
```

#### `receipts`
```sql
CREATE TABLE `receipts` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `receipt_number` varchar(50) NOT NULL UNIQUE,
  `supplier_account_id` bigint(20) UNSIGNED NOT NULL,
  `receipt_date` date NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `payment_method` enum('cash','bank_transfer','mobile_money','check') NOT NULL,
  `reference_number` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`supplier_account_id`) REFERENCES `accounts`(`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`)
);
```

### 6. Audit Trail Tables

#### `audit_logs`
```sql
CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `table_name` varchar(100) NOT NULL,
  `record_id` bigint(20) UNSIGNED NOT NULL,
  `action` enum('insert','update','delete') NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);
```

### 7. Loan Management Tables (Optional)

#### `supplier_loans`
```sql
CREATE TABLE `supplier_loans` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `supplier_account_id` bigint(20) UNSIGNED NOT NULL,
  `loan_number` varchar(50) NOT NULL UNIQUE,
  `principal_amount` decimal(15,2) NOT NULL,
  `interest_rate` decimal(5,2) DEFAULT 0.00,
  `loan_date` date NOT NULL,
  `maturity_date` date NOT NULL,
  `status` enum('active','paid','defaulted','cancelled') DEFAULT 'active',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`supplier_account_id`) REFERENCES `accounts`(`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`),
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`)
);
```

#### `loan_payments`
```sql
CREATE TABLE `loan_payments` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `loan_id` bigint(20) UNSIGNED NOT NULL,
  `payment_amount` decimal(15,2) NOT NULL,
  `principal_payment` decimal(15,2) NOT NULL,
  `interest_payment` decimal(15,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` enum('cash','bank_transfer','mobile_money','deduction') NOT NULL,
  `reference_number` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`loan_id`) REFERENCES `supplier_loans`(`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
);
```

## Data Seeding Requirements

### Initial Chart of Accounts
The system should be seeded with standard accounts:
- **Assets**: Cash, Bank, Accounts Receivable, Inventory
- **Liabilities**: Accounts Payable, Loans Payable
- **Income**: Milk Sales, Service Charges, Transport Fees
- **Expenses**: Salaries, Maintenance, Fuel, Electricity, Water

### Initial Fee Types
Seed the system with the current fee types:
- Depannage, Ibipande, Transport, Essence, MUTUELLE ABATURAGE RUTARE, AMAZI, Inguzanyo, IBISARUBETI, EJO HEZA RUTARE, Kwishyura moto, IMITI, Ibicuba, Ibihano, Impapuro, Avance

## Integration Points

1. **Milk Sales Integration**: Link `milk_sales` table with accounting transactions
2. **Supplier Management**: Use existing `accounts` table for supplier accounts
3. **User Management**: Use existing `users` table for audit trails
4. **Notification System**: Use existing `notifications` table for accounting alerts

## Indexes and Performance

Consider adding indexes on:
- `supplier_ledger.supplier_account_id`
- `accounting_transactions.transaction_date`
- `supplier_deductions.supplier_account_id`
- `audit_logs.table_name, record_id`
