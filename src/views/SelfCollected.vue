<template>
  <master>
    <ion-page>
      <!-- 1. HEADER -->
      <ion-header class="ion-no-border executive-header-spacer">
        <ion-toolbar class="slim-ledger-header">
          <div class="header-top">
            <div class="left-action-group">
              <div class="back-action" @click="goBack">
                <ion-icon :icon="chevronBackOutline"></ion-icon>
              </div>
              <div class="title-stack">
                <span class="status-tag"><span class="pulse-ruby"></span> DISPATCH ACTIVE</span>
                <h1 class="main-title">Self Collection</h1>
              </div>
            </div>
            <div class="task-counter">
              <!-- Dynamically update the task count based on the selected tab -->
              <label>{{ activeTab === 'pending' ? 'PENDING TASKS' : 'COMPLETED TASKS' }}</label>
              <span>{{ filteredDeliveries.length }}</span>
            </div>
          </div>
        </ion-toolbar>

        <!-- 🆕 Custom Segment Tabs for Pending / Complete -->
        <ion-toolbar class="tab-toolbar">
          <div class="custom-tabs">
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'pending' }" 
              @click="activeTab = 'pending'"
            >
              Pending
            </button>
            <button 
              class="tab-btn" 
              :class="{ active: activeTab === 'complete' }" 
              @click="activeTab = 'complete'"
            >
              Complete
            </button>
          </div>
        </ion-toolbar>
      </ion-header>

      <!-- 2. Main Ledger Area -->
      <ion-content class="technical-dispatch-portal">
        <div class="ledger-scroll-area">
          <!-- Loader -->
          <div v-if="loading" class="terminal-loader">
            <ion-spinner name="dots" color="danger"></ion-spinner>
            <p>SYNCING ...</p>
          </div>

          <!-- Empty State (Updates based on active tab) -->
          <div v-if="filteredDeliveries.length === 0 && !loading" class="empty-ledger-state">
            <ion-icon :icon="cubeOutline"></ion-icon>
            <p>NO {{ activeTab.toUpperCase() }} DATA</p>
          </div>

          <!-- Loop through filteredDeliveries -->
          <div 
            v-for="delivery in filteredDeliveries" 
            :key="delivery.DELIVERY_ORDER_NO"
            class="ledger-plate"
            @click="deliveryalldetailes(delivery)"
          >
            <!-- Status Sidebar Indicator -->
            <div class="plate-status-bar" :class="getStatusClass(delivery.DELIVERY_STATUS)"></div>

            <div class="plate-inner">
              <!-- Top Row: Identity & Status -->
              <div class="plate-row">
                <div class="identity-block">
                  <span class="tiny-label">ORDER REFERENCE</span>
                  <h2 class="order-id">#{{ delivery.DELIVERY_ORDER_NO }}</h2>
                </div>
                <div :class="['status-badge-mini', getStatusClass(delivery.DELIVERY_STATUS)]">
                  {{ delivery.DELIVERY_STATUS }}
                </div>
              </div>

              <!-- Customer Info -->
              <h3 class="customer-name">{{ delivery.CUSTOMER_NAME }}</h3>

              <!-- Data Grid: Logistics (Small Fonts) -->
              <div class="logistics-grid">
                <div class="log-cell">
                  <label>COLLECTION POINT</label>
                  <p class="address-text">{{ delivery.DELIVERY_ADDRESS || 'Self Collection' }}</p>
                </div>
                <div class="log-cell border-left">
                  <label>CONTACT</label>
                  <p class="phone-text">{{ delivery.CONTACT_NUMBER }}</p>
                </div>
              </div>

              <!-- Footer Row -->
              <div class="plate-footer">
                <div class="date-meta">
                  <ion-icon :icon="timeOutline"></ion-icon>
                  <span>{{ delivery.DELIVERY_DATE || 'Anytime' }}</span>
                </div>
                <div class="action-trigger">
                  <span>INITIATE</span>
                  <ion-icon :icon="chevronForwardOutline"></ion-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ion-content>
    </ion-page>
  </master>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonContent, IonSpinner, IonIcon } from '@ionic/vue';
import { calendarOutline, cubeOutline, locationOutline, callOutline, timeOutline, chevronForwardOutline, chevronBackOutline } from 'ionicons/icons';
import pick from '@/services/pick';

export default defineComponent({
  name: "DeliveryJob",
  components: { IonPage, IonHeader, IonToolbar, IonContent, IonSpinner, IonIcon },
  setup() {
    return { calendarOutline, cubeOutline, locationOutline, callOutline, timeOutline, chevronForwardOutline, chevronBackOutline };
  },
  data() {
    return {
      delivery_detailes: [] as any[],
      loading: false, 
      activeTab: 'pending',
    }
  },
  computed: {
    filteredDeliveries(): any[] {
      if (this.activeTab === 'complete') {
        return this.delivery_detailes.filter(d => d.DELIVERY_STATUS === 'Delivered' || d.DELIVERY_STATUS === 'Collected');
      } else {
        return this.delivery_detailes.filter(d => d.DELIVERY_STATUS !== 'Delivered' && d.DELIVERY_STATUS !== 'Collected');
      }
    }
  },
  mounted() {
    this.deliveryModule();
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    getStatusClass(status: string) {
      if (status === 'Delivered' || status === 'Collected') return 'state-green';
      if (status === 'Not Delivered') return 'state-red';
      if (status === 'Delivery In Progress' || status === 'Assigned Delivery') return 'state-amber';
      return 'state-default';
    },
    deliveryalldetailes(delivery: any) {
      localStorage.setItem("deliveryItem", JSON.stringify(delivery));
      localStorage.setItem("deliveryOrderItem", JSON.stringify(delivery.ORDER_DETAILS));
      if (delivery.DELIVERY_STATUS === "Delivered") {
        this.$router.push('/SelfCollectedDeliveryOrder');
      } else {
        this.$router.push('/SelfCollectedPendingDelivery');
      }
    },
    // 🆕 Updated method using getSelfCollected()
    deliveryModule() {
      this.loading = true;
      pick.getSelfCollected().then((res: any) => {
        this.delivery_detailes = res.status !== "false" ? res.response : [];
      }).catch((error) => {
        console.error("Error fetching self collected data:", error);
        this.delivery_detailes = [];
      }).finally(() => {
        this.loading = false;
      });
    },
  }
})
</script>

