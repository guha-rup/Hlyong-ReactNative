<template>
  <Master>
    <ion-page>
      <ion-content class="ion-no-padding">
        <div class="technical-confirmation-portal">
          
          <!-- 1. Slim Executive Header -->
          <header class="slim-terminal-header">
            <div class="header-content">
              <div class="title-stack">
                <span class="status-tag">
                  <span class="pulse-ruby"></span> VALIDATION REQUIRED
                </span>
                <h1 class="main-title">Confirm Relocation</h1>
              </div>
             
            </div>
          </header>

          <div class="terminal-body">
            
            <!-- 2. Transfer Ledger Plate -->
            <ion-card class="tech-plate summary-plate">
              <div class="plate-indicator"></div>
              
              <!-- Product Identity Section -->
              <div class="product-identity-strip">
                <div class="icon-box">
                  <ion-icon :icon="cubeOutline"></ion-icon>
                </div>
                <div class="id-text">
                  <h2 class="item-name">{{ scannedProduct_new?.PRODUCT_NAME || 'Select Product' }}</h2>
                  <span class="part-ref">PART REF: {{ scannedProduct_new?.PART_NO || 'N/A' }}</span>
                </div>
              </div>

              <div class="ledger-divider-dashed"></div>

              <!-- Visual Transfer Bridge (From -> To) -->
              <div class="transfer-visualizer">
                <div class="node-box">
                  <label class="tiny-label">SOURCE BIN</label>
                  <div class="bin-value">
                    <ion-icon :icon="locationOutline"></ion-icon>
                    <span>{{ scannedProduct_new?.SOURCE_WAREHOUSE_RACK_NO || 'N/A' }}</span>
                  </div>
                </div>

                <div class="bridge-arrow">
                  <ion-icon :icon="arrowForwardOutline"></ion-icon>
                </div>

                <div class="node-box target">
                  <label class="tiny-label">TARGET BIN</label>
                  <div class="bin-value crimson-text">
                    <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
                    <span>{{ binName || 'Not Defined' }}</span>
                  </div>
                </div>
              </div>

              <div class="ledger-divider-dashed"></div>

              <!-- Technical Stats Footer -->
              <div class="stats-strip">
                <div class="stat-cell">
                  <label class="tiny-label">TRANSFER VOLUME</label>
                  <span class="stat-val">{{ enteredQty }} <small>{{ uom_new }}</small></span>
                </div>
                <div class="stat-cell text-right">
                  <label class="tiny-label">BATCH REF</label>
                  <span class="stat-val-sm">{{ scannedProduct_new?.SOURCE_BATCH_NO || 'N/A' }}</span>
                </div>
              </div>
            </ion-card>

            <!-- 3. Validation Note -->
            <!-- <div class="technical-note">
              <ion-icon :icon="informationCircleOutline"></ion-icon>
              <p>Execute transfer protocol. This action will update the warehouse inventory ledger immediately.</p>
            </div> -->

            <!-- 4. Executive Actions -->
            <div class="action-stack">
              <ion-button expand="block" class="terminal-confirm-btn" @click="transferBin">
                <ion-icon :icon="swapHorizontalOutline" slot="start"></ion-icon>
                EXECUTE TRANSFER
              </ion-button>

              <ion-button fill="clear" class="terminal-cancel-btn" @click="$router.back()">
                ABORT & EDIT DETAILS
              </ion-button>
            </div>
          </div>
        </div>
      </ion-content>
    </ion-page>
  </Master>
</template>

<script>
// 1. Import Ionic Components
import { 
  IonPage, IonContent, IonIcon, IonCard, IonCardHeader, 
  IonCardTitle, IonCardSubtitle, IonCardContent, IonButton 
} from '@ionic/vue';

// 2. Import Icons
import { 
  checkmarkCircleOutline, swapHorizontalOutline, cubeOutline, 
  locationOutline, arrowForwardOutline, informationCircleOutline 
} from 'ionicons/icons';

import Master from "../layouts/Master.vue";
import pick from "@/services/pick"; 

