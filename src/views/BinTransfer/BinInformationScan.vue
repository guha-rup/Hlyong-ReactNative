<template>
  <Master>
    <div class="terminal-scanner-root">
      
      <!-- Top Navigation -->
      <header class="scanner-nav">
        <div class="back-action" @click="$router.back()">
          <ion-icon :icon="chevronBackOutline"></ion-icon>
        </div>
        <div class="status-indicator">
          <div class="status-dot"></div>
          <span class="status-text">SENSOR READY</span>
        </div>
      </header>

      <main class="scan-workspace">
        
        <!-- ========================================== -->
        <!-- VIEW 1: SCANNER FRAME (When no result yet) -->
        <!-- ========================================== -->
        <template v-if="!scannedResult">
          <!-- Heading -->
          <div class="title-cluster">
            <span class="step-label">PROCESS STEP: {{ currentStep }}</span>
            <h1 class="main-title">Scan {{ getStepLabel }}</h1>
          </div>

          <!-- High-Tech Scanner Frame (Clickable) -->
          <div class="scanner-viz-container" @click="startCameraScan">
            <div class="scanner-frame-mini">
              <!-- Decorative Corners -->
              <div class="corner tl"></div>
              <div class="corner tr"></div>
              <div class="corner bl"></div>
              <div class="corner br"></div>
              
              <!-- Animated Laser -->
              <div class="laser-scanner">
                <div class="laser-line"></div>
                <div class="laser-glow"></div>
              </div>

              <!-- Central Icon -->
              <ion-icon :icon="getStepIcon" class="center-icon"></ion-icon>
            </div>
          </div>

          <div class="prompt-card">
            <p>Tap the frame above to open the camera</p>
            <div class="device-tag">USING CAMERA SENSOR</div>
          </div>
        </template>

        <!-- ========================================== -->
        <!-- VIEW 2: SCAN RESULT (After successful scan)-->
        <!-- ========================================== -->
        <template v-else>
          <div class="title-cluster">
            <span class="step-label">SCAN SUCCESS</span>
          </div>

          <div class="result-card">
            <!-- Product Result Format -->
            <template v-if="currentStep === 'PRODUCT'">
 <div class="info-row-inline">
               <div class="info-row">
                <span class="info-label">Name</span>
                <span class="info-value">{{ scannedResult.PRODUCT_NAME }}</span>
              </div>

               <div class="info-col right-align">
                  <span class="info-label">Part No</span>
                  <span class="info-value highlight-part">{{ scannedResult.PART_NO }}</span>
                </div>

                </div>
              <div class="info-row">
                <span class="info-label">Category</span>
                <span class="info-value">{{ scannedResult.PRODUCT_CATEGORY }}</span>
              </div>

               <div class="info-row">
        <span class="info-label">Available Qty</span>
        <span class="info-value">{{ scannedResult.AVAILABLE_QTY }}</span>
      </div>
    

              <div class="info-row">
                  <span class="info-label">QTY WAS IN HAND</span>
                  <span class="info-value">{{ scannedResult.QTY_WAS_IN_HAND }}</span>
                </div>

               
       <div class="info-row">
                  <span class="info-label">Expiry Date</span>
                  <div class="expiry-wrapper">
                  <span class="info-value">{{ scannedResult.EXPIRY_DATE === 'null' ? 'N/A' : scannedResult.EXPIRY_DATE }}</span>
                  <span v-if="daysLeft !== null" 
                        class="days-badge" 
                        :class="{'expired': daysLeft < 0, 'warning': daysLeft >= 0 && daysLeft <= 30, 'safe': daysLeft > 30}">
                    {{ daysLeft < 0 ? 'EXPIRED' : `${daysLeft} DAYS LEFT` }}
                  </span>
                  </div>
                </div>

            </template>

            <!-- Bin/Pallet Result Format -->
            <template v-else>

             <div class="location-outer-box">
                <div class="loc-row">
                  <span class="loc-label">Warehouse</span>
                  <span class="loc-value">{{ scannedResult.WAREHOUSE_NAME }}</span>
                </div>
                
                <div class="loc-divider"></div>
                
                <div class="loc-row">
                  <span class="loc-label">Bin Location</span>
                  <span class="loc-value">{{ scannedResult.BIN_NAME }}</span>
                </div>
              </div>

               <div class="info-row-inline">
              <div class="info-row">
                <span class="info-label">Product Name</span>
                <span class="info-value">{{ scannedResult.PRODUCT_NAME }}</span>
              </div>

               <div class="info-col right-align">
                  <span class="info-label">Part No</span>
                  <span class="info-value highlight-part">{{ scannedResult.PART_NO }}</span>
                </div>

              </div>

               <div class="info-row">
                <span class="info-label">Available Qty</span>
                <span class="info-value">{{ scannedResult.AVAILABLE_QTY }}</span>
              </div>

               <div class="info-row">
                <span class="info-label">Batch No</span>
                <span class="info-value">{{ scannedResult.BATCH_NO }}</span>
              </div>

            </template>
          </div>

          <!-- Actions -->
          <div class="action-buttons">
            <button class="btn-rescan" @click="rescan">RESCAN</button>
          </div>
        </template>

      </main>

      <!-- Action Footer (Only show exit when scanning) -->
      <footer class="scan-footer" v-if="!scannedResult">
        <button class="cancel-link" @click="$router.back()">
          EXIT SCANNER
        </button>
      </footer>
    </div>
  </Master>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonIcon } from '@ionic/vue';
