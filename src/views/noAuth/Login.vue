<template>
  <ion-page>
    <!-- Main Content with Premium Background -->
    <ion-content :fullscreen="true" class="ion-no-padding">
      <div class="login-wrapper">
        
        <!-- Animated Background Blobs for Visual Depth -->
        <div class="blob blob-red"></div>
        <div class="blob blob-dark"></div>

        <!-- The Premium Glass Card -->
        <ion-card class="premium-glass-card">
          
          <!-- Logo Section -->
          <div class="logo-container">
            <div class="logo-glow">
              <ion-img :src="logoImage" alt="HC Logo" class="main-logo"></ion-img>
            </div>
          </div>

          <h2 class="login-title">Login</h2>

          <ion-card-content>
            <!-- Username Input -->
            <div class="input-wrapper">
              <ion-item lines="none" class="custom-item">
                <ion-icon :icon="personOutline" slot="start" class="input-icon"></ion-icon>
                <ion-input 
                  :label="activeLanguage == 'ENG' ? 'Username' : '用户名'" 
                  label-placement="floating" 
                  type="text" 
                  v-model="email"
                  class="custom-input">
                </ion-input>
              </ion-item>
            </div>

            <!-- Password Input -->
            <div class="input-wrapper">
              <ion-item lines="none" class="custom-item">
                <ion-icon :icon="lockClosedOutline" slot="start" class="input-icon"></ion-icon>
                <ion-input 
                  ref="password" 
                  :label="activeLanguage == 'ENG' ? 'Password' : '密码'" 
                  label-placement="floating" 
                  :type="passwordType"
                  placeholder="Enter Password" 
                  v-model="password" 
                  @keydown.enter="onLogin()"
                  class="custom-input">
                </ion-input>
                <ion-icon 
                  :icon="passwordType === 'password' ? eyeOutline : eyeOffOutline" 
                  slot="end" 
                  class="eye-icon"
                  @click="showPassword">
                </ion-icon>
              </ion-item>
            </div>

            <!-- Terms and Conditions -->
            <div class="terms-container">
              <ion-checkbox v-model="isChecked" mode="md" class="red-checkbox"></ion-checkbox>
              <ion-label class="terms-text">
                By signing up, I agree 
                <span class="terms-link" @click="Terms">Terms Of Use</span> and 
                <span class="terms-link" @click="DataProcessing">Data Protection Notice</span>
              </ion-label>
            </div>

            <!-- Premium Red Button -->
            <ion-button 
              expand="block" 
              class="premium-login-btn" 
              @click="onLogin()" 
              :disabled="!isChecked">
              {{ activeLanguage == 'ENG' ? 'Login ' : '登录' }}
            </ion-button>
            
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Feedback Components -->
      <ion-alert 
        :is-open="showError" 
        header="Error" 
        :message="errorMessage" 
        :buttons="['OK']"
        @didDismiss="showError = false"
        class="custom-alert">
      </ion-alert>

      <ion-toast
        :is-open="showToast"
        :message="toastMessage"
        :color="toastColor"
        :duration="2000"
        @didDismiss="showToast = false">
      </ion-toast>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonCard, IonImg, IonCardContent, IonItem, IonInput, 
  IonButton, IonAlert, IonPage, IonContent, IonIcon, 
  IonCheckbox, IonLabel, IonToast 
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { 
  personOutline, lockClosedOutline, eyeOutline, 
  eyeOffOutline 
} from 'ionicons/icons';
import AuthService from "@/services/AuthService";
import { mapGetters, mapActions } from "vuex";

