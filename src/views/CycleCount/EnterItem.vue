<template>
  <master>
    <div class="premium-container">
      
      <!-- Scan/Enter ITEM Input -->
      <div class="scan-section">
        <div class="section-title">Scan or Enter Item</div>
        <div class="scan-input-card">
          <ion-icon :icon="barcodeOutline" class="scan-icon"></ion-icon>
          <ion-input
            v-model="itemInput"
            class="scan-input"
            placeholder="e.g. 2 PM Ramen"
            clearInput
            autofocus
          ></ion-input>
        </div>
      </div>

      <!-- Items List Section -->
      <div class="list-section">
        
        <!-- List Header & Actions -->
        <div class="list-header">
          <div class="list-title">Items to count in {{ bin }}</div>
          <div class="list-actions">
            <div class="toggle-wrapper">
              <span class="toggle-label">Completed</span>
              <ion-toggle v-model="showCompleted" class="premium-toggle"></ion-toggle>
            </div>
            <div class="action-divider"></div>
            <ion-icon :icon="searchOutline" class="action-btn" @click="searchItems"></ion-icon>
            <ion-icon :icon="trashOutline" class="action-btn danger" @click="clearItems"></ion-icon>
          </div>
        </div>

        <!-- Cards Container -->
        <div class="cards-wrap">
          
          <!-- Loading State -->
          <div class="empty-state" v-if="isLoading">
            <ion-spinner name="crescent" color="primary"></ion-spinner>
            <p>Loading items for this bin...</p>
          </div>

          <template v-else>
            <div
              class="item-card"
              v-for="(row, index) in filteredItems"
              :key="index"
              @click="selectItem(row)"
              :class="{ 'is-selected': selectedItem?.PRODUCT_NAME === row.PRODUCT_NAME }"
            >
              <div class="card-left">
                <!-- Mapped to JSON keys -->
                <span class="item-no">{{ row.PRODUCT_NAME }}</span>
                <span class="item-desc">{{ row.PRODUCT_DESCRIPTION }}</span>
                
                <!-- Optional: Show Category Badge -->
                <span class="item-category" v-if="row.ITEM_CATEGORY">{{ row.ITEM_CATEGORY }}</span>
              </div>
              <div class="card-right">
                <ion-icon 
                  v-if="selectedItem?.PRODUCT_NAME === row.PRODUCT_NAME" 
                  :icon="checkmarkCircle" 
                  class="check-icon">
                </ion-icon>
              </div>
            </div>

            <!-- Empty State -->
            <div class="empty-state" v-if="filteredItems.length === 0">
              <ion-icon :icon="cubeOutline" class="empty-icon"></ion-icon>
              <p>No items found for this bin.</p>
            </div>
          </template>
        </div>
      </div>

    </div>

    <!-- ── 1-LINE BOTTOM BAR (NO SCROLLING) ── -->
    <div class="bottom-bar">
      <button class="btn-icon" @click="goBack">
        <ion-icon :icon="chevronBackOutline"></ion-icon>
      </button>
      <button class="btn-action btn-change" @click="handleChangeItem">Change Item</button>
      <button class="btn-action btn-enter-item" @click="handleEnterItemAction">Enter Item</button>
      <button class="btn-action btn-zero" @click="handleZeroQuantity">Zero Quantity</button>
      <button class="btn-primary" @click="handleEnterQuantity">Enter Quantity</button>
    </div>

  </master>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonInput, IonToggle, IonIcon, IonSpinner } from '@ionic/vue';
import { 
  barcodeOutline, searchOutline, trashOutline, 
  chevronBackOutline, checkmarkCircle, cubeOutline 
} from 'ionicons/icons';
import master from '../layouts/Master.vue';
import pick from '@/services/pick';

