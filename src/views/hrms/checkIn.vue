<template>
  <master userInfo="true">
    <div class="luxury-dashboard">
      
      <!-- 1. Top Executive Bar -->
      <header class="executive-top-bar">
        <div class="date-section">
          <span class="date-text">{{ currentDay }}</span>
        </div>
        
        <div class="status-section">
          <!-- System Online Indicator -->
          <div class="online-indicator">
            <span class="pulse-dot"></span>
            <span class="status-label">System Online</span>
          </div>
          <!-- Role Access on the Right -->
          <div class="role-access-box">
            <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
            <span>{{ menu }}</span>
          </div>
        </div>
      </header>

      <!-- 2. Operational Grid (Shifted Higher) -->
      <div class="grid-container">
        
        
        <ion-row class="luxury-row">
          <ion-col size="4" v-for="(page, i) in appPages" :key="i" class="luxury-col">
            <div class="luxury-card" @click="navigateTo(page.url)">
              <div class="icon-aura" :style="{ '--aura-color': page.color }">
                <ion-icon :icon="page.ionIcon"></ion-icon>
              </div>
              <div class="card-title">{{ page.title }}</div>
              <div class="accent-dot"></div>
            </div>
          </ion-col>
        </ion-row>
      </div>

    </div>
  </master>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { IonRow, IonCol, IonIcon } from "@ionic/vue";
import { useRouter } from "vue-router";
import { 
  homeOutline, carOutline, timeOutline, walletOutline, 
  documentTextOutline, headsetOutline, receiptOutline, calendarOutline, 
  cubeOutline, swapHorizontalOutline, layersOutline, shieldCheckmarkOutline,
  cashOutline,informationCircleOutline,bagHandleOutline
} from "ionicons/icons";
import Master from "@/views/layouts/Master.vue"; 

export default defineComponent({
  name: "Dashboard",
  components: { Master, IonRow, IonCol, IonIcon },
  setup() {
    const router = useRouter();
    const menu = ref("");
    const appPages = ref<any[]>([]);
    const currentDay = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

    const colors = {
      red: 'rgba(220, 38, 38, 0.12)',
      blue: 'rgba(37, 99, 235, 0.12)',
      amber: 'rgba(217, 119, 6, 0.12)',
      green: 'rgba(5, 150, 105, 0.12)',
      purple: 'rgba(124, 58, 237, 0.12)'
    };

    const driverPages = [
        // { title: 'Dashboard', url: '/checkIn', ionIcon: homeOutline, color: colors.red },
        { title: 'Delivery Job', url: '/deliveryjob', ionIcon: carOutline, color: colors.blue },
        { title: 'Order History', url: '/orderDetailes', ionIcon: timeOutline, color: colors.amber },
        { title: 'Expenditure', url: '/addexpenditure', ionIcon: walletOutline, color: colors.green },
        { title: 'Self Collection', url: '/SelfCollected', ionIcon: bagHandleOutline, color: colors.purple }, 
        // { title: 'Leave Application', url: '/leave', ionIcon: documentTextOutline, color: colors.purple },
        // { title: 'Holidays', url: '/my-setting', ionIcon: headsetOutline, color: colors.red },
        // { title: 'My Payslip', url: '/my-payslip', ionIcon: cashOutline, color: colors.blue },
        // { title: 'Attendance', url: '/checkIn', ionIcon: calendarOutline, color: colors.green }
    ];

    const storemanPages = [
        // { title: 'Dashboard', url: '/checkin', ionIcon: homeOutline, color: colors.red },
        { title: 'Picking & Packing', url: '/pick', ionIcon: cubeOutline, color: colors.blue },
        { title: 'Bin Transfer', url: '/BinScan', ionIcon: swapHorizontalOutline, color: colors.amber },
        { title: 'Cycle Count', url: '/AddWearhouse', ionIcon: layersOutline, color: colors.green },
        { title: 'Expenditure', url: '/addexpenditure', ionIcon: walletOutline, color: colors.purple },
        { title: 'Information', url: '/BinScanCategory', ionIcon: informationCircleOutline, color: colors.red }, 
         { title: 'Self Collection', url: '/SelfCollected', ionIcon: bagHandleOutline, color: colors.purple }, 
        // { title: 'Leave Application', url: '/leave', ionIcon: documentTextOutline, color: colors.red },
        // { title: 'My Payslip', url: '/my-payslip', ionIcon: cashOutline, color: colors.blue },
        // { title: 'Attendance', url: '/checkIn', ionIcon: calendarOutline, color: colors.green }
    ];

    onMounted(() => {
      const role = localStorage.getItem("userRole");
      menu.value = role || "User";
      appPages.value = (role === "Driver") ? driverPages : storemanPages;
    });

    const navigateTo = (url: string) => { router.push(url); };

    return { appPages, menu, currentDay, navigateTo, shieldCheckmarkOutline };
  }
});
</script>

<style scoped>
/* 1. Global Container */
.luxury-dashboard {
  min-height: 100vh;
  background-color: #F8FAFC;
  background-image: 
    radial-gradient(at 0% 0%, rgba(220, 38, 38, 0.03) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(37, 99, 235, 0.03) 0px, transparent 50%);
  padding: 5px 12px 50px;
}

/* 2. Executive Top Bar */
.executive-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 5px 25px;
}

.date-text {
  font-size: 11px;
  font-weight: 800;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.online-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #F1F5F9;
  box-shadow: 0 2px 5px rgba(0,0,0,0.02);
}

.status-label {
  font-size: 9px;
  font-weight: 800;
  color: #10B981; /* Green */
  text-transform: uppercase;
}

.pulse-dot {
  width: 6px; height: 6px;
  background: #10B981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10B981;
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.role-access-box {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0F172A; /* Midnight Dark */
  color: white;
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* 3. Grid Container (Moved Upper) */
.grid-container {
  margin-top: -5px; /* Pulls the grid closer to the top */
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 0 10px;
}

.section-label {
  font-size: 12px;
  font-weight: 800;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  white-space: nowrap;
}

.header-line {
  height: 1px;
  background: #E2E8F0;
  width: 100%;
}

.luxury-row { margin: 0 -8px; }
.luxury-col { padding: 8px; }

/* 4. Luxury Cards */
.luxury-card {
  background: white;
  height: 125px;
  border-radius: 24px; /* Super-ellipse look */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border: 1px solid #F1F5F9;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

.luxury-card:active {
  transform: scale(0.9) translateY(2px);
  background-color: #FAFBFC;
}

.icon-aura {
  width: 48px;
  height: 48px;
  background: var(--aura-color);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #0F172A;
  margin-bottom: 10px;
  transition: 0.3s;
}

.card-title {
  font-size: 10px;
  font-weight: 800;
  color: #1E293B;
  text-align: center;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  max-width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.accent-dot {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 4px;
  height: 4px;
  background: #E2E8F0;
  border-radius: 50%;
}
</style>