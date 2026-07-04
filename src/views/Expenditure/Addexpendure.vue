<template>
  <master>
    <div class="ledger-wrapper">
      
      <!-- 1. Minimalist Header -->
      <header class="slim-header">
        <div class="title-stack">
          <h1 class="main-title">Add Expenditure</h1>
          <!-- <p class="meta-tagline">Financial Ledger Entry</p> -->
        </div>
        <ion-button fill="clear" class="compact-view-btn" @click="viewExpenditure">
          <ion-icon slot="start" :icon="eyeOutline"></ion-icon>
          History
        </ion-button>
      </header>

      <div class="form-scroll-content">
        
        <!-- 2. Source Selection (Section 1) -->
        <div class="executive-card">
          <div class="card-indicator red"></div>
      
          
          <div class="compact-grid">
            <div class="input-cell">
              <ion-select label="Bill From" label-placement="floating" v-model="BILL_FROM" class="ledger-select">
                <ion-select-option value="Customer">Customer</ion-select-option>
                <ion-select-option value="Supplier">Supplier</ion-select-option>
              </ion-select>
            </div>
            
            <div class="input-cell animate-in" v-if="BILL_FROM">
              <!-- Supplier Select -->
              <ion-select 
                v-if="BILL_FROM == 'Supplier'"
                label="Select Supplier" label-placement="floating" 
                v-model="SUPPLIER_SYS_ID" @ionChange="specificSupplier"
                class="ledger-select highlight">
                <ion-select-option v-for="s in allsupplierdetailes" :key="s.VENDOR_SYS_ID" :value="s.VENDOR_SYS_ID">
                  {{ s.GROUP_COMPANY_NAME }}
                </ion-select-option>
              </ion-select>

              <!-- Customer Select -->
              <ion-select 
                v-if="BILL_FROM == 'Customer'"
                label="Select Customer" label-placement="floating" 
                v-model="CUSTOMER_SYS_ID" @ionChange="specificCustomer"
                class="ledger-select highlight">
                <ion-select-option v-for="c in allcustomerdetailes" :key="c.CUSTOMER_SYS_ID" :value="c.CUSTOMER_SYS_ID">
                  {{ c.CUSTOMER_NAME }}
                </ion-select-option>
              </ion-select>
            </div>
          </div>

          <div class="entity-badge" v-if="EXPENSE_TOWARDS">
            <ion-icon :icon="businessOutline"></ion-icon>
            <span>Target: <b>{{ EXPENSE_TOWARDS }}</b></span>
          </div>

          <div class="input-cell" v-if="BILL_FROM">
            <ion-input label="Mailing Address" label-placement="floating" v-model="SUPPLIER_MAILLING_ADDRESS" class="ledger-input"></ion-input>
          </div>
        </div>

        <!-- 3. Billing Context (Section 2) -->
        <div class="executive-card">
          <h2 class="tiny-label">BILLING CONTEXT</h2>
          <ion-row class="compact-row">
            <ion-col size="6">
              <div class="input-cell">
                <ion-input type="date" label="Bill Date" label-placement="floating" v-model="BILL_DATE" class="ledger-input"></ion-input>
              </div>
            </ion-col>
            <ion-col size="6">
              <div class="input-cell">
                <ion-input label="Bill No." label-placement="floating" v-model="BILL_NO" class="ledger-input"></ion-input>
              </div>
            </ion-col>
          </ion-row>
          <ion-row class="compact-row">
            <ion-col size="6">
              <div class="input-cell">
                <ion-select label="Status" label-placement="floating" v-model="PAYMENT_STATUS" class="ledger-select">
                  <ion-select-option value="Due">Due</ion-select-option>
                  <ion-select-option value="Paid">Paid</ion-select-option>
                </ion-select>
              </div>
            </ion-col>
            <ion-col size="6">
              <div class="input-cell">
                <ion-input label="Trans/Cheque ID" label-placement="floating" v-model="TRANSACTION_ID" class="ledger-input"></ion-input>
              </div>
            </ion-col>
          </ion-row>
        </div>

        <!-- 4. Monetary Breakdown (Section 3) -->
        <div class="executive-card focus">
          <h2 class="tiny-label">VALUATION & CATEGORY</h2>
          <div class="input-cell">
            <ion-select label="Asset Category" label-placement="floating" v-model="CATEGORY" class="ledger-select">
              <ion-select-option v-for="cat in category_detailes" :key="cat.ASSET_CATEGORY" :value="cat.ASSET_CATEGORY">
                {{ cat.ASSET_CATEGORY }}
              </ion-select-option>
            </ion-select>
          </div>
          <div class="input-cell">
            <ion-input label="Brief Description" label-placement="floating" v-model="DESCRIPTION" class="ledger-input"></ion-input>
          </div>
          <ion-row class="compact-row">
            <ion-col size="6">
              <div class="input-cell amount-field">
                <ion-input label="Net Amount (S$)" label-placement="floating" type="number" v-model="UNIT_AMOUNT" @ionInput="onGetAmount()" class="ledger-input bold"></ion-input>
              </div>
            </ion-col>
            <ion-col size="6">
              <div class="input-cell amount-field">
                <ion-input label="Tax (%)" label-placement="floating" type="number" v-model="GST" @ionInput="onGetAmount()" class="ledger-input bold"></ion-input>
              </div>
            </ion-col>
          </ion-row>
        </div>

        <!-- 5. Executive Financial Summary (Rich/Premium) -->
        <div class="financial-summary-box">
          <div class="summary-line">
            <span class="s-label">Calculated Net</span>
            <span class="s-val">S$ {{ UNIT_AMOUNT || '0.00' }}</span>
          </div>
          <div class="summary-line">
            <span class="s-label">Total GST Component</span>
            <span class="s-val">S$ {{ GST_AMOUNT || '0.00' }}</span>
          </div>
          <div class="ledger-divider"></div>
          <div class="summary-line grand">
            <span class="total-label">TOTAL PAYABLE</span>
            <span class="total-amount">S$ {{ TOTAL_TAXABLE_AMOUNT || '0.00' }}</span>
          </div>
        </div>

        <!-- Submit -->
        <ion-button expand="block" class="executive-submit-btn" @click="addExpenditure">
          <ion-icon slot="start" :icon="saveOutline"></ion-icon>
          Finalize & Save Entry
        </ion-button>
      </div>
    </div>
  </master>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { 
  IonCard, IonItem, IonInput, IonRow, IonCol, IonSelectOption, 
  IonSelect, IonButton, IonIcon 
} from "@ionic/vue";
import { eyeOutline, businessOutline, receiptOutline, calculatorOutline, saveOutline } from 'ionicons/icons';
import pick from '@/services/pick';

