<template>
  <master>
    <div class="titanium-ledger-view">
      
      <!-- 1. Executive Slim Header -->
      <header class="executive-header">
        <div class="title-block">
          <div class="status-indicator">
            <span class="pulse-red"></span>
         
          </div>
       
        </div>
        <ion-button @click="viewExpenditure" class="premium-add-btn">
          <ion-icon :icon="addOutline" slot="start"></ion-icon>
        Add Expenditure
        </ion-button>
      </header>

      <!-- 2. Technical List Content -->
      <div class="ledger-content">
        
        <!-- Loader / Empty State -->
        <div v-if="get_expendure_detailes.length === 0" class="system-empty">
          <ion-icon :icon="receiptOutline"></ion-icon>
          <p v-if="loading">SYNCING DATA...</p>
          <p v-else>NO TRANSACTION DATA FOUND</p>
        </div>

        <!-- Premium Ledger Card -->
        <div 
          v-for="(expenditure, index) in get_expendure_detailes" 
          :key="index"
          class="ledger-plate"
        >
          <!-- Left side color bar based on status -->
          <div class="plate-status-bar" :class="getStatusClass(expenditure.PAYMENT_STATUS)"></div>

          <div class="plate-inner" @click="getData(expenditure)">
            
            <!-- Top Metadata Row -->
            <div class="plate-meta">
              <span class="p-id">REF: #{{ expenditure.BILL_NO || 'TRX-' + expenditure.EXPENDITURE_SYS_ID }}</span>
              <div :class="['p-badge', getStatusClass(expenditure.PAYMENT_STATUS)]">
                {{ expenditure.PAYMENT_STATUS }}
              </div>
            </div>

            <!-- Main Identity Grid -->
            <div class="plate-grid">
              <div class="identity-col">
                <label class="technical-label">ENTITY / VENDOR</label>
                <h2 class="entity-name">{{ expenditure.SUPPLIER_NAME || expenditure.BILL_FROM }}</h2>
                <div class="sub-specs">
                  <span class="spec-text">{{ expenditure.BILL_FROM }}</span>
                  <span class="spec-divider">/</span>
                  <span class="spec-text">{{ expenditure.CATEGORY || 'GENERAL' }}</span>
                </div>
              </div>

              <div class="monetary-col">
                <label class="technical-label text-right">TOTAL VALUE</label>
                <div class="amount-wrap">
                  <span class="symbol">S$</span>
                  <span class="value">{{ expenditure.TOTAL_AMOUNT }}</span>
                </div>
                <div class="date-stamp">{{ expenditure.BILL_DATE }}</div>
              </div>
            </div>

            <!-- Action Ribbon -->
            <div class="plate-footer">
              <div class="action-btn delete" @click.stop="deleteExpenditure(expenditure)">
                <ion-icon :icon="trashOutline"></ion-icon>
                <span>DELETE RECORD</span>
              </div>
              <div class="action-btn edit">
                <span>VIEW DETAILS</span>
                <ion-icon :icon="chevronForwardOutline"></ion-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </master>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonButton, IonIcon } from "@ionic/vue";
import { 
  addOutline, trashOutline, receiptOutline, businessOutline, 
  personOutline, chevronForwardOutline 
} from 'ionicons/icons';
import pick from '@/services/pick';

