<template>
  <master>
    <div class="terminal-container">
      
      <!-- 1. Executive Mission Header -->
      <header class="terminal-header">
        <div class="header-left">
          <div class="status-badge">
            <span class="pulse-ruby"></span>
            <label>EDIT MODE</label>
          </div>
          <h1 class="terminal-title">Expenditure </h1>
        </div>
        <ion-button fill="clear" class="history-chip" @click="viewExpenditure">
          <ion-icon slot="start" :icon="listOutline"></ion-icon>
          History
        </ion-button>
      </header>

      <div class="terminal-body">
        
        <!-- 2. Source Information Plate -->
        <div class="tech-plate">
          <div class="plate-tab">SOURCE IDENTIFICATION</div>
          
          <div class="input-row">
            <div class="field-wrap">
              <ion-select label="BILL ORIGIN" label-placement="floating" v-model="BILL_FROM" class="tech-select">
                <ion-select-option value="Customer">Customer Entity</ion-select-option>
                <ion-select-option value="Supplier">Supplier Entity</ion-select-option>
              </ion-select>
            </div>
          </div>

          <div v-if="BILL_FROM" class="slide-down">
            <div class="field-wrap highlight">
              <!-- Supplier Select -->
              <ion-select 
                v-if="BILL_FROM == 'Supplier'"
                label="SELECT VENDOR" label-placement="floating" 
                v-model="SUPPLIER_SYS_ID" @ionChange="specificSupplier"
                class="tech-select">
                <ion-select-option v-for="s in allsupplierdetailes" :key="s.VENDOR_SYS_ID" :value="s.VENDOR_SYS_ID">
                  {{ s.GROUP_COMPANY_NAME }}
                </ion-select-option>
              </ion-select>

              <!-- Customer Select -->
              <ion-select 
                v-if="BILL_FROM == 'Customer'"
                label="SELECT CLIENT" label-placement="floating" 
                v-model="CUSTOMER_SYS_ID" @ionChange="specificCustomer"
                class="tech-select">
                <ion-select-option v-for="c in allcustomerdetailes" :key="c.CUSTOMER_SYS_ID" :value="c.CUSTOMER_SYS_ID">
                  {{ c.CUSTOMER_NAME }}
                </ion-select-option>
              </ion-select>
            </div>

            <div class="info-glance" v-if="EXPENSE_TOWARDS">
              <ion-icon :icon="businessOutline"></ion-icon>
              <div class="glance-text">
                <label>PAYEE IDENTITY</label>
                <span>{{ EXPENSE_TOWARDS }}</span>
              </div>
            </div>

            <div class="field-wrap">
              <ion-input label="MAILING ADDRESS" label-placement="floating" v-model="SUPPLIER_MAILLING_ADDRESS" class="tech-input"></ion-input>
            </div>
          </div>
        </div>

        <!-- 3. Logistics Plate -->
        <div class="tech-plate">
          <div class="plate-tab gray">LOGISTICS & BILLING</div>
          <ion-row>
            <ion-col size="6">
              <div class="field-wrap">
                <ion-input type="date" label="ENTRY DATE" label-placement="floating" v-model="BILL_DATE" class="tech-input"></ion-input>
              </div>
            </ion-col>
            <ion-col size="6">
              <div class="field-wrap">
                <ion-input label="REF NUMBER" label-placement="floating" v-model="BILL_NO" class="tech-input"></ion-input>
              </div>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="6">
              <div class="field-wrap">
                <ion-select label="STATUS" label-placement="floating" v-model="PAYMENT_STATUS" class="tech-select">
                  <ion-select-option value="Due">Payment Due</ion-select-option>
                  <ion-select-option value="Paid">Settled/Paid</ion-select-option>
                </ion-select>
              </div>
            </ion-col>
            <ion-col size="6">
              <div class="field-wrap">
                <ion-input label="TXN ID" label-placement="floating" v-model="TRANSACTION_ID" class="tech-input"></ion-input>
              </div>
            </ion-col>
          </ion-row>
        </div>

        <!-- 4. Breakdown Plate -->
        <div class="tech-plate ruby-border">
          <div class="plate-tab ruby">VALUATION BREAKDOWN</div>
          <div class="field-wrap">
            <ion-select label="ASSET CATEGORY" label-placement="floating" v-model="CATEGORY" class="tech-select">
              <ion-select-option v-for="cat in category_detailes" :key="cat.ASSET_CATEGORY" :value="cat.ASSET_CATEGORY">
                {{ cat.ASSET_CATEGORY }}
              </ion-select-option>
            </ion-select>
          </div>
          <div class="field-wrap">
            <ion-input label="NARRATIVE / DESCRIPTION" label-placement="floating" v-model="DESCRIPTION" class="tech-input"></ion-input>
          </div>
          <ion-row>
            <ion-col size="6">
              <div class="field-wrap amount">
                <ion-input label="NET UNIT VAL" label-placement="floating" type="number" v-model="UNIT_AMOUNT" @ionInput="onGetAmount()" class="tech-input bold"></ion-input>
              </div>
            </ion-col>
            <ion-col size="6">
              <div class="field-wrap amount">
                <ion-input label="GST COMPONENT %" label-placement="floating" type="number" v-model="GST" @ionInput="onGetAmount()" class="tech-input bold"></ion-input>
              </div>
            </ion-col>
          </ion-row>
        </div>

        <!-- 5. Executive Digital Receipt Summary (Wow Part) -->
        <div class="executive-summary-plate">
          <div class="summary-header">
            <ion-icon :icon="calculatorOutline"></ion-icon>
            <span>FINANCIAL RECONCILIATION</span>
          </div>
          <div class="ledger-line">
            <label>Subtotal Net</label>
            <span>S$ {{ UNIT_AMOUNT || '0.00' }}</span>
          </div>
          <div class="ledger-line">
            <label>Tax Calculated</label>
            <span>S$ {{ GST_AMOUNT || '0.00' }}</span>
          </div>
          <div class="ledger-divider"></div>
          <div class="ledger-line grand">
            <label>TOTAL PAYABLE</label>
            <div class="total-wrap">
              <small>S$</small>
              <span class="grand-val">{{ TOTAL_TAXABLE_AMOUNT || '0.00' }}</span>
            </div>
          </div>
        </div>

        <!-- Update Action -->
        <ion-button expand="block" class="terminal-action-btn" @click="updateExpenditure">
          <ion-icon slot="start" :icon="saveOutline"></ion-icon>
         Edit Expenditure
        </ion-button>
      </div>
    </div>
  </master>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { 
  IonItem, IonInput, IonRow, IonCol, IonSelectOption, 
  IonSelect, IonButton, IonIcon 
} from "@ionic/vue";
import { 
  listOutline, businessOutline, receiptOutline, 
  calculatorOutline, saveOutline, shieldCheckmarkOutline 
} from 'ionicons/icons';
import pick from '@/services/pick';

