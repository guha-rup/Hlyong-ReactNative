<template>
  <master>
    <div class="premium-light-container">
      
      <!-- Subtle Soft Background Orbs (Very light, not deep) -->
      <div class="light-orb-1"></div>
      <div class="light-orb-2"></div>

      <div class="content-wrapper">
        
        <!-- Executive Header Area -->
        <header class="page-header">
          <div class="header-top">
            <div class="title-info">
              <h1 class="main-title">Picking & Packing</h1>
             
            </div>
            <div class="order-count" v-if="pickingdetailes.length > 0">
              {{ pickingdetailes.length }} Active Jobs
            </div>
          </div>

          <!-- Refined Search & Date Bar -->
          <div class="filter-container">
            <div class="search-glass">
              <ion-icon :icon="searchIcon" class="icon-red"></ion-icon>
              <ion-input 
                placeholder="Search by SO No..." 
                @ionInput="onSearch($event.target.value)"
                class="refined-input">
              </ion-input>
            </div>
            <div class="date-glass">
              <ion-icon :icon="calendarIcon" class="icon-red"></ion-icon>
              <input 
                type="date" 
                v-model="pickdate" 
                @change="getPickOrder($event.target.value)"
                class="native-date" />
            </div>
          </div>
        </header>

        <!-- Loading Component -->
        <ion-loading
          :is-open="loading"
          message="Synchronizing..."
          spinner="crescent"
          class="custom-loading">
        </ion-loading>

        <!-- Orders Grid -->
        <div class="orders-list">
          
          <!-- Empty State -->
          <div v-if="pickingdetailes.length === 0 && !loading" class="empty-state">
            <div class="empty-circle">
              <ion-icon :icon="cubeIcon"></ion-icon>
            </div>
            <h3>No Records Found</h3>
            <p>We couldn't find any orders for the selected date.</p>
          </div>

          <!-- Premium Elevated Cards -->
          <div 
            v-for="pick in pickingdetailes" 
            :key="pick.SO_NO"
            class="order-card"
            @click="goToPack(pick)"
          >
            <div class="card-body">
              <div class="card-header">
                <span class="so-label">SO #{{ pick.SO_NO }}</span>
                <div :class="['status-pill', getStatusClass(pick.ORDER_STATUS)]">
                  {{ pick.ORDER_STATUS }}
                </div>
              </div>

              <h2 class="customer-name">{{ pick.CUSTOMER_NAME }}</h2>

              <div class="card-footer">
                <div class="footer-meta">
                  <ion-icon :icon="timeIcon"></ion-icon>
                  <span>{{ pick.DELIVERY_DATE }}</span>
                </div>
                <div class="go-button">
                  <ion-icon :icon="chevronIcon"></ion-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </master>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonInput, IonLoading, IonIcon } from "@ionic/vue";
import { 
  searchOutline, 
  calendarOutline, 
  cubeOutline, 
  timeOutline, 
  chevronForwardOutline 
} from 'ionicons/icons';
import pickService from '@/services/pick';

export default defineComponent({
  name: "Pick",
  components: { IonInput, IonLoading, IonIcon },
  setup() {
    // Manually returning icons to prevent Vite 'truckOutline' export errors
    return { 
      searchIcon: searchOutline, 
      calendarIcon: calendarOutline, 
      cubeIcon: cubeOutline,
      timeIcon: timeOutline,
      chevronIcon: chevronForwardOutline
    };
  },
  data() {
    return {
      pickdate:'',
      pickingdetailes: [] as any[],
      originalPickingDetails: [] as any[],
      loading: false,
    }
  },
  mounted() {
    this.getPickOrder();
  },
  methods: {
    getStatusClass(status: string) {
      if (status === 'Packing Completed') return 'pill-green';
      if (status === 'Processing in progress') return 'pill-amber';
      return 'pill-gray';
    },
    goToPack(pick: any) {
      localStorage.setItem("pickitem", JSON.stringify(pick));
      localStorage.setItem("packitem", JSON.stringify(pick.DETAILS));
      this.$router.push('/pack');
    },
    getPickOrder(dateVal?: string) {

      if (dateVal !== undefined) {
        this.pickdate = dateVal;
      }
      this.loading = true;
      // const date = dateVal || this.pickdate;
      pickService.pickdate(this.pickdate).then((res: any) => {
        this.pickingdetailes = res.status !== "false" ? res.response : [];
        this.originalPickingDetails = [...this.pickingdetailes];
      }).finally(() => { this.loading = false; });
    },
    onSearch(val: string) {
      const input = val.toLowerCase();
      this.pickingdetailes = this.originalPickingDetails.filter(o => 
        o.SO_NO.toLowerCase().includes(input) || o.CUSTOMER_NAME.toLowerCase().includes(input)
      );
    }
  }
});
</script>

