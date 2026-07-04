<template>
  <ion-app>
    <ion-split-pane content-id="main-content">
      <!-- Premium Dark/Red Sidebar -->
      <ion-menu content-id="main-content" type="overlay" class="premium-menu">
        <ion-content class="menu-content">
          
          <!-- Profile/Header Section -->
          <div class="menu-header">
            <div class="logo-wrapper">
              <ion-img :src="logoImage" alt="Logo" class="sidebar-logo"></ion-img>
            </div>
            <div class="profile-info">
              <h2 class="role-text">{{ menu || 'Authorized User' }}</h2>
              <p class="online-status"><span class="dot"></span> System Online</p>
            </div>
          </div>

          <!-- Navigation List -->
          <ion-list lines="none" class="nav-list">
            <ion-menu-toggle :auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item 
                @click="selectedIndex = i" 
                router-direction="root" 
                :router-link="p.url" 
                class="nav-item"
                :class="{ 'selected-item': selectedIndex === i }">
                
                <!-- Modern Ionicons (Fixed Import) -->
                <ion-icon slot="start" :icon="p.ionIcon" class="nav-icon"></ion-icon>
                
                <ion-label class="nav-label">{{ p.title }}</ion-label>
                
                <!-- Premium Right Arrow -->
                <ion-icon slot="end" :icon="chevronForwardOutline" class="arrow-icon"></ion-icon>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>

          <!-- Footer Logout -->
          <div class="menu-footer">
            <ion-item @click="logout" lines="none" class="logout-item" button>
              <ion-icon slot="start" :icon="logOutOutline"></ion-icon>
              <ion-label>Sign Out</ion-label>
            </ion-item>
          </div>

        </ion-content>
      </ion-menu>

      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
  </ion-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters, mapActions } from "vuex";
import {
  IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList,
  IonMenu, IonMenuToggle, IonRouterOutlet, IonSplitPane, IonImg
} from "@ionic/vue";

// Explicitly import Icons from your package.json dependencies
import { 
  gridOutline,  listOutline, walletOutline, 
  documentTextOutline, headsetOutline, receiptOutline, 
  calendarOutline, cubeOutline, swapHorizontalOutline,
  layersOutline, chevronForwardOutline, logOutOutline
} from "ionicons/icons";

export default defineComponent({
  name: "App",
  components: {
    IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList,
    IonMenu, IonMenuToggle, IonRouterOutlet, IonSplitPane, IonImg
  },
  setup() {
    return { chevronForwardOutline, logOutOutline };
  },
  data() {
    return {
      selectedIndex: 0,
      menu: "",
      appPages: [] as any[],
      // Driver List
      driver: [
        { title: 'Dashboard', url: '/checkIn', ionIcon: gridOutline },
        { title: 'Delivery Job', url: '/deliveryjob', ionIcon: walletOutline },
        { title: 'Order History', url: '/orderDetailes', ionIcon: listOutline },
        { title: 'Expenditure', url: '/addexpenditure', ionIcon: walletOutline },
        // { title: 'Leave Application', url: '/leave', ionIcon: documentTextOutline },
        // { title: 'Holidays', url: '/my-setting', ionIcon: headsetOutline },
        // { title: 'My Payslip', url: '/my-payslip', ionIcon: receiptOutline },
        // { title: 'Attendance', url: '/checkIn', ionIcon: calendarOutline }
      ],
      // Store Man List
      drivernew: [
        { title: 'Dashboard', url: '/checkin', ionIcon: gridOutline },
        { title: 'Picking & Packing', url: '/pick', ionIcon: cubeOutline },
        { title: 'Expenditure', url: '/addexpenditure', ionIcon: walletOutline },
        // { title: 'Leave Application', url: '/leave', ionIcon: documentTextOutline },
        // { title: 'Holidays', url: '/my-setting', ionIcon: headsetOutline },
        // { title: 'My Payslip', url: '/my-payslip', ionIcon: receiptOutline },
        // { title: 'Attendance', url: '/checkIn', ionIcon: calendarOutline },
        { title: 'Bin Transfer', url: '/BinScan', ionIcon: swapHorizontalOutline },
        // { title: 'Cycle Count', url: '/AddWearhouse', ionIcon: layersOutline }
      ]
    }
  },
  computed: {
    ...mapGetters(["activeLanguage"]),
    logoImage: () => "logo.png"
  },
  created() {
    document.addEventListener('myDataUpdated', this.checkLogin);
    this.checkLogin();
  },
  methods: {
    ...mapActions(["setLanguages", "setActivateLanguage"]),
    checkLogin() {
      const role = localStorage.getItem("userRole");
      this.menu = role || "";
      if (this.menu === "Driver") {
        this.appPages = this.driver;
      } else if (this.menu === "Store Man") {
        this.appPages = this.drivernew;
      }
    },
    logout() {
      localStorage.clear();
      window.location.href = "/login";
    }
  }
});
</script>

<style scoped>
/* 1. Global Menu Background */
.premium-menu {
  --background: #0d0e12; /* Rich Deep Black */
  --width: 290px;
}

.menu-content {
  --background: #0d0e12;
}

/* 2. Header / Profile Area */
.menu-header {
  padding: 50px 25px 30px;
  background: linear-gradient(to bottom, rgba(220, 38, 38, 0.12), transparent);
}

.logo-wrapper {
  width: 70px;
  height: 70px;
  background: white;
  padding: 12px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  margin-bottom: 20px;
}

.role-text {
  color: white;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.online-status {
  color: #8492a6;
  font-size: 13px;
  margin-top: 5px;
  display: flex;
  align-items: center;
}

.dot {
  height: 8px;
  width: 8px;
  background: #10b981; /* Success Green */
  border-radius: 50%;
  margin-right: 8px;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
}

/* 3. Navigation List Styling */
.nav-list {
  background: transparent;
  padding: 10px 15px;
}

.nav-item {
  --background: transparent;
  --color: #94a3b8;
  --border-radius: 16px;
  margin-bottom: 6px;
  --padding-start: 12px;
  transition: 0.3s all ease;
}

.nav-icon {
  font-size: 20px;
  margin-right: 15px;
  color: #64748b;
}

.arrow-icon {
  font-size: 14px;
  opacity: 0;
  transform: translateX(-10px);
  transition: 0.3s;
}

/* 4. Active/Selected State (Red Premium Look) */
.selected-item {
  --background: rgba(220, 38, 38, 0.1);
  --color: #ffffff;
  border-left: 4px solid #dc2626; /* Crimson Red */
}

.selected-item .nav-icon {
  color: #dc2626;
}

.selected-item .arrow-icon {
  opacity: 1;
  transform: translateX(0);
  color: #dc2626;
}

.nav-label {
  font-size: 15px;
  font-weight: 500;
}

/* 5. Footer Logout */
.menu-footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.logout-item {
  --background: rgba(220, 38, 38, 0.05);
  --color: #ef4444;
  --border-radius: 12px;
  font-weight: 600;
}

/* Custom Detail Scrollbar */
ion-content::part(scroll) {
  scrollbar-width: none;
}
</style>