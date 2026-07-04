<template>
    <!-- <master> -->
        <ion-text>    {{ activeLanguage == 'ENG' ? 'Order History' : 'Order History' }}</ion-text>
    
        <ion-searchbar placeholder="Search by name" class="searchbars"
            @ionInput="onSearch($event.target.value)"></ion-searchbar>

        <ion-card class="order-card " v-for="order in filteredOrder" :key=filteredOrder.id>
            <ion-text class="company-name text-dark d-flex" v-show="!showFullName">{{ order.CUSTOMER_NAME?.slice(0, 15)
            }}&nbsp;<span class="readMore" @click="showFullName = !showFullName"> read more</span>
            </ion-text>
            <ion-text class="company-name text-dark " v-show="showFullName">{{ order.CUSTOMER_NAME }} &nbsp; <span
                    class="readMore" @click="showFullName = !showFullName"> show less</span>
            </ion-text>
            <div class="d-flex space-between">
                <div> <ion-text class="sub-text">{{ order.DELIVERY_ADDRESS?.slice(0, 20) }} , {{ order.DELIVERY_PIN_CODE
                }}</ion-text>
                </div>
                <div><ion-text class="order-status-green">
                        {{ String(order.DELIVERY_STATUS).trim() }}
                    </ion-text></div>
            </div>
            <div class="d-flex space-between">
                <div><ion-text class="sub-text">Hp {{ order.MOBILE_NO }}</ion-text></div>
                <div> </div>
            </div>
            <div class="d-flex space-between">
                <div> <ion-text class="sub-text text-primary">Order Id</ion-text></div>
                <div> <ion-text class="sub-text text-primary">{{ order.DELIVERY_ORDER_NO }}</ion-text></div>
            </div>
            <div class="d-flex space-between">
                <div> <ion-text class="sub-text">Amount to Collect </ion-text></div>
                <div> <ion-text class="sub-text"> {{ order.AMOUNT_TO_COLLECT }}</ion-text></div>
            </div>
            <div class="d-flex space-between">
                <div> <ion-text class="sub-text">Collected Amount</ion-text></div>
                <div> <ion-text class="sub-text"> {{ order.COLLECTION_AMOUNT }}</ion-text></div>
            </div>
            <div class="d-flex space-between">
                <div> <ion-text class="sub-text">Payment Mode </ion-text></div>
                <div> <ion-text class="sub-text"> {{ order.COLLECTION_PAYMENT_MODE }}</ion-text></div>
            </div>
            <div class="d-flex space-between">
                <div> <ion-text class="sub-text">{{ order.DELIVERY_DATE }}</ion-text></div>
                <div> <ion-text class="sub-text">{{ order.DELIVERY_TIME }}</ion-text></div>
            </div>




            <ion-text class="sub-text">Delivery Remark : {{ order.DELIVERY_REMARKS }}</ion-text><br>
            <ion-text class="sub-text">Payment Remark : {{ order.PAYMENT_REMARKS }}</ion-text>

        </ion-card>

    <!-- </master> -->
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { IonGrid, IonRow, IonCol, IonText, IonCard, IonSearchbar, IonLabel } from '@ionic/vue';
import { mapGetters, mapActions } from "vuex";
import Myorders from '@/services/Myorders';

export default defineComponent({
    name: 'orderHistory',
    components: {
        IonText, IonGrid, IonRow, IonCol, IonCard, IonSearchbar, IonLabel
    },
    data() {
        return {
            showFullName: false,
            recentOrders: [],
            dynamicClass: "",
            filteredOrder: [],
        }
    },
    computed: {
     ...mapGetters([
    
     "activeLanguage",
      "languages",
    ]),
   
  
   
  

  },
    created() {
        Myorders.getOrderHistory().then((res) => {
            this.filteredOrder = res.status != "false" ? res.response : [];
            this.recentOrders = this.filteredOrder;
            console.log(this.recentOrders);
            if (this.filteredOrder.length === 0) {
                console.log("no data found");
            }
        })


    },
    mounted() {
        this.autoUpdateOrder()
    },
    methods: {
        ...mapActions([
    
    "setLanguages",
    "setActivateLanguage",
  ]),
        onSearch(item) {
            let inputLowerCase = item.toLowerCase();
            this.filteredOrder = this.recentOrders.filter(order => {
                const companyName = order.CUSTOMER_NAME.toLowerCase();
                const address = order.DELIVERY_ADDRESS.toLowerCase();
                const country = order.DELIVERY_COUNTRY.toLowerCase();
                const phone = order.MOBILE_NO.toLowerCase();
                const orderID = order.DELIVERY_ORDER_NO;
                this.dynamicClass = order.CUSTOMER_STATUS;
                return companyName.includes(inputLowerCase) || address.includes(inputLowerCase) || country.includes(inputLowerCase) || phone.includes(inputLowerCase)
            });

            ///API CAll

        },
        autoUpdateOrder() {
            Myorders.getOrderHistory().then((res) => {
                this.filteredOrder = res.status != "false" ? res.response : [];
                this.recentOrders = this.filteredOrder;
                console.log(this.recentOrders);
                if (this.filteredOrder.length === 0) {
                    console.log("no data found");
                }
            })

        }
    }
})
</script>
