<template>
  <Master>
    <div class="technical-terminal-container" @click="focusHiddenInput">
      <header class="slim-executive-header">
        <div class="header-left">
          <div class="online-status">
            <span class="pulse-ruby"></span>
            <span class="status-text">SYSTEM ACTIVE</span>
          </div>
        </div>
        <div class="header-right">
          <div class="role-chip"><span>STORE MAN</span></div>
        </div>
      </header>

      <div class="ledger-body">
        <!-- Instruction Banner -->
        <div class="instruction-banner" :class="{ 'success-banner': currentStep === 'DONE' }">
          <ion-icon :icon="currentStep === 'DONE' ? checkmarkCircle : barcodeOutline" 
                    :class="{ 'scanning-icon': currentStep !== 'DONE' }"></ion-icon>
          <h2>{{ getInstructionText() }}</h2>
        </div>

        <div class="sequence-sections">
          <!-- Section 1: BIN -->
          <div class="scan-section" 
               :class="{ 'active-section': currentStep === 'BIN', 'completed-section': scannedBin }"
               @click.stop="goToScanner('BIN')">
            <div class="section-icon-box">
              <ion-icon :icon="scannedBin ? checkmarkCircle : archiveOutline"></ion-icon>
            </div>
            <div class="section-content">
              <span class="section-label">01. BIN LOCATION</span>
              <span class="section-value" :class="{ 'placeholder-text': !scannedBin }">
                {{ scannedBin || 'Tap to scan Bin location ' }}
              </span>
            </div>
            <div class="active-indicator" v-if="currentStep === 'BIN' && !scannedBin">
              <span class="pulse-dot"></span>
            </div>
          </div>

          <!-- Section 2: PALLET -->
          <div class="scan-section" 
               :class="{ 'active-section': currentStep === 'PALLET', 'completed-section': scannedPallet }"
               @click.stop="goToScanner('PALLET')">
            <div class="section-icon-box">
              <ion-icon :icon="scannedPallet ? checkmarkCircle : layersOutline"></ion-icon>
            </div>
            <div class="section-content">
              <span class="section-label">02. PALLET LOCATION</span>
              <span class="section-value" :class="{ 'placeholder-text': !scannedPallet }">
                {{ scannedPallet || 'Tap to scan Pallet Location ' }}
              </span>
            </div>
            <div class="active-indicator" v-if="currentStep === 'PALLET' && !scannedPallet">
              <span class="pulse-dot"></span>
            </div>
          </div>

          <!-- Section 3: PRODUCT -->
          <div class="scan-section" 
               :class="{ 'active-section': currentStep === 'PRODUCT', 'completed-section': scannedProduct }"
               @click.stop="goToScanner('PRODUCT')">
            <div class="section-icon-box">
              <ion-icon :icon="scannedProduct ? checkmarkCircle : cubeOutline"></ion-icon>
            </div>
            <div class="section-content">
              <span class="section-label">03. PRODUCT BARCODE</span>
              <span class="section-value" :class="{ 'placeholder-text': !scannedProduct }">
                {{ scannedProduct || 'Tap to scan Product barcode' }}
              </span>
            </div>
            <div class="active-indicator" v-if="currentStep === 'PRODUCT' && !scannedProduct">
              <span class="pulse-dot"></span>
            </div>
          </div>
        </div>

        <!-- Submit Action Footer -->
        <div class="action-footer" v-if="currentStep === 'DONE'">
          <ion-button expand="block" class="submit-sequence-btn" @click.stop="submitSequence">
            PROCESS TRANSFER SEQUENCE
          </ion-button>
          <ion-button expand="block" fill="clear" color="medium" class="reset-btn" @click.stop="resetSequence">
            Reset Sequence
          </ion-button>
        </div>

        <!-- Hidden input for hardware scanning while on this page -->
        <input ref="machineInputCatcher" type="text" class="hidden-machine-catcher" 
               @keyup.enter="handleMachineScan" @blur="refocusIfActive" autofocus />
      </div>
    </div>
  </Master>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import { IonButton, IonIcon } from '@ionic/vue';
import { barcodeOutline, checkmarkCircle, archiveOutline, layersOutline, cubeOutline } from 'ionicons/icons';
import Master from "../layouts/Master.vue";
import pick from '@/services/pick';