<style scoped>
/* 1. Main Light Layout */
.premium-light-container {
  min-height: 100vh;
  background: #F8FAFC; /* Clean Cloud White */
  position: relative;
  overflow: hidden;
}

/* Soft Decorative Elements (Light colors) */
.light-orb-1 {
  position: absolute;
  top: -100px; right: -100px;
  width: 400px; height: 400px;
  background: rgba(220, 38, 38, 0.03); /* Very faint red */
  border-radius: 50%;
  filter: blur(80px);
}

.content-wrapper {
  position: relative;
  z-index: 5;
  padding: 20px;
}

/* 2. Page Header */
.page-header {
  margin-bottom: 30px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
}

.main-title {
  color: #0F172A; /* Deep Charcoal */
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #64748B;
  font-size: 14px;
  margin-top: 4px;
}

.order-count {
  background: #FEF2F2;
  color: #DC2626;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid rgba(220, 38, 38, 0.1);
}

/* 3. Search & Date Filter Bar */
.filter-container {
  display: flex;
  gap: 12px;
}

.search-glass, .date-glass {
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 52px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.search-glass { flex: 2; }
.date-glass { flex: 1.2; }

.icon-red {
  color: #DC2626;
  font-size: 20px;
  margin-right: 10px;
}

.refined-input {
  --color: #0F172A;
  --placeholder-color: #94A3B8;
  font-size: 14px;
  font-weight: 500;
}

.native-date {
  border: none;
  background: transparent;
  color: #0F172A;
  font-size: 13px;
  width: 100%;
  outline: none;
  font-weight: 600;
}

/* 4. Premium Elevated Cards */
.order-card {
  background: #FFFFFF;
  border-radius: 24px;
  margin-bottom: 18px;
  padding: 20px;
  border: 1px solid #F1F5F9;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.order-card:active {
  transform: scale(0.97);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.so-label {
  color: #DC2626;
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.5px;
}

.customer-name {
  color: #1E293B;
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 18px 0;
  line-height: 1.3;
}

/* 5. Status Pills */
.status-pill {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 10px;
  letter-spacing: 0.5px;
}

.pill-green { background: #ECFDF5; color: #059669; }
.pill-amber { background: #FFFBEB; color: #D97706; }
.pill-gray { background: #F8FAFC; color: #64748B; }

/* 6. Card Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #F8FAFC;
  padding-top: 15px;
}

.footer-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94A3B8;
  font-size: 13px;
  font-weight: 500;
}

.go-button {
  width: 34px;
  height: 34px;
  background: #FEF2F2;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #DC2626;
  transition: 0.2s;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-circle {
  width: 80px; height: 80px;
  background: #F1F5F9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
  color: #CBD5E1;
}

.empty-state h3 { color: #1E293B; font-weight: 700; margin-bottom: 8px; }
.empty-state p { color: #94A3B8; font-size: 14px; }

/* Loading Customization */
.custom-loading {
  --background: #FFFFFF;
  --spinner-color: #DC2626;
  --color: #0F172A;
}
</style>