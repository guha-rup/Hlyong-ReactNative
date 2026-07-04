<template>
  <Master>
    <div class="technical-terminal-container">

      <header class="slim-executive-header">
        <div class="header-left">
          <div class="online-status">
            <span class="pulse-ruby"></span>
            <span class="status-text">SYSTEM ONLINE</span>
          </div>
        </div>
        <div class="header-right">
          <div class="role-chip"><span>STORE MAN</span></div>
        </div>
      </header>

      <div class="ledger-body">

        <!-- Dynamic Instruction Banner -->
        <div class="instruction-banner" :class="{ 'success-banner': currentStep === 'DONE' }">
          <ion-icon :icon="currentStep === 'DONE' ? checkmarkCircle : barcodeOutline" 
                    :class="{ 'scanning-icon': currentStep !== 'DONE' }"></ion-icon>
          <h2>{{ getInstructionText() }}</h2>
        </div>

        <!-- The Three Sections -->
        <div class="sequence-sections">
          
          <!-- Section 1: BIN -->
          <div class="scan-section" 
               :class="{ 'active-section': currentStep === 'BIN', 'completed-section': scannedBin }"
               @click="goToScanner('BIN')">
            <div class="section-icon-box">
              <ion-icon :icon="scannedBin ? checkmarkCircle : archiveOutline"></ion-icon>
            </div>
            <div class="section-content">
              <span class="section-label">01. BIN LOCATION</span>
              <span class="section-value" :class="{ 'placeholder-text': !scannedBin }">
                {{ scannedBin || 'Tap to scan Bin...' }}
              </span>
            </div>
            <div class="active-indicator" v-if="currentStep === 'BIN'">
              <span class="pulse-dot"></span>
            </div>
          </div>

          <!-- Section 2: PALLET -->
          <div class="scan-section" 
               :class="{ 'active-section': currentStep === 'PALLET', 'completed-section': scannedPallet }"
               @click="goToScanner('PALLET')">
            <div class="section-icon-box">
              <ion-icon :icon="scannedPallet ? checkmarkCircle : layersOutline"></ion-icon>
            </div>
            <div class="section-content">
              <span class="section-label">02. PALLET LOCATION</span>
              <span class="section-value" :class="{ 'placeholder-text': !scannedPallet }">
                {{ scannedPallet || 'Tap to scan Pallet...' }}
              </span>
            </div>
            <div class="active-indicator" v-if="currentStep === 'PALLET'">
              <span class="pulse-dot"></span>
            </div>
          </div>

          <!-- Section 3: PRODUCT -->
          <div class="scan-section" 
               :class="{ 'active-section': currentStep === 'PRODUCT', 'completed-section': scannedProduct }"
               @click="goToScanner('PRODUCT')">
            <div class="section-icon-box">
              <ion-icon :icon="scannedProduct ? checkmarkCircle : cubeOutline"></ion-icon>
            </div>
            <div class="section-content">
              <span class="section-label">03. PRODUCT BARCODE</span>
              <span class="section-value" :class="{ 'placeholder-text': !scannedProduct }">
                {{ scannedProduct || 'Tap to scan Product...' }}
              </span>
            </div>
            <div class="active-indicator" v-if="currentStep === 'PRODUCT'">
              <span class="pulse-dot"></span>
            </div>
          </div>

        </div>

        <!-- Submit Action Footer -->
        <div class="action-footer" v-if="currentStep === 'DONE'">
          <ion-button expand="block" class="submit-sequence-btn" @click="submitSequence">
            PROCESS TRANSFER SEQUENCE
          </ion-button>
          <ion-button expand="block" fill="clear" color="medium" class="reset-btn" @click="resetSequence">
            Reset Sequence
          </ion-button>
        </div>

      </div>
    </div>
  </Master>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { IonButton, IonIcon } from '@ionic/vue';
import { 
  barcodeOutline, checkmarkCircle, 
  archiveOutline, layersOutline, cubeOutline 
} from 'ionicons/icons';
import Master from "../layouts/Master.vue";
import pick from '@/services/pick';

