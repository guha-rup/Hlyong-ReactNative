<template>
  <ion-page>
    <!-- 1. Executive Header -->
    <ion-header class="ion-no-border premium-header">
      <ion-toolbar class="luxury-toolbar">
        <!-- Menu Toggle -->
        <ion-buttons slot="start">
          <ion-menu-button class="custom-menu-btn"></ion-menu-button>
        </ion-buttons>

        <!-- Right Side Actions -->
        <ion-buttons slot="end">
          <div class="header-action-group">
            <div class="icon-circle" @click="goToProfile">
              <ion-icon :icon="personCircleOutline"></ion-icon>
            </div>
          </div>
        </ion-buttons>
      </ion-toolbar>

      <!-- 2. Sophisticated Welcome Hero (Only shows if userInfo prop is true) -->
      <div class="user-hero-section" v-if="userInfo">
        <div class="hero-content">
          <div class="avatar-container">
            <div class="avatar-glow"></div>
            <ion-img src="/user-img.png" class="user-avatar"></ion-img>
          </div>
          <div class="welcome-text-group">
            <p class="greeting-label">Welcome,</p>
            <h1 class="user-display-name">{{ UserName || 'Executive User' }}</h1>
          </div>
        </div>
        <!-- Abstract Decorative Element -->
        <div class="hero-decoration"></div>
      </div>
    </ion-header>

    <!-- 3. Main Content Area -->
    <ion-content :fullscreen="true" class="main-body-content">
      <div class="page-slot-container">
        <slot></slot>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { 
  IonContent, IonHeader, IonPage, IonToolbar, 
  IonButtons, IonMenuButton, IonImg, IonIcon 
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from "vuex";
import { personCircleOutline, notificationsOutline, languageOutline } from 'ionicons/icons';
import pick from '@/services/pick';

export default defineComponent({
  name: "MasterLayout",
  props: {
    userInfo: {
      type: [Boolean, String],
      default: false
    }
  },
  components: {
    IonContent, IonHeader, IonPage, IonToolbar, 
    IonButtons, IonMenuButton, IonImg, IonIcon
  },
  setup() {
    // Return icons to prevent Vite export errors
    return { 
      personCircleOutline, 
      notificationsOutline, 
      languageOutline 
    };
  },
  data() {
    return {
      UserName: "",
      getProfiledata: []
    }
  },
  computed: {
    ...mapGetters(["activeLanguage", "languages"]),
  },
  mounted() {
    this.getProfiledatafun();
  },
  methods: {
    ...mapActions(["setActivateLanguage"]),
    
    getProfiledatafun() {
      pick.onsearch().then((res) => {
        if (res.status !== "false" && res.response && res.response.length > 0) {
          this.UserName = res.response[0].USER_NAME;
        }
      }).catch(err => console.log("Profile Load Error", err));
    },

    goToProfile() {
      this.$router.push('/Profile');
    }
  }
});
</script>

<style scoped>
/* 1. Toolbar Styling */
.luxury-toolbar {
  --background: #FFFFFF;
  --color: #0F172A;
  --border-width: 0;
  padding: 5px 10px;
}

.custom-menu-btn {
  color: #DC2626; /* Crimson Accent */
}

.header-action-group {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-right: 10px;
}

.icon-circle {
  width: 38px;
  height: 38px;
  background: #F8FAFC;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #64748B;
  transition: 0.2s;
  cursor: pointer;
}

.icon-circle:active {
  background: #FEF2F2;
  color: #DC2626;
}

/* 2. Welcome Hero Section */
.user-hero-section {
  background: #FFFFFF;
  padding: 10px 25px 35px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #F1F5F9;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 2;
}

.avatar-container {
  position: relative;
  width: 70px;
  height: 70px;
}

.avatar-glow {
  position: absolute;
  top: -5px; left: -5px; right: -5px; bottom: -5px;
  background: linear-gradient(135deg, #DC2626, #991b1b);
  border-radius: 22px;
  opacity: 0.15;
  filter: blur(8px);
}

.user-avatar {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  border: 3px solid white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  object-fit: cover;
  background: #f0f0f0;
}

.greeting-label {
  color: #64748B;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.user-display-name {
  color: #0F172A;
  font-size: 32px;
  font-weight: 800;
  margin: 2px 0 0 0;
  letter-spacing: -1px;
}

.hero-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 1;
}

/* 3. Main Body Content Area */
.main-body-content {
  --background: #F8FAFC; /* Slate White Background */
}

.page-slot-container {
  padding-bottom: 40px; /* Space for footer/actions */
}

/* Remove default ion-header shadow */
ion-header::after {
  display: none !important;
}
</style>