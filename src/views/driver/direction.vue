<template>
  <master>
    <!--adress info-->
    <ion-grid>
      <ion-row class="d-flex space-between">
        <ion-col size="8" class="flex-coloumn">
          <ion-text class="company-name text-dark">{{
            this.CompanyName
          }}</ion-text>
          <ion-text class="sub-text"
            ><i class="fa fa-location-dot sub-text"></i>
            {{ this.DELIVERY_ADDRESS }}
          </ion-text>
          <ion-text class="sub-text ml-1"
            >{{ this.PIN_CODE }},{{ this.COUNTRY_NAME }}</ion-text
          >
        </ion-col>
        <ion-col size="4" class="flex-coloumn">
          <ion-text class="text-dark text-right company-name"
            >{{ activeLanguage == 'ENG' ? 'Delivery Date ' : '送货日期' }}</ion-text
          >
          <ion-text class="text-right sub-text">{{
            this.DELIVERY_DATE
          }}</ion-text>
          <ion-text class="text-right sub-text"
            >{{ activeLanguage == 'ENG' ? 'Hp ' : '手机号' }} {{ this.MOBILE_NO }}</ion-text
          >
        </ion-col>
      </ion-row>
    </ion-grid>
    <!--Location Map-->
    <ion-card class="map" v-if="loadMap">
      <google-map :my-location="myLocation" :destinationName="deliveryDestination"></google-map>
    </ion-card>
    <!--delivery info-->
    <ion-card class="form-adress mt-2">
      <ion-row class="orderid">
        <ion-col size="6" class="text-left flex-coloumn">
          <ion-text class="text-primary">{{ activeLanguage == 'ENG' ? 'Order Id' : '订单号' }}</ion-text>
          <ion-text class="text-dark sub-header">{{
            this.DELIVERY_ORDER_NO
          }}</ion-text>
        </ion-col>
        <ion-col size="6" class="text-right flex-coloumn">
          <ion-text class="text-primary">{{ activeLanguage == 'ENG' ? 'Date & Time' : '日期&时间' }}</ion-text>
          <ion-text class="text-dark sub-header"
            >{{ this.DELIVERY_DATE }}, {{ this.DELIVERY_TIME }}</ion-text
          >
        </ion-col>

        <ion-label class="text-left mt-1 flex-coloumn">
          <ion-label class="text-primary"> {{ activeLanguage == 'ENG' ? 'Delivery Instruction' : '送货指示' }}</ion-label>
          <ion-text>{{ this.DELIVERY_INSTRUCTION }}</ion-text>
        </ion-label>
      </ion-row>
    </ion-card>
    <!--payment info-->
    <ion-card class="form-adress mt-1">
      <ion-grid>
        <div class="text-left">
          <ion-label class="text-primary">{{ activeLanguage == 'ENG' ? 'Payment Instruction' : '付款指示' }} :</ion-label>
          <br />
          <ion-text>{{ this.PAYMENT_INSTRUCTION }}</ion-text>
        </div>
        <ion-row class="align-center">
          <ion-col class="text-left flex-coloumn" col="8">
            <ion-text class="text-primary mt-2">{{ activeLanguage == 'ENG' ? 'Amt to collect ' : '收集金额' }} :</ion-text>
          </ion-col>
          <ion-col class="text-right flex-coloumn" col="4">
            <ion-text class="mt-2">{{ this.AMOUNT_TO_COLLECT }}</ion-text>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-button
        class="btn mt-2"
        @click="goToConfirm(this.ORDER_ID)"
        size="small"
        >{{ activeLanguage == 'ENG' ? 'Out For Delivery' : '外送' }}</ion-button
      >
    </ion-card>

    <sweetAlert v-show="sweetAlert" />
  </master>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonCard,
  IonItem,
  IonButton,
  IonInput,
  IonLabel,
} from "@ionic/vue";
// import { AgmMap, AgmMarker } from '@agm/core';
// import { GmapMap, GmapMarker } from 'vue2-google-maps';
import myorders from "@/services/Myorders";
import GoogleMap from "./googleMap.vue";
import { mapGetters, mapActions } from "vuex";
import sweetAlert from "../sweetAlert.vue";
export default defineComponent({
  name: "direction",
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonCard,
    IonItem,
    IonButton,
    IonInput,
    IonLabel,
    sweetAlert,
    GoogleMap,
  },

  data() {
    return {
      sweetAlert: false,
      ORDER_ID: "",
      myLocation: {},
      loadMap: false,
      successMessage: "",
      CompanyName: "",
      DELIVERY_ADDRESS: "",
      COUNTRY_NAME: "",
      MOBILE_NO: 897775662,
      DELIVERY_DATE: "",
      DELIVERY_TIME: "",
      DELIVERY_ORDER_NO: "",
      PIN_CODE: "",
      payment: false,
      PAYMENT_INSTRUCTION: "",
      AMOUNT_TO_COLLECT: "",
      DELIVERY_INSTRUCTION: "",
    };
  },

  computed: {
    ...mapGetters([
    
    "activeLanguage",
     "languages",
   ]),
    deliveryDestination() {
        return `${this.DELIVERY_ADDRESS},${this.PIN_CODE },${this.COUNTRY_NAME }`;
    }
  },

  async mounted() {
    await this.getData();
    await this.fetchMyGeoLocation();
  },
  methods: {
    ...mapActions([
    
    "setLanguages",
    "setActivateLanguage",
  ]),
    getData() {
      let dataFromLocalStorage = localStorage.getItem("orders");
      let jsoin = JSON.parse(dataFromLocalStorage);
      // console.log(jsoin.CUSTOMER_NAME);

      this.CompanyName = jsoin.CUSTOMER_NAME;
      this.DELIVERY_ADDRESS = jsoin.DELIVERY_ADDRESS;
      this.COUNTRY_NAME = jsoin.DELIVERY_COUNTRY;
      this.MOBILE_NO = jsoin.MOBILE_NO;
      this.DELIVERY_DATE = jsoin.DELIVERY_DATE;
      this.DELIVERY_TIME = jsoin.DELIVERY_TIME;
      this.DELIVERY_ORDER_NO = jsoin.DELIVERY_ORDER_NO;
      this.PIN_CODE = jsoin.PIN_CODE;
      this.ORDER_ID = jsoin.ORDER_ID;
      this.PAYMENT_INSTRUCTION = jsoin.PAYMENT_INSTRUCTION;
      this.AMOUNT_TO_COLLECT = jsoin.AMOUNT_TO_COLLECT;
      this.DELIVERY_INSTRUCTION = jsoin.DELIVERY_INSTRUCTION;
    },
    goToConfirm() {
      let dataFromLocalStorage = localStorage.getItem("orders");
      let jsoin = JSON.parse(dataFromLocalStorage);
      myorders
        .statuschange({
          ITEM: "STATUS",
          DELIVERY_ORDER_ID: jsoin.ORDER_ID,
          DELIVERY_STATUS: "Out For Delivery",
        })
        .then((response) => {
          if (response.status == "false") {
            this.showError = true;
            this.errorMessage = response.response;
          } else {
            this.successMessage = "Delivery Status Updated Successfully";
            setTimeout(() => {
              this.sweetAlert = true;
              setTimeout(() => {
                this.sweetAlert = false;
              }, 1000);
              this.$router.push("/dashboard");
            }, 1000);
          }
        });
    },
    fetchMyGeoLocation() {
      myorders
        .getLocations({
          homeMobileCountryCode: 310,
          homeMobileNetworkCode: 410,
          radioType: "gsm",
          carrier: "Vodafone",
          considerIp: "true",
        })
        .then((res) => {
          this.myLocation = res.data.location;
          console.log(this.myLocation, "location22");
          this.loadMap = true;
        });
    },
  },
});
</script>
