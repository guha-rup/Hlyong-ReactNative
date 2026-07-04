<template>
  <master>
    <div class="technical-ledger-wrapper">
      
      <!-- 1. Ultra-Slim Executive Header -->
      <header class="slim-ledger-header">
        <div class="header-content">
          <div class="title-stack">
         
            <p class="meta-subtitle"> BIN LOCATION: {{ binCode || 'SYSTEM CACHE' }}</p>
          </div>
          <div class="status-chip">
            <span class="pulse-ruby"></span>
            <label>{{ products.length }} ITEMS FOUND</label>
          </div>
        </div>
      </header>

      <!-- 2. Technical List Container -->
      <div class="ledger-list-container">
        
        <!-- Empty State -->
        <div v-if="products.length === 0" class="empty-state-system">
          <ion-icon :icon="cubeOutline"></ion-icon>
          <p>NO PRODUCT AVAILABLE</p>
        </div>

        <!-- Premium Compact Inventory Card -->
        <div 
          v-for="(item, index) in products" 
          :key="index"
          class="inventory-plate"
        >
          <!-- Left Accent Status Bar -->
          <div class="plate-indicator"></div>

          <div class="plate-inner">
            <!-- Top Section: Identity & Transfer Action -->
            <div class="plate-header">
              <span class="part-ref-tag">PART #{{ item.partNo }}</span>
            </div>

            <!-- Product Name (Rich Typography) -->
            <h2 class="item-display-name">{{ item.name }}</h2>

            <!-- Core Metrics Strip (Compact) -->
            <div class="metrics-strip">
              <div class="m-box">
                <label>AVAILABLE STOCK</label>
                <span class="val crimson">{{ item.quantity }}</span>
              </div>
              <div class="m-box border-left">
                <label>BATCH REFERENCE</label>
                <span class="val">{{ item.batchNo }}</span>
              </div>
            </div>

            <!-- Technical Metadata Grid (Small & Rich) -->
            <div class="technical-grid">
              <div class="t-cell">
                <label>EXPIRY DATE</label>
                <div class="t-val-wrap">
                  <ion-icon :icon="calendarOutline"></ion-icon>
                  <span>{{ item.expiryDate }}</span>
                </div>
              </div>
              <div class="t-cell">
                <label>GRN REF</label>
                <div class="t-val-wrap">
                  <ion-icon :icon="barcodeOutline"></ion-icon>
                  <span>{{ item.grnNo }}</span>
                </div>
              </div>
              <div class="t-cell">
                <label>RECEIVED ON</label>
                <div class="t-val-wrap">
                  <ion-icon :icon="timeOutline"></ion-icon>
                  <span>{{ item.receivedDate }}</span>
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
import { defineComponent, ref, onMounted } from "vue";
import { IonIcon } from "@ionic/vue";
import { 
  cubeOutline, swapHorizontalOutline, calendarOutline, 
  barcodeOutline, timeOutline 
} from 'ionicons/icons';
import { useRoute, useRouter } from "vue-router";
import Master from "../layouts/Master.vue";

export default defineComponent({
  name: "BinDetails",
  components: { IonIcon, Master },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const binCode = route.params.binCode as string | undefined;
    const products = ref<any[]>([]);

    // Stabilize icons to prevent Vite build errors
    const icons = {
      cubeOutline, swapHorizontalOutline, calendarOutline, 
      barcodeOutline, timeOutline
    };

    const goToNewBinTransfer = (item: any) => {
      router.push({ 

        name: "NewBinTransfer",
        query: {
          productName: item.name,
          batchNo: item.batchNo,
          partNo: item.partNo,
          expiryDate: item.expiryDate,
          receivedDate: item.receivedDate,
          grnNo: item.grnNo,
          quantity: item.quantity,
          productSysId: item.productSysId,
          purchaseOrderNo: item.purchaseOrderNo,
          barcode: item.barcode,
        },
      });
    };

    onMounted(async () => {
      try {
        const storedData = localStorage.getItem("scanDatanew");
        if (storedData) {
          const raw = JSON.parse(storedData);
           const rawArray = Array.isArray(raw) ? raw : [raw];
            const validProducts = rawArray.filter(p => p.PRODUCT_NAME && p.PRODUCT_NAME.trim() !== '');
          products.value = validProducts.map((p: any) => ({
            partNo: p.PART_NO || "N/A",
            name: p.PRODUCT_NAME,
            quantity: p.AVAILABLE_QTY || "0",
            batchNo: p.BATCH_NO || "N/A",
            expiryDate: p.EXPIRY_DATE || "N/A",
            receivedDate: p.RECEIVED_DATE || "N/A",
            grnNo: p.GRN_NO || "N/A",
            productSysId: p.PRODUCT_SYS_ID || "N/A",
            purchaseOrderNo: p.PURCHASE_ORDER_NO || "N/A",
            barcode: p.PRODUCT_BARCODE || "N/A",
          }));
        }
      } catch (error) {
        console.error("Error parsing bin products:", error);
      }
    });

    return { ...icons, binCode, products, goToNewBinTransfer };
  },
});
</script>