export default {
  name: "NewBinDetails",
  // 3. Register all components used in the template
  components: { 
    Master, IonPage, IonContent, IonIcon, IonCard, 
    IonCardHeader, IonCardTitle, IonCardSubtitle, 
    IonCardContent, IonButton 
  },
  data() {
    return {
      binName: "",   
      organisationId: null,
      userId: null,        
      scannedProduct: null,
      scannedProduct_new: null,
      enteredQty: 0,
      uom_new: "",
      uom_id_new: null,
      // 4. Return icons in data so they are available to template
      checkmarkCircleOutline, swapHorizontalOutline, cubeOutline, 
      locationOutline, arrowForwardOutline, informationCircleOutline 
    };
  },
  mounted() {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      this.userId = parsed.UserId;            
      this.organisationId = parsed.Organisation_Sys_Id;
    }

    const saved = localStorage.getItem("scanData");
    if (saved) {
      this.scannedProduct = JSON.parse(saved);
    }

    const uom = localStorage.getItem("selectedUom"); 
    if (uom) this.uom_new = uom;

    const uom_id = localStorage.getItem("selectedUomSysId");
    if (uom_id) this.uom_id_new = uom_id;

    const bintrasferdata = localStorage.getItem("scanDatanew_data");
    if (bintrasferdata) {
      this.scannedProduct_new = JSON.parse(bintrasferdata);
    }
    
    const savedQty = localStorage.getItem("enteredQty");
    if (savedQty) this.enteredQty = savedQty;

    const savedBinName = localStorage.getItem("scannedBinName");
    if (savedBinName) {
        try {
            this.binName = JSON.parse(savedBinName);
        } catch(e) {
            this.binName = savedBinName;
        }
    }
  },
  methods: {
    async transferBin() {
      if (!this.binName || !this.scannedProduct_new) {
        alert("Verification data missing!");
        return;
      }

      const data = localStorage.getItem("scanDatanew");
      const p = JSON.parse(data);
      
      const payload = [
        {
          ITEM: "BIN_TRANSFER",
          PRODUCT_SYS_ID: p[0].PRODUCT_SYS_ID,
          PART_NO: p[0].PART_NO,
          PRODUCT_NAME: p[0].PRODUCT_NAME,
          EXPIRY_DATE: p[0].EXPIRY_DATE || null,
          QTY: this.enteredQty, 
          BATCH_NO: p[0].BATCH_NO,
          UOM: this.uom_new,
          UOM_SYS_ID: this.uom_id_new, 
          STOCK_ENTRY_LOCATION_ENTITY: "Warehouse",
          STOCK_QTY: this.enteredQty,
          CREATED_BY: this.userId,
          ORGANISATION_SYS_ID: this.organisationId,
          ADD_REDUCE_TYPE: "TRANSFER",
          STOCK_DATE: new Date().toISOString().split("T")[0],
          SOURCE_WAREHOUSE: "CSS WAREHOUSE",
          SOURCE_BRANCH_NAME_SYS_ID: this.scannedProduct_new.SOURCE_BRANCH_NAME_SYS_ID,
          SOURCE_WAREHOUSE_BUILDING_DETAILS_SYS_ID: this.scannedProduct_new.SOURCE_WAREHOUSE_BUILDING_DETAILS_SYS_ID,
          SOURCE_WAREHOUSE_RACK_DETAILS_SYS_ID: this.scannedProduct_new.SOURCE_WAREHOUSE_RACK_DETAILS_SYS_ID,
          SOURCE_WAREHOUSE_FLOOR_NO: this.scannedProduct_new.SOURCE_WAREHOUSE_FLOOR_NO,
          SOURCE_WAREHOUSE_UNIT_NO: this.scannedProduct_new.SOURCE_WAREHOUSE_UNIT_NO,
          SOURCE_WAREHOUSE_RACK_NO: p[0].RACK_NO || "N/A",
          SOURCE_WAREHOUSE_CODE: this.scannedProduct_new.SOURCE_WAREHOUSE_FLOOR_NO,
          SOURCE_BATCH_NO: this.scannedProduct_new.SOURCE_BATCH_NO,
          TARGET_WAREHOUSE: "CSS WAREHOUSE",
          TARGET_BRANCH_NAME_SYS_ID: this.scannedProduct.SOURCE_BRANCH_NAME_SYS_ID,
          TARGET_WAREHOUSE_BUILDING_DETAILS_SYS_ID: this.scannedProduct.SOURCE_WAREHOUSE_BUILDING_DETAILS_SYS_ID,
          TARGET_WAREHOUSE_RACK_DETAILS_SYS_ID: this.scannedProduct.SOURCE_WAREHOUSE_RACK_DETAILS_SYS_ID,
          TARGET_WAREHOUSE_FLOOR_NO: this.scannedProduct.SOURCE_WAREHOUSE_FLOOR_NO,
          TARGET_WAREHOUSE_UNIT_NO: this.scannedProduct.SOURCE_WAREHOUSE_UNIT_NO,
          TARGET_WAREHOUSE_RACK_NO: this.binName,
          TARGET_WAREHOUSE_CODE: this.scannedProduct.SOURCE_WAREHOUSE_FLOOR_NO,
        },
      ];

      try {
        await pick.Bin_submit_Details(payload);
        alert("✅ Relocation Sync Successful");
      
        this.$router.push({ name: "BinScan" });
      } catch (error) {
        alert("❌ Transfer Aborted: Server Error");
      }
    },
  },
};
</script>

