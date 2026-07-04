<template>
  <master>
    <div class="page-container">
      
      <!-- Enter Quantity Row -->
      <div class="card-section">
        <div class="section-header">
          <span class="label-text">Enter Quantity</span>
          <span class="required-dot"></span>
        </div>
        
        <div class="quantity-row">
          <div class="input-group">
            <ion-input
              v-model="quantity"
              type="number"
              class="premium-input"
              inputmode="decimal"
              placeholder="0"
            ></ion-input>
          </div>
          
          <div class="select-wrapper">
            <!-- Dynamically rendering UOM options to include the one from the API (like CTN, BOX, etc) -->
            <select v-model="selectedUom" class="premium-select">
              <option v-for="uom in availableUoms" :key="uom" :value="uom">
                {{ uom }}
              </option>
            </select>
            <ion-icon :icon="chevronDownOutline" class="select-icon"></ion-icon>
          </div>
          
          <button class="icon-btn" @click="handleAdd">
            <ion-icon :icon="addOutline"></ion-icon>
          </button>
        </div>
      </div>

      <!-- Inventory Status -->
      <div class="card-section mt-4">
        <div class="section-header">
          <span class="label-text">Inventory Status</span>
        </div>
        <div class="status-badge success">
          <ion-icon :icon="checkmarkCircle" class="status-icon"></ion-icon>
          <span>Good</span>
        </div>
      </div>

    </div>

    <!-- Floating Bottom Bar -->
    <div class="bottom-bar-wrapper">
      <div class="bottom-bar">
        <button class="back-btn" @click="goBack">
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </button>
        <button class="enter-btn" @click="handleEnterQuantity">
          <span>Confirm Quantity</span>
          <ion-icon :icon="arrowForwardCircle" class="btn-icon"></ion-icon>
        </button>
      </div>
    </div>

  </master>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonInput, IonIcon } from '@ionic/vue';
import master from '../layouts/Master.vue';
import pick from '@/services/pick';

import { 
  addOutline, 
  chevronDownOutline, 
  chevronBackOutline, 
  checkmarkCircle, 
  arrowForwardCircle 
} from 'ionicons/icons';

export default defineComponent({
  name: 'EnterQuentity',
  components: {
    IonInput,
    IonIcon,
    master
  },
  setup() {
    return {
      addOutline,
      chevronDownOutline,
      chevronBackOutline,
      checkmarkCircle,
      arrowForwardCircle
    };
  },
  data() {
    return {
      quantity: '' as string,
      selectedUom: 'BOX' as string, 
      availableUoms: ['Eaches(1)', 'TUB', 'BOX', 'CTN'] as string[], // Added CTN from your JSON
      bin: '' as string,
      item: '' as string,
      generateCcSysId: 0 as number, 
      binSysId: '' as string        
    };
  },
  mounted() {
    // 1. Capture ALL data passed from the previous page's router push
    this.bin = (this.$route.query.bin as string) || '';
    this.item = (this.$route.query.item as string) || '';
    
    // Capture dynamic IDs from the API response
    this.generateCcSysId = Number(this.$route.query.generateCcSysId) || 0; 
    this.binSysId = (this.$route.query.binSysId as string) || ""; 
    
    // Capture UOM and set it as the default selected value in dropdown
    if (this.$route.query.uom) {
      this.selectedUom = this.$route.query.uom as string;
      // Ensure the passed UOM exists in our dropdown options
      if (!this.availableUoms.includes(this.selectedUom)) {
        this.availableUoms.push(this.selectedUom);
      }
    }
  },
  methods: {
    handleAdd() {
      console.log('Add clicked');
    },
    goBack() {
      this.$router.back();
    },
    async handleEnterQuantity() {
      if (!this.quantity.toString().trim()) {
        alert("Please enter a quantity.");
        return;
      }

      // 2. Format the Payload using the dynamic IDs
      const payload = {
        ITEM: "ADD_COUNT_QTY",
        GENERATE_CC_SYS_ID: this.generateCcSysId, // from route
        BIN_SYS_ID: this.binSysId,                // from route
        COUNT_QTY: `${this.quantity} ${this.selectedUom}` 
      };

      try {
        // 3. Post to API
        const response = await pick.addCycleCountQty(payload);
        console.log("API Response:", response);

        // 4. Proceed to success page
        this.$router.push({ 
          name: 'PlanComplete', 
          query: { 
            bin: this.bin, 
            item: this.item, 
            quantity: this.quantity, 
            uom: this.selectedUom 
          } 
        });

      } catch (error) {
        console.error("Failed to post cycle count activity:", error);
        alert("Failed to submit quantity. Please try again.");
      }
    }
  }
});
</script>

<style scoped>
/* ── Global Layout ── */
.page-container {
  padding: 20px 20px 100px;
  background-color: #f8fafc;
  min-height: 100%;
}
.card-section {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
  border: 1px solid #f1f5f9;
}
.mt-4 {
  margin-top: 16px;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}
.label-text {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}
.required-dot {
  width: 6px;
  height: 6px;
  background-color: #ef4444;
  border-radius: 50%;
}
.quantity-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.input-group {
  flex: 0 0 100px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  transition: border-color 0.2s ease;
}
.input-group:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.premium-input {
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 10px;
  --padding-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}
.select-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}
.premium-select {
  width: 100%;
  appearance: none;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 36px 10px 14px;
  font-size: 15px;
  font-weight: 500;
  color: #334155;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.premium-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.select-icon {
  position: absolute;
  right: 12px;
  font-size: 16px;
  color: #94a3b8;
  pointer-events: none;
}
.icon-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  color: #3b82f6;
  border: none;
  border-radius: 12px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.icon-btn:active {
  background: #dbeafe;
  transform: scale(0.95);
}
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
}
.status-badge.success {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #d1fae5;
}
.status-icon {
  font-size: 18px;
}
.bottom-bar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px 24px;
  background: linear-gradient(to top, rgba(255,255,255,1) 80%, rgba(255,255,255,0));
  z-index: 100;
}
.bottom-bar {
  display: flex;
  gap: 12px;
}
.back-btn {
  width: 52px;
  height: 52px;
  background: #ffffff;
  color: #475569;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}
.back-btn:active {
  background: #f1f5f9;
  transform: scale(0.95);
}
.enter-btn {
  flex: 1;
  background: #0f172a;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
}
.enter-btn:active {
  transform: scale(0.98);
  background: #1e293b;
}
.btn-icon {
  font-size: 20px;
}
</style>