<template>
  <master pageTitle="Dashboard">
    <ion-card class="main-card">
      <ion-item class="no-border" @click="$router.push('Leaves')">
        <ion-icon :icon="icons.calendar" class="icon"></ion-icon>
        <ion-col>Leaves</ion-col>
      </ion-item>
    </ion-card>

    <ion-card class="main-card">
      <ion-item class="no-border" @click="$router.push('Attendance')">
        <ion-icon :icon="icons.time" class="icon"></ion-icon>
        <ion-col>Attendance</ion-col>
      </ion-item>
    </ion-card>

    <ion-card class="main-card">
      <ion-item class="no-border" @click="$router.push('Payroll')">
        <ion-icon :icon="icons.location" class="icon"></ion-icon>
        <ion-col>Payroll</ion-col>
      </ion-item>
    </ion-card>

    <ion-card class="main-card">
      <ion-item class="no-border" @click="$router.push('ExpenseClaim')">
        <ion-icon :icon="icons.calendar" class="icon"></ion-icon>
        <ion-col>Expense Claim</ion-col>
      </ion-item>
    </ion-card>
  </master>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonCard,
  IonCol,
  IonIcon,
  IonItem
} from "@ionic/vue";
import { calendar, time, location, arrow } from "ionicons/icons";

export default defineComponent({
  components: {
    IonCard,
    IonCol,
    IonIcon,
    IonItem
  },
  data() {
    return {
      icons: {
        calendar,
        time,
        location,
      }
    };
  },
  methods: {
    navigateTo(page: string) {
      // Add your navigation logic here based on the page parameter
      console.log("Navigating to " + page);
    }
  }
});
</script>

<style scoped>
ion-col {
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
  height: 16px;
  border-radius: 20px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

ion-card {
  padding: 10px;
}

ion-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
ion-item{
  height:70px;
}
.icon {
  margin-right: 10px;
  color: #bd9b36;
}

.arrow-icon {
  color: #bd9b36;
}
</style>