<style scoped>
.technical-confirmation-portal {
  min-height: 100vh;
  background-color: #F4F7F9;
  padding-bottom: 50px;
}

.slim-terminal-header {
  background: white;
  padding: 30px 20px 15px;
  border-bottom: 1px solid #E2E8F0;
}

.header-content { display: flex; justify-content: space-between; align-items: flex-end; }

.status-tag {
  display: flex; align-items: center; gap: 5px;
  font-size: 8px; font-weight: 900; color: #94A3B8; letter-spacing: 1px;
}

.pulse-ruby {
  width: 6px; height: 6px; background: #DC2626; border-radius: 50%;
  box-shadow: 0 0 8px rgba(220, 38, 38, 0.4);
}

.main-title { color: #0F172A; font-size: 19px; font-weight: 900; margin: 2px 0 0; letter-spacing: -0.5px; }

.op-badge {
  background: #ECFDF5; color: #059669; padding: 4px 10px; border-radius: 6px;
  font-size: 9px; font-weight: 900; border: 1px solid #D1FAE5;
}

.terminal-body { padding: 20px 15px; }

.tech-plate {
  background: white; border-radius: 12px; margin-bottom: 25px;
  border: 1px solid #E2E8F0; position: relative; overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
}

.plate-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #DC2626; }

.product-identity-strip { display: flex; align-items: center; gap: 12px; padding: 15px 18px; }
.icon-box { width: 40px; height: 40px; background: #F8FAFC; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #DC2626; }
.item-name { font-size: 15px; font-weight: 800; color: #1E293B; margin: 0; }
.part-ref { font-size: 8px; font-weight: 900; color: #94A3B8; letter-spacing: 0.5px; }

.ledger-divider-dashed { height: 1px; border-bottom: 1px dashed #E2E8F0; margin: 0 18px; }

.transfer-visualizer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 18px;
}

.tiny-label { display: block; font-size: 7.5px; font-weight: 900; color: #CBD5E1; margin-bottom: 5px; text-transform: uppercase; }
.bin-value { display: flex; align-items: center; gap: 6px; color: #475569; font-weight: 700; font-size: 14px; }
.crimson-text { color: #DC2626; }
.bridge-arrow { color: #E2E8F0; font-size: 20px; padding-top: 10px; }

.stats-strip {
  display: flex; justify-content: space-between; padding: 15px 18px;
  background: #F8FAFC;
}

.stat-val { font-size: 16px; font-weight: 900; color: #0F172A; }
.stat-val small { font-size: 10px; color: #64748B; font-weight: 700; }
.stat-val-sm { font-size: 13px; font-weight: 800; color: #475569; }

.technical-note {
  display: flex; gap: 10px; padding: 12px; background: #FEF2F2;
  border-radius: 10px; border: 1px solid #FEE2E2; margin-bottom: 30px;
}
.technical-note ion-icon { color: #DC2626; font-size: 20px; }
.technical-note p { font-size: 10px; color: #991B1B; font-weight: 600; line-height: 1.4; margin: 0; }

.terminal-confirm-btn {
  --background: #DC2626; --border-radius: 8px; height: 52px;
  font-weight: 900; font-size: 13px; letter-spacing: 0.5px;
  --box-shadow: 0 8px 16px rgba(220, 38, 38, 0.2);
}

.terminal-cancel-btn {
  --color: #94A3B8; font-weight: 800; font-size: 11px; margin-top: 10px;
}

.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>