export default defineComponent({
  name: "EditExpenditureUnique",
  components: { IonInput, IonRow, IonCol, IonSelectOption, IonSelect, IonButton, IonIcon },
  setup() {
    return { listOutline, businessOutline, receiptOutline, calculatorOutline, saveOutline, shieldCheckmarkOutline };
  },
  data() {
    return {
      UNIT_AMOUNT: "" as any,
      GST: "" as any,
      GST_AMOUNT: 0 as any,
      BILL_FROM: "",
      allsupplierdetailes: [],
      allcustomerdetailes: [],
      getSpecificsupplier: [] as any,
      getSpecificcustomer: [] as any,
      SUPPLIER_SYS_ID: "",
      CUSTOMER_SYS_ID: "",
      EXPENSE_TOWARDS: "",
      category_detailes: [],
      TOTAL_TAXABLE_AMOUNT: "" as any,
      BILL_DATE: "",
      BILL_NO: "",
      PAYMENT_STATUS: "",
      TRANSACTION_ID: "",
      DESCRIPTION: "",
      CATEGORY: "",
      SUPPLIER_MAILLING_ADDRESS: "",
    }
  },
  mounted() {
    this.getAllCustomer();
    this.getsupplier();
    this.getCategory();
    this.getalldata();
  },
  methods: {
    viewExpenditure() { this.$router.push('/viewexpenditure'); },

    onGetAmount() {
      let unitTotal = parseFloat(this.UNIT_AMOUNT) || 0;
      let gstVal = parseFloat(this.GST) || 0;
      let gstAmt = (unitTotal * gstVal) / 100;
      this.GST_AMOUNT = gstAmt.toFixed(2);
      this.TOTAL_TAXABLE_AMOUNT = (unitTotal + gstAmt).toFixed(2);
    },

    getAllCustomer() { pick.getCustomer({}).then(res => { this.allcustomerdetailes = res.status != "false" ? res.response : []; }); },
    getsupplier() { pick.getsuppliername({}).then(res => { this.allsupplierdetailes = res.status != "false" ? res.response : []; }); },
    
    specificSupplier() {
      pick.getSpecificSupplierCaptureValue(this.SUPPLIER_SYS_ID).then(res => {
        const data = res.response[0];
        this.SUPPLIER_MAILLING_ADDRESS = data.ADDRESS_LINE;
        this.EXPENSE_TOWARDS = data.GROUP_COMPANY_NAME;
      });
    },

    specificCustomer() {
      pick.getSpecificCustomerCaptureValue(this.CUSTOMER_SYS_ID).then(res => {
        const data = res.response[0];
        this.SUPPLIER_MAILLING_ADDRESS = data.CUSTOMER_ADDRESS;
        this.EXPENSE_TOWARDS = data.CUSTOMER_NAME;
      });
    },

    getCategory() { pick.category({}).then(res => { this.category_detailes = res.status != "false" ? res.response : []; }); },

    updateExpenditure() {
      let getdata = localStorage.getItem("expenditure");
      pick.addExpendituresave({
        ITEM: "UPDATE",
        RECORD_SYS_ID: JSON.parse(getdata || '{}').EXPENDITURE_SYS_ID,
        SUPPLIER_SYS_ID: this.SUPPLIER_SYS_ID,
        CUSTOMER_SYS_ID: this.CUSTOMER_SYS_ID,
        BILL_FROM: this.BILL_FROM,
        SUPPLIER_MAILLING_ADDRESS: this.SUPPLIER_MAILLING_ADDRESS,
        EXPENSE_TOWARDS: this.EXPENSE_TOWARDS,
        SUPPLIER_NAME: this.EXPENSE_TOWARDS,
        BILL_DATE: this.BILL_DATE,
        BILL_NO: this.BILL_NO,
        PAYMENT_STATUS: this.PAYMENT_STATUS,
        TRANSACTION_ID: this.TRANSACTION_ID,
        CATEGORY: this.CATEGORY,
        DESCRIPTION: this.DESCRIPTION,
        UNIT_AMOUNT: this.UNIT_AMOUNT,
        GST: this.GST,
        TOTAL_AMOUNT: this.TOTAL_TAXABLE_AMOUNT,
        CREATED_BY: "1",
      }).then(response => {
        if (response.status != 'false') window.location.href = "/viewexpenditure";
      });
    },

    getalldata() {
      let storage = localStorage.getItem("expenditure");
      if (storage) {
        const data = JSON.parse(storage);
        this.BILL_FROM = data.BILL_FROM;
        this.SUPPLIER_SYS_ID = data.SUPPLIER_SYS_ID;
        this.CUSTOMER_SYS_ID = data.CUSTOMER_SYS_ID;
        this.SUPPLIER_MAILLING_ADDRESS = data.SUPPLIER_MAILLING_ADDRESS;
        this.BILL_NO = data.BILL_NO;
        this.PAYMENT_STATUS = data.PAYMENT_STATUS;
        this.TRANSACTION_ID = data.TRANSACTION_ID;
        this.DESCRIPTION = data.DESCRIPTION;
        this.UNIT_AMOUNT = data.UNIT_AMOUNT;
        this.GST = data.GST;
        this.TOTAL_TAXABLE_AMOUNT = data.TOTAL_AMOUNT;
        this.EXPENSE_TOWARDS = data.SUPPLIER_NAME;
        this.CATEGORY = data.CATEGORY;
        
        const parsedDate = data.BILL_DATE;
        if (parsedDate && parsedDate.includes('-')) {
          const parts = parsedDate.split('-');
          this.BILL_DATE = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        this.onGetAmount();
      }
    }
  }
});
</script>

<style scoped>
/* 1. Terminal Container Background */
.terminal-container {
  min-height: 100vh;
  background-color: #F4F7F9; /* Titanium White */
  padding-bottom: 80px;
}

/* 2. Slim Executive Header */
.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 35px 20px 25px;
  background: white;
  border-bottom: 2px solid #E2E8F0;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.status-badge label {
  font-size: 8px;
  font-weight: 900;
  color: #94A3B8;
  letter-spacing: 2px;
}

