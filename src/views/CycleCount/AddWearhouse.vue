<template>
  <master>
    <div class="page-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-content">
          <h1 class="premium-title">Cycle Count</h1>
          <p class="premium-subtitle">
            <ion-icon :icon="timeOutline" class="sub-icon"></ion-icon>
            Session: {{ scannedData.year }}
          </p>
        </div>
        <div class="header-action" @click="viewExpenditure">
          <ion-icon :icon="listOutline"></ion-icon>
        </div>
      </div>

      <!-- Location Selection Card -->
      <div class="premium-card location-card">
        <div class="card-header">
          <div class="icon-circle location-bg">
            <ion-icon :icon="locationOutline"></ion-icon>
          </div>
          <span class="card-label">Warehouse Logistics</span>
        </div>

          <div class="selection-box read-only-box">
          <div class="selection-left">
            <ion-icon :icon="briefcaseOutline" class="entry-icon"></ion-icon>
            <div class="selection-info">
              <span class="label">Company Name</span>
              <span class="value">{{ currentOrganisationName || 'Select a warehouse first' }}</span>
            </div>
          </div>
        </div>
        
        <!-- Warehouse Selection -->
        <div class="selection-box">
          <div class="selection-left" style="width: 100%;">
            <ion-icon :icon="businessOutline" class="entry-icon"></ion-icon>
            <div class="selection-info w-full">
              <span class="label">Warehouse</span>
              <ion-select
                v-model="scannedData.WAREHOUSE_NAME"
                interface="popover"
                placeholder="Select Warehouse"
                class="value custom-warehouse-select"
              >
                <!-- Loop through API warehouse list -->
                <ion-select-option 
                  v-for="(warehouse, index) in warehouseList" 
                  :key="index" 
                  :value="warehouse.BRANCH_NAME"
                >
                  {{ warehouse.BRANCH_NAME }}
                </ion-select-option>
              </ion-select>
            </div>
          </div>
          <ion-icon :icon="chevronForwardOutline" class="arrow-icon"></ion-icon>
        </div>

        <!-- REPLACED RACK WITH ORGANISATION NAME -->
      

      </div>

      <!-- Product List -->
      <div class="product-list-container">
        <div 
          class="premium-card product-card" 
          v-for="(product, index) in scannedData.DETAILS" 
          :key="index"
        >
          <div class="product-header">
            <div class="product-identity">
               <ion-icon :icon="barcodeOutline" class="barcode-icon"></ion-icon>
               <span class="part-number">{{ product.PART_NO }}</span>
            </div>
            <span class="product-badge">Item {{ index + 1 }}</span>
          </div>

          <div class="product-body">
            <div class="product-title-row">
              <ion-icon :icon="cubeOutline" class="cube-icon"></ion-icon>
              <h2 class="product-name">{{ product.PRODUCT_NAME }}</h2>
            </div>
            
            <div class="input-grid">
              <div class="input-group">
                <label>
                  <ion-icon :icon="calculatorOutline"></ion-icon>
                  Quantity
                </label>
                <div class="input-wrapper">
                  <ion-input
                    type="number"
                    v-model="product.inputQty"
                    inputmode="decimal"
                    placeholder="0.00"
                    class="custom-input"
                  ></ion-input>
                </div>
              </div>

              <div class="input-group">
                <label>
                  <ion-icon :icon="optionsOutline"></ion-icon>
                  Unit (UoM)
                </label>
                <div class="input-wrapper">
                  <ion-select
                    v-model="product.selectedUom"
                    interface="popover"
                    placeholder="Unit"
                    class="custom-select"
                  >
                    <ion-select-option value="TUB">TUB</ion-select-option>
                    <ion-select-option value="BOX">BOX</ion-select-option>
                    <ion-select-option :value="scannedData.UOM">{{ scannedData.UOM }}</ion-select-option>
                  </ion-select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Action Area -->
      <div class="action-footer">
        <button class="main-submit-btn" @click="handleSubmit">
          <ion-icon :icon="checkmarkDoneOutline"></ion-icon>
          <span>View All Plan</span>
        </button>
      </div>
    </div>
  </master>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { 
  IonInput, IonSelect, IonSelectOption, IonIcon 
} from '@ionic/vue';
import master from '../layouts/Master.vue'
import pick from '@/services/pick';

import { 
  chevronForwardOutline, 
  locationOutline, 
  listOutline, 
  checkmarkDoneOutline, 
  cubeOutline, 
  businessOutline, 
  briefcaseOutline,
  barcodeOutline,
  calculatorOutline,
  optionsOutline,
  timeOutline
} from 'ionicons/icons';

