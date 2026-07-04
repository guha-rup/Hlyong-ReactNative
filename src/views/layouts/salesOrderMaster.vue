<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button color="primary"></ion-menu-button>
          </ion-buttons>

          <ion-row>
            <ion-col size="3"><ion-img :src="logoImage" alt="GMC Logo"></ion-img></ion-col>
            <!-- <ion-col size="3"><ion-title>{{ pageTitle }}</ion-title></ion-col> -->
            <ion-col size="5"></ion-col>
            <ion-col size="4">
              <ion-row style="margin: 10px 0px 0px 0px;">
                <ion-col>
                  <ion-icon :icon="icons.notifications"></ion-icon>
                </ion-col>
                <ion-col>
                  <ion-icon :icon="icons.cart"></ion-icon>
                </ion-col>
                <ion-col>
                  <ion-icon @click="onClickLogout" :icon="icons.personCircle"></ion-icon>
                </ion-col>
              </ion-row>
            </ion-col>
          </ion-row>
        </ion-toolbar>
      </ion-header>
      <!-- <ion-content class="page" :fullscreen="true"> -->
      <ion-content :fullscreen="true" style="height:100%">
        <h2 v-if="pageTitleDisabled" class="disabled">{{ pageTitle }}</h2>
        <h2 v-else>{{ pageTitle }}</h2>
        <slot> </slot>
      </ion-content>
    </ion-page>
  </template>
<script lang="ts">
import { IonContent, IonHeader, IonFooter, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonImg, IonRow, IonCol, IonIcon } from '@ionic/vue';
import { defineComponent } from 'vue';
import {
  notifications,
  cart,
  personCircle,
} from "ionicons/icons";

export default defineComponent({
    props: {
      pageTitle: {
        type: String,
        default: "Home",
      },
      pageTitleDisabled: {
        type: Boolean,
        default: false,
      }
    },
    components: {
        IonContent, IonHeader, IonFooter, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonImg, IonRow, IonCol, IonIcon
    },
    computed: {
      logoImage: () => {
        return "https://gmc.demotemplate.in/dist-assets/images/logo.png";
        // return require("../assets/logo.png");
      },
    },
    data() {
      return {
        icons: {
          notifications: notifications,
          cart: cart,
          personCircle: personCircle,
        }
      }
    },
    methods: {
      onClickLogout() {
        const user = localStorage.getItem('permit');
        if (user) {
          localStorage.removeItem("permit");
          this.$router.push('/login');
        } 
      }
    }
  });
  </script>
  <style scoped>
  h2.disabled {
    margin-left: 4%;
    left: 4%;
    color: #A0A0A0;
  }
  .logo-image {
    width: 30%;
  }
  </style>