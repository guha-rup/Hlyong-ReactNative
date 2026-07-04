<template>
  <master pageTitle="Home">
    <ion-grid>
      <ion-row>
        <ion-col size="6">
          <ion-card class="customer">
            <ion-card-header>
              <ion-card-title>
                <ion-icon :icon="icons.people"></ion-icon><br/>
                Customer
              </ion-card-title>
            </ion-card-header>
          </ion-card>
        </ion-col>
        <ion-col size="6">
          <ion-card class="salesOrder" @click="$router.push({name : 'SalesOrder'})">
            <ion-card-header>
              <ion-card-title>
                <ion-icon :icon="icons.bagCheck"></ion-icon><br/>
                Sales Order
              </ion-card-title>
            </ion-card-header>
          </ion-card>
        </ion-col>
        <ion-col size="6">
          <ion-card class="quotation" @click="$router.push({name : 'Quotations'})">
            <ion-card-header>
              <ion-card-title>
                <ion-icon :icon="icons.documentText"></ion-icon><br/>
                Quotation
              </ion-card-title>
            </ion-card-header>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
  </master>
</template>

<script lang="ts">
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonIcon
} from "@ionic/vue";
import { defineComponent } from "vue";
import {people, bagCheck, documentText} from 'ionicons/icons';

export default defineComponent({
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonIcon
  },
  data() {
    return {
      icons: {
        people: people,
        bagCheck: bagCheck,
        documentText: documentText
      }
    }
  },

 
});
</script>

<style scoped>
ion-card {
  border-radius: 10px;
  box-sizing: border-box;
  height: 100px;
  top: 10px;
}
ion-card-title {
  position: absolute;
  height: 18px;
  top: 30px;
  left: 25%;
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 18px;
  text-align: center;
}
ion-card.customer {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(176, 32, 0, 0.2) 100%
  );
  border: 1px solid rgba(207, 103, 80, 0.5);
}
ion-card.customer ion-card-title {
  color: #CF6750;
}
ion-card.salesOrder {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(0, 57, 169, 0.2) 100%
  );
  border: 1px solid rgba(77, 119, 203, 0.5);
}
ion-card.salesOrder ion-card-title {
  color: #4D77CB;
}
ion-card.quotation {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(88, 0, 142, 0.2) 100%
  );
  border: 1px solid rgba(145, 77, 187, 0.5);
}
ion-card.quotation ion-card-title {
  color: #914DBB;
}
</style>
