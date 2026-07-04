<template>
  <master>
    <div class="security-container">
      
      <!-- 1. Security Header -->
      <header class="executive-header">
        <div class="header-content">
          <div class="title-stack">
            <h1 class="main-title">Security Center</h1>
            <p class="subtitle">Update your account credentials</p>
          </div>
          <div class="lock-badge">
            <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
          </div>
        </div>
      </header>

      <div class="content-wrapper">
        <!-- 2. Secure Form Card -->
        <div class="luxury-card password-card">
          <div class="card-accent-bar"></div>
          
          <div class="card-body">
            <div class="form-instruction">
              <ion-icon :icon="keyOutline"></ion-icon>
              <span>Ensure your new password is strong and unique.</span>
            </div>

            <form @submit.prevent="changePassword">
              <!-- Current Password Field -->
              <div class="premium-input-group">
                <ion-item lines="none" class="luxury-item">
                  <ion-icon :icon="lockClosedOutline" slot="start" class="field-icon"></ion-icon>
                  <ion-input 
                    label="Current Password"
                    label-placement="floating"
                    :type="currentPasswordType"
                    v-model="currentpassword"
                    class="luxury-input">
                  </ion-input>
                  <ion-icon 
                    :icon="currentPasswordType === 'password' ? eyeOutline : eyeOffOutline" 
                    slot="end" 
                    class="eye-toggle"
                    @click="togglePassword('current')">
                  </ion-icon>
                </ion-item>
              </div>

              <!-- New Password Field -->
              <div class="premium-input-group">
                <ion-item lines="none" class="luxury-item">
                  <ion-icon :icon="lockOpenOutline" slot="start" class="field-icon"></ion-icon>
                  <ion-input 
                    label="New Password"
                    label-placement="floating"
                    :type="newPasswordType"
                    v-model="newpassword"
                    class="luxury-input">
                  </ion-input>
                  <ion-icon 
                    :icon="newPasswordType === 'password' ? eyeOutline : eyeOffOutline" 
                    slot="end" 
                    class="eye-toggle"
                    @click="togglePassword('new')">
                  </ion-icon>
                </ion-item>
              </div>

              <!-- Submit Action -->
              <ion-button expand="block" class="luxury-submit-btn" type="submit">
                <ion-icon :icon="saveOutline" slot="start"></ion-icon>
                Update Credentials
              </ion-button>
            </form>
          </div>
        </div>

        <!-- 3. Security Note -->
        <div class="security-note">
          <ion-icon :icon="alertCircleOutline"></ion-icon>
          <p>After a successful password change, you will be redirected to the login screen to re-authenticate your session.</p>
        </div>
      </div>
    </div>
    
    <!-- Custom Success Feedback -->
    <sweetAlert v-if="sweetAlertActive" :msg="msg" />
  </master>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { 
  IonButton, IonInput, IonIcon, IonItem, IonPage 
} from '@ionic/vue';
import { 
  shieldCheckmarkOutline, lockClosedOutline, lockOpenOutline, 
  eyeOutline, eyeOffOutline, keyOutline, saveOutline, 
  alertCircleOutline, chevronForwardOutline 
} from 'ionicons/icons';
import pick from '@/services/pick';
import sweetAlert from '../sweetAlert.vue';

export default defineComponent({
  name: "ChangePassword",
  components: { IonButton, IonInput, IonIcon, IonItem, sweetAlert },
  setup() {
    // Icons provided here to prevent Vite build errors
    return { 
      shieldCheckmarkOutline, lockClosedOutline, lockOpenOutline, 
      eyeOutline, eyeOffOutline, keyOutline, saveOutline, 
      alertCircleOutline, chevronForwardOutline 
    };
  },
  data() {
    return { 
      sweetAlertActive: false,
      currentpassword: '',
      newpassword: '',
      currentPasswordType: "password" as any,
      newPasswordType: "password" as any,
      msg: ""
    }
  },
  methods: {
    togglePassword(field: string) {
      if (field === 'current') {
        this.currentPasswordType = this.currentPasswordType === 'password' ? 'text' : 'password';
      } else if (field === 'new') {
        this.newPasswordType = this.newPasswordType === 'password' ? 'text' : 'password';
      }
    },
    async changePassword() {
      if (!this.currentpassword || !this.newpassword) {
        alert("Please fill in both fields.");
        return;
      }

      const userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}');
      
      pick.newpassword({
        ITEM: "USER_CHANGE_PASSWORD",
        REPEAT_PASS: this.currentpassword,
        NEW_PASSWORD: this.newpassword,
        USER_SYS_ID: userInfo.UserId,
      }).then(response => {
        if (response.status === 'true') {
          this.msg = response.response || "Password updated successfully";
          this.sweetAlertActive = true;
          
          setTimeout(() => {
            this.sweetAlertActive = false;
            localStorage.clear();
            window.location.href = "/login";
          }, 2000);
        } else {
          alert(response.response);
        }
      });
    }
  }
});
</script>

<style scoped>
/* 1. Page Background */
.security-container {
  min-height: 100vh;
  background-color: #F8FAFC;
  padding-bottom: 50px;
}

/* 2. Executive Header */
.executive-header {
  background: white;
  padding: 45px 20px 30px;
  border-bottom: 1px solid #F1F5F9;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-title {
  color: #0F172A;
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #64748B;
  font-size: 13px;
  margin-top: 5px;
}

.lock-badge {
  width: 48px;
  height: 48px;
  background: #FEF2F2;
  color: #DC2626;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 1px solid rgba(220, 38, 38, 0.1);
}

.content-wrapper { padding: 25px 15px; }

/* 3. Luxury Form Card */
.luxury-card {
  background: white;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.03);
  border: 1px solid #F1F5F9;
  margin-bottom: 25px;
}

.card-accent-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 5px;
  background: #DC2626;
}

.card-body { padding: 25px 20px; }

.form-instruction {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #F8FAFC;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 25px;
}

.form-instruction ion-icon { color: #DC2626; font-size: 18px; }
.form-instruction span { font-size: 12px; color: #475569; font-weight: 600; line-height: 1.4; }

/* 4. Luxury Inputs */
.premium-input-group {
  margin-bottom: 15px;
}

.luxury-item {
  --background: #F8FAFC;
  --border-radius: 16px;
  --padding-start: 12px;
  border: 1px solid #E2E8F0;
  transition: 0.3s all ease;
}

.luxury-item:focus-within {
  border: 1px solid #DC2626;
  background: #FFFFFF;
}

.field-icon { color: #94A3B8; font-size: 20px; margin-right: 10px; }
.eye-toggle { color: #94A3B8; font-size: 20px; cursor: pointer; padding: 10px; }

.luxury-input {
  --color: #0F172A;
  font-weight: 600;
  font-size: 15px;
}

/* 5. Submit Button */
.luxury-submit-btn {
  --background: #DC2626;
  --border-radius: 16px;
  --box-shadow: 0 10px 20px rgba(220, 38, 38, 0.25);
  height: 60px;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 0.5px;
  margin-top: 25px;
}

/* 6. Security Note */
.security-note {
  display: flex;
  gap: 12px;
  padding: 15px;
  background: #EFF6FF;
  border-radius: 16px;
  border: 1px solid #DBEAFE;
}

.security-note ion-icon { color: #2563EB; font-size: 24px; }
.security-note p { margin: 0; font-size: 12px; color: #1E40AF; font-weight: 600; line-height: 1.5; }
</style>