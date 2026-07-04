<template>
  <master>
    <div class="technical-dispatch-portal">
      
      <!-- 1. Ultra-Slim Executive Header -->
      <header class="slim-terminal-header">
        <div class="header-top">
          <div class="title-stack">
        
            <h1 class="main-title">Job Fulfillment</h1>
          </div>
          <div class="order-id-badge">#{{ ORDER_NO }}</div>
        </div>

        <!-- Tab Switcher to prevent scrolling -->
        <div class="segment-wrapper">
          <div class="segment-btn" :class="{ active: activeStage === 'mission' }" @click="activeStage = 'mission'">
            1. Product Details
          </div>
          <div class="segment-btn" :class="{ active: activeStage === 'fulfillment' }" @click="activeStage = 'fulfillment'">
            2. Validate & Sign
          </div>
        </div>
      </header>

      <div class="stage-content">
        
        <!-- STAGE 1: MISSION DETAILS (Customer, Map, Items) -->
        <div v-if="activeStage === 'mission'" class="fade-in">
          <div class="tech-plate">
            <div class="plate-inner">
              <h2 class="customer-name-mini">{{ CUSTOMER_NAME }}</h2>
              <div class="address-row-mini">
                <ion-icon :icon="locationOutline"></ion-icon>
                <p>{{ DELIVERY_ADDRESS }}</p>
              </div>
              <div class="mini-comm-bar">
                <a :href="'tel:' + CONTACT_NUMBER" class="m-btn call"><ion-icon :icon="callOutline"></ion-icon></a>
                <a :href="'sms:' + CONTACT_NUMBER" class="m-btn sms"><ion-icon :icon="chatbubbleEllipsesOutline"></ion-icon></a>
                <span class="phone-ledger">{{ CONTACT_NUMBER }}</span>
              </div>
            </div>
          </div>

          <div class="map-module-mini" v-if="loadMap">
            <google-map :my-location="myLocation" :destinationName="deliveryDestination"></google-map>
          </div>

          <div class="manifest-ledger-mini">
            <label class="section-tiny-label">SHIPMENT MANIFEST ({{ delivery_detailes.length }} ITEMS)</label>
            <div class="ledger-scroll">
              <div class="ledger-row-mini" v-for="order in delivery_detailes" :key="order.PRODUCT_NAME">
                <div class="p-thumb-box">
                    <img :src="generateImageUrl(order.THUMBNAIL_IMAGE)" />
                </div>
                <div class="p-info-mini">
                  <span class="p-name">{{ order.PRODUCT_NAME }}</span>
                  <div class="p-stats">
                    <span>Qty: <b>{{ order.PACKING_QTY }}</b></span>
                    <!-- <span class="p-price">S${{ order.TOTAL_PRICE }}</span> -->
                      <!-- <span class="p-price">S${{ calculateLineTotal(order.PACKING_QTY, order.UNIT_PRICE) }}</span> -->
                       <span class="p-price">
                        S${{ calculateLineTotal(order.PACKING_QTY, order.UNIT_PRICE, GST_APPLICABLE) }}
                        <small v-if="GST_APPLICABLE == 1" style="font-size: 7px; color: #94A3B8;">(Inc. 9% GST)</small>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ion-button expand="block" class="next-stage-btn" @click="activeStage = 'fulfillment'">
            PROCEED TO VALIDATION <ion-icon :icon="arrowForwardOutline" slot="end"></ion-icon>
          </ion-button>
        </div>

        <!-- STAGE 2: FULFILLMENT (Payment, Proofs, Signature) -->
        <div v-if="activeStage === 'fulfillment'" class="fade-in">
          
          <div class="tech-plate payment-plate">
            <label class="section-tiny-label">MONEY COLLECTION</label>
            <div class="amount-input-wrap">
              <span class="currency">S$</span>
              <!-- <ion-input type="number" v-model="COLLECTED_AMOUNT" placeholder="0.00" class="rich-amount-input"></ion-input> -->
                <span class="rich-amount-input">{{ Number(GRAND_TOTAL).toFixed(2) }}</span>
            </div>
          </div>

          <!-- Proof Upload Grid -->
          <div class="evidence-grid">
            <div class="evidence-box" @click="triggerInput('payment')">
               <label>PAYMENT PROOF</label>
               <div class="box-inner">
                  <ion-icon v-if="!urlnew && !employee_img" :icon="cameraOutline"></ion-icon>
                  <img v-else :src="urlnew || `${imageUrl}/${employee_img}`" />
               </div>
            </div>
            <div class="evidence-box" @click="triggerInput('delivery')">
               <label>DELIVERY PROOF</label>
               <div class="box-inner">
                  <ion-icon v-if="!urlnew2 && !DELIVERY_PROOF" :icon="imageOutline"></ion-icon>
                  <img v-else :src="urlnew2 || `${imageUrl}/${DELIVERY_PROOF}`" />
               </div>
            </div>
          </div>

          <!-- HIDDEN NATIVE INPUTS (Your previous working logic) -->
          <input type="file" accept="image/*" capture="environment" ref="payInput" @change="onFileChange" hidden>
          <input type="file" accept="image/*" capture="environment" ref="delInput" @change="onfilenewchange" hidden>

          <!-- Signature Pad -->
          <div class="tech-plate signature-plate">
            <label class="section-tiny-label">CUSTOMER ACKNOWLEDGEMENT</label>
            <div class="sig-pad-wrapper">
              <img v-if="DELIVERY_ACKNOWLEDGEMENT" :src="`${imageUrl}/${DELIVERY_ACKNOWLEDGEMENT}`" class="sig-img-preview" />
              <SignaturePad v-else @setSignatureValue="setSignatureValue" ref="signaturePad" />
              <button class="clear-sig-btn" @click="resetSignature">CLEAR</button>
            </div>
          </div>

          <div class="remarks-mini">
            <ion-input v-model="DELIVERY_REMARKS" placeholder="Add remarks (Optional)..." class="ledger-input-mini"></ion-input>
          </div>

          <div class="footer-actions" v-if="DELIVERY_STATUS == 'Delivery In Progress'|| DELIVERY_STATUS == 'Pending Delivery'">
            <ion-button expand="block" class="submit-job-btn" @click="handleCompleteJob">
              <ion-icon :icon="checkmarkDoneOutline" slot="start"></ion-icon>
              SUBMIT MISSION
            </ion-button>
          </div>
        </div>
      </div>

      <ion-loading :is-open="isLoading" :message="loaderMsg" spinner="crescent"></ion-loading>
    </div>
  </master>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IonIcon, IonInput, IonButton, IonLoading, actionSheetController,alertController } from '@ionic/vue';
