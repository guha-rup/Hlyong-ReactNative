<template>
    <ion-page>
      <ion-header :translucent="true" class="headerSlot">
        
      </ion-header>
      <!-- <ion-content class="page" :fullscreen="true"> -->
      <ion-content  class="ion-padding" style="--background: #F0F0F0;">
        
        <slot> </slot>
      </ion-content>
    </ion-page>
  </template>
<script lang="ts">
import { IonContent, IonHeader, IonFooter, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonImg, IonRow, IonCol, IonIcon,IonSelect  } from '@ionic/vue';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from "vuex";
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
        IonContent, IonHeader, IonFooter, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonImg, IonRow, IonCol, IonIcon,IonSelect
    },
    computed: {
      ...mapGetters([
    
    "activeLanguage",
     "languages",
   ]),
      logoImage: () => {
      // return "https://gmc.demotemplate.in/dist-assets/images/logo.png";
      return "logo.png";
    },
    },
    data() {
      return {
        getlanguage:"",
        showMenu: false,
        icons: {
          notifications: notifications,
          cart: cart,
          personCircle: personCircle,
        }
      }
    },
    methods: {
      ...mapActions([
    
    "setLanguages",
    "setActivateLanguage",
  ]),
  getvalue(){
console.log(this.getlanguage,"jh")
this.setActivateLanguage(this.getlanguage)
  },
      onClickLogout() {
        const user = localStorage.getItem('permit');
        if (user) {
          localStorage.removeItem("permit");
        //  localStorage.clear()
         sessionStorage.clear()
          this.$router.push('/login');
        } 
      },
      goToLogin() {
        localStorage.removeItem("permit");
        //  localStorage.clear()
         sessionStorage.clear()
          this.$router.push('/login');
     },
     
      goToProfile(){
        this.$router.push('/Profile');
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
  .dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  float: left;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 0.813rem;
  color: #f2f1f4;
  text-align: left;
  list-style: none;
  background-color: #26222a;
  background-clip: padding-box;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.25rem; }
  .list-none {
    list-style: none;
    margin-left: 0 !important;
    padding-left: 0;
    padding-top: 0;
    margin-bottom: 0;
}
  </style>