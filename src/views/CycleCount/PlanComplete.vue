<template>
  <master>
    <div class="page-container">

      <!-- Success Banner & Toolbar -->
      <div class="card-section banner-card">
        <div class="success-header">
          <div class="icon-wrapper">
            <ion-icon :icon="checkmarkCircle" class="success-icon"></ion-icon>
          </div>
          <div class="success-text">
            <h2>Plan Summary</h2>
            <p>Cycle count plan <strong>{{ planName }}</strong> overview.</p>
          </div>
        </div>
        
        <div class="toolbar-divider"></div>

        <div class="toolbar">
          <div class="toggle-group">
            <span class="toggle-label">Completed Tasks Only</span>
            <ion-toggle v-model="isComplete" class="premium-toggle" disabled></ion-toggle>
          </div>
          <div class="action-group">
            <button class="icon-btn" @click="fetchPlanData">
              <ion-icon :icon="searchOutline"></ion-icon>
            </button>
            <button class="icon-btn danger" @click="clearData">
              <ion-icon :icon="trashOutline"></ion-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Scanned Items Table/List -->
      <div class="card-section mt-4">
        <div class="section-header">
          <span class="label-text">Scanned Items</span>
          <span class="count-badge">{{ tableData.length }}</span>
        </div>

        <div class="premium-table">
          <!-- Table Header -->
          <div class="table-head">
            <span class="col-bin">BIN</span>
            <span class="col-item">ITEM</span>
            <span class="col-qty">QTY</span>
          </div>

          <!-- Table Body -->
          <div class="table-body">
            <div
              class="table-row"
              v-for="(row, index) in tableData"
              :key="index"
            >
              <span class="col-bin data-text">{{ row.BIN }}</span>
              <span class="col-item data-text">{{ row.ITEM }}</span>
              <span class="col-qty">
                <span class="qty-pill">{{ row.QUANTITY }}</span>
              </span>
            </div>

            <!-- Empty State -->
            <div class="empty-state" v-if="tableData.length === 0">
              <ion-icon :icon="documentTextOutline" class="empty-icon"></ion-icon>
              <p>No scanned data found for this plan.</p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Floating Bottom Bar -->
    <div class="bottom-bar-wrapper">
      <div class="bottom-bar">
        <button class="outline-btn" @click="goMainMenu">
          Main Menu
        </button>
        <button class="solid-btn" @click="goNextPlan">
          Next Plan
          <ion-icon :icon="arrowForward" class="btn-icon"></ion-icon>
        </button>
      </div>
    </div>

  </master>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonToggle, IonIcon } from '@ionic/vue';
import master from '../layouts/Master.vue';
import pick from '@/services/pick';

// Import Icons properly for Vue 3
import { 
  trashOutline, 
  searchOutline, 
  checkmarkCircle, 
  documentTextOutline,
  arrowForward
} from 'ionicons/icons';