import { 
  chevronBackOutline, archiveOutline, 
  layersOutline, cubeOutline 
} from 'ionicons/icons';
import Master from "../layouts/Master.vue";
import pick from "@/services/pick";

// Import the Capacitor Barcode Scanner Plugin
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

export default defineComponent({
  name: "BinInformationScan",
  components: { Master, IonIcon },
  setup() {
    const route = useRoute();
    const router = useRouter();

    // const currentStep = computed(() => (route.query.step as string) || 'BIN');
      const currentStep = computed(() => {
      const step = route.query.step as string;
      return step ? step.toUpperCase() : 'BIN';
    });

    // Refs to hold the scanned data before routing
    const scannedResult = ref<any>(null);
    const scannedBarcode = ref<string>("");

    const getStepLabel = computed(() => {
      if (currentStep.value === 'BIN') return 'Bin';
      if (currentStep.value === 'PALLET') return 'Pallet';
      return 'Product';
    });

    const getStepIcon = computed(() => {
      if (currentStep.value === 'BIN') return archiveOutline;
      if (currentStep.value === 'PALLET') return layersOutline;
      return cubeOutline;
    });

  const daysLeft = computed(() => {
      const rawDate = scannedResult.value?.EXPIRY_DATE;
      
      if (!rawDate || rawDate === 'null' || rawDate === 'N/A') {
        return null; 
      }

      let expDate;

      // Check if date is in DD-MM-YYYY format (e.g. 30-04-2026)
      if (/^\d{2}-\d{2}-\d{4}$/.test(rawDate)) {
        const [day, month, year] = rawDate.split('-');
        // JS Date uses 0-indexed months (0 = Jan, 1 = Feb, etc.)
        expDate = new Date(Number(year), Number(month) - 1, Number(day));
      } else {
        // Fallback for standard date formats like YYYY-MM-DD
        expDate = new Date(rawDate);
      }

      // If it's still an invalid date, stop here
      if (isNaN(expDate.getTime())) return null;

      const today = new Date();
      
      // Reset times to midnight to calculate exact full days difference
      today.setHours(0, 0, 0, 0);
      expDate.setHours(0, 0, 0, 0);
      
      const diffTime = expDate.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    });


    // 1. Function to open the mobile camera and scan
    const startCameraScan = async () => {
      // NOTE: Uncomment these lines to test in a browser without a real device camera
      //  await processScannedValue("N05-01-03");
      //  return;

      console.log('startCameraScan triggered');
      try {
        // Request camera permissions first
        const { camera } = await BarcodeScanner.requestPermissions();
        if (camera !== 'granted' && camera !== 'limited') {
          alert('Camera permission is required to scan barcodes.');
          return;
        }

        const result = await BarcodeScanner.scan();
        console.log(result, 'resultValue');
        if (result && result.barcodes && result.barcodes.length > 0) {
          const scannedValue = result.barcodes[0].rawValue;
          await processScannedValue(scannedValue);
        }
      } catch (error) {
        console.error("Camera scan failed:", error);
        alert("Failed to open camera. Are you running this on a physical mobile device?");
      }
    };

    // 2. Fetch the data based on scan
    const processScannedValue = async (val: string) => {
      val = val.trim().toUpperCase();
      console.log("Scanned Value:", val, "Current Step:", currentStep.value);
      if (!val) return;

      if (currentStep.value === 'PRODUCT') {
          alert(`FINAL SCANNED VALUE:\n${val}`);
        try {
          const response = await pick.productInformationSearch(val);
          console.log(response.response[0]);
          if (response?.response?.length > 0) {
            scannedResult.value = response.response[0];
             scannedBarcode.value = val;
          } else {
            alert('Product barcode not found in system. Please try again.');
          }
        } catch (error) {
          console.error(error);
          alert('Error verifying Product. Please check connection and try again.');
        }
      } 
      else if (currentStep.value === 'BIN' || currentStep.value === 'PALLET') {
        try {
          const response = await pick.binLocationSearch(val);
          console.log(response, 'response');
          
          if (response?.response?.length > 0) {
             // Save to ref instead of leaving page immediately
            scannedResult.value = response.response[0];
            scannedBarcode.value = val;
          } else {
            alert(`Validation Failed: ${currentStep.value} barcode not found in system.`);
          }
        } catch (error) {
          console.error(error);
          alert(`Error verifying ${currentStep.value}. Please check connection and try again.`);
        }
      }
    };

    // 3. User verifies data visually, clicks Confirm
    const confirmResult = () => {
      if (currentStep.value === 'PRODUCT') {
        localStorage.setItem(`draft_product`, scannedBarcode.value);
        localStorage.setItem(`product_details`, JSON.stringify(scannedResult.value));
      } else {
        localStorage.setItem(`draft_${currentStep.value.toLowerCase()}`, scannedBarcode.value);
      }
      router.back();
    };

    // 4. User realizes it's the wrong item, resets UI
    const rescan = () => {
      scannedResult.value = null;
      scannedBarcode.value = "";
    };

    return {
      currentStep, 
      getStepLabel, 
      getStepIcon,
      startCameraScan, 
      chevronBackOutline,
      scannedResult, 
      confirmResult, 
      rescan,
      daysLeft 
    };
  }
});
</script>

