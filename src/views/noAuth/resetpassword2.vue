<template>
    <ion-page>
      <div class="container">
        <h3 class="sub-heading">Reset Password</h3>
  
        <p class="info-text">Enter a new password</p>
        <p class="info-text">New password must be different from the previous one</p>
  
        <form @submit.prevent="resetPassword">
          <ion-item class="input-field">
            <ion-input
              label="New Password"
              label-placement="floating"
              :type="newPasswordType"
              autocomplete="off"
              v-model="newPassword"
              required
            ></ion-input>
            <i
                class="fa"
                :class="newPasswordType === 'password' ? 'fa-eye-slash' : 'fa-eye'"
                @click="togglePasswordVisibility('current')"
              ></i>
          </ion-item>
  
          <ion-item class="input-field">
            <ion-input
              label="Confirm Password"
              label-placement="floating"
              :type="ConfirmPasswordType"
              autocomplete="off"
              v-model="confirmPassword"
              required
            ></ion-input>
            <i
                class="fa"
                :class="ConfirmPasswordType === 'password' ? 'fa-eye-slash' : 'fa-eye'"
                @click="togglePasswordVisibility('new')"
              ></i>
          </ion-item>
  
          <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
  
          <ion-button expand="block" class="btn btn-danger" type="submit">
            Submit
          </ion-button>
        </form>
      </div>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import { IonButton, IonPage, IonInput, IonItem } from "@ionic/vue";
  import pick from "@/services/pick";
  
  export default defineComponent({
    components: {
      IonButton,
      IonPage,
      IonInput,
      IonItem,
    },
    data() {
      return {
        newPassword: "",
        confirmPassword: "",
        errorMessage: "",
        newPasswordType: 'password',
        ConfirmPasswordType: 'password',
      };
    },
    methods: {
        togglePasswordVisibility(field: string) {
        if (field === 'current') {
          this.newPasswordType =
            this.newPasswordType === 'password' ? 'text' : 'password';
        } else if (field === 'new') {
          this.ConfirmPasswordType =
            this.ConfirmPasswordType === 'password' ? 'text' : 'password';
        }
      },
      async resetPassword() {
        if (this.newPassword !== this.confirmPassword) {
          this.errorMessage = "Passwords do not match!";
          return;
        }
  
        const getData = localStorage.getItem("userForgotPasswordInfo");
        const opData = getData ? JSON.parse(getData) : null;
  
        if (!opData) {
          this.errorMessage = "User data not found!";
          return;
        }
  
        try {
          const response = await pick.resetPassword({
            ITEM: "CHANGE_PASSWORD_OTP",
            USER_SYS_ID: opData.USER_SYS_ID,
            NEW_PASSWORD: this.newPassword,
          });
  
          if (response.status === "false") {
            this.errorMessage = "OTP does not match!";
          } else {
            this.$router.push("/login");
          }
        } catch (error) {
          this.errorMessage = "Something went wrong. Please try again.";
        }
      },
    },
  });
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 20px;
  }
  
  .sub-heading {
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
  }
  
  .info-text {
    font-size: 14px;
    color: gray;
    text-align: center;
    margin-bottom: 5px;
  }
  
  .input-field {
    width: 100%;
    max-width: 350px;
    margin-top: 15px;
    border-radius: 10px;
  }
  
  .error-text {
    color: red;
    font-size: 13px;
    margin-top: 5px;
  }
  
  .submit-btn {
    width: 100%;
    max-width: 350px;
    margin-top: 20px;
    border-radius: 8px;
    --background: #3880ff;
  }
  </style>
   

  