export default defineComponent({
    name: "AddExpenditure",
    components: { IonInput, IonRow, IonCol, IonSelectOption, IonSelect, IonButton, IonIcon },
    setup() { return { eyeOutline, businessOutline, receiptOutline, calculatorOutline, saveOutline }; },
    data() {
        return {
            allcustomerdetailes: [],
            UNIT_AMOUNT: "" as any,
            CUSTOMER_SYS_ID: "",
            GST: "" as any,
            GST_AMOUNT: 0 as any,
            BILL_FROM: "",
            PAYMENT_STATUS: "",
            allsupplierdetailes: [],
            SUPPLIER_SYS_ID: "",
            EXPENSE_TOWARDS: "",
            category_detailes: [],
            TOTAL_TAXABLE_AMOUNT: 0 as any,
            BILL_DATE: "",
            BILL_NO: "",
            TRANSACTION_ID: "",
            CATEGORY: "",
            DESCRIPTION: "",
            SUPPLIER_MAILLING_ADDRESS: "",
        }
    },
    mounted() { this.getAllCustomer(); this.getsupplier(); this.getCategory(); },
    methods: {
        viewExpenditure() { this.$router.push('/viewexpenditure'); },
        onGetAmount() {
            let unitTotal = parseFloat(this.UNIT_AMOUNT) || 0;
            let gstPercent = parseFloat(this.GST) || 0;
            let gstAmt = (unitTotal * gstPercent) / 100;
            this.GST_AMOUNT = gstAmt.toFixed(2);
            this.TOTAL_TAXABLE_AMOUNT = (unitTotal + gstAmt).toFixed(2);
        },
        getsupplier() { pick.getsuppliername({}).then((res) => { this.allsupplierdetailes = res.status != "false" ? res.response : []; }); },
        getAllCustomer() { pick.getCustomer({}).then((res) => { this.allcustomerdetailes = res.status != "false" ? res.response : []; }); },
        specificSupplier() {
            pick.getSpecificSupplierCaptureValue(this.SUPPLIER_SYS_ID).then((res) => {
                const data = res.response[0];
                this.SUPPLIER_MAILLING_ADDRESS = data.ADDRESS_LINE;
                this.EXPENSE_TOWARDS = data.GROUP_COMPANY_NAME;
            });
        },
        specificCustomer() {
            pick.getSpecificCustomerCaptureValue(this.CUSTOMER_SYS_ID).then((res) => {
                const data = res.response[0];
                this.SUPPLIER_MAILLING_ADDRESS = data.CUSTOMER_ADDRESS;
                this.EXPENSE_TOWARDS = data.CUSTOMER_NAME;
            });
        },
        getCategory() { pick.category({}).then((res) => { this.category_detailes = res.status != "false" ? res.response : []; }); },
        addExpenditure() {
            pick.addExpendituresave({
                ITEM: "ADD", RECORD_SYS_ID: "0",
                SUPPLIER_SYS_ID: this.SUPPLIER_SYS_ID,
                BILL_FROM: this.BILL_FROM,
                SUPPLIER_MAILLING_ADDRESS: this.SUPPLIER_MAILLING_ADDRESS,
                EXPENSE_TOWARDS: this.EXPENSE_TOWARDS,
                SUPPLIER_NAME: this.EXPENSE_TOWARDS,
                BILL_DATE: this.BILL_DATE,
                CUSTOMER_SYS_ID: this.CUSTOMER_SYS_ID,
                BILL_NO: this.BILL_NO,
                PAYMENT_STATUS: this.PAYMENT_STATUS,
                TRANSACTION_ID: this.TRANSACTION_ID,
                CATEGORY: this.CATEGORY,
                DESCRIPTION: this.DESCRIPTION,
                UNIT_AMOUNT: this.UNIT_AMOUNT,
                GST: this.GST,
                TOTAL_AMOUNT: this.TOTAL_TAXABLE_AMOUNT,
                CREATED_BY: "1",
            }).then(response => { if (response.status != 'false') window.location.href = "/viewexpenditure"; });
        }
    }
});
</script>