<style scoped>
/* Root Container */
.terminal-scanner-root {
  height: 100vh;
  background: radial-gradient(circle at top, #1e293b 0%, #0f172a 100%);
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
}

/* Header Navigation */
.scanner-nav {
  padding: 45px 20px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-action {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #94a3b8;
  cursor: pointer;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
}

.status-text {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #10b981;
}

/* Main Workspace */
.scan-workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 60px;
}

.title-cluster {
  text-align: center;
  margin-bottom: 40px;
}

.step-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.main-title {
  font-size: 28px;
  font-weight: 800;
  margin: 5px 0 0;
  background: linear-gradient(to right, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Scanner Frame Container */
.scanner-viz-container {
  position: relative;
  margin-bottom: 40px;
  cursor: pointer;
  transition: transform 0.2s;
}

.scanner-viz-container:active {
  transform: scale(0.95);
}

.scanner-frame-mini {
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

/* Tech Brackets */
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid #3b82f6;
}
.tl { top: -5px; left: -5px; border-right: 0; border-bottom: 0; border-radius: 8px 0 0 0; }
.tr { top: -5px; right: -5px; border-left: 0; border-bottom: 0; border-radius: 0 8px 0 0; }
.bl { bottom: -5px; left: -5px; border-right: 0; border-top: 0; border-radius: 0 0 0 8px; }
.br { bottom: -5px; right: -5px; border-left: 0; border-top: 0; border-radius: 0 0 8px 0; }

.center-icon {
  font-size: 60px;
  color: #334155;
  z-index: 1;
}

/* Modern Laser */
.laser-scanner {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 2;
}

.laser-line {
  position: absolute;
  width: 90%;
  height: 2px;
  left: 5%;
  background: #3b82f6;
  box-shadow: 0 0 15px #3b82f6, 0 0 5px #fff;
  animation: laserMove 2.5s infinite ease-in-out;
}

.laser-glow {
  position: absolute;
  width: 100%;
  height: 40px;
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.15), transparent);
  animation: laserMove 2.5s infinite ease-in-out;
}

@keyframes laserMove {
  0%, 100% { transform: translateY(20px); opacity: 0; }
  10%, 90% { opacity: 1; }
  50% { transform: translateY(180px); }
}

/* Prompt Card */
.prompt-card {
  text-align: center;
}

.prompt-card p {
  color: #94a3b8;
  font-size: 15px;
  margin-bottom: 15px;
}

.device-tag {
  display: inline-block;
  background: #1e293b;
  color: #3b82f6;
  font-size: 10px;
  font-weight: 900;
  padding: 8px 16px;
  border-radius: 8px;
  letter-spacing: 1px;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

/* ==========================================================
   Result Card Styles
========================================================== */
.result-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 350px;
  backdrop-filter: blur(10px);
}

.info-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 12px;
}
.info-row:last-child {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #21cf38;
}

