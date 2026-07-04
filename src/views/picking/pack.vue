<template>
  <master>
    <div class="technical-ledger-page" @click="keepFocusIfActive">
      
      <!-- 1. ULTRA-SLIM EXECUTIVE HEADER -->
      <header class="slim-mission-header">
        <div class="header-content">
          <div class="header-left">
            <span class="so-badge">SO #{{ SO_NO }}</span>
            <h1 class="company-name-mini">{{ COMPANY_NAME }}</h1>
          </div>
          <div class="header-right">
            <div class="m-pill">
              <ion-icon :icon="calendarOutline"></ion-icon>
              <span>{{ DELIVERY_DATE }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- 2. The Main Scrollable Content -->
      <div class="scrollable-content">
        
        <!-- PRODUCT GROUP LOOP -->
        <div v-for="(group, productName) in groupedPackingData" :key="productName" class="product-section" :class="{ 'is-product-completed': group.isCompleted }">
          
          <div class="product-master-label">
            <div class="p-info">
              <h2 class="p-title">{{ group.header.PRODUCT_NAME }}</h2>
              <span class="p-subtitle">REF: {{ group.header.PART_NO }}</span>
            </div>
            <div class="p-total-target">
              <label>GOAL</label>
              <span>{{ group.header.DISPLAY_QTY_UOM }}</span>
            </div>
          </div>

          <!-- RACK CARDS -->
          <div class="rack-cards-container">
            <div
              v-for="pack in group.items"
              :key="pack.ITEM_PROCESS_ORDER_RACK_SYS_ID"
              class="unified-rack-card"
              :class="{ 'active-scan-border': isLaserReady && activePack?.ITEM_PROCESS_ORDER_RACK_SYS_ID === pack.ITEM_PROCESS_ORDER_RACK_SYS_ID,
                  'is-fully-chosen': Number(pack.ONLY_PACKED_QTY) > 0 && Number(pack.ONLY_PACKED_QTY) >= Number(pack.PICK_UP_QTY),
                'is-partially-chosen': Number(pack.ONLY_PACKED_QTY) > 0 && Number(pack.ONLY_PACKED_QTY) < Number(pack.PICK_UP_QTY)

              }"
            >
              <div class="card-inner">
                
                <div class="tech-vertical-grid">
                  <div class="data-cell">
                    <label>LOCATION / RACK</label>
                    <span class="val-red">{{ pack.RACK_NO }}</span>
                  </div>
                  <div class="data-cell">
                    <label>BATCH NUMBER</label>
                    <span class="val-bold">{{ pack.BATCH_NO }}</span>
                  </div>
                  <div class="data-cell">
                    <label>WAREHOUSE</label>
                    <span class="val-sub">{{ pack.WAREHOUSE_NAME }}</span>
                  </div>
                </div>

                <div class="stats-vertical-grid">
                  <div class="stat-cell">
                    <label>AVAILABLE</label>
                    <span class="s-val">{{ pack.AVAILABLE_QTY }}</span>
                  </div>
                  <div class="stat-cell highlight">
                    <label>TO PICK</label>
                    <span class="s-val">{{ pack.PICK_UP_QTY }}</span>
                  </div>
                  <div class="stat-cell info" v-if="!isSectionVisible">
                    <label>PACKED</label>
                    <span class="s-val blue-text">{{ pack.PACKED_QTY || 0 }}</span>
                    
                  </div>
                </div>

                <!-- Action Bar -->
                <div class="action-strip">
                  <div class="manual-link" @click="toggleSection">
                    <ion-icon :icon="createOutline"></ion-icon>
                    <span>Manual Entry</span>
                  </div>

                  <!-- Integrated Scan Button (Tap to Activate Hardware Laser) -->
                  <ion-button 
                    class="luxury-scan-button" 
                    :class="{'laser-ready-btn': isLaserReady && activePack?.ITEM_PROCESS_ORDER_RACK_SYS_ID === pack.ITEM_PROCESS_ORDER_RACK_SYS_ID}"
                    @click="activateLaserScanner(pack)"
                  >
                    <div class="button-content">
                      <ion-icon :icon="isLaserReady && activePack?.ITEM_PROCESS_ORDER_RACK_SYS_ID === pack.ITEM_PROCESS_ORDER_RACK_SYS_ID ? barcodeOutline : barcodeOutline"></ion-icon>
                      <span>{{ isLaserReady && activePack?.ITEM_PROCESS_ORDER_RACK_SYS_ID === pack.ITEM_PROCESS_ORDER_RACK_SYS_ID ? 'LASER READY' : 'VERIFY SCAN' }}</span>
                    </div>
                  </ion-button>
                </div>

                <!-- Camera Fallback (Only shows when laser is active for that specific pack) -->
                <div class="camera-fallback-wrap" v-if="isLaserReady && activePack?.ITEM_PROCESS_ORDER_RACK_SYS_ID === pack.ITEM_PROCESS_ORDER_RACK_SYS_ID">
                    <ion-button fill="clear" size="small" color="danger" @click="openCameraLens(pack)">
                        <ion-icon :icon="cameraOutline" slot="start"></ion-icon>
                        Use Camera instead
                    </ion-button>
                </div>

                <!-- Manual Qty Input Drawer -->
                <div v-if="isSectionVisible" class="qty-drawer fade-in">
                  <label>ENTER QTY ({{ pack.UOM }})</label>
                  <ion-input
                    type="number"
                    inputmode="decimal"
                    v-model="pack.ONLY_PACKED_QTY"
                    @change="updatePackingQty(pack, $event.target.value, pack.PICK_UP_QTY)"
                    class="luxury-qty-input">
                  </ion-input>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. REMARKS & BUTTONS -->
        <div class="end-of-job-console">
          <div class="remarks-card-mini">
            <div class="remarks-header">
              <ion-icon :icon="documentTextOutline"></ion-icon>
              <span>Job Remarks</span>
            </div>
            <ion-textarea
              placeholder="Fulfillment notes..."
              v-model="PICKING_PACKING_REMARKS"
              class="final-textarea">
            </ion-textarea>
          </div>

          <div class="final-action-row">
            <ion-button class="btn-inprogress-final" @click="inprogressPickingDetailes">
              <ion-icon :icon="hourglassOutline" slot="start"></ion-icon>
              Progress
            </ion-button>
            <ion-button class="btn-complete-final" @click="gotoCompletePack">
              <ion-icon :icon="checkmarkDoneOutline" slot="start"></ion-icon>
              Complete
            </ion-button>
          </div>
        </div>
      </div>

      <!-- THE HIDDEN FIX: Invisible native input to catch laser data from industrial device -->
      <input 
        ref="machineInputCatcher" 
        type="text" 
        class="hidden-machine-catcher"
        @keyup.enter="handleHardwareScan"
      />

    </div>
    <sweetAlert v-if="sweetAlert" :msg="msg" />
  </master>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from 'vue';