export default defineComponent({
  name: 'AddCount',
  components: { IonInput, IonSelect, IonSelectOption, IonIcon, master },
  setup() {
    return {
      chevronForwardOutline,
      locationOutline,
      listOutline,
      checkmarkDoneOutline,
      cubeOutline,
      businessOutline,
      briefcaseOutline,
      barcodeOutline,
      calculatorOutline,
      optionsOutline,
      timeOutline
    }
  },
  data() {
    return {
      warehouseList: [] as any[], 
      scannedData: {
        WAREHOUSE_NAME: '',
        BIN_NO: '',
        RACK_NO: '',
        year: new Date().getFullYear(),
        UOM: 'PCS',
        DETAILS: [] as any[]
      }
    };
  },
  computed: {
    currentOrganisationName(): string {
      const selectedWarehouse = this.warehouseList.find(
        (w: any) => w.BRANCH_NAME === this.scannedData.WAREHOUSE_NAME
      );
      return selectedWarehouse ? selectedWarehouse.ORGANISATION_NAME : '';
    }
  },
  async mounted() {
    const rawData = localStorage.getItem('scanData');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        const item = Array.isArray(parsed) ? parsed[0] : parsed;
        if (item) {
          item.DETAILS = (item.DETAILS || []).map((product: any) => ({
            ...product,
            inputQty: '',
            selectedUom: ''
          }));
          this.scannedData = { ...item, year: new Date().getFullYear() };
        }
      } catch (err) {
        console.error('Error parsing scanData:', err);
      }
    }

  
    await this.fetchWarehouses();
  },
  methods: {
    async fetchWarehouses() {
      try {
        const apiRes = await pick.getWarehouses();
        
        if (apiRes && apiRes.data && apiRes.data.response) {
          this.warehouseList = apiRes.data.response;
        } else if (apiRes && apiRes.response) {
          this.warehouseList = apiRes.response;
        } else {
          this.warehouseList = [];
        }

        // Auto-select the first warehouse if none is currently selected
        if (!this.scannedData.WAREHOUSE_NAME && this.warehouseList.length > 0) {
          this.scannedData.WAREHOUSE_NAME = this.warehouseList[0].BRANCH_NAME;
        }
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
      }
    },
    viewExpenditure() { this.$router.push('/ViewCount'); },
    handleSubmit() {
      console.log('Submitting:', this.scannedData);
      this.$router.push('/SelectPlan');
    }
  }
});
</script>

<style scoped>
/* Redesigned Styles */
.page-container {
  background-color: #f4f7fa;
  min-height: 100vh;
  padding-bottom: 100px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 20px 20px;
  background: #ffffff;
  border-radius: 0 0 30px 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.premium-title {
  font-size: 24px;
  font-weight: 800;
  color: #1a202c;
  margin: 0;
}

.premium-subtitle {
  font-size: 13px;
  color: #718096;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.sub-icon {
    font-size: 14px;
}

.header-action {
  width: 45px;
  height: 45px;
  background: #fff5f5;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e53e3e;
  font-size: 22px;
  cursor: pointer;
}

/* Card Improvements */
.premium-card {
  background: white;
  margin: 20px 16px;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.location-bg {
  background: #ebf8ff;
  color: #3182ce;
}

.card-label {
  font-size: 12px;
  font-weight: 700;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.selection-box {
  background: #f8fafc;
  border-radius: 15px;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  border: 1px solid #edf2f7;
}

.selection-box:not(.read-only-box):active {
  background: #edf2f7;
}

.read-only-box {
  background: #ffffff; /* Slightly different background to show it's read-only */
}

.selection-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.entry-icon {
  font-size: 20px;
  color: #4a5568;
}

.selection-info .label {
  font-size: 11px;
  color: #718096;
  display: block;
}

.selection-info .value {
  font-size: 15px;
  font-weight: 700;
  color: #2d3748;
}

.arrow-icon {
  color: #cbd5e0;
}

/* Warehouse Select Fixes */
.w-full {
  width: 100%;
}

.custom-warehouse-select {
  --padding-start: 0;
  --padding-end: 0;
  margin: 0;
  min-height: auto;
  font-size: 15px;
  font-weight: 700;
  color: #2d3748;
  width: 100%;
}

.custom-warehouse-select::part(icon) {
  display: none;
}

/* Product Card Improvements */
.product-card {
  border-top: 5px solid #e53e3e;
}

.product-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.product-identity {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f7fafc;
    padding: 4px 10px;
    border-radius: 8px;
}

.barcode-icon {
    font-size: 16px;
    color: #4a5568;
}

.part-number {
  font-size: 13px;
  font-weight: 600;
  color: #4a5568;
  font-family: 'Courier New', Courier, monospace;
}

.product-badge {
  font-size: 10px;
  font-weight: 800;
  color: #e53e3e;
  text-transform: uppercase;
}

.product-title-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 20px;
}

.cube-icon {
    font-size: 22px;
    color: #e53e3e;
    margin-top: 2px;
}

.product-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  line-height: 1.2;
}

/* Input Fields */
.input-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 15px;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: #718096;
  margin-bottom: 8px;
}

.input-wrapper {
  background: #f7fafc;
  border: 1.5px solid #edf2f7;
  border-radius: 12px;
  transition: border-color 0.2s;
}

.input-wrapper:focus-within {
    border-color: #e53e3e;
    background: white;
}

.custom-input {
  --padding-start: 12px;
  font-weight: 800;
  font-size: 16px;
}

.custom-select {
    padding: 0 10px;
    font-weight: 600;
}

/* Action Footer */
.action-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 20px 16px 40px;
  background: linear-gradient(to top, #f4f7fa 80%, rgba(244, 247, 250, 0));
}

.main-submit-btn {
  width: 100%;
  height: 60px;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 17px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 12px 24px rgba(229, 62, 62, 0.3);
}

.main-submit-btn:active {
    transform: scale(0.98);
    background: #c53030;
}
</style>