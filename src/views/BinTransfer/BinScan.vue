<template>
  <Master>
    <div class="technical-terminal-container">
      
      <!-- 1. Slim Executive Header -->
      <header class="slim-executive-header">
        <div class="header-left">
          <div class="online-status">
            <span class="pulse-ruby"></span>
            <span class="status-text">SYSTEM ONLINE</span>
          </div>
          <h1 class="header-title">Bin Scanner</h1>
        </div>
        <div class="header-right">
          <div class="role-chip"><span>STORE MAN</span></div>
        </div>
      </header>

      <div class="ledger-body">
        
        <!-- 2. Integrated Operations Plate -->
        <div class="tech-plate">
          <div class="plate-tab">OPERATIONS CONSOLE</div>
          
          <div class="ops-grid">
            <div class="input-wrap">
              <label class="tiny-label">TARGET WAREHOUSE</label>
              <ion-select v-model="selectedWarehouse" interface="popover" class="compact-select">
                <ion-select-option value="CSS WAREHOUSE">CSS WAREHOUSE</ion-select-option>
              </ion-select>
            </div>

            <!-- Manual Input (Standard interaction) -->
            <div class="input-wrap border-left">
              <label class="tiny-label">MANUAL BIN ID</label>
              <ion-input
                v-model="manualBin"
                placeholder="e.g. N13-06-04"
                class="compact-input"
                @keyup.enter="handleManualSubmit"
                clear-input
              ></ion-input>
            </div>
          </div>

          <ion-button expand="block" class="verify-action-btn" @click="handleManualSubmit">
            <ion-icon :icon="searchOutline" slot="start"></ion-icon>
            VERIFY IDENTITY
          </ion-button>
        </div>

        <div class="technical-divider">
          <div class="line"></div>
          <span>HARDWARE SENSOR CONTROLS</span>
          <div class="line"></div>
        </div>

        <!-- 4. High-Speed Scan Portal (Machine Logic) -->
        <!-- Logic: CLICKING THIS focuses the machine catcher, making it instant -->
        <div class="scan-portal-wrapper" @click="activateMachineSensor">
          <div class="viewfinder" :class="{ 'laser-active': isLaserReady }">
            <div class="overlay-elements">
              <div class="bracket top-left"></div><div class="bracket top-right"></div>
              <div class="bracket bottom-left"></div><div class="bracket bottom-right"></div>
              <div class="scanning-laser" v-if="isLaserReady"></div>
            </div>

            <div class="scan-trigger-hub">
              <ion-icon :icon="barcodeOutline" :class="{'pulse-icon': isLaserReady}"></ion-icon>
              <span class="hub-text">{{ isLaserReady ? 'READY: PRESS DEVICE BUTTON' : 'TAP TO ACTIVATE SENSOR' }}</span>
            </div>
          </div>
          
          <!-- Secondary Option for Standard Mobile Users -->
          <ion-button v-if="isLaserReady" fill="clear" color="danger" class="camera-link" @click.stop="openCameraLens">
             <ion-icon :icon="cameraOutline" slot="start"></ion-icon>
             Use Phone Camera instead
          </ion-button>
          <p class="instruction-meta">LASER SCANNING IS INSTANT ON INDUSTRIAL DEVICES</p>
        </div>

        <!-- THE HIDDEN FIX: Invisible native input to catch laser data -->
        <!-- This is a standard <input> to bypass Shadow DOM focus issues -->
        <input 
          ref="machineInputCatcher" 
          type="text" 
          placeholder="Scan or Type here..."
          class="hidden-machine-catcher"
          @keyup.enter="handleMachineScan"
          @blur="refocusIfActive"
        />

      </div>
    </div>
  </Master>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick,onMounted } from 'vue';
import { IonButton, IonInput, IonSelect, IonSelectOption, IonIcon, alertController } from '@ionic/vue';
import { businessOutline, searchOutline, barcodeOutline, cameraOutline, personCircleOutline } from 'ionicons/icons';
import { useRouter } from "vue-router";
import pick from '@/services/pick';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import Master from "../layouts/Master.vue";

export default defineComponent({
  name: "BinTransferScanner",
  components: { IonButton, Master, IonSelect, IonSelectOption, IonInput, IonIcon },

  setup() {
    const selectedWarehouse = ref("CSS WAREHOUSE");
    const manualBin = ref("");
    const isLaserReady = ref(false);
    const machineInputCatcher = ref<HTMLInputElement | null>(null);
    const router = useRouter();

    const icons = { businessOutline, searchOutline, barcodeOutline, cameraOutline };

    const clearOldData = () => {
      localStorage.removeItem("scanDatanew");
      localStorage.removeItem("scanDatanew_data");
    };
    onMounted(() => {
      setTimeout(() => {
        activateMachineSensor();
      }, 400); // 400ms delay ensures the page is ready
    });

    // 1. Activate Machine Sensor: Focuses the hidden box so the laser can "type"
    const activateMachineSensor = () => {
      clearOldData(); 
      isLaserReady.value = true;
      // Force focus to the invisible input box
      nextTick(() => {
        if (machineInputCatcher.value) {
            machineInputCatcher.value.focus();
        }
      });
    };

    // Refocus guard: If user taps screen background, pull focus back to scanner input
    const refocusIfActive = () => {
        if (isLaserReady.value) {
            setTimeout(() => {
                machineInputCatcher.value?.focus();
            }, 150);
        }
    };

    // 2. Machine Scan Logic: Receives typed data and hits "Enter" automatically
    const handleMachineScan = (event: any) => {
      const val = event.target.value;
      if (val) {
        isLaserReady.value = false;
          if (event.target) {
          event.target.blur();
    }
        processFinalData(val.trim().toUpperCase());
        event.target.value = ""; // Clear for next time
      }
    };

    // Standard Camera Mode (Backup for normal phones)
    const openCameraLens = async () => {
      isLaserReady.value = false;
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted') return;
      try {
        const result = await BarcodeScanner.scan();
        if (result.barcodes.length > 0) {
          processFinalData(result.barcodes[0].displayValue?.trim().toUpperCase());
        }
      } catch (e) { console.error(e); }
    };

    // Unified Processing Method
    const processFinalData = async (val: string) => {
      
      if (!val) return;
      clearOldData(); 
      try {
        const response = await pick.BinNameWiseProduct(val);
        console.log(response);
    
        
        if (response && response.response && response.response.length > 0) {
          localStorage.setItem('scanDatanew', JSON.stringify(response.response));
          localStorage.setItem('scanDatanew_data', JSON.stringify(response.response[0]));
           window.location.href = '/BinProductDetails';
        } else {
           alert("Validation Failed: Bin " + val + " is empty.");
           isLaserReady.value = false;
        }
      } catch (error) { console.error(error); }
    };

    const handleManualSubmit = () => {
      if (!manualBin.value.trim()) return;
      processFinalData(manualBin.value.trim().toUpperCase());
    };

    return { 
        ...icons, selectedWarehouse, manualBin, handleManualSubmit, 
        activateMachineSensor, isLaserReady, handleMachineScan, 
        openCameraLens, machineInputCatcher, refocusIfActive 
    };
  },
});
</script>

