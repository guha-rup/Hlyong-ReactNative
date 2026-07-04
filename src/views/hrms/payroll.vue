<template>
  <master pageTitle="Pay Roll">

  </master>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonCard, IonButton, IonCol, IonIcon, IonItem } from "@ionic/vue";
import { calendar,time,location } from "ionicons/icons";

export default defineComponent({
  components: {
    IonCard,
    IonButton,
    IonCol,
    IonIcon,
    IonItem,
  },
  data() {
    return {
      icons: {
        calendar,
        time,
        location,
        
      },
    };
  },
});
</script>
<style scoped>
 
  ion-col{
    font-size: 24px;

  }

  .no-border {
    --border-width: 0;
    --border-color: transparent;
  }

  .date {
    margin: 0;
    font-size: 14px;
  }

  .shift-time,
  .location {
    margin: 0;
    font-size: 12px;
  }

  ion-card .main-card {
    padding: 16px;
    border: 3px solid #bd9b36;
    border-radius: 20px;
     box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); 
  }


  ion-card {
    padding: 10px;
  }
    ion-button {
      --background: linear-gradient(180deg, #C49531 0%, #A36626 100%);
      border-radius: 2px;
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #FFFFFF;
  }
</style>