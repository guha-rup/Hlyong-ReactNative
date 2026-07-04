<template>
  <master class="premium-layout">
    
    <div class="content-wrapper">
      <!-- Header Section -->
      <div class="section-header">
        <div>
          <h1 class="section-title">Cycle Count Tasks</h1>
          <p class="section-subtitle">Plan #{{ planNo }} - Select a task to begin</p>
        </div>
        <div class="header-actions">
          <button class="icon-btn" @click="fetchTasks" aria-label="Refresh">
            <ion-icon :icon="refreshOutline"></ion-icon>
          </button>
          <button class="icon-btn danger" @click="clearTasks" aria-label="Clear">
            <ion-icon :icon="trashOutline"></ion-icon>
          </button>
        </div>
      </div>

      <!-- Settings Card -->
      <div class="settings-card">
        <div class="toggle-row">
          <span class="toggle-label">Show Completed Tasks</span>
          <ion-toggle v-model="showCompleted" class="premium-toggle"></ion-toggle>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="data-card">
        <div class="table-header">
          <span class="col-bin">BIN Location</span>
          <span class="col-item">Product Details</span>
        </div>

        <div class="table-body">
          <!-- Loading State -->
          <div v-if="isLoading" class="loading-state">
            <ion-spinner name="crescent"></ion-spinner>
            <p>Loading tasks...</p>
          </div>

          <!-- Task List -->
          <template v-else>
            <div
              class="table-row"
              v-for="(task, index) in filteredTasks"
              :key="task.BIN_SYS_ID + '-' + index"
              @click="selectTask(task)"
              :class="{ 
                'selected': selectedTask?.BIN_SYS_ID === task.BIN_SYS_ID,
                'completed': task.completed 
              }"
            >
              <div class="col-bin">
                <div class="bin-info-group">
                  <span class="bin-badge">
                    <ion-icon :icon="cubeOutline" class="bin-icon"></ion-icon>
                    {{ task.BIN_NAME }}
                  </span>
                  <span class="zone-text">{{ task.ZONE_NAME }}</span>
                </div>
              </div>
              <div class="col-item">
                <div class="item-info">
                  <span class="item-text">{{ task.PRODUCT_NAME }}</span>
                  <span class="category-text">{{ task.ITEM_CATEGORY }}</span>
                </div>
                <ion-icon 
                  v-if="task.completed" 
                  :icon="checkmarkCircle" 
                  class="status-icon success"
                ></ion-icon>
              </div>
            </div>

            <!-- Empty State -->
            <div class="empty-state" v-if="filteredTasks.length === 0">
              <ion-icon :icon="folderOpenOutline" class="empty-icon"></ion-icon>
              <p>No tasks available for this plan</p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Floating Bottom Bar -->
    <div class="bottom-bar">
      <button class="back-btn" @click="goBack">
        <ion-icon :icon="chevronBackOutline"></ion-icon>
      </button>
      <button 
        class="start-btn" 
        :class="{ 'disabled': !selectedTask }"
        @click="handleStartCount"
      >
        <span>Start Count</span>
        <ion-icon :icon="arrowForwardOutline"></ion-icon>
      </button>
    </div>

  </master>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonToggle, IonIcon, IonSpinner } from '@ionic/vue';
import master from '../layouts/Master.vue';
import pick from '@/services/pick';

import { 
  searchOutline, 
  trashOutline, 
  cubeOutline, 
  checkmarkCircle, 
  folderOpenOutline, 
  chevronBackOutline, 
  arrowForwardOutline,
  refreshOutline
} from 'ionicons/icons';