export default defineComponent({
  name: "Login",
  components: {
    IonCard, IonImg, IonCardContent, IonItem, IonInput, 
    IonButton, IonAlert, IonPage, IonContent, IonIcon, 
    IonCheckbox, IonLabel, IonToast
  },
  setup() {
    return { personOutline, lockClosedOutline, eyeOutline, eyeOffOutline };
  },
  data() {
    return {
      menu: "",
      role: "",
      isChecked : false,
      email: "",
      passwordType: 'password' as any,
      password: "",
      errorMessage: "",
      showError: false,
      showToast: false,
      toastMessage: '',
      toastColor: 'success',
    }
  },
  computed: {
    ...mapGetters(["activeLanguage", "languages"]),
    logoImage: () => "logo.png",
  },
  methods: {
    ...mapActions(["setLanguages", "setActivateLanguage"]),
    onLogin() {
      AuthService.login({ USER_NAME: this.email, PASSWORD: this.password }).then(response => {
        if (response.status == 'false') {
          this.showError = true;
          this.errorMessage = response.response;
        } else if (response.Token) {
          localStorage.setItem('permit', response.Token);
          localStorage.setItem("userInfo", JSON.stringify(response));
          localStorage.setItem("userRole", response.SystemRoleName);
          
          // let role = response.SystemRoleName;
          // if (role === "Driver") {
          //   window.location.href = "/checkin";
          // } else if (role === "Store Man") {
          //   window.location.href = "/checkin";
          // }

          let role = response.SystemRoleName;
          if (role === "Driver" || role === "Store Man") {
            this.$router.replace("/checkIn");
          } else {
             this.$router.replace("/dashboard");
          }
          const event = new Event('myDataUpdated');
          document.dispatchEvent(event);
        }
      })
    },
    showPassword() {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    },
    ForgotPassword() { this.$router.push('/emailverification') },
    Terms() { this.$router.push('/otp') },
    DataProcessing() { this.$router.push('/resetpassword') },
  },
  // mounted() {
  //   const token = localStorage.getItem('permit');
  //   const role = localStorage.getItem('userRole');
  //   if (token && role) {
  //     if (role === 'Driver') this.$router.replace('/checkin');
  //     else if (role === 'Store Man') this.$router.replace('/checkin');
  //   }
  // }
});
</script>

<style scoped>
/* 1. Background Styling */
.login-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f1012; /* Deep Charcoal */
  position: relative;
  overflow: hidden;
}

/* Red Aesthetic Blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 1;
}
.blob-red {
  top: -10%;
  right: -10%;
  width: 350px;
  height: 350px;
  background: rgba(220, 38, 38, 0.4); /* Premium Red Glow */
}
.blob-dark {
  bottom: -10%;
  left: -10%;
  width: 300px;
  height: 300px;
  background: rgba(220, 38, 38, 0.2);
}

/* 2. Glassmorphism Card */
.premium-glass-card {
  width: 90%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 28px;
  padding: 20px 10px;
  box-shadow: 0 25px 45px rgba(0, 0, 0, 0.5);
  z-index: 10;
}

/* 3. Logo & Title */
.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
.logo-glow {
  background: white;
  padding: 15px;
  border-radius: 22px;
  box-shadow: 0 10px 20px rgba(220, 38, 38, 0.2);
}
.main-logo {
  width: 70px;
  height: 70px;
}
.login-title {
  text-align: center;
  color: white;
  font-weight: 700;
  font-size: 26px;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}

/* 4. Input Fields */
.input-wrapper {
  margin-bottom: 18px;
}
.custom-item {
  --background: rgba(255, 255, 255, 0.05);
  --border-radius: 16px;
  --padding-start: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: 0.3s all ease-in-out;
}
.custom-item:focus-within {
  border: 1px solid #dc2626; /* Premium Red Border on focus */
  background: rgba(255, 255, 255, 0.1);
}
.input-icon {
  color: #dc2626;
  font-size: 20px;
  margin-right: 10px;
}
.custom-input {
  --color: white;
  font-size: 14px;
}
.eye-icon {
  color: #94a3b8;
  cursor: pointer;
}

/* 5. Terms & Checkbox */
.terms-container {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 15px 5px;
}
.red-checkbox {
  --size: 18px;
  --checkbox-background-checked: #dc2626;
  --border-color-checked: #dc2626;
  --border-color: rgba(255, 255, 255, 0.3);
}
.terms-text {
  color: #cbd5e1;
  font-size: 11px;
  line-height: 1.4;
}
.terms-link {
  color: #dc2626;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}

/* 6. Premium Button */
.premium-login-btn {
  --background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  --background-activated: #7f1d1d;
  --border-radius: 16px;
  --box-shadow: 0 10px 20px rgba(220, 38, 38, 0.3);
  height: 56px;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.5px;
  margin-top: 10px;
}

/* Disabled state */
ion-button[disabled] {
  opacity: 0.4;
  --background: #4b5563;
}
</style>