import { IonButton, IonInput, IonTextarea, IonIcon, alertController } from '@ionic/vue';
import { 
  calendarOutline, barcodeOutline, createOutline, listOutline,
  checkmarkDoneOutline, hourglassOutline, documentTextOutline, cubeOutline, cameraOutline 
} from 'ionicons/icons';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import pick from '@/services/pick';
import sweetAlert from '../sweetAlert.vue';

export default defineComponent({
  name: "PackingJobFinal",
  components: { IonButton, IonInput, IonTextarea, IonIcon, sweetAlert },
  setup() {
    const isLaserReady = ref(false);
    const activePack = ref<any>(null);
    const machineInputCatcher = ref<HTMLInputElement | null>(null);

    const icons = { 
        calendarOutline, barcodeOutline, createOutline, listOutline,
        checkmarkDoneOutline, hourglassOutline, documentTextOutline, cubeOutline, cameraOutline 
    };

    // 1. Activate Hardware Scanning Mode
    const activateLaserScanner = (pack: any) => {
      activePack.value = pack;
      isLaserReady.value = true;
      // Focus the hidden native input so the laser has a place to "type"
      nextTick(() => {
        if (machineInputCatcher.value) {
            machineInputCatcher.value.focus();
        }
      });
    };

    // 2. Handle the "Enter" key sent by the Hardware Laser
    const handleHardwareScan = (event: any) => {
      const val = event.target.value;
      if (val && activePack.value) {
        getScanResult(val.trim(), activePack.value);
        event.target.value = ""; // Clear input for next scan
      }
    };

    // Auto-refocus if user clicks elsewhere while laser is ready
    const keepFocusIfActive = () => {
        if (isLaserReady.value) {
            machineInputCatcher.value?.focus();
        }
    }

    // Standard Camera Mode (Backup)
    const openCameraLens = async (pack: any) => {
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted') return;
      try {
        const { barcodes } = await BarcodeScanner.scan();
        if (barcodes.length > 0) {
          getScanResult(barcodes[0].displayValue, pack);
        }
      } catch (error: any) {
        console.error(error);
      }
    };

    const getScanResult = async (scannedData: any, pack: any) => {
      try {
        const res = await pick.qrcode(scannedData, pack);
        if (res && res.response && res.response[0]) {
          const product = res.response[0];
          localStorage.setItem('originalqrcodedata', JSON.stringify(product));
          
          if (product.PRODUCT_SYS_ID === pack.ITEM_ID) {
            localStorage.setItem('packingscandetailes', JSON.stringify(pack));
            isLaserReady.value = false;
            window.location.href = '/ScanProduct';
          } else {
            isLaserReady.value = false;
            window.location.href = '/ScanRightProduct';
          }
        }
      } catch (error: any) {
        alert("Verification Error: " + error.message);
        isLaserReady.value = false;
      }
    };

    return { 
      ...icons,
      activateLaserScanner, handleHardwareScan, openCameraLens,
      isLaserReady, activePack, machineInputCatcher, keepFocusIfActive
    };
  },
  data() {
    return {
      isSectionVisible: false,
      sweetAlert: false,
      msg: "",
      SO_NO: "",
      COMPANY_NAME: "",
      PICKING_PACKING_REMARKS: "",
      DELIVERY_DATE: "",
      get_data_packing: [] as any[],
      sl_id: "",
    }
  },
  computed: {
    groupedPackingData() {
      const grouped = {} as any;
      this.get_data_packing.forEach(item => {
        const key = item.PRODUCT_NAME;
        if (!grouped[key]) {
          grouped[key] = {
            header: { PRODUCT_NAME: item.PRODUCT_NAME, PART_NO: item.PART_NO, DISPLAY_QTY_UOM: item.DISPLAY_QTY_UOM },
            items: []
          };
        }
        grouped[key].items.push(item);
      });

      for (const key in grouped) {
        let totalToPick = 0;
        let totalPacked = 0;
        
        grouped[key].items.forEach((pack: any) => {
          totalToPick += Number(pack.PICK_UP_QTY || 0);
          totalPacked += Number(pack.ONLY_PACKED_QTY || 0);
        });
        grouped[key].isCompleted = totalToPick > 0 && totalPacked >= totalToPick;
      }

      return grouped;
    }
  },
  mounted() {
    this.getDataForPickingData();
    this.getwarehouseDetailes();
  },
  methods: {
    toggleSection() { this.isSectionVisible = !this.isSectionVisible; },
    getDataForPickingData() {
      let getdata = localStorage.getItem("pickitem");
      if(getdata) {
        const data = JSON.parse(getdata);
        this.SO_NO = data.SO_NO;
        this.COMPANY_NAME = data.COMPANY_NAME;
        this.DELIVERY_DATE = data.DELIVERY_DATE;
        this.sl_id = data.SALES_ORDER_SYS_ID;
        this.PICKING_PACKING_REMARKS = data.PICKING_PACKING_REMARKS || data.WAREHOUSE_REMARKS;
      }
    },
    getwarehouseDetailes() {
      pick.salesorderdetailes(this.sl_id).then((res: any) => {
        if (res.status != "false") {
          this.get_data_packing = res[0].ORDER_DETAILS;
        }
      });
    },
    updatePackingQty(pack: any, value: any, orderQty: any) {
      value = Number(value);
      if (value > orderQty) {
        alert(`Limit exceeded. Max: ${orderQty}`);
        pack.ONLY_PACKED_QTY = 0;
      } else {
        pack.ONLY_PACKED_QTY = value;
      }
    },
    getPackData(status: string) {
       return this.get_data_packing.map(item => ({
            ITEM_PROCESS_SYS_ID: item.ITEM_PROCESS_SYS_ID,
            PACKING_QTY: item.ONLY_PACKED_QTY || "0",
            PACKING_STATUS: status,
            ITEM_ID: item.ITEM_ID,
            BATCH_NO: item.BATCH_NO,
            RACK_NO: item.RACK_NO,
            PACKING_UOM: item.UOM,
            PACKING_UOM_SYS_ID: item.UOM_SYS_ID || item.PACKING_UOM_SYS_ID,
            WAREHOUSE_NAME: item.WAREHOUSE_NAME,
            BRANCH_NAME_SYS_ID: item.BRANCH_NAME_SYS_ID,
            WAREHOUSE_BUILDING_DETAILS_SYS_ID: item.WAREHOUSE_BUILDING_DETAILS_SYS_ID,
            WAREHOUSE_RACK_DETAILS_SYS_ID: item.WAREHOUSE_RACK_DETAILS_SYS_ID,
            ITEM_PROCESS_ORDER_RACK_SYS_ID: item.ITEM_PROCESS_ORDER_RACK_SYS_ID,
            UOM_SYS_ID: item.UOM_SYS_ID,
       }));
    },
    inprogressPickingDetailes() {
      let params = {
        ITEM: "ORDER_STATUS", SALES_ORDER_ID: this.sl_id,
        PICKING_PACKING_REMARKS: this.PICKING_PACKING_REMARKS,
        ORDER_STATUS: "Packing_Inprogress", DETAILS: this.getPackData("Packing_Inprogress")
      };
      pick.inprogressPickingDetailes(params).then(() => { window.location.href = "/pick"; });
    },
    gotoCompletePack() {
     
      let params = {
        ITEM: "ORDER_STATUS", ORDER_STATUS: "Packing_Completed",
        PICKING_PACKING_REMARKS: this.PICKING_PACKING_REMARKS,
        SALES_ORDER_ID: this.sl_id, DETAILS: this.getPackData("Packing Completed")
      };
      
      pick.gotoCompletePack(params).then(() =>
      
       { window.location.href = "/pick"; }
      );
    }
  }
});
</script>

