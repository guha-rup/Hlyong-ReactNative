<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Barcode Scanner</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-button expand="full" @click="scan" :disabled="!isSupported">
        Scan Barcode
      </ion-button>
      <ion-list v-if="barcodes.length > 0">
        <ion-item v-for="(barcode, index) in barcodes" :key="index">
          {{ barcode.displayValue || 'No value found' }}
        </ion-item>
      </ion-list>
      <p v-if="!isSupported">Barcode scanning is not supported on this device.</p>
    </ion-content>
  </ion-page>
</template>
 
<script>
import { defineComponent, onMounted, ref } from 'vue';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { alertController } from '@ionic/vue';
 
export default defineComponent({
  name: 'HomePage',
  setup() {
    const isSupported = ref(false);
    const barcodes = ref([]);
 
    onMounted(async () => {
      const result = await BarcodeScanner.isSupported();
      isSupported.value = result.supported;
 
      if (!isSupported.value) {
        const alert = await alertController.create({
          header: 'Unsupported Device',
          message: 'Barcode scanning is not supported on this device.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    });
 
    const scan = async () => {
      const granted = await requestPermissions();
      if (!granted) {
        await presentAlert('Permission denied', 'Please grant camera permission to use the barcode scanner.');
        return;
      }
 
      try {
        const { barcodes: scannedBarcodes } = await BarcodeScanner.scan();
        barcodes.value.push(...scannedBarcodes);
      } catch (error) {
        console.error('Error during scanning:', error);
        await presentAlert('Error', error.message || 'Scanning failed. Please try again.');
      }
    };
 
    const requestPermissions = async () => {
      const { camera } = await BarcodeScanner.requestPermissions();
      return camera === 'granted' || camera === 'limited';
    };
 
    const presentAlert = async (header, message) => {
      const alert = await alertController.create({
        header,
        message,
        buttons: ['OK'],
      });
      await alert.present();
    };
 
    return {
      isSupported,
      barcodes,
      scan,
    };
  },
});
</script>
 
<style scoped>
ion-button {
  margin: 16px;
}
</style>