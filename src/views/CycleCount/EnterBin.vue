<template>
  <master>
    <div class="premium-container">
      
      <!-- Scan/Enter BIN Input -->
      <div class="scan-section">
        <div class="section-header" style="justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <ion-icon :icon="barcodeOutline" class="header-icon"></ion-icon>
            <div class="scan-label" style="margin-bottom: 0;">Scan or Enter Bin</div>
          </div>
          
          <!-- New Camera Trigger Button -->
          <button class="camera-trigger" @click="startCameraScan">
            <ion-icon :icon="cameraOutline"></ion-icon>
            <span>SCAN</span>
          </button>
        </div>
        
        <div class="scan-input-wrap" :class="{ 'is-focused': isFocused }">
          <ion-input
            v-model="binInput"
            class="scan-input"
            placeholder="e.g. N13-01-03"
            clear-input
            autofocus
            :disabled="isVerifying"
            @ionFocus="isFocused = true"
            @ionBlur="isFocused = false"
            @keyup.enter="handleEnterBin"
          ></ion-input>
        </div>
      </div>

      <!-- Expected BIN Card -->
      <div class="expected-section" v-if="expectedBin">
        <div class="scan-label">Expected Location</div>
        <div class="expected-card" @click="fillExpectedBin">
          <div class="expected-content">
            <ion-icon :icon="locationOutline" class="location-icon"></ion-icon>
            <span class="expected-value">{{ expectedBin }}</span>
          </div>
          <!-- <div class="tap-to-use">Tap to use</div> -->
        </div>
      </div>

    </div>

    <!-- Bottom Bar -->
    <div class="bottom-bar">
      <button class="back-btn" @click="goBack" :disabled="isVerifying">
        <ion-icon :icon="arrowBackOutline"></ion-icon>
      </button>
      <button class="enter-btn" :disabled="!binInput.trim() || isVerifying" @click="handleEnterBin">
        <span v-if="!isVerifying">Continue</span>
        <span v-else>Verifying...</span>
        
        <ion-icon v-if="!isVerifying" :icon="arrowForwardOutline" class="btn-icon"></ion-icon>
        <ion-spinner v-else name="crescent" class="btn-spinner"></ion-spinner>
      </button>
    </div>

  </master>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonInput, IonIcon, IonSpinner, toastController } from '@ionic/vue';
import { 
  barcodeOutline, 
  arrowBackOutline, 
  locationOutline, 
  arrowForwardOutline, 
  cameraOutline 
} from 'ionicons/icons';
import master from '../layouts/Master.vue';
import pick from '@/services/pick';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export default defineComponent({
  name: 'EnterBin',
  components: {
    IonInput,
    IonIcon,
    IonSpinner,
    master
  },
  data() {
    return {
      planNo: '' as string,
      warehouseId: '' as string,
      binInput: '' as string,
      expectedBin: '' as string,
      item: '' as string,
      isFocused: false as boolean,
      isVerifying: false as boolean, 
      
      barcodeOutline,
      arrowBackOutline,
      locationOutline,
      arrowForwardOutline,
      cameraOutline
    };
  },
  mounted() {
    this.planNo = (this.$route.query.planNo as string) || '';
    this.expectedBin = (this.$route.query.bin as string) || '';
    this.item = (this.$route.query.item as string) || '';
    
    this.initWarehouseContext();
  },
  methods: {
    initWarehouseContext() {
      // Fetch dynamic Warehouse ID mapped as BRANCH_NAME_SYS_ID
      const rawData = localStorage.getItem('scanData');
      if (rawData) {
        try {
          const parsed = JSON.parse(rawData);
          const data = Array.isArray(parsed) ? parsed[0] : parsed;
          this.warehouseId = data.BRANCH_NAME_SYS_ID || "1";
        } catch (e) {
          console.error("Context Error", e);
        }
      }
    },
  
    async startCameraScan() {
    // await this.handleEnterBin("N16-01-02");
    // return
      if (this.isVerifying) return;

      try {
        // Request Permissions
        const { camera } = await BarcodeScanner.requestPermissions();
        if (camera !== 'granted' && camera !== 'limited') {
          this.showToast('Camera permission is required to scan barcodes.', 'warning');
          return;
        }

        // Open Camera
        const result = await BarcodeScanner.scan();
        if (result && result.barcodes && result.barcodes.length > 0) {
          const scannedValue = result.barcodes[0].rawValue;
          this.binInput = scannedValue;
          
          // Automatically verify after scanning
          await this.handleEnterBin();
        }
      } catch (error) {
        console.error("Camera scan failed:", error);
        this.showToast("Failed to open camera. Are you running this on a physical mobile device?", "danger");
      }
    },

    async showToast(message: string, color: 'danger' | 'success' | 'warning' = 'danger') {
      const toast = await toastController.create({
        message: message,
        duration: 2500,
        position: 'top',
        color: color,
      });
      await toast.present();
    },

    fillExpectedBin() {
      if (this.isVerifying) return;
      this.binInput = this.expectedBin;
      if (navigator.vibrate) navigator.vibrate(50); 
    },
    
    goBack() {
      this.$router.back();
    },
    
    // --- Verification API Logic ---
 async handleEnterBin(manualBin?: any) {
  if (manualBin && typeof manualBin === 'string') {
    this.binInput = manualBin;
  }
  
  const bin = this.binInput.trim();
  if (!bin || this.isVerifying) return;

  this.isVerifying = true;

  try {
    const apiResponse = await pick.verifyBinScan(bin, this.warehouseId);
    console.log("API Response:", apiResponse);

    const isValid = Array.isArray(apiResponse) && apiResponse.length > 0;

    if (isValid) {
      // Success! Navigate to next page
      this.$router.push({ 
        name: 'EnterItem', 
        query: { 
          planNo: this.planNo, 
          bin: bin, 
          item: this.item 
        } 
      });
    } else {
      this.showToast('Invalid Bin Location. Please try again.', 'danger');
      this.binInput = ''; 
    }
    
  } catch (error) {
    console.error('Error:', error);
    this.showToast('Network error while verifying bin.', 'danger');
  } finally {
    this.isVerifying = false;
  }
}
  }
});
</script>

