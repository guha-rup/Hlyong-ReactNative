<template>
  <master>
    <ion-page>
      <ion-content class="ion-no-padding">
        <div class="technical-validation-portal">
          
          <!-- 1. Ultra-Slim Executive Header -->
          <header class="slim-terminal-header">
            <div class="header-content">
              <div class="title-stack">
                <span class="status-tag"><span class="pulse-ruby"></span> VALIDATION ACTIVE</span>
                <h1 class="main-title">Confirm Scanning</h1>
              </div>
              <div class="op-badge">VERIFIED</div>
            </div>
          </header>

          <div class="terminal-body">
            
            <!-- 2. Product Identity Plate (Rich & Technical) -->
            <div class="tech-plate product-identity-plate">
              <div class="plate-indicator"></div>
              <div class="product-visual-row">
                <div class="img-wrapper">
                  <ion-img :src="generateImageUrl(data?.THUMBNAIL_IMAGE)" class="luxury-thumb" />
                </div>
                <div class="item-text">
                  <span class="ref-label">PRODUCT IDENTITY</span>
                  <h2 class="item-name">{{ data?.PRODUCT_NAME || "No Product Found" }}</h2>
                </div>
              </div>

              <div class="ledger-divider-dashed"></div>

              <!-- Location Details Grid -->
              <div class="spec-grid">
                <div class="spec-item">
                  <label class="tiny-label">TARGET WAREHOUSE</label>
                  <div class="spec-val-wrap">
                    <ion-icon :icon="businessOutline"></ion-icon>
                    <span class="spec-val">{{ packdata?.WAREHOUSE_NAME || '-' }}</span>
                  </div>
                </div>
                <div class="spec-item border-left">
                  <label class="tiny-label">BIN / RACK NO.</label>
                  <div class="spec-val-wrap">
                    <ion-icon :icon="locationOutline"></ion-icon>
                    <span class="spec-val crimson-text">{{ packdata?.RACK_NO || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Entry Console (Merged Qty & UOM Strip) -->
            <div class="input-console-section">
              <label class="section-tiny-label">FULFILLMENT QUANTITY</label>
              <div class="integrated-input-strip">
                <div class="qty-zone">
                  <ion-input
                    type="number"
                    v-model="productQty"
                    placeholder="0.00"
                    class="ledger-qty-input"
                  ></ion-input>
                </div>
                <!-- <div class="uom-zone">
                  <ion-select
                    v-model="selectedUOM"
                    placeholder="UNIT"
                    interface="popover"
                    class="ledger-uom-select"
                    @ionChange="updateUOMSysId"
                  >
                    <ion-select-option
                      v-for="item in measurementDetails"
                      :key="item.UOM_SYS_ID"
                      :value="item.UOM"
                    >
                      {{ item.UOM }}
                    </ion-select-option>
                  </ion-select>
                </div> -->
                <div class="uom-zone static-uom">
                  <span class="uom-text">{{ selectedUOM || 'UNIT' }}</span>
                </div>
              </div>
            </div>

            <!-- 4. Execution Action -->
            <div class="action-stack">
              <ion-button 
                expand="block" 
                class="terminal-confirm-btn" 
                @click="scaningAfterQrCode"
              >
                <ion-icon :icon="checkmarkCircleOutline" slot="start"></ion-icon>
                EXECUTE SCAN SYNC
              </ion-button>
              <p class="security-note">Finalizing this entry will update the Picking & Packing ledger.</p>
            </div>

          </div>
        </div>
      </ion-content>
    </ion-page>
  </master>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { 
  IonPage, IonContent, IonImg, IonIcon, IonButton, 
  IonInput, IonSelect, IonSelectOption 
} from '@ionic/vue';
import { 
  businessOutline, locationOutline, checkmarkCircleOutline, 
  qrCodeOutline, cubeOutline 
} from 'ionicons/icons';
import pick from '@/services/pick';

export default defineComponent({
  name: 'ScanProduct',
  components: { 
    IonPage, IonContent, IonImg, IonIcon, IonButton, 
    IonInput, IonSelect, IonSelectOption 
  },
  setup() {
    // Vite compatibility: Return icons explicitly
    return { 
      businessOutline, locationOutline, checkmarkCircleOutline, 
      qrCodeOutline, cubeOutline 
    };
  },
  data() {
    return {
      data: null as any,
      packdata: null as any,
      productQty: "",
      selectedUOM: "",
      UOM_SYS_ID: "",
      measurementDetails: [] as any[],
      imageUrl: `https://uat-hlyongapi.cssdemo.dev/public/uploaded_files`,
    };
  },
  mounted() {
    const storedData = localStorage.getItem('originalqrcodedata');
    if (storedData) {
      this.data = JSON.parse(storedData);
      this.measurementDetails = this.data.MEASUREMENT_DETAILS || [];
    }

    const packeddata = localStorage.getItem('packingscandetailes');
    if (packeddata) {
      this.packdata = JSON.parse(packeddata);
    }

    if (this.packdata.UOM) {
        this.selectedUOM = this.packdata.UOM;
        this.UOM_SYS_ID = this.packdata.UOM_SYS_ID || this.packdata.PACKING_UOM_SYS_ID;
      }

      if (!this.selectedUOM && this.measurementDetails.length > 0) {
      this.selectedUOM = this.measurementDetails[0].UOM;
      this.UOM_SYS_ID = this.measurementDetails[0].UOM_SYS_ID;
    }
  },
  methods: {
    updateUOMSysId() {
      const selectedItem = this.measurementDetails.find(
        (item) => item.UOM === this.selectedUOM
      );
      if (selectedItem) {
        this.UOM_SYS_ID = selectedItem.UOM_SYS_ID;
      }
    },
    generateImageUrl(img: string) {
      return img ? `${this.imageUrl}/${img}` : '';
    },
    scaningAfterQrCode() {
      if (!this.productQty || !this.selectedUOM || !this.UOM_SYS_ID) {
        alert("Verification required: Please enter Quantity and UOM.");
        return;
      }

      pick.qrcodepost({
        ITEM: 'PRODUCT_SCANNING',
        BRANCH_NAME_SYS_ID: this.packdata?.BRANCH_NAME_SYS_ID,
        WAREHOUSE_BUILDING_DETAILS_SYS_ID: this.packdata?.WAREHOUSE_BUILDING_DETAILS_SYS_ID,
        WAREHOUSE_RACK_DETAILS_SYS_ID: this.packdata?.WAREHOUSE_RACK_DETAILS_SYS_ID,
        ITEM_PROCESS_SYS_ID: this.packdata?.ITEM_PROCESS_SYS_ID,
        ITEM_SYS_ID: this.packdata?.ITEM_ID,
        PACKING_UOM: this.selectedUOM,
        PACKING_UOM_SYS_ID: this.UOM_SYS_ID,
        PACKING_QTY: this.productQty,
      }).then((response) => {
       
        if (response.status === 'true') {

          window.location.href = "/pack";
        } else {
          alert(response.response);
        }
      });
    },
  },
});
</script>

<style scoped>
/* 1. Terminal Layout Background */
.technical-validation-portal {
  min-height: 100vh;
  background-color: #F4F7F9; /* Titanium White */
}

/* 2. Slim Executive Header */
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

/* 3. Identity Tech Plate */
.tech-plate {
  background: white; border-radius: 12px; margin-bottom: 25px;
  border: 1px solid #E2E8F0; position: relative; overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.02);
}

.plate-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #DC2626; }

.product-visual-row { display: flex; align-items: center; gap: 15px; padding: 15px 18px; }

.img-wrapper {
  width: 60px; height: 60px; border-radius: 10px;
  background: #F8FAFC; border: 1px solid #F1F5F9;
  padding: 5px; display: flex; align-items: center; justify-content: center;
}

.luxury-thumb { width: 100%; height: 100%; object-fit: contain; }

.ref-label { font-size: 8px; font-weight: 900; color: #94A3B8; letter-spacing: 0.5px; }
.item-name { color: #1E293B; font-size: 15px; font-weight: 800; margin: 2px 0 0; line-height: 1.2; }

.ledger-divider-dashed { height: 1px; border-bottom: 1px dashed #E2E8F0; margin: 0 18px; }

/* Technical Detail Grid */
.spec-grid { display: grid; grid-template-columns: 1fr 1fr; background: #F8FAFC; border-radius: 8px; margin: 15px 18px; border: 1px solid #E2E8F0; }
.spec-item { padding: 10px; }
.border-left { border-left: 1px solid #E2E8F0; }

.tiny-label { font-size: 7.5px; font-weight: 900; color: #94A3B8; margin-bottom: 4px; display: block; }
.spec-val-wrap { display: flex; align-items: center; gap: 6px; color: #0F172A; }
.spec-val-wrap ion-icon { font-size: 13px; color: #64748B; }
.spec-val { font-size: 12px; font-weight: 800; }
.crimson-text { color: #DC2626; }

/* 4. Integrated Input Strip */
.section-tiny-label { font-size: 8.5px; font-weight: 900; color: #64748B; letter-spacing: 1px; margin-bottom: 10px; display: block; padding-left: 5px; }

.integrated-input-strip {
  display: flex; background: white; border-radius: 10px;
  border: 1px solid #0F172A; overflow: hidden; margin-bottom: 30px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.qty-zone { flex: 2; border-right: 1px solid #E2E8F0; }
/* .uom-zone { flex: 1; background: #F8FAFC; } */
.uom-zone.static-uom {
  flex: 1; 
  background: #F8FAFC; 
  display: flex; 
  align-items: center; 
  justify-content: center;
}
.uom-text {
  font-size: 14px;
  font-weight: 800;
  color: #1E293B;
  letter-spacing: 0.5px;
}

.ledger-qty-input { --padding-start: 15px; --color: #0F172A; font-weight: 900; font-size: 18px; height: 52px; }
.ledger-uom-select { font-weight: 800; font-size: 12px; color: #0F172A; height: 52px; }

/* 5. Execution Action */
.terminal-confirm-btn {
  --background: #DC2626; --border-radius: 8px; height: 56px;
  font-weight: 900; font-size: 13px; letter-spacing: 0.5px;
  --box-shadow: 0 8px 16px rgba(220, 38, 38, 0.2);
}

.security-note {
  text-align: center; font-size: 9px; font-weight: 700; color: #94A3B8;
  margin-top: 15px; text-transform: uppercase;
}
</style>