export default defineComponent({
  name: "BinInformationScan",
  components: { IonButton, IonIcon, Master },

  setup() {
    const router = useRouter();

    // Load drafted scans from localStorage so data persists when returning from the scanner page
    const scannedBin = ref('');
    const scannedPallet = ref('');
    const scannedProduct = ref('');

    onMounted(() => {
      scannedBin.value = localStorage.getItem('draft_bin') || '';
      scannedPallet.value = localStorage.getItem('draft_pallet') || '';
      scannedProduct.value = localStorage.getItem('draft_product') || '';
    });

    // Auto-calculate which step is next
    const currentStep = computed(() => {
      if (!scannedBin.value) return 'BIN';
      if (!scannedPallet.value) return 'PALLET';
      if (!scannedProduct.value) return 'PRODUCT';
      return 'DONE';
    });

    const getInstructionText = () => {
      if (currentStep.value === 'BIN') return 'TAP BIN SECTION TO SCAN';
      if (currentStep.value === 'PALLET') return 'TAP PALLET SECTION TO SCAN';
      if (currentStep.value === 'PRODUCT') return 'TAP PRODUCT SECTION TO SCAN';
      return 'SEQUENCE COMPLETE';
    };

    const goToScanner = (step: string) => {
      // Redirect to the scanner page, telling it what we are looking for
      router.push({ path: '/scan-location', query: { step } });
    };

    const clearDrafts = () => {
      localStorage.removeItem('draft_bin');
      localStorage.removeItem('draft_pallet');
      localStorage.removeItem('draft_product');
      scannedBin.value = '';
      scannedPallet.value = '';
      scannedProduct.value = '';
    };

    const resetSequence = () => {
      clearDrafts();
      localStorage.removeItem("scanDatanew");
      localStorage.removeItem("scanDatanew_data");
    };

    const submitSequence = async () => {
      try {
        const response = await pick.BinNameWiseProduct(scannedBin.value);
        if (response?.response?.length > 0) {
          const sessionData = {
            bin: scannedBin.value,
            pallet: scannedPallet.value,
            product: scannedProduct.value,
            apiResponse: response.response[0]
          };

          localStorage.setItem('scanDatanew', JSON.stringify(response.response));
          localStorage.setItem('scanDatanew_data', JSON.stringify(sessionData));
          
          clearDrafts(); // Sequence successful, wipe drafts
          window.location.href = '/BinInformation';
        } else {
          alert(`Validation Failed: Bin ${scannedBin.value} is empty or invalid.`);
          resetSequence();
        }
      } catch (error) { 
        console.error(error); 
      }
    };

    return {
      barcodeOutline, checkmarkCircle, 
      archiveOutline, layersOutline, cubeOutline,
      currentStep, scannedBin, scannedPallet, scannedProduct,
      getInstructionText, goToScanner, resetSequence, submitSequence
    };
  },
});
</script>

<style scoped>
/* Paste your original styling for the Main Page here (same as your 1st code block's CSS) */
.technical-terminal-container { min-height: 100vh; background-color: #F4F7F9; padding-bottom: 40px; }
.slim-executive-header { background: white; padding: 40px 20px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; }
.online-status { display: flex; align-items: center; gap: 8px; }
.status-text { font-size: 9px; font-weight: 900; color: #10B981; letter-spacing: 1px; }
.pulse-ruby { width: 8px; height: 8px; background: #10B981; border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
.role-chip { background: #0F172A; color: white; padding: 6px 12px; border-radius: 8px; font-size: 10px; font-weight: 800; }
.ledger-body { padding: 25px 15px; }

/* Banners & Sections */
.instruction-banner { display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0F172A; color: white; border-radius: 16px; padding: 20px; margin-bottom: 25px; transition: all 0.3s ease; }
.instruction-banner.success-banner { background: #10B981; }
.instruction-banner ion-icon { font-size: 32px; margin-bottom: 8px; }
.scanning-icon { animation: slightBounce 1.5s infinite ease-in-out; }
.instruction-banner h2 { margin: 0; font-size: 12px; font-weight: 900; letter-spacing: 1.5px; }
@keyframes slightBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); color: #DC2626; } }

.sequence-sections { display: flex; flex-direction: column; gap: 15px; }
.scan-section { display: flex; align-items: center; background: white; padding: 18px 15px; border-radius: 16px; border: 2px solid transparent; box-shadow: 0 4px 6px rgba(0,0,0,0.03); position: relative; transition: all 0.25s; cursor: pointer; }
.section-icon-box { display: flex; align-items: center; justify-content: center; width: 45px; height: 45px; background: #F1F5F9; border-radius: 12px; margin-right: 15px; }
.section-icon-box ion-icon { font-size: 22px; color: #64748B; }
.section-content { display: flex; flex-direction: column; flex: 1; }
.section-label { font-size: 10px; font-weight: 900; color: #94A3B8; margin-bottom: 4px; }
.section-value { font-size: 16px; font-weight: 800; color: #0F172A; }
.placeholder-text { font-size: 12px; font-weight: 600; color: #CBD5E1; font-style: italic; }

.active-section { border-color: #0F172A; transform: scale(1.02); }
.active-section .section-icon-box { background: #0F172A; }
.active-section .section-icon-box ion-icon { color: white; }
.active-section .section-label { color: #0F172A; }
.completed-section { border-color: #10B981; background: #F0FDF4; }
.completed-section .section-icon-box { background: #D1FAE5; }
.completed-section .section-icon-box ion-icon { color: #059669; }

.active-indicator { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); }
.pulse-dot { display: block; width: 12px; height: 12px; background: #DC2626; border-radius: 50%; animation: pulse-red 1.5s infinite; }
@keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); } }
.action-footer { margin-top: 35px; }
.submit-sequence-btn { --background: #0F172A; --border-radius: 12px; font-weight: 800; font-size: 13px; letter-spacing: 1px; height: 50px; margin-bottom: 15px;}
.reset-btn { font-size: 12px; font-weight: 800; }
</style>