<style scoped>
.technical-terminal-container { min-height: 100vh; background-color: #F4F7F9; padding-bottom: 40px; }

/* The Hidden Input: Invisible but captures hardware laser data */
.hidden-machine-catcher {
    position: fixed;
    top: -1000px; 
    left: -1000px;
    opacity: 0;
    width: 1px;
    height: 1px;
    z-index: -1;
}
 .visible-machine-catcher {
    display: block;
    width: 100%;
    max-width: 260px;
    margin: 10px auto;
    padding: 12px;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    background: white;
    color: #0F172A;
    font-weight: bold;
    text-align: center;
    outline: none;
}

.slim-executive-header {
  background: white; padding: 40px 20px 15px;
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid #E2E8F0;
}
.online-status { display: flex; align-items: center; gap: 6px; }
.status-text { font-size: 8px; font-weight: 900; color: #10B981; letter-spacing: 1px; }
.pulse-ruby { width: 6px; height: 6px; background: #10B981; border-radius: 50%; box-shadow: 0 0 8px rgba(16, 129, 100, 0.6); animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

.header-title { color: #0F172A; font-size: 20px; font-weight: 900; }
.role-chip { background: #0F172A; color: white; padding: 6px 12px; border-radius: 10px; display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 800; }

.ledger-body { padding: 20px 15px; margin-top: -10px;}
.tech-plate { background: white; border-radius: 12px; padding: 25px 15px 15px; border: 1px solid #E2E8F0; position: relative; box-shadow: 0 4px 10px rgba(0,0,0,0.02); margin-bottom: 25px; }
.plate-tab { position: absolute; top: -10px; left: 15px; background: #DC2626; color: white; padding: 2px 10px; font-size: 8px; font-weight: 900; border-radius: 4px; }

.ops-grid { display: grid; grid-template-columns: 1fr 1.3fr; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; margin-bottom: 15px; }
.input-wrap { padding: 10px; }
.border-left { border-left: 1px solid #E2E8F0; }
.tiny-label { display: block; font-size: 7.5px; font-weight: 900; color: #94A3B8; margin-bottom: 4px; }
.compact-select, .compact-input { --color: #0F172A; font-size: 13px; font-weight: 700; height: 32px; }

.verify-action-btn { --background: #0F172A; --border-radius: 8px; height: 44px; font-weight: 800; font-size: 11px; }

.technical-divider { display: flex; align-items: center; gap: 15px; margin: 25px 0; }
.line { flex: 1; height: 1px; background: #E2E8F0; }
.technical-divider span { color: #94A3B8; font-size: 9px; font-weight: 900; }

.viewfinder { position: relative; width: 100%; max-width: 260px; height: 160px; margin: 0 auto 15px; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); cursor: pointer; background: #000; transition: 0.3s; }
.viewfinder.laser-active { border: 2px solid #DC2626; box-shadow: 0 0 20px rgba(220, 38, 38, 0.4); }

.bracket { position: absolute; width: 20px; height: 20px; border: 3px solid #DC2626; }
.top-left { top: 15px; left: 15px; border-right: 0; border-bottom: 0; }
.top-right { top: 15px; right: 15px; border-left: 0; border-bottom: 0; }
.bottom-left { bottom: 15px; left: 15px; border-right: 0; border-top: 0; }
.bottom-right { bottom: 15px; right: 15px; border-left: 0; border-top: 0; }

.scanning-laser { position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: #DC2626; box-shadow: 0 0 10px #DC2626; animation: laserSweep 2s infinite ease-in-out; }
@keyframes laserSweep { 0% { top: 15%; } 50% { top: 85%; } 100% { top: 15%; } }

.scan-trigger-hub { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 8px; width: 100%; text-align: center; }
.scan-trigger-hub ion-icon { font-size: 44px; color: white; opacity: 0.5; }
.pulse-icon { opacity: 1 !important; color: #DC2626 !important; animation: iconPulse 1s infinite; }
@keyframes iconPulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }

.hub-text { color: white; font-size: 10px; font-weight: 900; letter-spacing: 1px; }
.camera-link { font-size: 10px; font-weight: 800; width: 100%; margin-top: -5px; }
.instruction-meta { font-size: 8px; font-weight: 800; color: #94A3B8; text-align: center; margin-top: 10px; }
</style>