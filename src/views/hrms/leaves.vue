<template>
  <master>
  <ion-segment value="Leave Application" v-model="selectedtab">
      <ion-segment-button value="Leave Application">
          <ion-label>Leave Application</ion-label>
      </ion-segment-button>
      <ion-segment-button value="segment">
          <ion-label>Application Status</ion-label>
      </ion-segment-button>
  </ion-segment>
     
 
          <ion-card class="confirmation-card"  v-if="selectedtab == 'Leave Application'">
          <ion-text class="heading text-primary mt-1 mb-2">
              Leave Application
          </ion-text>
          <ion-item class="input-field">
              <ion-input label="From Date" labelPlacement="stacked" placeholder="Enter Date" type="date"></ion-input>
          </ion-item>
          <ion-item class="input-field">
              <ion-input label="To Date" labelPlacement="stacked" placeholder="Enter Date" type="date"></ion-input>
          </ion-item>
          <ion-item class="input-field">
              <ion-select label="Leave Type" label-placement="floating" class="select">
                  <ion-select-option value="apple">Casual</ion-select-option>
                  <ion-select-option value="banana">Earned</ion-select-option>
              </ion-select>
          </ion-item>
          <ion-item class="input-field">
              <ion-input label="Total Leave Days" labelPlacement="stacked" placeholder="Enter Days"></ion-input>
          </ion-item>
          <ion-item class="input-field">
              <ion-input label="Reason" labelPlacement="stacked" placeholder="Enter Days"></ion-input>
          </ion-item>
          <ion-button class="btn mt-2" @click="() => $router.push('/dashboard')">Apply</ion-button>
      </ion-card>
    

      <ion-card class="confirmation-card"  v-if="selectedtab == 'segment'">
          <ion-text class="heading text-primary mt-1 mb-2">
            Application Status
          </ion-text>
          <ion-card class="order-car d-flex space-between">
              <ion-label class="flex-coloumn text-left">
                  <ion-text class="company-name text-dark">Sick Leave
                  </ion-text>       
                      <ion-text class="sub-text ">15.02.23</ion-text>
                      <ion-text class="sub-text">Total Leave Days</ion-text>                  
              </ion-label>
              <ion-label class="flex-coloumn text-right">

                  
                      <ion-text class="order-status-green">Approved</ion-text>

                      <ion-text class="sub-text mt-1">20.02.23</ion-text>
                      <ion-text class="sub-text">5</ion-text>

                 
              </ion-label>
          </ion-card>
          <ion-card class="order-car d-flex space-between">
              <ion-label class="flex-coloumn text-left">
                  <ion-text class="company-name text-dark d-flex">Sick Leave 
                  </ion-text>
     
                      <ion-text class="sub-text ">15.02.23</ion-text>
                      <ion-text class="sub-text">Total Leave Days</ion-text>
            
              </ion-label>
              <ion-label class="flex-coloumn text-right">

                 
                      <ion-text class="order-status-red">Rejected</ion-text>
                      <ion-text class="sub-text mt-1">20.02.23</ion-text>
                      <ion-text class="sub-text">5</ion-text>

                  
              </ion-label>
          </ion-card>
      </ion-card>

     

      
          
     
</master>

</template>

<script lang="ts">
import { IonLabel, IonSegment, IonSegmentButton,IonText,IonSelectOption,IonSelect,IonInput, IonButton,IonCard,IonItem } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'myleave',
  components: { IonLabel, IonSegment, IonSegmentButton,IonText,IonSelectOption,IonSelect,IonInput,IonButton,IonCard,IonItem },
  data() {
      return {
          selectedtab: 'Leave Application'
      }
  }
});
</script>

<style>
ion-slides{
  width:100%
}
ion-segment-button::part(indicator-background) {
  background: #2ea3f2;
}

/* Material Design styles */
ion-segment-button.md::part(native) {
  color: #000;
}

.segment-button-checked.md::part(native) {
  color: #2ea3f2;
}

ion-segment-button.md::part(indicator-background) {
  height: 4px;
}

/* iOS styles */
ion-segment-button.ios::part(native) {
  color: #2ea3f2;
}

.segment-button-checked.ios::part(native) {
  color: #fff;
}

ion-segment-button.ios::part(indicator-background) {
  border-radius: 20px;
}
</style>