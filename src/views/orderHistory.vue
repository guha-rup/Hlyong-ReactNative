<template>
  <master>
    <div class="technical-history-portal">
      
      <!-- 1. Ultra-Slim Executive Header -->
      <header class="slim-terminal-header">
        <div class="header-content">
          <div class="title-stack">
           
            <h1 class="main-title">Order History</h1>
          </div>
          <div class="record-counter">
            <label>TOTAL RECORDS</label>
            <span>{{ OrderHistory.length }}</span>
          </div>
        </div>
      </header>

      <div class="terminal-body">
        
        <!-- Empty State System -->
        <div v-if="OrderHistory.length === 0" class="system-empty">
          <ion-icon :icon="receiptOutline"></ion-icon>
          <p>NO  DATA DETECTED</p>
        </div>

        <!-- 2. Technical Ledger Plates -->
        <div 
          v-for="order in OrderHistory" 
          :key="order.DELIVERY_ORDER_NO"
          class="ledger-plate"
        >
          <!-- Left Status Indicator Bar -->
          <div class="plate-indicator" :class="getStatusClass(order.DELIVERY_STATUS)"></div>

          <div class="plate-inner">
            <!-- Header Row: ID & Status Badge -->
            <div class="plate-row header">
              <div class="id-group">
                <span class="tiny-label">ORDER ID</span>
                <h2 class="order-no">#{{ order.DELIVERY_ORDER_NO }}</h2>
              </div>
              <div :class="['status-pill-mini', getStatusClass(order.DELIVERY_STATUS)]">
                {{ order.DELIVERY_STATUS }}
              </div>
            </div>

            <!-- Customer Identity -->
            <div class="customer-section">
              <h3 class="cust-name">{{ order.CUSTOMER_NAME }}</h3>
              <div class="address-box">
                <ion-icon :icon="locationOutline"></ion-icon>
                <p>{{ order.DELIVERY_ADDRESS }} {{ order.DELIVERY_PIN_CODE }}</p>
              </div>
            </div>

            <!-- Technical Data Grid (3-Column Small Font) -->
            <div class="data-grid">
              <div class="data-cell">
                <label>DISPATCH DATE</label>
                <div class="val-wrap">
                  <ion-icon :icon="calendarOutline"></ion-icon>
                  <span>{{ order.DELIVERY_DATE }}</span>
                </div>
              </div>
              <div class="data-cell border-left">
                <label>CONTACT REF</label>
                <div class="val-wrap">
                  <ion-icon :icon="callOutline"></ion-icon>
                  <span>{{ order.HP }}</span>
                </div>
              </div>
              <div class="data-cell border-left">
                <label>PAYMENT MODE</label>
                <div class="val-wrap">
                  <ion-icon :icon="walletOutline"></ion-icon>
                  <span>{{ order.COLLECTION_PAYMENT_MODE || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Financial Reconciliation Strip (Rich & Compact) -->
            <div class="financial-strip">
              <div class="f-cell">
                <label>TARGET COLLECTION</label>
                <span class="f-val">S$ {{ order.AMOUNT_TO_COLLECT }}</span>
              </div>
              <div class="f-cell highlight">
                <label>ACTUAL COLLECTED</label>
                <span class="f-val crimson-text">S$ {{ order.COLLECTED_AMOUNT }}</span>
              </div>
            </div>

            <!-- Remarks Module (Collapsed Technical Style) -->
            <div class="remarks-module" v-if="order.DELIVERY_REMARKS || order.PAYMENT_REMARKS">
                <div class="remark-row">
                    <ion-icon :icon="chatbubbleEllipsesOutline"></ion-icon>
                    <span>{{ order.DELIVERY_REMARKS || 'No job remarks recorded' }}</span>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </master>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonIcon, IonCard, IonCardContent } from '@ionic/vue';
import { 
  receiptOutline, locationOutline, calendarOutline, 
  callOutline, walletOutline, chatbubbleEllipsesOutline, 
  cardOutline, cubeOutline 
} from 'ionicons/icons';
import pick from '@/services/pick';

export default defineComponent({
  name: "OrderHistoryTechnical",
  components: { IonIcon },
  setup() {
    // Icons provided here to prevent Vite export errors
    return { 
      receiptOutline, locationOutline, calendarOutline, 
      callOutline, walletOutline, chatbubbleEllipsesOutline, 
      cardOutline, cubeOutline 
    };
  },
  data() {
    return {
      OrderHistory: [] as any[],
    }
  },
  mounted() {
    this.getPickOrder();
  },
  methods: {
    getStatusClass(status: string) {
      if (status === 'Delivered') return 'state-green';
      if (status === 'Not Delivered') return 'state-red';
      if (status === 'Delivery In Progress') return 'state-amber';
      if (status === 'Collected') return 'state-blue';
      return 'state-default';
    },
    getPickOrder() {
      pick.OrderDetailes().then((res: any) => {
        this.OrderHistory = res.status !== "false" ? res.response : [];
      });
    },
  }
})
</script>

<style scoped>
/* 1. Global Technical Background */
.technical-history-portal {
  min-height: 100vh;
  background-color: #F4F7F9; /* Titanium White */
  padding-bottom: 40px;
}

/* 2. Slim Executive Header */
.slim-terminal-header {
  background: white;
  padding: 35px 20px 15px;
  border-bottom: 1px solid #E2E8F0;
}

.header-content { display: flex; justify-content: space-between; align-items: flex-end; }
.status-tag { display: flex; align-items: center; gap: 5px; font-size: 8px; font-weight: 900; color: #94A3B8; letter-spacing: 1px; }
.pulse-ruby { width: 6px; height: 6px; background: #DC2626; border-radius: 50%; box-shadow: 0 0 8px rgba(220, 38, 38, 0.4); }
.main-title { color: #0F172A; font-size: 19px; font-weight: 900; margin: 2px 0 0; letter-spacing: -0.5px; }

.record-counter { text-align: right; }
.record-counter label { display: block; font-size: 7.5px; font-weight: 900; color: #94A3B8; }
.record-counter span { font-size: 16px; font-weight: 900; color: #0F172A; }

.terminal-body { padding: 15px 12px; }

/* 3. The Ledger Plate (Card) Design */
.ledger-plate {
  background: white; border-radius: 12px; margin-bottom: 12px;
  border: 1px solid #E2E8F0; position: relative; overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.plate-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }
/* State Colors for Sidebar */
.state-green { background-color: #10B981; }
.state-red { background-color: #DC2626; }
.state-amber { background-color: #F59E0B; }
.state-blue { background-color: #2563EB; }

.plate-inner { padding: 12px 15px; }

/* Header Row */
.plate-row.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.tiny-label { display: block; font-size: 7.5px; font-weight: 900; color: #CBD5E1; letter-spacing: 0.5px; margin-bottom: 2px; }
.order-no { font-size: 13px; font-weight: 800; color: #64748B; margin: 0; }

.status-pill-mini { font-size: 8px; font-weight: 900; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.5px; }
.status-pill-mini.state-green { background: #ECFDF5; color: #059669; border: 0.5px solid #D1FAE5; }
.status-pill-mini.state-red { background: #FEF2F2; color: #DC2626; border: 0.5px solid #FEE2E2; }
.status-pill-mini.state-amber { background: #FFFBEB; color: #D97706; border: 0.5px solid #FEF3C7; }
.status-pill-mini.state-blue { background: #EFF6FF; color: #2563EB; border: 0.5px solid #DBEAFE; }

/* Customer Identity */
.cust-name { color: #0F172A; font-size: 15px; font-weight: 800; margin: 0 0 4px 0; }
.address-box { display: flex; gap: 6px; color: #64748B; font-size: 10px; font-weight: 600; margin-bottom: 12px; }
.address-box ion-icon { color: #DC2626; font-size: 12px; }

/* Technical Data Grid */
.data-grid {
  display: grid; grid-template-columns: 1fr 1fr 1.2fr;
  background: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 8px;
  margin-bottom: 12px;
}
.data-cell { padding: 8px 10px; }
.data-cell label { display: block; font-size: 7px; font-weight: 900; color: #94A3B8; margin-bottom: 4px; }
.border-left { border-left: 1px solid #F1F5F9; }

.val-wrap { display: flex; align-items: center; gap: 4px; color: #475569; font-size: 10px; font-weight: 700; }
.val-wrap ion-icon { font-size: 11px; color: #CBD5E1; }

/* Financial Reconciliation Strip */
.financial-strip { display: flex; gap: 10px; margin-bottom: 12px; }
.f-cell { flex: 1; background: white; border: 1px solid #E2E8F0; padding: 6px 10px; border-radius: 8px; }
.f-cell.highlight { background: #FFF5F5; border-color: #FEE2E2; }
.f-cell label { display: block; font-size: 7px; font-weight: 900; color: #94A3B8; margin-bottom: 2px; }
.f-val { font-size: 12px; font-weight: 900; color: #0F172A; }
.crimson-text { color: #DC2626; }

/* Remarks Module */
.remarks-module { padding-top: 10px; border-top: 1px dashed #E2E8F0; }
.remark-row { display: flex; gap: 8px; align-items: flex-start; color: #94A3B8; font-size: 10px; font-weight: 600; font-style: italic; }
.remark-row ion-icon { font-size: 14px; margin-top: -2px; color: #CBD5E1; }

/* System UI */
.system-empty { text-align: center; padding: 60px 20px; color: #CBD5E1; }
.system-empty ion-icon { font-size: 32px; margin-bottom: 10px; }
.system-empty p { font-size: 9px; font-weight: 900; letter-spacing: 1.5px; }
</style>