export default defineComponent({
  name: "ViewExpenditure",
  components: { IonButton, IonIcon },
  setup() {
    // These MUST be returned for the template to see them
    return { 
      addOutline, trashOutline, receiptOutline, businessOutline, 
      personOutline, chevronForwardOutline 
    };
  },
  data() {
    return {
      get_expendure_detailes: [] as any[],
      loading: false
    }
  },
  mounted() {
    this.getExpenditure();
  },
  methods: {
    getStatusClass(status: string) {
      if (status === 'Paid') return 'state-paid';
      if (status === 'Pending' || status === 'Due') return 'state-due';
      return 'state-overdue';
    },
    viewExpenditure() {
      this.$router.push('/addexpenditure');
    },
    deleteExpenditure(expenditure: any) {
      if(confirm("Confirm deletion of this record?")) {
        pick.deleteExpendituresave({
          ITEM: "DELETE",
          RECORD_SYS_ID: expenditure.EXPENDITURE_SYS_ID
        }).then(res => {
          if (res.status != 'false') {
            this.getExpenditure();
          }
        });
      }
    },
    getExpenditure() {
      this.loading = true;
      pick.getExpenditure({}).then((res) => {
        console.log("Expenditure Data Loaded:", res); // DEBUG LOG
        if (res && res.status !== "false") {
            this.get_expendure_detailes = res.response;
        } else {
            this.get_expendure_detailes = [];
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    getData(expenditure: any) {
      localStorage.setItem("expenditure", JSON.stringify(expenditure));
      this.$router.push('/editexpenditure');
    }
  }
})
</script>

<style scoped>
/* 1. Technical Container */
.titanium-ledger-view {
  min-height: 100vh;
  background-color: #F4F7F9;
  padding: 5px 12px 60px;
}

/* 2. Executive Header */
.executive-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 20px 5px;
  border-bottom: 2px solid #E2E8F0;
  margin-bottom: 20px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.status-indicator label {
  font-size: 8px;
  font-weight: 900;
  color: #94A3B8;
  letter-spacing: 1.5px;
}

.pulse-red {
  width: 6px; height: 6px;
  background: #DC2626;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(220, 38, 38, 0.4);
}

.main-title {
  color: #0F172A;
  font-size: 19px;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.5px;
}

.premium-add-btn {
  --background: #0F172A;
  --border-radius: 8px;
  height: 36px;
  font-weight: 800;
  font-size: 10px;
  letter-spacing: 0.5px;
}

/* 3. The Ledger Plates (Cards) */
.ledger-plate {
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid #E2E8F0;
  position: relative;
  overflow: hidden;
}

.plate-status-bar {
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 4px;
  background: #CBD5E1; /* default */
}

/* Color logic for the left bar */
.plate-status-bar.state-paid { background-color: #10B981; }
.plate-status-bar.state-due { background-color: #F59E0B; }
.plate-status-bar.state-overdue { background-color: #DC2626; }

.plate-inner { padding: 15px 15px 10px 18px; }

.plate-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.p-id {
  font-size: 9px;
  font-weight: 800;
  color: #94A3B8;
}

.p-badge {
  font-size: 8px;
  font-weight: 900;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

/* Badge Color States */
.p-badge.state-paid { background-color: #ECFDF5; color: #10B981; }
.p-badge.state-due { background-color: #FFFBEB; color: #F59E0B; }
.p-badge.state-overdue { background-color: #FEF2F2; color: #DC2626; }

.plate-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.technical-label {
  font-size: 8px;
  font-weight: 900;
  color: #CBD5E1;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 2px;
}

.entity-name {
  color: #0F172A;
  font-size: 14px;
  font-weight: 800;
  margin: 0;
}

.sub-specs {
  display: flex;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  color: #64748B;
}

.monetary-col { text-align: right; }

.amount-wrap {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
}

.symbol {
  font-size: 10px;
  font-weight: 900;
  color: #DC2626;
  margin-right: 2px;
}

.value {
  font-family: monospace;
  font-size: 18px;
  font-weight: 900;
  color: #0F172A;
}

.date-stamp {
  font-size: 10px;
  font-weight: 700;
  color: #94A3B8;
}

.plate-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #F1F5F9;
  padding-top: 8px;
  margin-top: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  font-weight: 900;
  cursor: pointer;
}

.delete { color: #CBD5E1; }
.delete:active { color: #DC2626; }
.edit { color: #DC2626; }

.system-empty {
  text-align: center; padding: 60px 20px;
  color: #CBD5E1;
}
</style>