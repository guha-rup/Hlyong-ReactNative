<template>
  <master>
    <div class="technical-manifesto-portal">
      
      <!-- 1. Ultra-Slim Executive Header -->
      <header class="slim-terminal-header">
        <div class="header-content">
          <div class="title-stack">
          
            <h1 class="main-title">Delivery Data</h1>
          </div>
          <div class="header-meta-box">
             <div class="op-badge">#{{ ORDER_NO }}</div>
             <div class="date-ledger">{{ DELIVERY_DATE }}</div>
          </div>
        </div>
      </header>

      <div class="terminal-body">
        
        <!-- 2. Customer & Identity Plate -->
        <div class="tech-plate">
          <div class="plate-indicator"></div>
          <div class="plate-inner">
            <div class="id-strip">
              <span class="tiny-label">SL REFERENCE: <b class="val-red">{{ SO_NO }}</b></span>
            </div>
            <h2 class="customer-name-mini">{{ CUSTOMER_NAME }}</h2>
            <div class="address-grid-mini">
              <ion-icon :icon="locationOutline"></ion-icon>
              <p>{{ DELIVERY_ADDRESS }}</p>
            </div>
            <div class="comm-strip-mini">
              <div class="phone-data">
                <ion-icon :icon="callOutline"></ion-icon>
                <span>{{ CONTACT_NUMBER }}</span>
              </div>
              <div class="comm-actions">
                <a :href="'tel:' + CONTACT_NUMBER" class="m-btn call">CALL</a>
                <a :href="'sms:' + CONTACT_NUMBER" class="m-btn sms">SMS</a>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Navigation Overlay (Ultra Slim) -->
        <div class="nav-module-mini" v-if="loadMap">
          <div class="map-frame">
            <google-map :my-location="myLocation" :destinationName="deliveryDestination"></google-map>
          </div>
        </div>

        <!-- 4. Shipment Manifest (Condensed) -->
        <div class="manifest-section-mini">
          <label class="section-tiny-label">SHIPMENT CONTENTS ({{ delivery_detailes.length }} ITEMS)</label>
          <div class="ledger-box">
            <div class="ledger-row" v-for="order in delivery_detailes" :key="order.PRODUCT_NAME">
              <div class="p-thumb">
                 <img :src="generateImageUrl(order.THUMBNAIL_IMAGE)" @error="(e) => {e.target.src='https://placehold.co/100x100/f8fafc/94a3b8?text=No+Image';}" />
              </div>
              <div class="p-data">
                  <span class="p-name">{{ order.PRODUCT_NAME }}</span>
                  <div class="p-specs">
                      <span>QTY: <b>{{ order.PACKING_QTY }}</b></span>
                      <span class="p-price">S${{ order.TOTAL_PRICE }}</span>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. THE NEW "WOW" INSTRUCTION LEDGER -->
        <div class="ops-ledger-container">
            <label class="section-tiny-label">OPERATIONAL LOGS</label>
            <div class="ledger-card-unified">
                
                <!-- Payment Log Row -->
                <div class="log-tile blue-accent">
                    <div class="log-icon-box"><ion-icon :icon="cardOutline"></ion-icon></div>
                    <div class="log-content">
                        <label>PAYMENT LOG</label>
                        <p>{{ PAYMENT_INSTRUCTION || 'No specific instructions' }}</p>
                    </div>
                </div>

                <!-- Delivery Log Row -->
                <div class="log-tile amber-accent">
                    <div class="log-icon-box"><ion-icon :icon="documentTextOutline"></ion-icon></div>
                    <div class="log-content">
                        <label>DELIVERY LOG</label>
                        <p>{{ DELIVERY_INSTRUCTION || 'Standard drop-off protocol' }}</p>
                    </div>
                </div>

                <!-- Payment Mode Row -->
                <div class="log-tile ruby-accent last">
                    <div class="log-icon-box"><ion-icon :icon="walletOutline"></ion-icon></div>
                    <div class="log-content">
                        <label>COLLECTION MODE</label>
                        <div class="mode-highlight">{{ PAYMENT_MODE }}</div>
                    </div>
                </div>

            </div>
        </div>

        <!-- 6. Bottom Command Console (Fixed) -->
        <footer class="command-console">
            <ion-button v-if="DELIVERY_STATUS == 'Assigned Delivery'" expand="block" class="btn-executive collect" @click="collectDeliveryStatus">
                <ion-icon :icon="downloadOutline" slot="start"></ion-icon> COLLECT SHIPMENT
            </ion-button>

            <ion-button v-if="DELIVERY_STATUS == 'Collected'" expand="block" class="btn-executive progress" @click="outForDelivery">
                <ion-icon :icon="paperPlaneOutline" slot="start"></ion-icon> START DISPATCH
            </ion-button>

            <div class="active-dual-commands" v-if="(DELIVERY_STATUS == 'Delivery In Progress'|| DELIVERY_STATUS == 'Pending Delivery') && !notdelivery">
                <ion-button class="btn-executive success" @click="deliveryItemNew">
                    <ion-icon :icon="checkmarkDoneOutline" slot="start"></ion-icon> DELIVERED
                </ion-button>
                <ion-button class="btn-executive fail" @click="notDelivery">
                    <ion-icon :icon="closeCircleOutline" slot="start"></ion-icon> FAILED
                </ion-button>
            </div>

            <div class="failure-drawer fade-in" v-if="notdelivery">
                 <div class="input-wrap">
                    <ion-input v-model="NOT_DELIVERY" placeholder="Enter failure reason..."></ion-input>
                    <ion-button @click="reasonForNotDelivery" class="mini-submit-btn">SUBMIT</ion-button>
                 </div>
            </div>
        </footer>
      </div>
    </div>
  </master>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonIcon, IonButton, IonInput } from '@ionic/vue';
