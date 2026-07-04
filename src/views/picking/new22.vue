<template>
    <master>
      <h3 class="sub-heading" style="margin-top: -4px;">Scan Product</h3>
      <ion-page>
        <div>
       
          <div class="product-details" style="margin-top: 180px;">
          <p class="product-name">{{ data?.PRODUCT_NAME }} </p>
          <p class="error-text" style="color:#ff0000;margin-top: 5px;">Wrong Product!</p>
          <p class="instruction-text" style="color:#bfbfbd;margin-top: 5px;">Please Scan The Right Product</p>
        </div>
  
        <div class="warehouse-details" style="margin-top: 20px;">
            <div class="detail-row" >
              <span class="label"style="margin-top: 20px;color:#bfbfbd;" >Warehouse</span>
              <span class="value" style="margin-left: 120px;">Downtown</span>
            </div>
            <div class="detail-row">
              <span class="label" style="color:#bfbfbd ;">Unit No.</span>
              <span class="value"style="margin-left: 220px;">3</span>
            </div>
            <div class="detail-row">
              <span class="label"style="color:#bfbfbd ;" >Floor No.</span>
              <span class="value"style="margin-left: 212px;">5</span>
            </div>
            <div class="detail-row">
              <span class="label" style="color:#bfbfbd ;">Rack No.</span>
              <span class="value"style="margin-left: 205px;">32</span>
            </div>
          </div>
          <div class="product-description" style="margin-top: 10px;">
            <p>Basic American Instant Potato Granules</p>
          </div>
            <ion-button
              class="btn btn-danger"
              style="margin-top: 10px; border-radius: 15px;"
              type="button"
            
            >
              Done
            </ion-button>
       
        </div>
      </ion-page>
    </master>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { IonButton, IonCard, IonRow, IonCol, IonInput } from '@ionic/vue';
  import pick from '@/services/pick';
  
  export default defineComponent({
    components: { IonButton, IonCard, IonRow, IonCol, IonInput },
    name: 'Pack',
   
    data() {
      return {
        data: null,
      };
    },
    mounted() {
      const storedData = localStorage.getItem('originalqrcodedata');
      if (storedData) {
        try {
          this.data = JSON.parse(storedData); // Assign parsed data to the reactive property
          console.log(this.data, 'Parsed data');
        } catch (error) {
          console.error('Error parsing data from localStorage:', error);
        }
      } else {
        console.error('No data found in localStorage for originalqrcodedata');
      }
   
     
    },
    methods: {
    
    },
  });
  </script>
  