<style scoped>
/* 1. Base Ledger Layout */
.ledger-wrapper {
  min-height: 100vh;
  background-color: #F8FAFC;
  padding: 15px 12px 60px;
}

/* 2. Slim Premium Header */
.slim-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  padding: 0 5px;
}

.main-title {
  color: #0F172A;
  font-size: 20px; /* Reduced for expert look */
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
}

.meta-tagline {
  color: #94A3B8;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.compact-view-btn {
  --color: #DC2626;
  font-weight: 800;
  font-size: 11px;
  height: 30px;
  text-transform: uppercase;
}

/* 3. Executive Card System */
.executive-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 12px;
  border: 1px solid #F1F5F9;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  position: relative;
}

.card-indicator {
  position: absolute;
  top: 15px; left: 0; bottom: 15px;
  width: 3px; border-radius: 0 4px 4px 0;
}
.card-indicator.red { background: #DC2626; }

.tiny-label {
  font-size: 9px;
  font-weight: 900;
  color: #94A3B8;
  letter-spacing: 1.2px;
  margin: 0 0 12px 0;
}

/* 4. Compact Ledger Inputs */
.input-cell {
  background: #F8FAFC;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  margin-bottom: 8px;
  padding: 0 10px;
}

.ledger-input, .ledger-select {
  --color: #0F172A;
  font-size: 13px; /* Smaller font for premium look */
  font-weight: 600;
  min-height: 40px;
}

.ledger-input.bold { font-weight: 800; }

.amount-field {
  background: #FFF5F5;
  border-color: #FEE2E2;
}

.entity-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FEF2F2;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 11px;
  color: #B91C1C;
}

/* 5. Financial Summary Ledger (Wow Part) */
.financial-summary-box {
  background: #0F172A; /* Midnight Contrast */
  border-radius: 16px;
  padding: 20px;
  margin: 25px 0;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15);
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.s-label { font-size: 11px; color: #94A3B8; font-weight: 600; }
.s-val { font-size: 12px; color: #FFFFFF; font-weight: 700; }

.ledger-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 12px 0;
}

.summary-line.grand { margin-top: 5px; }
.total-label { font-size: 12px; color: #FFFFFF; font-weight: 900; letter-spacing: 0.5px; }
.total-amount { color: #DC2626; font-size: 20px; font-weight: 900; }

/* 6. Action Button */
.executive-submit-btn {
  --background: #DC2626;
  --border-radius: 10px;
  height: 52px;
  font-weight: 800;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.animate-in {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.compact-row { margin: 0 -4px; }
.compact-row ion-col { padding: 0 4px; }
</style>