# Accounting Module Features Documentation

## 🧭 Core Purpose

To help Milk Collection Centers (MCCs) track all financial interactions with their suppliers, buyers, and expenses, following double-entry principles and enabling balance reports, profit tracking, and transparency.

## ⚙️ Main Features

### 1. Chart of Accounts

**Predefined accounts:**

- **Assets:** Cash, Bank, Receivables (Suppliers owe MCC), Inventory (milk)
- **Liabilities:** Payables (MCC owes suppliers)
- **Income:** Milk sales, Transport fees, Service charges
- **Expenses:** Salaries, Maintenance, Fuel, Electricity

Allow MCCs to add custom accounts if needed.

### 2. Supplier Ledger

- View all charges, payments, and balances per supplier
- Support credit and debit entries
- Automatically update when milk collection or payment transactions occur
- Monthly supplier statements (PDF export)

### 3. Transaction Management

Record all money in/out operations:

- Milk sales to processors (income)
- Payments to suppliers (expense)
- Service charges deducted from supplier payouts (income)
- Other MCC expenses

Each transaction posts to two accounts (double-entry system).

### 4. Automated Deductions

**Current Fee Types in Use:**
- Depannage (Repair/Maintenance)
- Ibipande (Pieces/Parts)
- Transport
- Essence (Fuel)
- MUTUELLE ABATURAGE RUTARE (Insurance)
- AMAZI (Water)
- Inguzanyo (Loan)
- IBISARUBETI (Medicines)
- EJO HEZA RUTARE (Future Savings)
- Kwishyura moto (Vehicle Loan Payment)
- IMITI (Medicine)
- Ibicuba (Fines)
- Ibihano (Penalties)
- Impapuro (Papers/Documents)
- Avance (Advance Payment)

**System Features:**
- Define deduction rules per supplier for each fee type
- Automatically calculate deductions on supplier payouts
- Generate summary of deductions per collection period
- Support both fixed amounts and percentage-based deductions

### 5. Invoices & Receipts

- Generate and print receipts for suppliers or buyers
- Record payment mode (cash, bank transfer, mobile money)
- Support partial payments and outstanding balances

### 6. Reports & Analytics

- Income Statement (Profit & Loss)
- Balance Sheet
- Supplier Account Summary
- Cash Flow (daily, weekly, monthly)
- Export to Excel/PDF

### 7. Integration with Milk Data

- Auto-fetch milk quantities collected per supplier and auto-compute payable amounts
- Sync milk sales to processors to recognize revenue
- Link quality deductions or rejections to financial penalties

### 8. User Roles & Permissions

- **MCC accountant:** full access
- **Manager:** view & approve reports
- **Clerk:** can record transactions but not delete or modify

### 9. Audit Trail

- Every transaction logged with timestamp, user, and device ID
- Prevent data manipulation after approval/closure

### 10. Optional Add-ons

- Loan Management (track supplier loans or advances)
- Integration with banks or mobile wallets
- End-of-month automated closing and rollover

## Implementation Notes

This accounting module will integrate with the existing Gemura system to provide comprehensive financial tracking for Milk Collection Centers, ensuring transparency and proper financial management following double-entry bookkeeping principles.
