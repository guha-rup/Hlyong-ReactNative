<script setup lang="ts">
import Master from '../layouts/Master.vue';

</script>

<template>
    <Master>
    <div class="d-flex justify-content-between" style="align-items: center;">
            <h3 class="sub-heading" style="margin-top: -5px;color: black;">View Stocks Entry</h3>
            <p class="text-danger" style="padding-top: 5px;margin-top: -18px;" @click="viewExpenditure">Add</p>

        </div>

         <IonCard class="info-card">
      <IonCardContent>
        <IonRow>
          <IonCol size="6">
            <div class="label">Warehouse Name</div>
            <div class="value">ABC Warehouse</div>
          </IonCol>
          <IonCol size="6">
            <div class="label">Rack No.</div>
            <div class="value">LOC-001</div>
          </IonCol>
          <IonCol size="6">
            <div class="label">Bin</div>
            <div class="value">NH041</div>
          </IonCol>
          <IonCol size="6">
            <div class="label">Reconciliation Year</div>
            <div class="value">2025</div>
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  <ion-card class="packing-card">
  <ion-grid>
    <ion-row>
      <ion-col size="12">
        <div class="detail-item">
          <span class="label">Part No.</span>
          <span class="separator">-</span>
          <span class="value">BA12003</span>
        </div>
        <div class="detail-item">
          <span class="label">Product Name</span>
          <span class="separator">-</span>
          <span class="value bold">CUSTOM MASHED<br>POTATOES</span>
        </div>
     <div class="detail-item">
          <span class="label">Stock Taken</span>
          <span class="separator">-</span>
          <span class="value">60</span>
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>
</ion-card>
    </Master>
    
</template>

  
  <script lang="ts">
  import { defineComponent } from 'vue';import { IonButton, IonCard, IonRow, IonCol, IonInput, IonSelectOption, IonSelect, IonCardContent } from '@ionic/vue';
   
  export default defineComponent({
    components: { IonButton, IonCard, IonRow, IonCol, IonInput,IonSelectOption,IonSelect,IonCardContent},
    // name: 'Pack',
   
    data() {
      return {
      };
    },
    mounted() {
 
    },
    methods: {

      viewExpenditure(){
        this.$router.push('/AddCount')
      }
     
     
    },
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
  --border-radius: 20px;
  padding: 8px 16px;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.label {
  font-weight: 600;
  color: #333;
}

.packed-input {
  background-color: #d2d4d6;
  color: #000;
  border-radius: 6px;
  width: 25%;
  text-align: center;
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

.label {
  color: #888;
  font-size: 14px;
  min-width: 110px;
}

.value {
  font-size: 14px;
  color: #000;
}

.bold {
  font-weight: bold;
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

</style>