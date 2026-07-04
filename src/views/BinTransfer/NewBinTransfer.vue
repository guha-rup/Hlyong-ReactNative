<template>
  <master>
    <div class="technical-transfer-portal">
      
      <!-- 1. Slim Terminal Header -->
      <header class="slim-terminal-header">
        <div class="header-content">
          <div class="title-stack">
            <span class="status-tag">
              <span class="pulse-ruby"></span> 
              {{ isLaserReady ? 'SENSOR ACTIVE' : 'TERMINAL STANDBY' }}
            </span>
            <h1 class="main-title">Inventory Relocation</h1>
          </div>
          <div class="op-id">ID: B-{{ batchNo?.substring(0,4) }}</div>
        </div>
      </header>

      <div class="terminal-body">
        
        <!-- 2. Product Identity Plate -->
        <div class="tech-plate">
          <div class="plate-indicator"></div>
          <div class="plate-inner">
            <div class="identity-row">
              <span class="ref-label">PART REF: {{ partNo }}</span>
              <h2 class="item-name">{{ productName }}</h2>
            </div>
            
            <div class="spec-grid">
              <div class="spec-item">
                <label class="tiny-label">AVAILABLE STOCK</label>
                <div class="spec-val-wrap">
                  <ion-icon :icon="cubeOutline"></ion-icon>
                  <span class="spec-val">{{ quantity }} <small>UNITS</small></span>
                </div>
              </div>
              <div class="spec-item border-left">
                <label class="tiny-label">BATCH REFERENCE</label>
                <div class="spec-val-wrap">
                  <ion-icon :icon="pricetagOutline"></ion-icon>
                  <span class="spec-val">{{ batchNo }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Integrated Quantity & UOM Strip -->
        <div class="input-console">
          <label class="section-tiny-label">DEFINE TRANSFER VOLUME</label>
          <div class="integrated-strip">
            <div class="qty-zone">
              <ion-input
                :value="enteredQty"
                @ionInput="enteredQty = parseFloat($event.target.value)"
                type="number"
                placeholder="0.00"
                class="ledger-qty-input">
              </ion-input>
            </div>
            <div class="uom-zone">
              <ion-select
                v-model="selectedUom"
                interface="popover"
                class="ledger-uom-select"
                placeholder="UOM"
                @ionChange="dataadd($event)">
                <ion-select-option
                  v-for="item in uom?.MEASUREMENT_DETAILS"
                  :key="item.MEASUREMENT_SYS_ID"
                  :value="item">
                  {{ item.UOM }}
                </ion-select-option>
              </ion-select>
            </div>

          </div>
        </div>

        <!-- 4. Target Destination (Hybrid Hardware Scan) -->
        <div class="destination-portal">
          <label class="section-tiny-label">TARGET DESTINATION BIN</label>
          
          <!-- TECHNICAL SENSOR TRIGGER -->
          <div class="optic-scan-trigger" :class="{ 'laser-active': isLaserReady }" @click="activateHardwareLaser">
            <div class="sensor-box">
              <ion-icon :icon="barcodeOutline"></ion-icon>
              <div class="laser-sweep" v-if="isLaserReady"></div>
            </div>
            <div class="sensor-text">
              <h4>{{ isLaserReady ? 'READY FOR HARDWARE SCAN' : 'TAP TO ACTIVATE SENSOR' }}</h4>
              <p>{{ isLaserReady ? 'Press Yellow side button' : 'Laser ready mode' }}</p>
            </div>
          </div>

          <!-- Camera fallback for normal smartphones -->
          <ion-button v-if="isLaserReady" fill="clear" color="danger" class="camera-backup-btn" @click.stop="openMobileCamera">
            <ion-icon :icon="cameraOutline" slot="start"></ion-icon>
            Use Phone Camera Instead
          </ion-button>

          <div class="ledger-divider">
            <span>OR MANUAL ENTRY</span>
          </div>

          <div class="manual-entry-plate">
            <ion-input
              :value="manualBinName"
              @ionInput="manualBinName = $event.target.value"
              placeholder="ENTER BIN ID..."
              class="terminal-manual-input"
              @keyup.enter="submitManualBin"
              clear-input>
            </ion-input>
            <ion-button expand="block" class="terminal-submit-btn" @click="submitManualBin">
              VERIFY & EXECUTE
            </ion-button>
          </div>
        </div>
      </div>

      <!-- THE SECRET KEY: Invisible Input Catcher for High-Speed Laser Scanning -->
      <input 
        ref="hiddenLaserInput" 
        type="text" 
        class="hidden-machine-catcher"
        @keyup.enter="handleLaserData" 
        @blur="refocusIfActive"
      />

    </div>
  </master>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from "vue";
import { IonButton, IonInput, IonSelect, IonSelectOption, IonIcon, alertController } from "@ionic/vue";
import { swapHorizontalOutline, cubeOutline, pricetagOutline, barcodeOutline, chevronForwardOutline, cameraOutline } from 'ionicons/icons';
import { useRoute, useRouter } from "vue-router";
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import pick from '@/services/pick';

export default defineComponent({
  name: "NewBinTransferPremium",
  components: { IonButton, IonInput, IonSelect, IonSelectOption, IonIcon },
  setup() {
    const uom = ref<any>(null);
    const selectedUom = ref<any>(null);
    const route = useRoute();
    const router = useRouter();
    const enteredQty = ref<number | null>(null);
    const manualBinName = ref<string>("");
    
    // Hardware State
    const isLaserReady = ref(false);
    const hiddenLaserInput = ref<HTMLInputElement | null>(null);

    const icons = { swapHorizontalOutline, cubeOutline, pricetagOutline, barcodeOutline, chevronForwardOutline, cameraOutline };

    const partNo = route.query.partNo;
    const productName = route.query.productName;
    const quantity = route.query.quantity;
    const batchNo = route.query.batchNo as string;
    const productSysId = route.query.productSysId;
    const passedUom = (route.query.uom as string) || "N/A";

    onMounted(() => {
      if (productSysId) {
        pick.SpecificUom(productSysId).then((res) => {
          if (res && res.response && res.response.length > 0){ uom.value = res.response[0];

          if (uom.value.MEASUREMENT_DETAILS && passedUom) {
              const defaultMatch = uom.value.MEASUREMENT_DETAILS.find(
                (item: any) => item.UOM === passedUom
              );
              if (defaultMatch) {
                selectedUom.value = defaultMatch; // Binds to Ion-Select UI
                localStorage.setItem("selectedUom", defaultMatch.UOM);
                localStorage.setItem("selectedUomSysId", defaultMatch.MEASUREMENT_SYS_ID);
              }
            }
          }
        });
      }
    });

    // 1. Logic: Click box to focus the machine scanner
    const activateHardwareLaser = () => {
      if (!enteredQty.value || enteredQty.value <= 0) {
        alert("Verification Error: Enter quantity first.");
        return;
      }
      isLaserReady.value = true;
      focusInput();
    };

    const focusInput = () => {
        nextTick(() => {
            if (hiddenLaserInput.value) hiddenLaserInput.value.focus();
        });
    };

    const refocusIfActive = () => {
        if (isLaserReady.value) setTimeout(() => focusInput(), 150);
    };

    // 2. Logic: The machine types and hits Enter automatically
    const handleLaserData = (event: any) => {
      const val = event.target.value.trim().toUpperCase();
      if (val) {
        isLaserReady.value = false;
        processFinalValidation(val);
        event.target.value = ""; 
      }
    };

    // Camera fallback for normal phones
    const openMobileCamera = async () => {
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera === 'granted') {
        const result = await BarcodeScanner.scan();
        if (result.barcodes.length > 0) {
          const val = result.barcodes[0].displayValue.replace(/[\r\n\t]/g, '');
          processFinalValidation(val.toUpperCase());
        }
      }
    };

    // 3. Unified Validation Logic
    const processFinalValidation = async (binVal: string) => {
      const response = await pick.BinNameWiseProduct(binVal);
      if (response && response.response && response.response.length > 0) {
        localStorage.setItem('scanData', JSON.stringify(response.response[0]));
        localStorage.setItem('scannedBinName', JSON.stringify(binVal));
        localStorage.setItem("enteredQty", String(enteredQty.value));
          localStorage.setItem("selectedUom", selectedUom.value?.UOM || passedUom); 
        if(selectedUom.value?.MEASUREMENT_SYS_ID) {
            localStorage.setItem("selectedUomSysId", selectedUom.value.MEASUREMENT_SYS_ID);
        }
        window.location.href = '/NewBinDetails';
      } else {
        alert("Bin Not Found in System.");
        isLaserReady.value = false;
      }
    };

    const submitManualBin = () => {
  
      if (!manualBinName.value.trim() || !enteredQty.value) return;
      processFinalValidation(manualBinName.value.trim().toUpperCase());
    };

    const dataadd = (event: any) => {
      const selected = event.detail.value;
      if (!selected) return;
      selectedUom.value = selected;
      localStorage.setItem("selectedUom", selected.UOM);
      localStorage.setItem("selectedUomSysId", selected.UOM_SYS_ID);
    };

    return { ...icons, uom, selectedUom, partNo, productName, quantity, batchNo, manualBinName, activateHardwareLaser, isLaserReady, hiddenLaserInput, handleLaserData, openMobileCamera, enteredQty, dataadd, submitManualBin, refocusIfActive };
  },
});
</script>