export default defineComponent({
  name: 'EnterItem',
  components: {
    IonInput,
    IonToggle,
    IonIcon,
    IonSpinner,
    master
  },
  setup() {
    return {
      barcodeOutline, 
      searchOutline, 
      trashOutline, 
      chevronBackOutline, 
      checkmarkCircle, 
      cubeOutline
    };
  },
  data() {
    return {
      planNo: '' as string, 
      itemInput: '' as string,
      bin: '' as string,
      warehouseId: '' as string,
      isLoading: false,
      showCompleted: false,
      selectedItem: null as any,
      items: [] as any[]
    };
  },
  computed: {
    filteredItems(): any[] {
      if (this.showCompleted) return this.items;
      return this.items.filter((i: any) => !i.completed);
    }
  },
  async mounted() {
    this.planNo = (this.$route.query.planNo as string) || ''; 
    this.bin = (this.$route.query.bin as string) || '';
    this.itemInput = (this.$route.query.item as string) || '';
    
    this.initWarehouseContext();
    await this.fetchItemsForBin();
  },
  methods: {
    initWarehouseContext() {
      const rawData = localStorage.getItem('scanData');
      if (rawData) {
        try {
          const parsed = JSON.parse(rawData);
          const data = Array.isArray(parsed) ? parsed[0] : parsed;
          this.warehouseId = data.BRANCH_NAME_SYS_ID || "1";
        } catch (e) {
          console.error("Context Error", e);
        }
      }
    },
    async fetchItemsForBin() {
      if (!this.warehouseId || !this.bin) return;
      this.isLoading = true;
      try {
        const res = await pick.getCyclePlans(this.warehouseId);
        let plans = Array.isArray(res) ? res : (res?.data || res?.response || []);
        
        let allTasks: any[] = [];

        if (this.planNo) {
          const selectedPlan = plans.find((p: any) => String(p.PLAN_SYS_ID) === String(this.planNo));
          if (selectedPlan && selectedPlan.TASK_DETAILS) {
            allTasks = selectedPlan.TASK_DETAILS;
          }
        } else {
          plans.forEach((plan: any) => {
            if (plan.TASK_DETAILS) allTasks = allTasks.concat(plan.TASK_DETAILS);
          });
        }

        const binTasks = allTasks.filter((t: any) => t.BIN_NAME === this.bin);
        const uniqueProducts: any[] = [];
        const seen = new Set();
        
        for (const t of binTasks) {
          if (!seen.has(t.PRODUCT_SYS_ID)) {
            seen.add(t.PRODUCT_SYS_ID);
            uniqueProducts.push(t);
          }
        }

        this.items = uniqueProducts.map(t => ({
          ...t,
          completed: false
        }));

        if (this.itemInput && this.items.length > 0) {
          const preMatched = this.items.find((i: any) => i.PRODUCT_NAME === this.itemInput);
          if (preMatched) this.selectItem(preMatched);
        }

      } catch (error) {
        console.error("Error fetching bin items:", error);
      } finally {
        this.isLoading = false;
      }
    },
    selectItem(row: any) {
      this.selectedItem = row;
      this.itemInput = row.PRODUCT_NAME.replace('\n', '');
    },
    clearItems() {
      this.itemInput = '';
      this.selectedItem = null;
    },
    searchItems() {
      console.log('Search items triggered');
    },
    goBack() {
      this.$router.back();
    },
    
    handleChangeItem() {
      console.log('Change Item triggered');
      this.clearItems();
    },
    handleEnterItemAction() {
      console.log('Enter Item triggered');
      if (!this.itemInput.trim()) {
        alert("Please enter an item");
        return;
      }
    },
    handleZeroQuantity() {
      console.log('Zero Quantity for bin:', this.bin);
    },
    handleEnterQuantity() {
      if (!this.itemInput.trim()) {
        alert("Please enter or select an item");
        return;
      }
      
      let matchedItem = this.selectedItem;

      if (!matchedItem || matchedItem.PRODUCT_NAME !== this.itemInput.trim()) {
        matchedItem = this.items.find((i: any) => i.PRODUCT_NAME.toLowerCase() === this.itemInput.trim().toLowerCase());
      }

      if (!matchedItem) {
        alert("Item not found in this bin. Please select from the list.");
        return;
      }

      this.$router.push({ 
        name: 'EnterQuentity', 
        query: { 
          planNo: this.planNo,
          bin: this.bin, 
          item: matchedItem.PRODUCT_NAME,
          productSysId: matchedItem.PRODUCT_SYS_ID,
          generateCcSysId: matchedItem.GENERATE_CC_SYS_ID,
          binSysId: matchedItem.BIN_SYS_ID,
          uom: matchedItem.UOM
        } 
      });
    }
  }
});
</script>

<style scoped>
/* ── Global Variables ── */
:root {
  --primary-color: #2563EB;
  --primary-dark: #1E40AF;
  --surface-color: #F8FAFC;
  --card-bg: #FFFFFF;
  --text-main: #0F172A;
  --text-muted: #64748B;
  --border-radius: 12px;
  --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 4px 16px rgba(15, 23, 42, 0.08);
}

