<template>
    <ion-page>
      <ion-header v-if="showHeader">
        <ion-toolbar>
          <ion-title>{{ pageTitle }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <slot> </slot>
      </ion-content>
    </ion-page>
  </template>
<script lang="ts">
    import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
    import { defineComponent } from 'vue';

    export default defineComponent({
    props: {
        pageTitle: {
            type: String,
            default: "",
        },
        showHeader: {
            type: Boolean,
            default: false,
        }
    },
    components: {
        IonContent, IonHeader, IonPage, IonTitle, IonToolbar
    }
  });
  </script>