<style scoped>
/* 1. Global Titanium Layout */
.technical-ledger-wrapper {
  min-height: 100vh;
  background-color: #F4F7F9; /* Professional technical white-grey */
  padding-bottom: 40px;
}

/* 2. Slim Executive Header */
.slim-ledger-header {
  background: white;
  padding: 30px 20px 15px;
  border-bottom: 1px solid #E2E8F0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.main-title {
  color: #0F172A;
  font-size: 19px;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.5px;
}

.meta-subtitle {
  color: #94A3B8;
  font-size: 9px;
  font-weight: 800;
  margin-top: 2px;
  letter-spacing: 1px;
}

.status-chip {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  padding: 4px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-chip label {
  font-size: 8px;
  font-weight: 900;
  color: #64748B;
}

.pulse-ruby {
  width: 6px; height: 6px;
  background: #DC2626;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(220, 38, 38, 0.4);
}

/* 3. Inventory Plates (Compact & Rich) */
.ledger-list-container {
  padding: 15px 12px;
}

.inventory-plate {
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  border: 1px solid #E2E8F0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
  transition: transform 0.2s ease;
}

.inventory-plate:active {
  transform: scale(0.98);
  background: #F8FAFC;
}

.plate-indicator {
  position: absolute;
  top: 12px; left: 0; bottom: 12px;
  width: 3px;
  background: #DC2626;
  border-radius: 0 4px 4px 0;
}

.plate-inner { padding: 12px 15px; }

/* Plate Header */
.plate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.part-ref-tag {
  font-size: 9px;
  font-weight: 900;
  color: #94A3B8;
  letter-spacing: 0.5px;
}

.transfer-trigger {
  color: #DC2626;
  font-size: 16px;
}

.item-display-name {
  color: #1E293B;
  font-size: 15px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 12px 0;
}

/* 4. Compact Metrics Strip */
.metrics-strip {
  display: flex;
  background: #F8FAFC;
  border-radius: 8px;
  padding: 8px 0;
  margin-bottom: 12px;
  border: 1px solid #E2E8F0;
}

.m-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.border-left { border-left: 1px solid #E2E8F0; }

.m-box label {
  font-size: 8px;
  color: #94A3B8;
  font-weight: 900;
  margin-bottom: 2px;
}

.m-box .val {
  font-size: 14px;
  font-weight: 900;
  color: #0F172A;
}

.val.crimson { color: #DC2626; }

/* 5. Technical Grid (Micro Data) */
.technical-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding-top: 10px;
  border-top: 1px dashed #E2E8F0;
}

.t-cell { display: flex; flex-direction: column; }

.t-cell label {
  font-size: 7.5px;
  font-weight: 900;
  color: #CBD5E1;
  margin-bottom: 3px;
}

.t-val-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #64748B;
}

.t-val-wrap ion-icon { font-size: 11px; }

.t-val-wrap span {
  font-size: 10px;
  font-weight: 700;
}

/* Empty State */
.empty-state-system {
display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center; 
  padding: 80px 20px;
  color: #94A3B8;
}
.empty-state-system ion-icon {  font-size: 48px; 
  color: #CBD5E1;
  margin-bottom: 15px; }
.empty-state-system p { font-size: 9px; font-weight: 900; letter-spacing: 1px; }
</style>