<template>
    <master>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
      <ion-refresher-content></ion-refresher-content>
    </ion-refresher>

        <ion-row class="d-flex space-between">
             <ion-col size="6">
                 <ion-text>
                     Unassigned Orders
                 </ion-text>
             </ion-col>
        <ion-col size="6">
                 <ion-text class="float-right">
                      
                     <input type="date"  v-model="dateSelectedUnassigned" @change="onSearchOrderUnassigned($event.target.value)" class="date-selection">
                 </ion-text>
             </ion-col>
        </ion-row>
        <!-- Orders Cards -->
        <ion-searchbar  placeholder="Search by name" class="searchbars" v-model="searchQuery" @input="filterEmployees"></ion-searchbar>
        <i class="ri-qr-scan-line "></i>
        <ion-card class="order-card d-flex space-between flex-end" v-for="order in filteredEmployees" :key=order.id
        @click="goToDriverPage(order)"   >
            <ion-label>
                <ion-text class="company-name text-dark d-flex">{{ order?.CUSTOMER_NAME?.slice(0,20) }} <ion-text :class="order.CUSTOMER_STATUS"></ion-text>
                </ion-text>
               
                    <ion-text class="sub-text">{{ order?.DELIVERY_ADDRESS?.slice(0,20) }} , {{ order.DELIVERY_PIN_CODE }}</ion-text><br>
                    <ion-text class="sub-text">{{ order.DELIVERY_COUNTRY }}</ion-text><br>
                    <ion-text class="sub-text">Hp {{ order.phone }}</ion-text><br>
                    <ion-text class="sub-text text-primary"> Order Id</ion-text><br>
               
            </ion-label>
            <ion-label class="text-right">
                    <ion-text class="hidden">Hidden</ion-text>
                    <ion-text class="sub-text">{{ order.DELIVERY_DATE }}</ion-text><br>
                    <ion-text class="sub-text">{{ order.DELIVERY_TIME }}</ion-text><br>
                    <ion-text class="sub-text text-primary">{{ order.ORDER_ID }}</ion-text>
                
            </ion-label>
        </ion-card>

    </master>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import {IonLabel, IonGrid, IonRow, IonCol, IonText, IonCard, IonSearchbar, IonAlert } from '@ionic/vue';
import myorders from '@/services/Myorders';
export default defineComponent({
    name: "unassignedOrders",
    components: {
      IonLabel,  IonText, IonGrid, IonRow, IonCol, IonCard, IonSearchbar,IonAlert
    },
    data() {
        return {
            dateSelectedUnassigned: new Date().toISOString().substr(0, 10),
            searchQuery:"",
            recentOrders: [
             
              
                   
            ],
        }
    },
    computed: {
  dateSelected: new Date().toISOString().substr(0, 10),
  filteredEmployees() {
    return this.recentOrders.filter((employee) => {
      const searchQuery = this.searchQuery ? this.searchQuery.toLowerCase() : '';
      const employeeName = employee.CUSTOMER_NAME ? employee.CUSTOMER_NAME.toLowerCase() : '';
      const DELIVERY_DATE = employee.DELIVERY_DATE ? employee.DELIVERY_DATE.toLowerCase() : '';
      const DELIVERY_ADDRESS = employee.DELIVERY_ADDRESS ? employee.DELIVERY_ADDRESS.toLowerCase() : '';
      // const DELIVERY_PIN_CODE = employee.DELIVERY_PIN_CODE ? employee.DELIVERY_PIN_CODE.toLowerCase() : '';
      const MOBILE_NO = employee.MOBILE_NO ? employee.MOBILE_NO.toLowerCase() : '';
      const DELIVERY_ORDER_NO = employee.ORDER_ID ? employee.ORDER_ID.toLowerCase() : '';
     
      
     

    
      return (
        employeeName.includes(searchQuery) ||  DELIVERY_DATE.includes(searchQuery) ||  DELIVERY_ADDRESS.includes(searchQuery)  || DELIVERY_ORDER_NO.includes(searchQuery) ||  MOBILE_NO.includes(searchQuery)
     
      );
    });
  },
  
},
    mounted(){
  this.onSearchOrderUnassigned(new Date().toISOString().substr(0, 10));
 },
    methods:{
        onSearchOrderUnassigned(searchString: any) {
  searchString = searchString || new Date().toISOString().substr(0, 10);
  myorders.dateSelectedUnassigned(searchString).then((res) => {
          this.recentOrders = res.status != "false" ? res.response : [];
          if (this.recentOrders.length === 0) {
            // this.setError('No Data Found');
         
            
          }
        })                          
    },
    filterEmployees(){

},
goToDriverPage(order){
    console.log(order);
    
    localStorage.setItem("driver", JSON.stringify(order))
    this.$router.push("/assigndriver") 
},

handleRefresh(event: CustomEvent)  {
        setTimeout(() => {
          // Any calls to load data go here
          this.onSearchOrderUnassigned(new Date().toISOString().substr(0, 10));
          event.target.complete();
        }, 2000)
      }

    }
})
</script>