import { 
    calendarOutline, locationOutline, callOutline, chatbubbleEllipsesOutline, 
    cameraOutline, imageOutline, checkmarkDoneOutline, refreshOutline,
    arrowForwardOutline, cubeOutline 
} from 'ionicons/icons';
import SignaturePad from "@/views/signature-pad/SignaturePad.vue";
import GoogleMap from "@/views/driver/googleMap.vue";
import myorders from "@/services/Myorders";
import pick from '@/services/pick';

export default defineComponent({
  name: "DeliveryPendingTechnical",
  components: { IonIcon, IonInput, IonButton, IonLoading, SignaturePad, GoogleMap },
  setup() {
    return { 
      calendarOutline, locationOutline, callOutline, chatbubbleEllipsesOutline, 
      cameraOutline, imageOutline, checkmarkDoneOutline, arrowForwardOutline, cubeOutline 
    };
  },
  data() {
    return {
      activeStage: 'mission',
      isLoading: false,
      loaderMsg: "Syncing Ledger...",
      showError: false,
      imageUrl: `https://uat-hlyongapi.cssdemo.dev/public/uploaded_files`,
      myLocation: {}, loadMap: false,
      ORDER_NO: "", SO_NO: "", CUSTOMER_NAME: "", DELIVERY_DATE: "",
      DELIVERY_ADDRESS: "", DELIVERY_PIN_CODE: "", DELIVERY_COUNTRY: "",
      CONTACT_NUMBER: "", COLLECTED_AMOUNT: "", DELIVERY_STATUS: "",
      DELIVERY_REMARKS: "", delivery_detailes: [],
      GRAND_TOTAL: 0,
      urlnew: null as any, urlnew2: null as any,
      selectedFile: null as any, selectedFilenew: null as any,
      owner_signature_file: null as any,
      employee_img: null, DELIVERY_PROOF: null, DELIVERY_ACKNOWLEDGEMENT: null,
      GST_APPLICABLE: 0
    };
  },
  computed: {
    deliveryDestination() { return `${this.DELIVERY_ADDRESS},${this.DELIVERY_PIN_CODE},${this.DELIVERY_COUNTRY}`; }
  },
  mounted() { 
    this.allGetDataFromLocalStorageOrderDetailes(); 
    this.fetchMyGeoLocation(); 
  },
  methods: {

    calculateLineTotal(qty: any, price: any, gstApplicable: number) {
        if (!qty || !price) return '0.00';
        
        const numericQty = parseFloat(String(qty).replace(/[^0-9.]/g, '')) || 0;
        const numericPrice = parseFloat(String(price).replace(/,/g, '')) || 0;
        
        let total = numericQty * numericPrice;

        // Apply 9% GST if enabled
        if (gstApplicable == 1) {
            total = total * 1.09;
        }

        return total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    triggerInput(type: string) {
        if(type === 'payment') (this.$refs.payInput as HTMLInputElement).click();
        else (this.$refs.delInput as HTMLInputElement).click();
    },
    onFileChange(e: any) {
      this.selectedFile = e.target.files[0];
      if (this.selectedFile) this.urlnew = URL.createObjectURL(this.selectedFile);
    },
    onfilenewchange(e: any) {
      this.selectedFilenew = e.target.files[0];
      if (this.selectedFilenew) this.urlnew2 = URL.createObjectURL(this.selectedFilenew);
    },
    async handleCompleteJob() {
      // if (!this.COLLECTED_AMOUNT || parseFloat(this.COLLECTED_AMOUNT) <= 0) {
      //    this.showError = true;
         
      //     const alert = await alertController.create({
      //     header: 'Validation Error',
      //     message: 'Please enter the collected amount before submitting the mission.',
      //     buttons: ['OK']
      //   });
      //   await alert.present();

      //    return;
        
      //   }
      
      this.isLoading = true;
      this.loaderMsg = "Uploading Proofs...";

      try {
        // 1. Start Uploads
        if (this.owner_signature_file) await this.uploadGeneric(this.owner_signature_file, pick.signatureimage);
        if (this.selectedFile) await this.uploadGeneric(this.selectedFile, pick.PostImage);
        if (this.selectedFilenew) await this.uploadGeneric(this.selectedFilenew, pick.PostImagenew);

        // 2. WAIT FOR SERVER: 2 Second timeout to ensure files are moved to folder
        this.loaderMsg = "Finalizing Server Sync...";
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. Finalize Status
        const d = JSON.parse(localStorage.getItem("deliveryItem") || '{}');
        await pick.outDeliveryStaus({
            ITEM: "STATUS", DELIVERY_ORDER_ID: d.DELIVERY_ORDER_SYS_ID,
            DELIVERY_STATUS: "Deliverd", COLLECTED_AMOUNT: this.GRAND_TOTAL,
            PAYMENT_PROOF: this.selectedFile?.name || this.employee_img,
            DELIVERY_PROOF: this.selectedFilenew?.name || this.DELIVERY_PROOF,
            DELIVERY_ACKNOWLEDGEMENT: this.owner_signature_file?.name || this.DELIVERY_ACKNOWLEDGEMENT,
            DELIVERY_REMARKS: this.DELIVERY_REMARKS
        });

        window.location.href = "/SelfCollected";
      } catch (err) {
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },
    uploadGeneric(file: File, serviceFunc: Function) {
      const fd = new FormData();
      fd.append("FILE", file);
      return serviceFunc(fd);
    },
    fetchMyGeoLocation() { myorders.getLocations({ considerIp: "true" }).then((res) => { this.myLocation = res.data.location; this.loadMap = true; }); },
    setSignatureValue(val: any) { const fn = `${new Date().valueOf()}_sig.jpeg`; this.owner_signature_file = this.convertDataUrlToFile(val, fn); },
    convertDataUrlToFile(dataUrl: any, filename: string) {
      const arr = dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      return new File([u8arr], filename, { type: mime });
    },
    resetSignature() { (this.$refs.signaturePad as any).resetSign(); },
    generateImageUrl(img: string) { return img ? `https://uat-hlyongapi.cssdemo.dev/public/uploaded_files/${img}` : ''; },
    allGetDataFromLocalStorageOrderDetailes() {
      const getdata = localStorage.getItem("deliveryItem");
      if (getdata) {
        const d = JSON.parse(getdata);
        this.ORDER_NO = d.DELIVERY_ORDER_NO; this.SO_NO = d.SO_NO;
        this.CUSTOMER_NAME = d.CUSTOMER_NAME; this.DELIVERY_DATE = d.DELIVERY_DATE;
        this.DELIVERY_ADDRESS = d.DELIVERY_ADDRESS; this.DELIVERY_PIN_CODE = d.DELIVERY_PIN_CODE;
        this.DELIVERY_COUNTRY = d.DELIVERY_COUNTRY; this.CONTACT_NUMBER = d.CONTACT_NUMBER;
        this.COLLECTED_AMOUNT = d.COLLECTED_AMOUNT; this.DELIVERY_STATUS = d.DELIVERY_STATUS;
        this.GRAND_TOTAL = d.GRAND_TOTAL || 0;
        this.employee_img = d.PAYMENT_PROOF; this.DELIVERY_PROOF = d.DELIVERY_PROOF;
        this.DELIVERY_ACKNOWLEDGEMENT = d.DELIVERY_ACKNOWLEDGEMENT;
        this.GST_APPLICABLE = d.GST_APPLICABLE || 0; 
      }
      const items = localStorage.getItem("deliveryOrderItem");
      if (items) this.delivery_detailes = JSON.parse(items);
    }
  }
});
</script>

<style scoped>
.technical-dispatch-portal { min-height: 100vh; background-color: #F4F7F9; }
.slim-terminal-header { background: white; padding: 30px 20px 0; border-bottom: 1px solid #E2E8F0; }
.header-top { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 15px; }
.status-tag { display: flex; align-items: center; gap: 5px; font-size: 8px; font-weight: 900; color: #94A3B8; letter-spacing: 1px; }
.pulse-ruby { width: 6px; height: 6px; background: #DC2626; border-radius: 50%; box-shadow: 0 0 8px rgba(220, 38, 38, 0.4); }
.main-title { color: #0F172A; font-size: 19px; font-weight: 900; margin: 0; letter-spacing: -0.5px; }
.order-id-badge { background: #0F172A; color: white; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 900; }

.segment-wrapper { display: flex; gap: 10px; padding: 10px 0 15px; }
.segment-btn { flex: 1; text-align: center; font-size: 10px; font-weight: 800; color: #94A3B8; padding: 10px; border-radius: 10px; background: #F8FAFC; border: 1px solid #E2E8F0; text-transform: uppercase; }
.segment-btn.active { background: #DC2626; color: white; border-color: #DC2626; }

.stage-content { padding: 15px; }

.tech-plate { background: white; border-radius: 12px; margin-bottom: 15px; border: 1px solid #E2E8F0; box-shadow: 0 4px 10px rgba(0,0,0,0.02); padding: 12px 15px; }
.customer-name-mini { font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 5px; }
.address-row-mini { display: flex; gap: 5px; font-size: 10px; color: #64748B; line-height: 1.3; font-weight: 600; }
.address-row-mini ion-icon { color: #DC2626; font-size: 14px; }

.mini-comm-bar { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
.m-btn { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; text-decoration: none; }
.m-btn.call { background: #ECFDF5; color: #059669; }
.m-btn.sms { background: #EFF6FF; color: #2563EB; }
.phone-ledger { font-size: 12px; font-weight: 800; color: #0F172A; margin-left: auto; }

.map-module-mini { height: 130px; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; margin-bottom: 15px; }
.section-tiny-label { font-size: 8px; font-weight: 900; color: #94A3B8; letter-spacing: 1px; margin-bottom: 8px; display: block; text-transform: uppercase; }

.manifest-ledger-mini { background: white; padding: 10px; border-radius: 12px; border: 1px solid #E2E8F0; }
.ledger-scroll { max-height: 100px; overflow-y: auto; }
.ledger-row-mini { padding: 6px 0; border-bottom: 1px dashed #F1F5F9; display: flex; gap: 10px; align-items: center; }
.p-thumb-box img { width: 35px; height: 35px; border-radius: 6px; object-fit: cover; background: #f8f9fa; }
.p-info-mini { flex: 1; }
.p-name { font-size: 10px; font-weight: 800; color: #0F172A; }
.p-stats { display: flex; justify-content: space-between; font-size: 9px; color: #64748B; font-weight: 700; }
.p-price { color: #059669; font-weight: 800; }

.next-stage-btn { --background: #0F172A; --border-radius: 10px; height: 48px; font-weight: 900; font-size: 11px; margin-top: 10px; }

/* Stage 2 */
.amount-input-wrap { display: flex; align-items: center; background: #F8FAFC; border-radius: 10px; padding: 0 15px; border: 1px solid #E2E8F0; }
.currency { font-weight: 900; color: #DC2626; margin-right: 10px; font-size: 18px; }
.rich-amount-input { font-weight: 900; font-size: 22px; color: #0F172A; }

.evidence-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
.evidence-box { background: white; padding: 10px; border-radius: 12px; border: 1px solid #E2E8F0; text-align: center; cursor: pointer; }
.evidence-box label { font-size: 7px; font-weight: 900; color: #94A3B8; display: block; margin-bottom: 5px; }
.box-inner { height: 75px; background: #F8FAFC; border: 1.5px dashed #CBD5E1; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.box-inner ion-icon { font-size: 24px; color: #CBD5E1; }
.box-inner img { width: 100%; height: 100%; object-fit: cover; }

.sig-pad-wrapper { background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 12px; height: 120px; position: relative; overflow: hidden; }
.clear-sig-btn { position: absolute; bottom: 5px; right: 5px; font-size: 8px; font-weight: 900; background: #FEF2F2; color: #DC2626; border: none; padding: 4px 8px; border-radius: 4px; z-index: 10; }
.sig-img-preview { height: 100%; width: auto; margin: 0 auto; display: block; }

.ledger-input-mini { --background: white; border: 1px solid #E2E8F0; border-radius: 8px; font-size: 11px; font-weight: 700; height: 40px; --padding-start: 10px; margin-top: 10px; }
.submit-job-btn { --background: #DC2626; --border-radius: 12px; height: 54px; font-weight: 900; font-size: 13px; margin-top: 15px; box-shadow: 0 8px 16px rgba(220, 38, 38, 0.2); }

.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; } }
</style>