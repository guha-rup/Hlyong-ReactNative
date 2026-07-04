<template>
   
 <ion-menu contentId="main-content">
     <ion-header>
         <ion-toolbar>
             <ion-title>
                 <ion-img src="/logo.png" class="logo"></ion-img>
             </ion-title>
         </ion-toolbar>
     </ion-header>
     <ion-content>
    
             <!-- <ion-list class="list">
                 <ion-item lines="none" v-for="route in routes" :key="route.id" class="menu-list">
                     <ion-label @click="$router.push(`${route.path}`)">
                         <ion-row class="d-flex space-between">
                             <ion-col size="11"> <i :class="route.icon" style="margin-right:10px"></i>{{ route.name }} </ion-col>
                             <ion-col size="1"><i class="fa fa-solid fa-chevron-right left-icon"></i></ion-col>
                         </ion-row>

                     </ion-label>
                 </ion-item>
             </ion-list> -->
       
     </ion-content>
 </ion-menu>

 <ion-page class="ion-page" id="main-content">
     <ion-header>
         <ion-toolbar>
             <ion-buttons slot="start">
                 <ion-menu-button></ion-menu-button>
             </ion-buttons>
             <ion-grid>
                 <ion-row class="header">
                     <ion-col size="6">
                         <ion-title class="logoTitle">
                             <ion-img src="/logo.png" class="logo"></ion-img>
                         </ion-title>
                     </ion-col>
                     <ion-col size="4"></ion-col>
                     <ion-col size="2">
                         <i class="fa fa-bell mr-1"></i>
                         <i class="fa-solid fa-circle-user" @click="this.$router.push('/Profile')"></i>
                     </ion-col>
                 </ion-row>
             </ion-grid>


         </ion-toolbar>
     </ion-header>
     <ion-content class="ion-padding">
         <slot></slot>
     </ion-content>
 </ion-page>

</template>
<script lang="ts">
import { defineComponent } from 'vue';
import {IonList,IonLabel, IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonMenu, IonItem, IonImg, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonCard,IonText } from '@ionic/vue';
export default defineComponent({
components: {
IonList,  IonLabel,   IonPage, IonHeader, IonToolbar, IonContent, IonTitle, IonMenu, IonItem, IonImg, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonCard,IonText
},

data() {
 return {
     routes: [
         {
             id: 1,
             path: '/checkIn',
             name: 'Check In',
             icon: 'fa ri-calendar-check-line'
         },
         {
             id: 2,
             path: '/dashboard',
             name: 'Orders',
             icon: 'fa fa-clipboard-list',
         },
         {
             id: 3,
             path: '/unassignedOrder',
             name: 'Unassigned Orders',
             icon: 'ri-truck-line fa'
         },
         {
             id: 4,
             path: '/orderHistory',
             name: 'My Order History',
             icon: 'fa-regular fa-rectangle-list fa'
         },
         {
             id: 5,
             path: '/leave',
             name: 'My Leave',
             icon: 'fa-regular fa-calendar-days fa'
         },
         {
             id: 6,
             path: '/claims',
             name: 'My Claim',
             icon: 'ri-coins-line fa'
         },
         {
             id: 7,
             path: '/my-payslip',
             name: 'My Payslip',
             icon: 'fa ri-currency-line'
         },
         {
             id: 8,
             path: '/my-setting',
             name: 'Setting',
             icon: 'fa ri-settings-2-line'
         },
         {
             id: 9,
             path: '/my-qr',
             name: 'My QR Code',
             icon: 'fa ri-body-scan-line'
         },
         {
             id: 10,
             path: '/login',
             name: 'Log Out',
             icon: 'fa ri-shut-down-line'
         },
     ]
 }
}
})
</script>