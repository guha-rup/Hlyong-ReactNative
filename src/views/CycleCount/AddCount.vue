<template>
  <master>

    <div class="d-flex justify-content-between" style="align-items: center;">
      <h3 class="sub-heading" style="margin-top: -5px; color: black;">Add Stocks Entry</h3>
      <p class="text-danger" style="padding-top: 5px; margin-top: -18px;" @click="viewExpenditure">View</p>
    </div>

    <IonCard class="info-card">
      <IonCardContent>
        <IonRow>
          <IonCol size="6">
            <div class="label">Warehouse Name</div>
            <div class="value">{{ scannedData.WAREHOUSE_NAME }}</div>
          </IonCol>
          <IonCol size="6">
            <div class="label">Rack No.</div>
            <div class="value">{{ scannedData.RACK_NO }}</div>
          </IonCol>
          <IonCol size="6">
            <div class="label">Bin</div>
            <div class="value">{{ scannedData.BIN_NO }}</div>
          </IonCol>
          <IonCol size="6">
            <div class="label">Reconciliation Year</div>
            <div class="value">{{ scannedData.year || '2025' }}</div>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>

    <div>
      <IonButton class="add-product-btn" @click="handleAddProduct">Add Product</IonButton>
    </div>

    <!-- Product List -->
    <ion-card class="packing-card" v-for="(product, index) in scannedData.DETAILS" :key="index">
      <ion-grid>
        <ion-row>
          <ion-col size="12">
            <div class="detail-item">
              <span class="label">Part No.</span>
              <span class="separator">-</span>
              <span class="value">{{ product.PART_NO }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Product Name</span>
              <span class="separator">-</span>
              <span class="value bold">{{ product.PRODUCT_NAME }}</span>
            </div>
            <div class="detail-item input-row">
              <span class="label">Quantity</span>
              <span class="separator">-</span>
              <ion-input
                type="number"
                v-model="product.inputQty"
                class="packed-input"
                inputmode="decimal"
              ></ion-input>
            </div>
            <div class="detail-item input-row">
              <span class="label">UoM</span>
              <span class="separator">-</span>
              <ion-select v-model="product.selectedUom" interface="popover" class="uom-select" placeholder="Select">
                <ion-select-option value="TUB">TUB</ion-select-option>
                <ion-select-option value="BOX">BOX</ion-select-option>
                <ion-select-option :value="scannedData.UOM">{{ scannedData.UOM }}</ion-select-option>
              </ion-select>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card>

  
    <div>
      <IonButton class="submit-tbtn" @click="handleSubmit">Submit</IonButton>
    </div>
  </master>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  IonButton,
  IonCard,
  IonRow,
  IonCol,
  IonInput,
  IonSelectOption,
  IonSelect,
  IonCardContent
} from '@ionic/vue';
import { useRoute } from 'vue-router';
import master from '../layouts/Master.vue';

export default defineComponent({
  name: 'AddCount',
  components: {
    IonButton,
    IonCard,
    IonRow,
    IonCol,
    IonInput,
    IonSelectOption,
    IonSelect,
    IonCardContent,
    master
  },
  data() {
    return {
      scannedData: {
        WAREHOUSE_NAME: '',
        BIN_NO: '',
        RACK_NO: '',
        year: new Date().getFullYear(),
        UOM: '',
        DETAILS: [] as any[]
      }
    };
  },

  mounted() {
  const rawData = localStorage.getItem('scanData');
  console.log('LocalStorage Data:', rawData);

  if (rawData) {
    try { 
      const parsed = JSON.parse(rawData);
      console.log('Parsed full response:', parsed);

      if (Array.isArray(parsed) && parsed.length > 0) {
        const item = parsed[0];

         item.DETAILS = item.DETAILS.map((product: any) => ({
            ...product,
            inputQty: '',
            selectedUom: ''
          }));

        this.scannedData = {
            ...item,
            year: new Date().getFullYear()
          };
           console.log('Assigned scannedData:', this.scannedData);
      } else {
        console.warn('No valid response array found');
      }
    } catch (err) {
      console.error('Error parsing scanData from localStorage:', err);
    }
  } else {
    console.warn('No scanData found in localStorage');
  }
},

  methods: {
    viewExpenditure() {
      this.$router.push('/ViewCount');
    },
      handleAddProduct() {
      console.log('Add Product clicked');
    },
    handleSubmit() {
      console.log('Submitting product data:', this.scannedData.DETAILS);
    }
  }
});
</script>

<style scoped>
.info-card {
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: none;
}

.label {
  font-size: 14px;
  color: #888;
}

.value {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-top: 4px;
  margin-left: 25px;
}

.add-product-btn {
  --background: red;
  --color: white;
  --border-radius: 10px;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  width: 100px;
  height: 30px;
  margin-left: auto;
  margin-right: 20px;
  margin-top: 10px;
}

.submit-tbtn {
  --background: red;
  --color: white;
  --border-radius: 20px;
  padding: 8px 16px;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.packed-input {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 6px 10px;
  text-align: center;
  width: 150px;
}

.uom-select {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 6px 10px;
  min-width: 100px;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.separator {
  margin: 0 8px;
  color: #888;
}

.bold {
  font-weight: bold;
}
</style>
