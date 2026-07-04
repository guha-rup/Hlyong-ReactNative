<template>
    <master>
        <v-form>
            <!--adress info-->
            <ion-grid>
                <ion-row class="d-flex space-between">
                    <ion-col size="8" class="flex-coloumn">

                        <ion-text class="company-name text-dark" v-show="!showFullName">{{ this?.CUSTOMER_NAME?.slice(0,15) }} <span class="readMore" @click="showFullName = !showFullName">read more</span></ion-text>
                        <ion-text class="company-name text-dark" v-show="showFullName">{{ this.CUSTOMER_NAME }} <span class="readMore" @click="showFullName = !showFullName">show less</span></ion-text>
                    
                        <ion-text class="sub-text"><i class="fa fa-location-dot sub-text"></i> {{ this.DELIVERY_ADDRESS }}
                            Crescent
                        </ion-text>
                        <ion-text class="sub-text ml-1">{{ this.DELIVERY_PIN }},{{ this.DELIVERY_COUNTRY }}</ion-text>

                    </ion-col>
                    <ion-col size="4" class="flex-coloumn">

                        <ion-text class="company-name text-dark text-right">Date & Time</ion-text>
                        <ion-text class="text-right sub-text">{{ this.DELIVERY_DATE }} , {{ this.DELIVERY_TIME }}</ion-text>
                        <ion-text class="text-right sub-text">Hp {{ this.MOBILE_NO }}</ion-text>

                    </ion-col>
                </ion-row>
            </ion-grid>
            <!--payment info
        <ion-card class="form-adress mt-1">

            <ion-label class="text-primary">Payment Instruction</ion-label>
            <ion-grid>
                <ion-row>
                    <ion-col class="text-left flex-coloumn" col="8">
                        <ion-text>Order Value :</ion-text>
                        <ion-text>Balance Amt :</ion-text>
                        <ion-text>Amt to collect :</ion-text>
                    </ion-col>
                    <ion-col class="text-right flex-coloumn" col="4">
                        <ion-text>2000</ion-text>
                        <ion-text>1500</ion-text>
                        <ion-text>500</ion-text>
                    </ion-col>
                </ion-row>
            </ion-grid>

        </ion-card>-->
            <!--delivery info-->
            <ion-card class="confirmation-card">
                <ion-row class="orderi">
                    <ion-col size="6" class="text-left flex-coloumn">
                        <ion-text class="text-primary">Order Id</ion-text>
                        <ion-text class="text-dark sub-header">{{this.ORDER_ID}}</ion-text>
                    </ion-col>
                    <ion-col size="6" class="text-right">
                    </ion-col>
                </ion-row>
                <ion-row class="orderi" style="margin: 14px 0 -9px 4px;">
                    <ion-col size="12" class="text-left flex-coloumn">
                <ion-text class="text-primary">Payment Instruction</ion-text>
            </ion-col>
            <ion-col size="12" class="text-left flex-coloumn">
             
                    <p class="paymentInstruction">{{ this.PAYMENT_INSTRUCTION }}</p>
                    <!-- <ion-select label="Payment Instruction" label-placement="floating" class="select"
                        @ionChange="paymentInstruction" v-model="amntRemark">
                        <ion-select-option value="needToCollect">No Need to Collect Payment</ion-select-option>
                        <ion-select-option value="collectOnDelivery">Collect Payment on Delivery</ion-select-option>
                        <ion-select-option value="notShowAmnt">Customer already pay it</ion-select-option>
                        <ion-select-option value="cod">Cash on Delivery</ion-select-option>
                        <ion-select-option value="others">Others</ion-select-option>
                    </ion-select> -->
              
            </ion-col>
            </ion-row>
               
                <ion-item class="input-field">
                    <ion-select label="Assign Driver" label-placement="floating" class="select" v-model="assign_driver">
                        <ion-select-option  v-for="drivername in driver"
                            :key="drivername.USER_SYS_ID" :value="drivername.USER_SYS_ID" style="color:#000">{{
                                drivername.PERSON_NAME
                            }}</ion-select-option>

                    </ion-select>
                </ion-item>
                <ion-item class="input-field">
                    <ion-input label="Delivery Instruction" labelPlacement="stacked" placeholder="Enter text" v-model="this.delivery_instruction"></ion-input>
                </ion-item>
                <ion-button class="btn mt-2" size="small" type="submit" @click="goToConfirm">Assign</ion-button>
            </ion-card>
        </v-form>
        <sweetAlert v-show="sweetAlert" />
    </master>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { IonGrid, IonRow, IonCol, IonText, IonCard, IonItem, IonButton, IonInput, IonLabel, IonSelectOption, IonSelect, } from '@ionic/vue';
