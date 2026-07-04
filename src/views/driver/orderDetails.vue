<template>
    <master>
        <div class="d-flex space-between">
            <ion-label>
                <ion-text class="company-name text-dark">{{ this.CompanyName }}</ion-text> <br>
                <ion-text class="sub-text">{{ this.DELIVERY_ADDRESS  }} , {{ DELIVERY_PIN_CODE }}</ion-text><br>
                <ion-text class="sub-text">{{this. DELIVERY_COUNTRY  }}</ion-text><br>
                <ion-text class="sub-text">Hp {{ this.MOBILE_NO  }}</ion-text><br>
                <ion-text class="sub-text text-primary">Order Id</ion-text>
            </ion-label>
            <ion-label class="text-right">
                <ion-text class="hidden">Hidden</ion-text><br>
                <ion-text class="hidden">Hidden</ion-text><br>
                <ion-text class="sub-text">{{ this.DELIVERY_DATE }}</ion-text><br>
                <ion-text class="sub-text">{{this. DELIVERY_TIME }}</ion-text><br>
                <ion-text class="sub-text text-primary">{{this. DELIVERY_ORDER_NO }}</ion-text>

            </ion-label>
        </div>
        <ion-card class="order-card d-flex space-between flex-end" v-for="order in sub_json" :key=order.id>
            <ion-label>
                <ion-text class="company-name text-dark d-flex">{{ order.PRODUCT_NAME  }}
                    <ion-text :class="order.status"></ion-text>
                </ion-text>

                <ion-text class="sub-text">{{ order.PRODUCT_DESCRIPTION 
                }}</ion-text><br>
                <ion-text class="sub-text">Order : {{ order.ORDER_QTY  }} {{
                    order.UOM }}</ion-text><br>
                <ion-text class="sub-text">Remarks : {{ order.PRODUCT_REMARKS 
                }}</ion-text><br>

            </ion-label>

        </ion-card>
    </master>
</template>
<script lang="ts">
import SalesOrderService from '@/services/SalesOrderService';
import { defineComponent } from 'vue';
import{IonText,IonCard, IonLabel} from '@ionic/vue'
export default defineComponent({
    name: "orderDetails",
    components: {
IonText,IonCard, IonLabel

    },
    data() {
        return {

            CompanyName: "",
            DELIVERY_ADDRESS: "Static Delivery Address",
            DELIVERY_COUNTRY: "Static Country",
            MOBILE_NO: 897775662,
            DELIVERY_DATE: "12/10/23",
            DELIVERY_TIME: "02:15pm",
            DELIVERY_ORDER_NO: "#20536",
            DELIVERY_PIN_CODE: "02565",
            orderDetails: {},
            sub_json:[],

        }
    },
  async  mounted() {
      await  this.getData();
    },
    methods: {
        getData() {
            let orderDetailsInLocalStorage = localStorage.getItem("orders")
            let jsoin = JSON.parse(orderDetailsInLocalStorage);
          

            this.orderDetails = jsoin;
           
            
            this.CompanyName = this.orderDetails.CUSTOMER_NAME;
            this.DELIVERY_ADDRESS = this.orderDetails.DELIVERY_ADDRESS;
            this.DELIVERY_COUNTRY = this.orderDetails.DELIVERY_COUNTRY;
            this.MOBILE_NO = this.orderDetails.MOBILE_NO;
            this.DELIVERY_DATE = this.orderDetails.DELIVERY_DATE;
            this.DELIVERY_TIME = this.orderDetails.DELIVERY_TIME;
            this.DELIVERY_ORDER_NO = this.orderDetails.DELIVERY_ORDER_NO;
            this.DELIVERY_PIN_CODE = this.orderDetails.DELIVERY_PIN_CODE;

            this.sub_json =this.orderDetails.ORDER_DETAILS
           
        }
        /*  getData() {
               let specificId = this.$route.params.id;
              console.log(specificId);
  
              SalesOrderService.getSpecificOrderDetail(specificId).then((res) => {
                  this.orderDetails = res.status != "false" ? res.response : [];
                  console.log(this.orderDetails);
  
  
  
                  this.CompanyName = res.response[specificId].CUSTOMER_NAME;
                  this.DELIVERY_ADDRESS = res.response[specificId].DELIVERY_ADDRESS;
                  this.DELIVERY_COUNTRY = res.response[specificId].DELIVERY_COUNTRY;
                  this.MOBILE_NO = res.response[specificId].MOBILE_NO;
                  this.DELIVERY_DATE = res.response[specificId].DELIVERY_DATE;
                  this.DELIVERY_TIME = res.response[specificId].DELIVERY_TIME;
                  this.DELIVERY_ORDER_NO = res.response[specificId].DELIVERY_ORDER_NO;
                  this.DELIVERY_PIN_CODE = res.response[specificId].DELIVERY_PIN_CODE; 
                
                  if (this.orderDetails.length === 0) {
                      // this.setError('No Data Found');
                      console.log("no data found");
  
                  }
              })
          } */
    }
})
</script>