import { 
    calendarOutline, locationOutline, callOutline, chatbubbleEllipsesOutline, 
    mapOutline, downloadOutline, paperPlaneOutline, checkmarkDoneOutline, 
    closeCircleOutline, cubeOutline, cardOutline, documentTextOutline, walletOutline 
} from 'ionicons/icons';
import GoogleMap from "@/views/driver/googleMap.vue"
import myorders from "@/services/Myorders";
import pick from '@/services/pick';

export default defineComponent({
    name: "DeliveryDetailsPremium",
    components: { IonIcon, IonButton, IonInput, GoogleMap },
    setup() {
        return { 
            calendarOutline, locationOutline, callOutline, chatbubbleEllipsesOutline, 
            mapOutline, downloadOutline, paperPlaneOutline, checkmarkDoneOutline, 
            closeCircleOutline, cubeOutline, cardOutline, documentTextOutline, walletOutline 
        };
    },
    data() {
        return {
            notdelivery: false,
         imageUrl: `https://uat-hlyongapi.cssdemo.dev/public/uploaded_files`,
            ORDER_NO: "", myLocation: {}, loadMap: false, NOT_DELIVERY: "",
            DELIVERY_DATE: "", CUSTOMER_NAME: "", DELIVERY_AMOUNT: "",
            DELIVERY_COUNTRY: "", DELIVERY_ADDRESS: "", DELIVERY_PIN_CODE: "",
            delivery_detailes: [], PAYMENT_INSTRUCTION: "", DELIVERY_INSTRUCTION: "",
            PAYMENT_MODE: "", CONTACT_NUMBER: "", SO_NO: '', DELIVERY_STATUS: ''
        };
    },
    computed: {
        deliveryDestination() { return `${this.DELIVERY_ADDRESS},${this.DELIVERY_PIN_CODE},${this.DELIVERY_COUNTRY}`; }
    },
    mounted() { this.allGetDataFromLocalStorageOrderDetailes(); this.fetchMyGeoLocation(); },
    methods: {
        fetchMyGeoLocation() { myorders.getLocations({ considerIp: "true" }).then((res) => { this.myLocation = res.data.location; this.loadMap = true; }); },
        generateImageUrl(img) { return img ? `${this.imageUrl}/${img}` : ''; },
        notDelivery() { this.notdelivery = true; },
        deliveryItemNew() { window.location.href = "/deliverd"; },
        allGetDataFromLocalStorageOrderDetailes() {
            let getdata = localStorage.getItem("deliveryItem");
            if (getdata) {
                const d = JSON.parse(getdata);
                this.ORDER_NO = d.DELIVERY_ORDER_NO; this.SO_NO = d.SO_NO;
                this.CUSTOMER_NAME = d.CUSTOMER_NAME; this.DELIVERY_DATE = d.DELIVERY_DATE;
                this.DELIVERY_ADDRESS = d.DELIVERY_ADDRESS; this.DELIVERY_PIN_CODE = d.DELIVERY_PIN_CODE;
                this.DELIVERY_COUNTRY = d.DELIVERY_COUNTRY; this.CONTACT_NUMBER = d.CONTACT_NUMBER;
                this.DELIVERY_STATUS = d.DELIVERY_STATUS; this.PAYMENT_INSTRUCTION = d.PAYMENT_INSTRUCTION;
                this.DELIVERY_INSTRUCTION = d.DELIVERY_INSTRUCTION; this.PAYMENT_MODE = d.COLLECTION_PAYMENT_MODE;
                if (this.DELIVERY_STATUS == "Not Delivered") this.notdelivery = true;
            }
            let delivery_order = localStorage.getItem("deliveryOrderItem");
            if (delivery_order) this.delivery_detailes = JSON.parse(delivery_order);
        },
        collectDeliveryStatus() { pick.deliveryStatus({ ITEM: "STATUS", DELIVERY_ORDER_ID: JSON.parse(localStorage.getItem("deliveryItem")).DELIVERY_ORDER_SYS_ID, DELIVERY_STATUS: "Collect" }).then(() => { window.location.href = "/deliveryjob"; }); },
        outForDelivery() { pick.outDeliveryStaus({ ITEM: "STATUS", DELIVERY_ORDER_ID: JSON.parse(localStorage.getItem("deliveryItem")).DELIVERY_ORDER_SYS_ID, DELIVERY_STATUS: "Delivery In Progress" }).then(() => { window.location.href = "/deliveryjob"; }); },
        reasonForNotDelivery() { pick.notdelivery({ ITEM: "STATUS", DELIVERY_ORDER_ID: JSON.parse(localStorage.getItem("deliveryItem")).DELIVERY_ORDER_SYS_ID, DELIVERY_STATUS: "Not Delivered", REJECT_REASON: this.NOT_DELIVERY }).then(() => { window.location.href = "/deliveryjob"; }); }
    }
});
</script>