<style scoped>
.technical-ledger-page { min-height: 100vh; background-color: #F8FAFC; }

/* Hidden Catcher for Hardware Laser */
.hidden-machine-catcher {
    position: fixed;
    top: -100px;
    left: -100px;
    opacity: 0;
    z-index: -1;
}

.slim-mission-header { background: #0F172A; padding: 10px 15px; color: white; border-bottom: 2px solid #DC2626; }
.header-content { display: flex; justify-content: space-between; align-items: center; }
.so-badge { font-size: 9px; font-weight: 900; color: #FCA5A5; letter-spacing: 1px; text-transform: uppercase; }
.company-name-mini { font-size: 16px; font-weight: 800; margin: 0; color: #FFFFFF; }
.m-pill { background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; color: #CBD5E1; display: flex; align-items: center; gap: 4px; }

.scrollable-content { padding: 12px; }
.product-section { margin-bottom: 25px; }

.product-master-label {
  display: flex; align-items: center; gap: 10px;
  background: #FFFFFF; padding: 12px; border-radius: 12px;
  border: 1px solid #E2E8F0; margin-bottom: 8px;
}
.p-title { color: #0F172A; font-size: 14px; font-weight: 800; margin: 0; }
.p-subtitle { color: #64748B; font-size: 9px; font-weight: 700; text-transform: uppercase; }
.p-total-target { text-align: right; flex: 1; }
.p-total-target label { display: block; font-size: 8px; font-weight: 800; color: #94A3B8; }
.p-total-target span { font-size: 15px; font-weight: 900; color: #059669; }

.unified-rack-card {
  background: white; border-radius: 12px; margin-bottom: 10px;
  border: 1px solid #F1F5F9; box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  overflow: hidden; transition: 0.3s;
}
.active-scan-border { border: 2px solid #DC2626; transform: scale(1.02); }

.card-inner { padding: 12px 12px 12px 18px; border-left: 6px solid #DC2626; }

.unified-rack-card.is-fully-chosen {
  background-color: #F0FDF4; /* Light green */
  border: 1px solid #10B981; 
}
.unified-rack-card.is-fully-chosen .card-inner {
  border-left-color: #059669; 
}
.unified-rack-card.is-fully-chosen .val-red,
.unified-rack-card.is-fully-chosen .highlight .s-val {
  color: #059669; /* Change Red text to Green */
}
.unified-rack-card.is-fully-chosen .luxury-scan-button {
  --background: #059669; /* Green Button */
}

/* 🟠 PARTIALLY CHOSEN STATE CSS 🟠 */
.unified-rack-card.is-partially-chosen {
  background-color: #FFFBEB; /* Light Orange */
  border: 1px solid #F59E0B;
}
.unified-rack-card.is-partially-chosen .card-inner {
  border-left-color: #D97706; 
}
.unified-rack-card.is-partially-chosen .val-red,
.unified-rack-card.is-partially-chosen .highlight .s-val {
  color: #D97706; /* Change Red Text to Orange */
}
.unified-rack-card.is-partially-chosen .luxury-scan-button {
  --background: #D97706; /* Orange button */
}

.tech-vertical-grid, .stats-vertical-grid {
  display: grid; grid-template-columns: 1fr 1fr 1fr;
  gap: 8px; padding-bottom: 10px; margin-bottom: 10px;
  border-bottom: 1px dashed #F1F5F9;
}
.data-cell, .stat-cell { display: flex; flex-direction: column; }
label { font-size: 8px; font-weight: 900; color: #94A3B8; margin-bottom: 2px; text-transform: uppercase; }
.val-red { font-size: 13px; font-weight: 800; color: #DC2626; }
.val-bold { font-size: 13px; font-weight: 700; color: #1E293B; }
.val-sub { font-size: 9px; color: #64748B; font-weight: 600; }
.s-val { font-size: 13px; font-weight: 700; color: #1E293B; }
.highlight .s-val { color: #DC2626; font-weight: 800; }

.action-strip { display: flex; justify-content: space-between; align-items: center; }
.manual-link { font-size: 10px; font-weight: 700; color: #64748B; display: flex; align-items: center; gap: 4px; cursor: pointer; }

.luxury-scan-button {
  --background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  --border-radius: 10px;
  --color: #ffffff;
  height: 38px;
  min-width: 130px;
}
.laser-ready-btn { --background: #DC2626; animation: pulse-border 1.5s infinite; }

@keyframes pulse-border {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
}

.is-product-completed .product-master-label {
  background-color: #ECFDF5; /* Soft Mint Green */
  border: 1px solid #10B981; /* Emerald Green border */
  transition: all 0.3s ease;
}

.is-product-completed .p-title {
  color: #065F46; /* Dark Green Title */
}

.is-product-completed .p-subtitle {
  color: #047857; /* Medium Green Subtitle */
}

.is-product-completed .p-total-target label {
  color: #059669;
}

.is-product-completed .p-total-target span {
  color: #065F46;
  font-weight: 900;
}

.camera-fallback-wrap { text-align: center; margin-top: 5px; }

.end-of-job-console { margin-top: 30px; padding-bottom: 50px; }
.remarks-card-mini { background: white; border-radius: 12px; padding: 12px; border: 1px solid #F1F5F9; margin-bottom: 15px; }
.remarks-header { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 900; color: #DC2626; text-transform: uppercase; margin-bottom: 8px; }
.final-textarea { --background: #F8FAFC; border-radius: 8px; font-size: 13px; font-weight: 600; min-height: 60px; padding: 8px; }

.final-action-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.btn-inprogress-final { --background: #FFFFFF; --color: #059669; --border-color: #059669; --border-style: solid; --border-width: 1px; --border-radius: 12px; height: 50px; font-weight: 800; }
.btn-complete-final { --background: #059669; --border-radius: 12px; height: 50px; font-weight: 800; }

.qty-drawer { margin-top: 10px; padding: 10px; background: #FEF2F2; border-radius: 8px; }
.luxury-qty-input { --background: white; border: 1px solid #FECACA; border-radius: 6px; font-weight: 900; height: 38px; }
.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; } }
</style>