<style scoped>
/* Moves the whole header down from the status bar */
.executive-header-spacer {
  padding-top: 70px;
  background: #ffffff;
}

.slim-ledger-header {
  --background: #ffffff;
  --padding-start: 20px;
  --padding-end: 20px;
  --min-height: 50px; 
}

/* Tab Toolbar Styling */
.tab-toolbar {
  --background: #ffffff;
  --padding-top: 10px;
  --padding-bottom: 15px;
  --padding-start: 15px;
  --padding-end: 15px;
  border-bottom: 1px solid #E2E8F0;
}

.custom-tabs {
  display: flex;
  background: #F1F5F9;
  border-radius: 8px;
  padding: 4px;
  width: 100%;
}

.tab-btn {
  flex: 1;
  padding: 8px 0;
  font-size: 13px;
  font-weight: 800;
  color: #94A3B8;
  background: transparent;
  border: none;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: #ffffff;
  color: #DC2626; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.header-top { display: flex; justify-content: space-between; align-items: flex-end; width: 100%; padding-bottom: 10px; }

.left-action-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-action {
  background: #F1F5F9;
  border-radius: 8px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0F172A;
  font-size: 20px;
  cursor: pointer;
}

.status-tag {
  display: flex; align-items: center; gap: 5px;
  font-size: 8px; font-weight: 900; color: #94A3B8; letter-spacing: 1px;
}

.pulse-ruby {
  width: 6px; height: 6px; background: #DC2626; border-radius: 50%;
  box-shadow: 0 0 8px rgba(220, 38, 38, 0.4);
}

.main-title { color: #0F172A; font-size: 19px; font-weight: 900; margin: 0; letter-spacing: -0.5px; }

.task-counter { text-align: right; }
.task-counter label { display: block; font-size: 7.5px; font-weight: 900; color: #94A3B8; }
.task-counter span { font-size: 16px; font-weight: 900; color: #DC2626; }

/* Background & Content */
.technical-dispatch-portal { --background: #F4F7F9; }

/* Ledger Card Design */
.ledger-scroll-area { padding: 15px 12px; }
.ledger-plate { background: white; border-radius: 12px; margin-bottom: 10px; border: 1px solid #E2E8F0; position: relative; overflow: hidden; }
.plate-status-bar { position: absolute; top: 0; left: 0; bottom: 0; width: 4px; }
.plate-inner { padding: 12px 15px; }

.plate-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;}
.tiny-label { display: block; font-size: 7.5px; font-weight: 900; color: #CBD5E1; letter-spacing: 0.5px; margin-bottom: 2px; }
.order-id { color: #64748B; font-size: 12px; font-weight: 800; margin: 0; }
.status-badge-mini { font-size: 8px; font-weight: 900; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; }

.customer-name { color: #0F172A; font-size: 14px; font-weight: 800; margin: 0 0 10px 0; }

.logistics-grid { display: grid; grid-template-columns: 1.5fr 1fr; background: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 8px; margin-bottom: 12px; }
.log-cell { padding: 8px 10px; }
.log-cell label { display: block; font-size: 7px; font-weight: 900; color: #94A3B8; margin-bottom: 3px; }
.border-left { border-left: 1px solid #F1F5F9; }
.address-text, .phone-text { color: #475569; font-size: 10px; font-weight: 700; margin: 0; line-height: 1.3; }

.plate-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px dashed #E2E8F0; }
.date-meta { display: flex; align-items: center; gap: 5px; color: #94A3B8; font-size: 10px; font-weight: 700; }
.action-trigger { display: flex; align-items: center; gap: 4px; color: #DC2626; font-size: 9px; font-weight: 900; }

/* Status Colors */
.state-green { background-color: #10B981; }
.status-badge-mini.state-green { background: #ECFDF5; color: #059669; border: 0.5px solid #D1FAE5; }
.state-red { background-color: #DC2626; }
.status-badge-mini.state-red { background: #FEF2F2; color: #DC2626; border: 0.5px solid #FEE2E2; }
.state-amber { background-color: #F59E0B; }
.status-badge-mini.state-amber { background: #FFFBEB; color: #D97706; border: 0.5px solid #FEF3C7; }
.state-blue { background-color: #2563EB; }
.status-badge-mini.state-blue { background: #EFF6FF; color: #2563EB; border: 0.5px solid #DBEAFE; }

.terminal-loader { text-align: center; margin-top: 40px; color: #64748B; font-size: 10px; font-weight: 900; }
.empty-ledger-state { text-align: center; padding: 60px 20px; color: #CBD5E1; font-size: 11px; font-weight: 900; }
</style>