export default defineComponent({
  name: 'SelectTask',
  components: {
    IonToggle,
    IonIcon,
    IonSpinner,
    master
  },
  setup() {
    return {
      searchOutline,
      trashOutline,
      cubeOutline,
      checkmarkCircle,
      folderOpenOutline,
      chevronBackOutline,
      arrowForwardOutline,
      refreshOutline
    };
  },
  data() {
    return {
      planNo: '' as string,
      warehouseId: '' as string,
      showCompleted: false,
      isLoading: false,
      selectedTask: null as any,
      tasks: [] as any[]
    };
  },
  computed: {
    filteredTasks(): any[] {
      if (this.showCompleted) return this.tasks;
      return this.tasks.filter((t: any) => !t.completed);
    }
  },
  async mounted() {
    this.planNo = (this.$route.query.planNo as string) || '';
    this.initWarehouseContext();
    await this.fetchTasks();
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
    async fetchTasks() {
      if (!this.warehouseId || !this.planNo) return;
      this.isLoading = true;
      try {
        // Fetch all plans for the warehouse
        const res = await pick.getCyclePlans(this.warehouseId);
        
        let plans = [];
        if (Array.isArray(res)) plans = res;
        else if (res?.data) plans = res.data;
        else if (res?.response) plans = res.response;

        // Find the specific plan based on the passed PLAN_SYS_ID
        const selectedPlan = plans.find((p: any) => String(p.PLAN_SYS_ID) === String(this.planNo));

        if (selectedPlan && selectedPlan.TASK_DETAILS) {
          // Map tasks and append a local 'completed' flag (assuming false initially)
          this.tasks = selectedPlan.TASK_DETAILS.map((t: any) => ({
            ...t,
            completed: false 
          }));
        } else {
          this.tasks = [];
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        this.isLoading = false;
      }
    },
    selectTask(task: any) {
      this.selectedTask = task;
    },
    clearTasks() {
      this.selectedTask = null;
    },
    goBack() {
      this.$router.back();
    },
    handleStartCount() {
      if (!this.selectedTask) return;
      // Push specific details to next screen
      this.$router.push({ 
        name: 'EnterBin', 
        query: { 
          planNo: this.planNo, 
          bin: this.selectedTask.BIN_NAME, 
          item: this.selectedTask.PRODUCT_NAME,
          binSysId: this.selectedTask.BIN_SYS_ID,
          productSysId: this.selectedTask.PRODUCT_SYS_ID
        } 
      });
    }
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.premium-layout {
  --bg-color: #f4f7f9;
  --surface-color: #ffffff;
  --primary-color: #0f172a;
  --accent-color: #2563eb;
  --text-main: #1e293b;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-color);
  min-height: 100vh;
}

.content-wrapper {
  padding: 16px 16px 100px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* --- Headers --- */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 4px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.icon-btn {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.icon-btn:active {
  transform: scale(0.92);
}

.icon-btn.danger {
  color: #ef4444;
}

/* --- Cards General --- */
.settings-card, .data-card {
  background: var(--surface-color);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
}

/* --- Toggle Row --- */
.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.toggle-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.premium-toggle {
  --background: #cbd5e1;
  --background-checked: var(--accent-color);
  --handle-box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* --- Data Table --- */
.table-header {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  padding: 16px;
  background: #f8fafc;
  border-bottom: 1px solid var(--border-color);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: var(--accent-color);
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:active { background-color: #f8fafc; }
.table-row.selected { background-color: #eff6ff; }
.table-row.selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--accent-color);
  border-radius: 0 4px 4px 0;
}
.table-row.completed { opacity: 0.6; }

/* Data Columns & Typography */
.col-bin, .col-item {
  display: flex;
  align-items: center;
}

.bin-info-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.bin-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  color: var(--accent-color);
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #bfdbfe;
}

.zone-text {
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 600;
  margin-left: 2px;
}

.bin-icon { font-size: 16px; }

.item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1.2;
}

.category-text {
  font-size: 12px;
  color: var(--text-muted);
}

.status-icon.success {
  color: #10b981;
  margin-left: auto;
  font-size: 18px;
}

/* --- Empty State --- */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
  font-weight: 500;
}

/* --- Floating Bottom Bar --- */
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--border-color);
  padding: 16px;
  gap: 16px;
  z-index: 100;
  box-shadow: 0 -10px 20px rgba(0, 0, 0, 0.03);
}

.back-btn {
  background: var(--surface-color);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 20px;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
}

.back-btn:active {
  background: #f1f5f9;
  transform: scale(0.95);
}

.start-btn {
  flex: 1;
  background: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);
}

.start-btn:active:not(.disabled) {
  transform: translateY(2px);
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);
}

.start-btn.disabled {
  background: #cbd5e1;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>