export default defineComponent({
  name: "TransferMain",
  components: { IonButton, IonIcon, Master },
  setup() {
    const router = useRouter();
    const machineInputCatcher = ref<HTMLInputElement | null>(null);

    const scannedBin = ref('');
    const scannedPallet = ref('');
    const scannedProduct = ref('');

    const currentStep = computed(() => {
      if (!scannedBin.value) return 'BIN';
      if (!scannedPallet.value) return 'PALLET';
      if (!scannedProduct.value) return 'PRODUCT';
      return 'DONE';
    });

    

    onMounted(() => {
      // Load from storage when returning from scan page
      scannedBin.value = localStorage.getItem('draft_bin') || '';
      scannedPallet.value = localStorage.getItem('draft_pallet') || '';
      scannedProduct.value = localStorage.getItem('draft_product') || '';
      focusHiddenInput();
    });

    const getInstructionText = () => {
      if (currentStep.value === 'BIN') return 'SCAN OR TAP BIN';
      if (currentStep.value === 'PALLET') return 'SCAN OR TAP PALLET';
      if (currentStep.value === 'PRODUCT') return 'SCAN OR TAP PRODUCT';
      return 'SEQUENCE COMPLETE';
    };

    const goToScanner = (step: string) => {
      router.push({ path: '/BinInformationScan', query: { step } });
    };

  const handleMachineScan = async (event: any) => {
      const val = event.target.value?.trim().toUpperCase();
      if (val) {
        if (currentStep.value === 'BIN') { 
          scannedBin.value = val; 
          localStorage.setItem('draft_bin', val); 
        }
        else if (currentStep.value === 'PALLET') { 
          scannedPallet.value = val; 
          localStorage.setItem('draft_pallet', val); 
        }
        else if (currentStep.value === 'PRODUCT') { 
          try {
            const response = await pick.productInformationSearch(val);
            if (response?.response?.length > 0) {
              scannedProduct.value = val; 
              localStorage.setItem('draft_product', val);
              localStorage.setItem(`product_details`, JSON.stringify(response.response[0]));
            } else {
              alert(`Validation Failed: Product Barcode ${val} not found.`);
            }
          } catch (error) {
            console.error(error);
            alert("API Error validating Product Barcode.");
          }
        }
        event.target.value = ""; // Clear for next scan
      }
    };

    const focusHiddenInput = () => {
      if (currentStep.value !== 'DONE') nextTick(() => machineInputCatcher.value?.focus());
    };

    const refocusIfActive = () => {
      if (currentStep.value !== 'DONE') setTimeout(() => machineInputCatcher.value?.focus(), 150);
    };

    const resetSequence = () => {
      scannedBin.value = ''; scannedPallet.value = ''; scannedProduct.value = '';
      localStorage.removeItem('draft_bin'); localStorage.removeItem('draft_pallet'); localStorage.removeItem('draft_product');
      localStorage.removeItem("scanDatanew"); localStorage.removeItem("scanDatanew_data");
    };

    const submitSequence = async () => {
      try {
        const response = await pick.BinNameWiseProduct(scannedBin.value);
        if (response?.response?.length > 0) {
          const sessionData = { bin: scannedBin.value, pallet: scannedPallet.value, product: scannedProduct.value, apiResponse: response.response[0] };
          localStorage.setItem('scanDatanew', JSON.stringify(response.response));
          localStorage.setItem('scanDatanew_data', JSON.stringify(sessionData));
          resetSequence(); // Clear drafts
          window.location.href = '/BinInformation';
        } else {
          alert(`Validation Failed: Bin ${scannedBin.value} is empty.`);
          resetSequence();
        }
      } catch (error) { console.error(error); }
    };

    return {
      barcodeOutline, checkmarkCircle, archiveOutline, layersOutline, cubeOutline,
      machineInputCatcher, currentStep, scannedBin, scannedPallet, scannedProduct,
      getInstructionText, focusHiddenInput, refocusIfActive, goToScanner, handleMachineScan, resetSequence, submitSequence
    };

    
  }
});
</script>

<style scoped>
/* Your Existing CSS Styles Here */
.technical-terminal-container { min-height: 100vh; background-color: #F4F7F9; padding-bottom: 40px; cursor: pointer; }
.hidden-machine-catcher { position: fixed; top: -1000px; left: -1000px; opacity: 0; }
.slim-executive-header { background: white; padding: 40px 20px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E2E8F0; }
.online-status { display: flex; align-items: center; gap: 8px; }
.status-text { font-size: 9px; font-weight: 900; color: #10B981; letter-spacing: 1px; }
.pulse-ruby { width: 8px; height: 8px; background: #10B981; border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
.role-chip { background: #0F172A; color: white; padding: 6px 12px; border-radius: 8px; font-size: 10px; font-weight: 800; }
.ledger-body { padding: 25px 15px; }
.instruction-banner { display: flex; flex-direction: column; align-items: center; background: #0F172A; color: white; border-radius: 16px; padding: 20px; margin-bottom: 25px; text-align: center; }
.instruction-banner.success-banner { background: #10B981; }
.instruction-banner h2 { margin: 0; font-size: 12px; font-weight: 900; letter-spacing: 1.5px; }
.sequence-sections { display: flex; flex-direction: column; gap: 15px; }
.scan-section { display: flex; align-items: center; background: white; padding: 18px 15px; border-radius: 16px; position: relative; transition: 0.25s; border: 2px solid transparent; box-shadow: 0 4px 6px rgba(0,0,0,0.03); }
.section-icon-box { width: 45px; height: 45px; background: #F1F5F9; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 15px; }
.section-icon-box ion-icon { font-size: 22px; color: #64748B; }
.section-label { font-size: 10px; font-weight: 900; color: #94A3B8; display: block; }
.section-value { font-size: 16px; font-weight: 800; color: #0F172A; }
.active-section { border-color: #0F172A; }
.completed-section { border-color: #10B981; background: #F0FDF4; }
.pulse-dot { width: 12px; height: 12px; background: #DC2626; border-radius: 50%; animation: pulse-red 1.5s infinite; position: absolute; right: 20px; }
@keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); } 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); } }
.submit-sequence-btn { --background: #0F172A; --border-radius: 12px; font-weight: 800; height: 50px; margin-top: 20px; }
</style>