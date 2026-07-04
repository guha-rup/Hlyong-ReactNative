

<template>
    <master>
    <div>
          <img src="/public/scan.jpg" alt="Sample Image" @click="scan" />
    </div>
    </master>
</template>

  <script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
  import { IonButton, IonCard, IonRow, IonCol, IonInput , IonSelectOption,IonSelect} from '@ionic/vue';

  import pick from '@/services/pick';
  import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
  import { alertController } from '@ionic/vue';
  import { useRouter } from 'vue-router';
  export default defineComponent({
    components: { IonButton, IonCard, IonRow, IonCol, IonInput,IonSelectOption,IonSelect, },
    // name: 'Pack',
   
    data() {
      return {
      };
    }, 

   setup() {
    const isSupported = ref(false);
    const scannedData = ref<any>(null);
      const router = useRouter();

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
  
const response = await pick.binbarcodeDynamic('N4-01-09');

if (response && response.response) { 
  localStorage.setItem('scanData', JSON.stringify(response.response));
  router.push('/AddCount');
} else {
  console.warn('Invalid API Response or missing data:', response);
}
    return
  const granted = await requestPermissions();
  if (!granted) {
    await presentAlert('Permission Denied', 'Please grant camera permission.');
    return;
  }

  try {
    const result = await BarcodeScanner.scan();
    if (!result || !Array.isArray(result.barcodes)) {
      console.error('Unexpected scan result:', result);
      await presentAlert('Scan Failed', 'Unexpected response from scanner.');
      return;
    }

    const scannedBarcodes = result.barcodes;
    await presentAlert('Barcodes found:', JSON.stringify(scannedBarcodes));
    //  alert('Barcodes found:', scannedBarcodes);
    if (scannedBarcodes.length > 0 && scannedBarcodes[0].displayValue) {
       const scannedValue = scannedBarcodes[0].displayValue;
      // const scannedValue = "B04-01-03";
       console.log('Scanned Value:', scannedValue);
      
      const response = await pick.binbarcodeDynamic(scannedValue);
      console.log('API Response:', response);
      await presentAlert('API Response:', JSON.stringify(response));

      if (response?.data) {
        localStorage.setItem('scannedBinData', JSON.stringify(response.data));
        window.location.href = '/AddCount';
      } else {
        await presentAlert('Invalid API Response', 'No data returned from server.');
      } 
    } else {
      await presentAlert('No Barcode Found', 'No barcodes were detected. Try again.');
    }
  } catch (error: any) {
    console.error('Scan error:', error);
    await presentAlert('Error', error.message || 'Something went wrong during scanning.');
  }
};


    const requestPermissions = async () => {
      try {
        const { camera } = await BarcodeScanner.requestPermissions();
        return camera === 'granted' || camera === 'limited';
      } catch (error) {
        console.error('Permission error:', error);
        return false;
      }
    };

    const presentAlert = async (header: string, message: string) => {
      const alert = await alertController.create({
        header,
        message,
        buttons: ['OK'],
      });
      await alert.present();
    };

    return {
      isSupported,
      scan,
      scannedData,
    };
  },
    
    mounted() {
 
    },
    // methods: {

    //   scan(){
    //     this.$router.push('/AddCount')
    //     console.log('hello');
    //   },
     
     
    // },
  });
  </script>

  <style scoped>
img {
  width: 100%;
  max-width: 300px;
  margin: 20px auto;
  display: block;
  cursor: pointer;
  border: 2px dashed #ccc;
  padding: 10px;
  border-radius: 10px;
}
</style>