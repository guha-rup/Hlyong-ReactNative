<!-- btn btn-danger -->
<template>
    <ion-page>
      <ion-content class="ion-padding">
        <div class="container">
          <h3 class="sub-heading">Forgot Password</h3>
  
          <p class="description">
            Enter email address associated with your account.
          </p>
  
          <ion-item class="input-field" lines="none">
            <ion-input
              label="Email"
              label-placement="floating"
              v-model="emailverify"
              type="email"
              class="custom-input"
            ></ion-input>
          </ion-item>
  
          <ion-button expand="block" class="btn btn-danger" @click="EmailVarification">
            Recover Password
          </ion-button>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import {
    IonButton,
    IonContent,
    IonItem,
    IonInput,
    IonPage,
  } from '@ionic/vue';
  import pick from '@/services/pick';
  
  export default defineComponent({
    components: {
      IonButton,
      IonContent,
      IonItem,
      IonInput,
      IonPage,
    },
    data() {
      return {
        emailverify: "",
      };
    },
    methods: {
      EmailVarification() {
        pick.emailverifycation([{
          ITEM: "EMAIL_VERIFICATION",
          USER_NAME: this.emailverify,
        }]).then(response => {
          if (response.status === 'false') {
            alert("User account not available in the system");
          } else {
            localStorage.setItem("userForgotPasswordInfo", JSON.stringify(response));
            this.$router.push('/otp');
          }
        });
      },
    },
  });
  </script>