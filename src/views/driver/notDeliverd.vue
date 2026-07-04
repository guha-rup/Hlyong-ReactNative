<template>
    <master>
        <v-form>
            <!--Delivery Remark Card-->
            <ion-card class="confirmation-card">
                <ion-row class="orderi">
                    <ion-col size="6" class="text-left flex-coloumn">
                        <ion-text class="text-primary">Order Id</ion-text>
                        <ion-text class="text-dark sub-text">{{ this.DELIVERY_ORDER_NO }}</ion-text>
                    </ion-col>
                    <ion-col size="6" class="text-right flex-coloumn">
                        <ion-text class="text-primary">Date & Time</ion-text>
                        <ion-text class="sub-text">{{ this.DELIVERY_DATE }} , {{ this.DELIVERY_TIME }}</ion-text>
                    </ion-col>
                </ion-row>

                <ion-item class="input-field">
                    <ion-select label="Reason" label-placement="floating" class="select" v-model="reason"
                        @ion-change="chooseReason">
                        <ion-select-option value="Rescheduled">Reschedule</ion-select-option>
                        <ion-select-option value="Others">Others</ion-select-option>
                    </ion-select>
                </ion-item>
                <ion-item class="input-field" v-show="others">
                    <ion-input label="Other Reason" labelPlacement="stacked" placeholder="Reason"
                        v-model="otherReason"></ion-input>
                </ion-item>
                <ion-label v-show="rescheduled">

                    <ion-item class="input-field">
                        <ion-input label="Rescheduled Date" labelPlacement="stacked" v-model="date" type="date"></ion-input>
                    </ion-item>
                    <ion-item class="input-field">
                        <ion-input label="Reason for Reschedule" labelPlacement="stacked" placeholder="Reason"
                            v-model="reschedulereason"></ion-input>
                    </ion-item>
                </ion-label>


                <ion-button class="btn mt-2 ml-1" @click="submitForm" size="small">Submit</ion-button>
            </ion-card>

        </v-form>
        <sweetAlert v-show="sweetAlert" />
    </master>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { IonText, IonRow, IonCol, IonCard, IonLabel, IonInput, IonItem, IonSelectOption, IonSelect, IonButton } from '@ionic/vue'
import myorders from '@/services/Myorders';
import { mapGetters, mapActions } from "vuex";
import sweetAlert from '../sweetAlert.vue';
export default defineComponent({
    name: 'notDelivered',
    components: {
        IonText, IonRow, IonCol, IonCard, IonLabel, IonInput, IonItem, IonSelectOption, IonSelect, IonButton, sweetAlert,
    },
    data() {
        return {
            sweetAlert: false,


            ORDER_ID: "",
            DELIVERY_DATE: "",
            DELIVERY_TIME: "",
            DELIVERY_ORDER_NO: "",

            reason: "",
            otherReason: "",
            reschedulereason: "",
            date: "",
            others: false,
            rescheduled: false,
          
        }

    },

    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            let dataFromLocalStorage = localStorage.getItem("orders");
            let jsoin = JSON.parse(dataFromLocalStorage);
            // console.log(jsoin.CUSTOMER_NAME);


            this.DELIVERY_DATE = jsoin.DELIVERY_DATE;
            this.DELIVERY_TIME = jsoin.DELIVERY_TIME;
            this.DELIVERY_ORDER_NO = jsoin.DELIVERY_ORDER_NO;

            this.ORDER_ID = jsoin.ORDER_ID

        },
        chooseReason(val) {
            console.log(this.reason);
            if (this.reason == "Rescheduled") {
                this.rescheduled = true,
                    this.others = false
            } if (this.reason == "Others") {
                this.others = true,
                    this.rescheduled = false
            }
        },

        submitForm() {
            let dataFromLocalStorage = localStorage.getItem("orders");
            let jsoin = JSON.parse(dataFromLocalStorage);

            let data = {
                DELIVERY_ORDER_ID: jsoin.ORDER_ID,
                DELIVERY_ORDER_NO : jsoin.DELIVERY_ORDER_NO,
                DELIVERY_DATE: jsoin.DELIVERY_DATE,
                DELIVERY_STATUS: this.reason,
              
                reschedulereason: this.reschedulereason,
                rescheduleDate: this.date,
                otherReason:this.otherReason
            }
            console.log(data);

            
            myorders.submitReason({

                DELIVERY_ORDER_ID: jsoin.ORDER_ID,
                DELIVERY_STATUS: this.reason,
                RESCHEDULE_DATE: this.date,
                RESCHEDULE_REASON: this.reschedulereason,
                REASON : this.otherReason,
                
              
                ITEM:"STATUS"
                

            }).then(response => {
                if (response.status == 'false') {
                    this.showError = true;
                    this.errorMessage = response.response;
                } else {
                    this.uploadFile(this.selectedFile);

                }
            })

            setTimeout(() => {
                this.sweetAlert = true
                setTimeout(() => { this.sweetAlert = false }, 1000);
                this.$router.push("/dashboard");
            }, 1000)

        },

    }
})
</script>