.premium-container {
  background-color: var(--surface-color, #F8FAFC);
  min-height: 100%;
  padding-bottom: 80px; 
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted, #64748B);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

/* ── Scan Section ── */
.scan-section {
  padding: 20px 16px 10px;
}

.scan-input-card {
  display: flex;
  align-items: center;
  background: var(--card-bg, #fff);
  border-radius: var(--border-radius, 12px);
  padding: 4px 12px;
  box-shadow: var(--shadow-sm);
  border: 1.5px solid transparent;
  transition: border-color 0.2s ease;
}

.scan-input-card:focus-within {
  border-color: var(--primary-color, #2563EB);
  box-shadow: var(--shadow-md);
}

.scan-icon {
  font-size: 24px;
  color: var(--primary-color, #2563EB);
  margin-right: 8px;
}

.scan-input {
  --padding-start: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-main, #0F172A);
  width: 100%;
}

/* ── List Section ── */
.list-section {
  padding: 10px 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.list-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main, #0F172A);
}

.list-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggle-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted, #64748B);
}

.premium-toggle {
  --background: #E2E8F0;
  --background-checked: var(--primary-color, #2563EB);
  width: 38px;
  height: 22px;
}

.action-divider {
  width: 1px;
  height: 18px;
  background: #CBD5E1;
}

.action-btn {
  font-size: 20px;
  color: var(--text-muted, #64748B);
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-btn:active {
  color: var(--primary-color, #2563EB);
}

.action-btn.danger:active {
  color: #EF4444;
}

/* ── Item Cards ── */
.cards-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--card-bg, #fff);
  padding: 16px;
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  border-left: 4px solid transparent;
  transition: all 0.2s ease;
}

.item-card:active {
  transform: scale(0.98);
}

.item-card.is-selected {
  border-left-color: var(--primary-color, #2563EB);
  background: #EFF6FF;
  box-shadow: var(--shadow-md);
}

.card-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-no {
  font-size: 15px;
  font-weight: 700;
  color: var(--primary-color, #2563EB);
  white-space: pre-line;
}

.item-desc {
  font-size: 13px;
  color: var(--text-muted, #64748B);
  line-height: 1.4;
}

.item-category {
  display: inline-block;
  background: #E0E7FF;
  color: var(--primary-dark, #1E40AF);
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
  margin-top: 4px;
  width: fit-content;
}

.check-icon {
  font-size: 22px;
  color: var(--primary-color, #2563EB);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: var(--text-muted, #64748B);
}

/* ── 1-LINE BOTTOM BAR (NO SCROLLING) ── */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  border-top: 1px solid #E2E8F0;
  padding: 10px 4px 18px; /* Tighter padding left/right to fit everything */
  gap: 4px; /* Tighter gap between buttons */
  z-index: 100;
  box-shadow: 0 -4px 15px rgba(15, 23, 42, 0.05);
  /* Removed overflow/scrolling so flexbox squeezes them */
}

button {
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  height: 44px; /* Slightly taller to fit 2 lines of text if squished */
  border-radius: 8px;
  font-size: 11px; /* Small font to fit text */
  font-weight: 700;
  padding: 0 2px;
  
  /* CRITICAL: Allows text to stack (e.g. "Zero \n Quantity") instead of cutting off */
  white-space: normal; 
  text-align: center;
  line-height: 1.1; 
}

button:active {
  transform: scale(0.95);
}

/* Back Button */
.btn-icon {
  background: #F1F5F9;
  color: #334155;
  border: none;
  font-size: 20px;
  flex: 0 0 38px; /* Fixed small width for back button */
  width: 38px;
  padding: 0;
}

/* All Text Buttons Flex Evenly */
.btn-action, .btn-primary {
  flex: 1; /* These stretch and squeeze equally */
}

/* Colors and Borders */
.btn-action {
  border-width: 1px;
  border-style: solid;
}

.btn-change {
  background: #F8FAFC;
  color: #475569;
  border-color: #CBD5E1;
}

.btn-enter-item {
  background: #EFF6FF;
  color: #1D4ED8;
  border-color: #BFDBFE;
}

.btn-zero {
  background: #FEF2F2;
  color: #B91C1C;
  border-color: #FECACA;
}

.btn-primary {
  background: var(--primary-color, #2563EB);
  color: #FFFFFF;
  border: none;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
}

.btn-primary:active {
  background: var(--primary-dark, #1E40AF);
}
</style>