import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideIconComponent } from '../../../../shared/components/lucide-icon/lucide-icon.component';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-import-inventory-modal',
  standalone: true,
  imports: [CommonModule, LucideIconComponent],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Import Inventory</h2>
          <button class="close-btn" (click)="close()">
            <app-lucide-icon name="x" size="20px"></app-lucide-icon>
          </button>
        </div>

        <div class="modal-body">
          <!-- Upload Area -->
          <div class="upload-area" 
               [class.dragover]="isDragover"
               (dragover)="onDragOver($event)"
               (dragleave)="onDragLeave($event)"
               (drop)="onDrop($event)"
               (click)="fileInput.click()">
            <input type="file" #fileInput accept=".csv" (change)="onFileSelected($event)" hidden>
            
            <div class="upload-icon">
              <app-lucide-icon name="upload-cloud" size="48px"></app-lucide-icon>
            </div>
            <p class="upload-text">Drag and drop your CSV file here</p>
            <p class="upload-subtext">or click to browse</p>
          </div>

          <!-- Selected File -->
          <div class="selected-file" *ngIf="selectedFile">
            <app-lucide-icon name="file-text" size="20px"></app-lucide-icon>
            <span class="file-name">{{ selectedFile.name }}</span>
            <button class="remove-btn" (click)="removeFile()">
              <app-lucide-icon name="x" size="16px"></app-lucide-icon>
            </button>
          </div>

          <!-- Import Result -->
          <div class="import-result" *ngIf="importResult">
            <div class="result-success" *ngIf="importResult.success > 0">
              <app-lucide-icon name="check-circle" size="16px"></app-lucide-icon>
              {{ importResult.success }} items imported successfully
            </div>
            <div class="result-errors" *ngIf="importResult.errors.length > 0">
              <app-lucide-icon name="alert-circle" size="16px"></app-lucide-icon>
              {{ importResult.errors.length }} errors occurred
              <ul>
                <li *ngFor="let error of importResult.errors">{{ error }}</li>
              </ul>
            </div>
          </div>

          <!-- Template Download -->
          <div class="template-section">
            <p>Need a template? Download our CSV template to get started.</p>
            <button class="btn-link" (click)="downloadTemplate()">
              <app-lucide-icon name="download" size="16px"></app-lucide-icon>
              Download Template
            </button>
          </div>

          <!-- Format Info -->
          <div class="format-info">
            <h4>CSV Format Requirements:</h4>
            <ul>
              <li>First row must be headers</li>
              <li>Required columns: SKU, Name, Category, Quantity, Unit, Unit Price, Reorder Level, Supplier, Location, Status, Last Restocked</li>
              <li>Date format: YYYY-MM-DD</li>
            </ul>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" (click)="close()">Cancel</button>
          <button class="btn-primary" [disabled]="!selectedFile || importing" (click)="importFile()">
            <app-lucide-icon name="upload" size="16px" *ngIf="!importing"></app-lucide-icon>
            <span *ngIf="importing">Importing...</span>
            <span *ngIf="!importing">Import</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./import-inventory-modal.component.scss']
})
export class ImportInventoryModalComponent {
  @Output() importComplete = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  selectedFile: File | null = null;
  isDragover = false;
  importing = false;
  importResult: { success: number; errors: string[] } | null = null;

  constructor(private inventoryService: InventoryService) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragover = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragover = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragover = false;
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      this.selectedFile = file;
      this.importResult = null;
    } else {
      alert('Please select a CSV file');
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.importResult = null;
  }

  async importFile() {
    if (!this.selectedFile) return;

    this.importing = true;
    
    try {
      const content = await this.selectedFile.text();
      this.importResult = this.inventoryService.importFromCSV(content);
      
      if (this.importResult.success > 0) {
        setTimeout(() => {
          this.importComplete.emit(this.importResult);
        }, 1500);
      }
    } catch (error) {
      this.importResult = { success: 0, errors: ['Failed to read file'] };
    }
    
    this.importing = false;
  }

  downloadTemplate() {
    const template = 'SKU,Name,Category,Quantity,Unit,Unit Price,Reorder Level,Supplier,Location,Status,Last Restocked\nDF-001,Dairy Feed Premium,Animal Feed,100,kg,1200,20,Rwanda Feeds Ltd,Warehouse A,In Stock,2025-11-20';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  close() {
    this.modalClosed.emit();
  }
}