.pulse-ruby {
  width: 6px; height: 6px;
  background: #DC2626;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(220, 38, 38, 0.4);
}

.terminal-title {
  color: #0F172A;
  font-size: 19px;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.5px;
}

.history-chip {
  --color: #DC2626;
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
}

.terminal-body { padding: 20px 15px; }

/* 3. Tech Plate System (Unified Cards) */
.tech-plate {
  background: white;
  border-radius: 12px;
  padding: 24px 18px 15px;
  margin-bottom: 25px;
  border: 1px solid #E2E8F0;
  position: relative;
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
}

.ruby-border { border-left: 4px solid #DC2626; }

/* The "Tab" look on the cards */
.plate-tab {
  position: absolute;
  top: -10px;
  left: 15px;
  background: #0F172A;
  color: white;
  padding: 2px 10px;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 1px;
  border-radius: 4px;
}

.plate-tab.gray { background: #64748B; }
.plate-tab.ruby { background: #DC2626; }

/* 4. Luxury Inputs & Selects */
.field-wrap {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 0 10px;
}

.field-wrap.highlight { border-color: #DC2626; background: #FFF5F5; }
.field-wrap.amount { background: #F0F9FF; border-color: #BAE6FD; } /* Soft blue for financial entry */

.tech-input, .tech-select {
  --color: #0F172A;
  font-size: 13px;
  font-weight: 700;
  min-height: 42px;
}

.bold { font-weight: 900; }

.info-glance {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #F1F5F9;
  padding: 10px 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.info-glance ion-icon { color: #DC2626; font-size: 18px; }
.glance-text label { display: block; font-size: 8px; font-weight: 900; color: #94A3B8; }
.glance-text span { font-size: 13px; font-weight: 800; color: #0F172A; }

/* 5. Executive Grand Total Card */
.executive-summary-plate {
  background: #0F172A; /* Midnight Contrast */
  border-radius: 16px;
  padding: 25px;
  margin: 30px 0;
  box-shadow: 0 15px 30px rgba(15, 23, 42, 0.2);
  color: white;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #94A3B8;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.5px;
}

.ledger-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.ledger-line label { font-size: 11px; font-weight: 600; color: #64748B; }
.ledger-line span { font-size: 13px; font-weight: 700; }

.ledger-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 15px 0;
}

.grand { align-items: center; }
.grand label { color: white; font-weight: 900; letter-spacing: 0.5px; }

.total-wrap { display: flex; align-items: baseline; gap: 4px; }
.total-wrap small { color: #DC2626; font-weight: 900; font-size: 14px; }
.grand-val { font-size: 26px; font-weight: 900; color: white; }

/* 6. Action Button */
.terminal-action-btn {
  --background: #DC2626;
  --border-radius: 12px;
  --box-shadow: 0 10px 20px rgba(220, 38, 38, 0.2);
  height: 56px;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 1px;
}

.slide-down { animation: slideDown 0.3s ease-out; }
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>