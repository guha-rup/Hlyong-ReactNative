<template>
  <master>
      <ion-card class="confirmation-card">
          <ion-text class="heading text-primary mt-1 mb-2">Local Expenses</ion-text>
          <ion-item class="input-field">
              <ion-select label="Expense For" label-placement="floating" class="select">
                  <ion-select-option value="apple">Customer Meeting</ion-select-option>
              </ion-select>
          </ion-item>
          <ion-item class="input-field">
              <ion-select label="Claim type" label-placement="floating" class="select">
                  <ion-select-option value="apple">Traveling</ion-select-option>
              </ion-select>
          </ion-item>
          <ion-item class="input-field">
              <ion-select label="Local Expense type" label-placement="floating" class="select">
                  <ion-select-option value="apple">Traveling</ion-select-option>
              </ion-select>
          </ion-item>

          <ion-item class="input-field">
              <ion-input label="Expense From Date" labelPlacement="stacked" type="date"></ion-input>
          </ion-item>
          <ion-item class="input-field">
              <ion-input label="Expense To Date" labelPlacement="stacked" type="date"></ion-input>
          </ion-item>
          <ion-item class="input-field">
              <ion-input label="Amount" labelPlacement="stacked" placeholder="Enter Amount"></ion-input>
          </ion-item>
          <ion-item class="input-field">
              <ion-select label="Mode of Payment" label-placement="floating" class="select">
                  <ion-select-option value="apple">Online</ion-select-option>
                  <ion-select-option value="apple">Cash</ion-select-option>
              </ion-select>
          </ion-item>
          <ion-item class="input-field">
              <ion-select label="Currency" label-placement="floating" class="select">
                  <ion-select-option value="apple">Singapore Dollar</ion-select-option>
              </ion-select>
          </ion-item>
          <ion-item class="input-field">
              <ion-input label="Expense Details" labelPlacement="stacked" placeholder="Enter Details"></ion-input>
          </ion-item>

          <ion-button class="btn mt-2">Save</ion-button>
      </ion-card>
  </master>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { IonCard, IonItem, IonSelectOption, IonSelect, IonText, IonInput,IonButton } from '@ionic/vue';
export default defineComponent({
  name: 'claims',
  components: {
      IonCard, IonItem, IonSelectOption, IonSelect, IonText, IonInput,IonButton
  }

})
</script>