export default defineComponent({
  name: 'PlanComplete',
  components: {
    IonToggle,
    IonIcon,
    master
  },
  setup() {
    return {
      trashOutline,
      searchOutline,
      checkmarkCircle,
      documentTextOutline,
      arrowForward
    };
  },
  data() {
    return {
      planNo: '' as string,
      planName: 'Unknown Plan' as string,
      isComplete: true,
      tableData: [] as any[]
    };
  },
  async mounted() {
    // 1. Get Plan Number from Router
    this.planNo = (this.$route.query.planNo as string) || '';

    // 2. Fetch the updated plan data from API
    if (this.planNo) {
      await this.fetchPlanData();
    } else {
      // Fallback: If no planNo was provided, just show the single item passed
      const bin = (this.$route.query.bin as string) || '';
      const item = (this.$route.query.item as string) || '';
      const quantity = (this.$route.query.quantity as string) || '';
      const uom = (this.$route.query.uom as string) || '';

      if (bin && item && quantity) {
        this.tableData = [
          { BIN: bin, ITEM: item, QUANTITY: `${quantity} ${uom}` }
        ];
      }
    }
  },
  methods: {
    async fetchPlanData() {
      try {
        // Get Warehouse ID from local storage (Required for API call)
        const rawData = localStorage.getItem('scanData');
        let warehouseId = "1";
        if (rawData) {
          const parsed = JSON.parse(rawData);
          warehouseId = (Array.isArray(parsed) ? parsed[0] : parsed).BRANCH_NAME_SYS_ID || "1";
        }

        // Fetch All Plans
        const res = await pick.getCyclePlans(warehouseId);
        const plans = Array.isArray(res) ? res : (res?.data || res?.response || []);
        
        // Find the matching plan
        const selectedPlan = plans.find((p: any) => String(p.PLAN_SYS_ID) === String(this.planNo));

        if (selectedPlan && selectedPlan.TASK_DETAILS) {
          // Set Plan Name (e.g. "Checking" or "Abcdef")
          this.planName = selectedPlan.PLAN_NAME;

          // Filter tasks to ONLY show ones that have a COUNT_QTY (meaning they've been scanned)
          const completedTasks = selectedPlan.TASK_DETAILS.filter((t: any) => t.COUNT_QTY !== null);

          // Map them to match the Table's UI structure
          this.tableData = completedTasks.map((t: any) => ({
            BIN: t.BIN_NAME,
            ITEM: t.PRODUCT_NAME,
            QUANTITY: t.COUNT_QTY  // Outputs "100 BOX" directly from API
          }));
        }

      } catch (error) {
        console.error("Failed to fetch final plan data:", error);
      }
    },
    clearData() {
      this.tableData = [];
    },
    goMainMenu() {
      this.$router.push({ name: 'Home' }); // Update name to match your actual Home route
    },
    goNextPlan() {
      this.$router.push({ name: 'SelectPlan' }); // Update name to match your Plan List route
    }
  }
});
</script>

<style scoped>
/* ── Global Layout ── */
.page-container {
  padding: 20px 20px 110px; /* Clear fixed bottom bar */
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

/* ── Success Banner & Toolbar ── */
.banner-card {
  padding: 0;
  overflow: hidden;
}

.success-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
}

.icon-wrapper {
  background: #dcfce7;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.success-icon {
  font-size: 28px;
  color: #16a34a;
}

.success-text h2 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.success-text p {
  margin: 0;
  font-size: 14px;
  color: #64748b;
}

.success-text strong {
  color: #0f172a;
}

.toolbar-divider {
  height: 1px;
  background: #f1f5f9;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #ffffff;
}

.toggle-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.premium-toggle {
  --background: #cbd5e1;
  --background-checked: #3b82f6;
  width: 44px;
  height: 24px;
}

.action-group {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: #f8fafc;
  color: #64748b;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:active {
  background: #e2e8f0;
  transform: scale(0.92);
}

.icon-btn.danger {
  color: #ef4444;
  background: #fef2f2;
}

.icon-btn.danger:active {
  background: #fee2e2;
}

/* ── Table / List Section ── */
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.label-text {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.count-badge {
  background: #eff6ff;
  color: #3b82f6;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 12px;
}

/* Table Layout */
.premium-table {
  width: 100%;
}

.table-head {
  display: flex;
  padding: 0 8px 10px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.5px;
}

.table-row {
  display: flex;
  align-items: center;
  padding: 14px 8px;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.table-row:last-child {
  border-bottom: none;
}

.col-bin { flex: 1.2; }
.col-item { flex: 1.5; }
.col-qty { 
  flex: 1.3; 
  display: flex;
  justify-content: flex-end; 
}

.data-text {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

/* QTY Pill Badge */
.qty-pill {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  white-space: nowrap;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0 10px;
  color: #94a3b8;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

/* ── Floating Bottom Bar ── */
.bottom-bar-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px 24px; 
  background: linear-gradient(to top, rgba(255,255,255,1) 85%, rgba(255,255,255,0));
  z-index: 100;
}

.bottom-bar {
  display: flex;
  gap: 12px;
}

.outline-btn {
  flex: 1;
  background: #ffffff;
  color: #475569;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}

.outline-btn:active {
  background: #f8fafc;
  transform: scale(0.96);
}

.solid-btn {
  flex: 1.5;
  background: #0f172a; 
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  padding: 14px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
}

.solid-btn:active {
  transform: scale(0.96);
  background: #1e293b;
}

.btn-icon {
  font-size: 18px;
}
</style>