<style scoped>
/* Technical Layout Background */
.technical-transfer-portal {
  min-height: 100vh;
  background-color: #F4F7F9;
  padding-bottom: 50px;
}

/* THE HIDDEN INPUT FIX: Invisible off-screen catcher */
.hidden-machine-catcher {
    position: fixed;
    top: -100px;
    left: -100px;
    opacity: 0;
    width: 1px;
    height: 1px;
    z-index: -1;
}

.slim-terminal-header {
  background: white; padding: 30px 20px 15px; border-bottom: 1px solid #E2E8F0;
}
.header-content { display: flex; justify-content: space-between; align-items: flex-end; }
.status-tag { display: flex; align-items: center; gap: 5px; font-size: 8px; font-weight: 900; color: #94A3B8; letter-spacing: 1px; }
.pulse-ruby { width: 6px; height: 6px; background: #DC2626; border-radius: 50%; box-shadow: 0 0 8px rgba(220, 38, 38, 0.4); animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

.main-title { color: #0F172A; font-size: 19px; font-weight: 900; margin: 2px 0 0; letter-spacing: -0.5px; }
.op-id { font-size: 10px; font-weight: 800; color: #64748B; }

.terminal-body { padding: 20px 15px; }

/* Tech Plate */
.tech-plate { background: white; border-radius: 12px; margin-bottom: 25px; border: 1px solid #E2E8F0; position: relative; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
.plate-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #DC2626; }
.plate-inner { padding: 15px 18px; }
.ref-label { font-size: 8px; font-weight: 900; color: #94A3B8; }
.item-name { color: #1E293B; font-size: 15px; font-weight: 800; margin: 2px 0 15px; line-height: 1.2; }

.spec-grid { display: grid; grid-template-columns: 1fr 1fr; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; }
.spec-item { padding: 10px; }
.border-left { border-left: 1px solid #E2E8F0; }
.tiny-label { font-size: 7.5px; font-weight: 900; color: #94A3B8; margin-bottom: 4px; display: block; }
.spec-val-wrap { display: flex; align-items: center; gap: 6px; color: #0F172A; }
.spec-val-wrap ion-icon { font-size: 14px; color: #DC2626; }
.spec-val { font-size: 13px; font-weight: 800; }

.integrated-strip { display: flex; background: white; border-radius: 10px; border: 1px solid #0F172A; overflow: hidden; margin-bottom: 30px; box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08); }
.qty-zone { flex: 2; border-right: 1px solid #E2E8F0; }
.uom-zone { flex: 1; background: #F8FAFC; }
.ledger-qty-input { --padding-start: 15px; --color: #0F172A; font-weight: 900; font-size: 18px; height: 52px; }
.ledger-uom-select { font-weight: 800; font-size: 12px; color: #0F172A; height: 52px; }

/* Hybrid Scan Trigger */
.optic-scan-trigger { background: #0F172A; border-radius: 16px; padding: 15px; display: flex; align-items: center; gap: 15px; cursor: pointer; transition: 0.3s; }
.optic-scan-trigger.laser-active { border: 2px solid #DC2626; box-shadow: 0 0 15px rgba(220, 38, 38, 0.4); }
.sensor-box { width: 44px; height: 44px; background: rgba(220, 38, 38, 0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #DC2626; font-size: 24px; position: relative; overflow: hidden; }
.laser-sweep { position: absolute; width: 100%; height: 2px; background: #DC2626; top: 0; animation: sweep 2s infinite ease-in-out; }
.sensor-text h4 { color: white; margin: 0; font-size: 11px; font-weight: 900; }
.sensor-text p { color: #94A3B8; margin: 2px 0 0; font-size: 9px; }

.camera-backup-btn { width: 100%; font-size: 9px; font-weight: 900; text-transform: uppercase; margin-top: 5px; }

.ledger-divider { display: flex; align-items: center; gap: 15px; margin: 25px 0; }
.line { flex: 1; height: 1px; background: #E2E8F0; }
.ledger-divider span { color: #94A3B8; font-size: 8px; font-weight: 900; }

.manual-entry-plate { background: white; padding: 15px; border-radius: 16px; border: 1px solid #E2E8F0; }
.terminal-manual-input { --background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0; margin-bottom: 12px; font-weight: 700; font-size: 12px; }
.terminal-submit-btn { --background: #DC2626; --border-radius: 8px; height: 48px; font-weight: 900; font-size: 12px; }

@keyframes sweep { 0% { top: 10%; } 50% { top: 90%; } 100% { top: 10%; } }
.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; } }
</style>