.action-buttons {
display: flex;
  margin-top: 30px;
  width: 90%;
  max-width: 350px;
}

.btn-rescan {
 width: 100%;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid #3b82f6;
  color: #60a5fa;
  padding: 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.15);
}
.btn-rescan:active {
  background: rgba(255,255,255,0.05);
}

.btn-confirm {
  flex: 1.5;
  background: #3b82f6;
  border: none;
  color: #ffffff;
  padding: 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
  transition: all 0.2s;
}
.btn-confirm:active {
  transform: translateY(2px);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* Footer */
.scan-footer {
  padding: 30px;
  text-align: center;
}

.cancel-link {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
}

.location-outer-box {
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column; /* Stacks items vertically */
  gap: 12px; /* Adds space between the rows and the divider */
  box-shadow: inset 0 0 12px rgba(59, 130, 246, 0.05);
}

.loc-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Aligns text to the left */
}

.loc-label {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 4px;
}

.loc-value {
  font-size: 16px;
  font-weight: 800;
  color: #60a5fa; /* Terminal Blue */
  letter-spacing: 0.5px;
}

.loc-divider {
  width: 100%; /* Changes to a horizontal line */
  height: 1px; 
  background: rgba(59, 130, 246, 0.2);
}

.info-row-inline {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 12px;
  gap: 16px; /* Adds space between the two columns */
}

.info-col {
  display: flex;
  flex-direction: column;
  flex: 1; /* Makes both columns take up equal space */
}

.info-col.right-align {
  align-items: flex-end; /* Pushes the Part No text to the right side */
  text-align: right;
}

.highlight-part {
  color: #f59e0b; /* Bright Amber/Orange so it stands out */
  font-weight: 800;
  text-shadow: 0 0 8px rgba(245, 158, 11, 0.3); /* Subtle glow effect */
}


.highlight-qty {
  color: #10b981; /* Emerald Green to indicate availability */
  font-weight: 800;
}

.expiry-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Pushes badge to the right */
  width: 100%;
}

.days-badge {
  font-size: 10px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
}

.days-badge.safe {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981; /* Green */
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.days-badge.warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b; /* Amber/Orange */
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.days-badge.expired {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444; /* Red */
  border: 1px solid rgba(239, 68, 68, 0.3);
}
</style>