<style scoped>
/* 1. Global Terminal Setup */
.technical-manifesto-portal {
  min-height: 100vh;
  background-color: #F4F7F9;
  padding-bottom: 110px;
}

/* 2. Slim Executive Header */
.slim-terminal-header {
  background: white;
  padding: 30px 20px 15px;
  border-bottom: 1px solid #E2E8F0;
}
.header-content { display: flex; justify-content: space-between; align-items: flex-end; }
.status-tag { display: flex; align-items: center; gap: 5px; font-size: 8px; font-weight: 900; color: #94A3B8; letter-spacing: 1px; }
.pulse-ruby { width: 6px; height: 6px; background: #DC2626; border-radius: 50%; box-shadow: 0 0 8px rgba(220, 38, 38, 0.4); }
.main-title { color: #0F172A; font-size: 19px; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
.op-badge { background: #0F172A; color: white; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 900; }
.date-ledger { font-size: 9px; font-weight: 700; color: #94A3B8; margin-top: 3px; }

.terminal-body { padding: 12px; }

/* 3. Tech Plates (Condensed) */
.tech-plate { background: white; border-radius: 12px; border: 1px solid #E2E8F0; box-shadow: 0 4px 10px rgba(0,0,0,0.02); padding: 12px; margin-bottom: 12px; position: relative; overflow: hidden; }
.plate-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #DC2626; }

.tiny-label { font-size: 8px; font-weight: 900; color: #94A3B8; letter-spacing: 0.5px; }
.val-red { color: #DC2626; }
.customer-name-mini { font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 4px; }
.address-grid-mini { display: flex; gap: 5px; font-size: 10px; color: #64748B; line-height: 1.3; font-weight: 600; margin-bottom: 10px; }

.comm-strip-mini { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px dashed #F1F5F9; }
.phone-data { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 800; color: #0F172A; }
.comm-btn { padding: 5px 12px; border-radius: 6px; font-size: 9px; font-weight: 900; text-decoration: none; }
.comm-btn.call { background: #ECFDF5; color: #059669; }
.comm-btn.sms { background: #EFF6FF; color: #2563EB; }

/* 4. Map & Ledger Modules */
.nav-module-mini { height: 110px; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; margin-bottom: 12px; }
.section-tiny-label { font-size: 8px; font-weight: 900; color: #94A3B8; margin: 0 0 6px 5px; display: block; letter-spacing: 1px; }

.ledger-box { background: white; border-radius: 10px; border: 1px solid #E2E8F0; padding: 0 10px; max-height: 120px; overflow-y: auto; margin-bottom: 12px;}
.ledger-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #F8FAFC; }
.p-thumb { width: 32px; height: 32px; border-radius: 6px; overflow: hidden; background: #F8FAFC; border: 1px solid #F1F5F9; }
.p-thumb img { width: 100%; height: 100%; object-fit: cover; }
.p-name { font-size: 10px; font-weight: 800; color: #1E293B; flex: 1; }
.p-specs { display: flex; gap: 10px; font-size: 9px; color: #64748B; font-weight: 700; }
.p-price { color: #059669; font-weight: 900; }

/* 5. THE NEW OPS LEDGER DESIGN (Premium/Rich Part) */
.ledger-card-unified {
    background: white;
    border-radius: 12px;
    border: 1px solid #E2E8F0;
    overflow: hidden;
    box-shadow: 0 6px 15px rgba(0,0,0,0.03);
}

.log-tile {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    border-bottom: 1px solid #F1F5F9;
    position: relative;
}

.log-tile.last { border-bottom: none; }

.log-icon-box {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    margin-right: 15px;
}

.log-content { flex: 1; }
.log-content label { display: block; font-size: 7px; font-weight: 900; color: #94A3B8; margin-bottom: 2px; }
.log-content p { font-size: 10px; font-weight: 700; color: #334155; margin: 0; line-height: 1.2; }

/* Dynamic Accent Colors */
.blue-accent .log-icon-box { background: #EEF2FF; color: #4F46E5; }
.blue-accent { border-left: 3px solid #4F46E5; }

.amber-accent .log-icon-box { background: #FFFBEB; color: #D97706; }
.amber-accent { border-left: 3px solid #D97706; }

.ruby-accent .log-icon-box { background: #FEF2F2; color: #DC2626; }
.ruby-accent { border-left: 3px solid #DC2626; }

.mode-highlight { font-size: 13px; font-weight: 900; color: #DC2626; letter-spacing: 0.5px; }

/* 6. Action Console */
.command-console { position: fixed; bottom: 0; left: 0; right: 0; background: white; padding: 15px 15px 25px; border-top: 1px solid #E2E8F0; z-index: 1000; box-shadow: 0 -8px 25px rgba(0,0,0,0.05); }
.btn-executive { --border-radius: 8px; height: 48px; font-weight: 900; font-size: 12px; margin: 0; letter-spacing: 0.5px; }
.btn-executive.collect { --background: #0F172A; }
.btn-executive.progress { --background: #2563EB; }
.btn-executive.success { --background: #059669; flex: 1; }
.btn-executive.fail { --background: #DC2626; flex: 1; }
.active-dual-commands { display: flex; gap: 8px; }

.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; } }
</style>