<style scoped>
/* Exact Existing CSS + Minor Additions for Camera Button & Spinner */
.premium-container { padding: 24px 20px; background-color: #f8f9fc; height: 100%; display: flex; flex-direction: column; gap: 28px; }
.section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; width: 100%; }
.header-icon { font-size: 18px; color: #2a4570; }
.scan-label { font-size: 13px; font-weight: 700; color: #64748b; letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 8px; }

/* Camera Trigger Button Style */
.camera-trigger { background: #eff6ff; color: #3a7bd5; border: 1px solid #bfdbfe; border-radius: 8px; padding: 6px 10px; display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(58, 123, 213, 0.05); }
.camera-trigger ion-icon { font-size: 16px; }
.camera-trigger:active { transform: scale(0.95); background: #e0f2fe; }

.scan-input-wrap { background: #ffffff; border-radius: 16px; border: 2px solid transparent; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04); transition: all 0.3s ease; overflow: hidden; }
.scan-input-wrap.is-focused { border-color: #3a7bd5; box-shadow: 0 8px 24px rgba(58, 123, 213, 0.15); transform: translateY(-2px); }
.scan-input { --padding-start: 16px; --padding-end: 16px; --padding-top: 16px; --padding-bottom: 16px; font-size: 18px; font-weight: 600; color: #1e293b; width: 100%; }

.expected-card { background: #ffffff; border-radius: 14px; padding: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03); border: 1px solid #e2e8f0; cursor: pointer; transition: all 0.2s ease; }
.expected-card:active { transform: scale(0.98); background: #f1f5f9; }
.expected-content { display: flex; align-items: center; gap: 10px; }
.location-icon { font-size: 20px; color: #3a7bd5; background: #eff6ff; padding: 8px; border-radius: 10px; }
.expected-value { font-size: 16px; font-weight: 700; color: #0f172a; letter-spacing: 0.5px; }
.tap-to-use { font-size: 12px; font-weight: 600; color: #3a7bd5; background: #eff6ff; padding: 6px 12px; border-radius: 20px; }

.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; display: flex; align-items: center; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-top: 1px solid rgba(0, 0, 0, 0.05); padding: 16px 20px calc(16px + env(safe-area-inset-bottom)); gap: 16px; z-index: 100; box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.04); }
.back-btn { background: #ffffff; color: #475569; border: 1px solid #e2e8f0; border-radius: 14px; font-size: 22px; width: 54px; height: 54px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02); transition: all 0.2s ease; }
.back-btn:active { background: #f1f5f9; transform: scale(0.95); }
.enter-btn { flex: 1; background: linear-gradient(135deg, #3a5a8c 0%, #213a60 100%); color: #ffffff; border: none; border-radius: 14px; font-size: 16px; font-weight: 600; height: 54px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(33, 58, 96, 0.3); transition: all 0.2s ease; }
.enter-btn:disabled { background: #cbd5e1; box-shadow: none; cursor: not-allowed; color: #94a3b8; }
.enter-btn:not(:disabled):active { transform: scale(0.98); box-shadow: 0 2px 8px rgba(33, 58, 96, 0.2); }

/* Spinner for Loading State */
.btn-spinner { width: 20px; height: 20px; color: white; }
</style>