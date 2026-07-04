<template>
  <master userInfo="true">
    <div class="profile-container">
      
      <!-- 1. Profile Hero Section -->
      <div class="profile-hero">
        <div class="avatar-wrapper">
          <!-- <div class="avatar-circle">
            <ion-icon :icon="personOutline"></ion-icon>
          </div> -->
          <!-- <div class="edit-badge" @click="gotoChangepassword">
            <ion-icon :icon="createOutline"></ion-icon>
          </div> -->
        </div>
        <h2 class="user-display-name">{{ UserName || 'User Profile' }}</h2>
        <!-- <p class="user-role-tag">Authorized System User</p> -->
      </div>

      <!-- 2. Information Ledger Card -->
      <div class="info-card">
        <!-- Email Field -->
        <div class="info-row">
          <div class="icon-box email-bg">
            <ion-icon :icon="mailOutline"></ion-icon>
          </div>
          <div class="text-content">
            <label>Registered Email</label>
            <p>{{ Email || 'N/A' }}</p>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Username Field -->
        <div class="info-row">
          <div class="icon-box user-bg">
            <ion-icon :icon="personOutline"></ion-icon>
          </div>
          <div class="text-content">
            <label>System Username</label>
            <p>{{ UserName || 'N/A' }}</p>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Phone Field -->
        <div class="info-row">
          <div class="icon-box phone-bg">
            <ion-icon :icon="callOutline"></ion-icon>
          </div>
          <div class="text-content">
            <label>Contact Number</label>
            <p>{{ HandPhone || 'N/A' }}</p>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Password Field (Read Only) -->
        <div class="info-row" @click="gotoChangepassword">
          <div class="icon-box pass-bg">
            <ion-icon :icon="lockClosedOutline"></ion-icon>
          </div>
          <div class="text-content">
            <label>Security Password</label>
            <p>••••••••••••</p>
          </div>
          <ion-icon :icon="chevronForwardOutline" class="fwd-icon"></ion-icon>
        </div>
      </div>

      <!-- 3. Logout Action -->
      <div class="action-section">
        <ion-button expand="block" class="logout-btn" @click="Login()">
          <ion-icon :icon="logOutOutline" slot="start"></ion-icon>
          Secure Sign Out
        </ion-button>
        <!-- <p class="version-text">App Version 2.0.1 (Premium)</p> -->
      </div>

    </div>
  </master>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { 
  personOutline, mailOutline, callOutline, lockClosedOutline, 
  createOutline, logOutOutline, chevronForwardOutline 
} from 'ionicons/icons';
import { IonButton, IonIcon } from '@ionic/vue';
import pick from '@/services/pick';

export default defineComponent({
  name: "Profile",
  components: {
    IonButton, IonIcon
  },
  setup() {
    // Returning icons to ensure Vite compatibility and no export errors
    return { 
      personOutline, mailOutline, callOutline, lockClosedOutline, 
      createOutline, logOutOutline, chevronForwardOutline 
    };
  },
  data() {
    return {
      getProfiledata: [],
      Email: "",
      UserName: "",
      HandPhone: '',
      password: '',
    }
  },
  mounted() {
    this.getProfiledatafun();
  },
  methods: {
    gotoChangepassword() {
      this.$router.push('/ChangePassword');
    },
    Login() {
      localStorage.removeItem('permit');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userRole');
      window.location.href = "/login";
    },
    getProfiledatafun() {
      pick.onsearch().then((res) => {
        if (res.status != "false" && res.response && res.response[0]) {
          const profile = res.response[0];
          this.Email = profile.EMAIL_ID;
          this.UserName = profile.USER_NAME;
          this.HandPhone = profile.MOBILE_NO;
          this.password = profile.PASSWORD;
        }
      });
    }
  }
});
</script>

<style scoped>
/* 1. Main Background */
.profile-container {
  min-height: 100vh;
  background-color: #F8FAFC; /* Slate White */
  padding-bottom: 50px;
}

/* 2. Hero Section Styling */
.profile-hero {
  background: white;
  padding: 60px 20px 40px;
  text-align: center;
  border-bottom: 1px solid #F1F5F9;
  background: linear-gradient(180deg, rgba(220, 38, 38, 0.05) 0%, white 100%);
}

.avatar-wrapper {
  position: relative;
  width: 100px;
  margin: 0 auto 20px;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  background: #F8FAFC;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #DC2626;
  border: 4px solid white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.06);
}

.edit-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #DC2626;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  box-shadow: 0 4px 10px rgba(220, 38, 38, 0.3);
  cursor: pointer;
}

.user-display-name {
  color: #0F172A;
  font-size: 24px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
}

.user-role-tag {
  color: #64748B;
  font-size: 14px;
  font-weight: 600;
  margin-top: 5px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 3. Info Card Styling */
.info-card {
  background: white;
  margin: -20px 20px 30px;
  border-radius: 24px;
  padding: 10px 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.04);
  border: 1px solid #F1F5F9;
  position: relative;
  z-index: 10;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 20px 0;
  gap: 15px;
}

.icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

/* Color Palette for Boxes */
.email-bg { background: #EEF2FF; color: #4F46E5; }
.user-bg  { background: #FFF7ED; color: #EA580C; }
.phone-bg { background: #ECFDF5; color: #059669; }
.pass-bg  { background: #FEF2F2; color: #DC2626; }

.text-content { flex: 1; }
.text-content label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.text-content p {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #1E293B;
}

.divider {
  height: 1px;
  background: #F1F5F9;
}

.fwd-icon {
  color: #CBD5E1;
  font-size: 18px;
}

/* 4. Action Section */
.action-section {
  padding: 0 20px;
  text-align: center;
}

.logout-btn {
  --background: #DC2626;
  --border-radius: 16px;
  --box-shadow: 0 10px 20px rgba(220, 38, 38, 0.2);
  height: 60px;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.version-text {
  margin-top: 25px;
  color: #94A3B8;
  font-size: 12px;
  font-weight: 600;
}
</style>