import myorders from '@/services/Myorders';
import sweetAlert from '../sweetAlert.vue';
export default defineComponent({
    name: "assignedOrders",
    components: {
        IonGrid, IonRow, IonCol, IonText, IonCard, IonItem, IonButton, IonInput, IonLabel,
        IonSelectOption, IonSelect,sweetAlert
    },
    data() {
        return {
            driver: [],
          
            amntRemark: "",
        
            ORDER_ID:"",
            
            sweetAlert:false,
            assign_driver: "",
     
            delivery_instruction: "",

            PAYMENT_INSTRUCTION:"",
            CUSTOMER_NAME:"",
            DELIVERY_ADDRESS:"",
            DELIVERY_PIN:"",
            DELIVERY_COUNTRY:"",
            DELIVERY_DATE:"",
            DELIVERY_TIME:"",
            MOBILE_NO:"",
            showFullName:false,

        }
    },
    mounted() {
        let order_id = localStorage.getItem("driver");
        this.dynamicField()
        this.fetchDriver()
        this.getCustomerInfo()
    },
    methods: {
        fetchDriver() {
            myorders.getDriver().then((res) => {
                if (res.status != "false") {
                    this.driver = res.response;
                } else {
                    // this.setError(res.response);
                    // this.setProducts([]);
                    console.log("error");

                }

            });
        },
      
      
      dynamicField(){
        let order_id = localStorage.getItem("driver");
            let jsoin = JSON.parse(order_id);

            this.ORDER_ID=jsoin.ORDER_ID
      },
        goToConfirm(){
            let order_id = localStorage.getItem("driver");
            let jsoin = JSON.parse(order_id);
            myorders.goToConfirm({  INFO: { 
                ITEM:"ASSIGN_ORDER",
                DELIVERY_ORDER_SYS_ID:jsoin.ORDER_ID,
                DELIVERY_PERSON_SYS_ID: this.assign_driver,
             
                PAYMENT_INSTRUCTION: this.PAYMENT_INSTRUCTION 
               
            
            }
}).then(response => {
          if (response.status == 'false') {
            this.showError = true;
            this.errorMessage = response.response;
          } else{
            this.$router.push("/dashboard");
            this.successMessage = "Delivery Status Updated Successfully";
            setTimeout(() => {
                            this.sweetAlert = true
                            setTimeout(() => { this.sweetAlert = false }, 1000)
                        }, 1000)


          }
        })
         
        },


        getCustomerInfo(){
            let dataFromLocalStorage = localStorage.getItem("driver")
       let data = JSON.parse(dataFromLocalStorage);
        
       console.log(data.PAYMENT_INSTRUCTION);
       this.CUSTOMER_NAME = data.CUSTOMER_NAME;
       this.DELIVERY_ADDRESS = data.DELIVERY_ADDRESS;
       this.DELIVERY_DATE = data.DELIVERY_DATE;
       this.DELIVERY_TIME = data.DELIVERY_TIME;
       this.DELIVERY_COUNTRY = data.DELIVERY_COUNTRY;
      this.MOBILE_NO = data.MOBILE_NO;
      this.DELIVERY_PIN = data.DELIVERY_PIN_CODE
      this.PAYMENT_INSTRUCTION = data.PAYMENT_INSTRUCTION;
     this.delivery_instruction =data.DELIVERY_INSTRUCTION ;
        }
    }

},
)


</script>
