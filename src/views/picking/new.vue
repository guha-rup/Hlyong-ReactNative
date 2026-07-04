<template>
    <master>
        <div >
        <h3 class="sub-heading" style="margin-top: -8px; "><b>Picking & Packing</b></h3>
        <h4 class="text-danger" style="font-size: 17px; color: black;">{{this.SO_NO}}</h4>
        <p style="font-size: 14px;"><b>{{ this.COMPANY_NAME}}</b></p>
       
        <p class="sub-text" style="font-size: 13px;margin-top: -8px;">Picking & Packing Date - {{ this.DELIVERY_DATE }}</p>
</div>
        <ion-card class="silver-card" style="margin: 0;" v-for="pack in pickItems.DETAILS" >
            <ion-row>
                <ion-col size="12"  >
                    <ul>
                        <li style="margin-top: -15px;"><b>Part No. - {{pack.PART_NO  }}</b></li>
                        <li class="sub-text" style="font-size: 14px;">{{pack.ITEM_NAME}} ({{ pack.UOM }})</li>
                        <li class="sub-text" style="display:flex; justify-content: space-between; "><span>Batch No <span style="margin-left:110px;"> - </span>  </span><span style="color: #000;"> {{ pack.BATCH_NO }}</span></li>
                        <li class="sub-text" style="display:flex; justify-content: space-between; "><span>Origin <span style="margin-left:127px;"> - </span> </span> <span style="color: #000;"> {{ pack.ORIGIN_COUNTRY }}</span></li>
                        <!-- <li class="sub-text">Packing Description - <span style="color: #000;"></span> </li> -->
                        <li class="sub-text" style="display:flex; justify-content: space-between; "><span>QTY Ordered <span style="margin-left: 86px;"> - </span></span><span style="color: #000;">{{ pack.ORDER_QTY  }}</span></li>
                        <li class="sub-text" style="display:flex; justify-content: space-between; "><span>Warehouse <span style="margin-left: 103px;"> - </span></span><span style="color: #000;">{{ pack.BRANCH_NAME }}</span></li>
                        <li class="sub-text" style="display:flex; justify-content: space-between; "><span>Unit No <span style="margin-left: 120px;"> - </span></span><span style="color: #000;">{{ pack.UNIT_NO }}</span></li>
                        <li class="sub-text" style="display:flex; justify-content: space-between; "><span>Floor No <span style="margin-left: 115px;"> - </span> </span><span style="color: #000;">{{ pack.FLOOR_NO }}</span></li>
                        <li class="sub-text" style="display:flex; justify-content: space-between; "><span>Rack No <span style="margin-left: 118px;"> - </span></span><span style="color: #000;">{{ pack.RACK_NO }}</span></li>
                        <ul style="display: flex; flex-direction: row;">
                        <li class="sub-text" style="margin-left: -5px;">QTY Packed  <span style="margin-left: 5px;">-</span> </li>
                        <ion-input type="number" style="color: #000;padding:13px;background-color: white;border-radius: 6px; margin-left: 20px; margin-top: -3px; width: 30%;" v-model="pack.PACKING_QTY"   @change="updatePackingQty
                        (pack.ITEM_PROCESS_SYS_ID, $event.target.value , pack.ORDER_QTY)"></ion-input>
                    </ul>
                        <li></li>
                    </ul>
                </ion-col>
               
            </ion-row>
        </ion-card>
<br> <br>
        <ion-card class="white-card" style="margin: 0; padding: 5px; border-radius: 15px; margin-top: -24px; height: 20%;">
            <ion-row>
                <ion-col size="6"  >
                    <ul style="list-style: none;">
                      
                    
                        <li class="sub-text" style="margin-top: -10px; margin-left: -25px;">Remarks<ion-input style="color: #000;background-color: white;border-radius: 6px;height: 20px;margin-left: -10px;" v-model="PICKING_PACKING_REMARKS"></ion-input> </li>

                      
                    </ul>
                </ion-col>
               
            </ion-row>
        </ion-card>
      
      <ion-row style="margin-top: 10px; margin-bottom: 40px;" >
            <ion-col size="6" >

                <p class="btn btn-blue" style="height: 39px;width:100%;padding-top: 10px; color: #0c9648;" @click="inprogressPickingDetailes" >In Progress</p>
            </ion-col>
            <ion-col size="6" >

<p class="btn btn-green" style="height: 39px;width:100%;padding-top: 10px;" @click="gotoCompletePack">Complete</p>
</ion-col>
      </ion-row>
      <sweetAlert v-show="sweetAlert" :msg="msg"   />
    </Master>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import sweetAlert from '../sweetAlert.vue'
import pick from '@/services/pick';
import { IonButton, IonCard, IonRow, IonCol, IonText, IonInput } from '@ionic/vue';
// import sweetAlert from '../sweetAlert.vue';
import { IonToast } from '@ionic/vue';

export default defineComponent({
    name:"Pick",
components:{
     IonCard,IonRow,IonCol,IonText,IonInput,pick,sweetAlert,IonToast
},
data(){
    return {
        sweetAlert: false,
        pickItems:[],
        msg: "",
        SO_NO:"",
        successMessage:"",
        COMPANY_NAME:"",
        PICKING_PACKING_REMARKS:"",
        DELIVERY_DATE:"",
        ORDER_QTY:"",
        getDetailesDta:[],
        packing_detailes:"",

      }
  
},
mounted(){
    this.getDataForPickingData()
},
methods:{
getDataForPickingData(){
    let getdata = localStorage.getItem("pickitem");
    this.pickItems = JSON.parse(getdata);
    console.log("Retrieved data:", this.pickItems);
    this.SO_NO =JSON.parse(getdata).SO_NO
    this.PICKING_PACKING_REMARKS=JSON.parse(getdata).PICKING_PACKING_REMARKS
    this.COMPANY_NAME =JSON.parse(getdata).COMPANY_NAME
    this.DELIVERY_DATE=JSON.parse(getdata).DELIVERY_DATE
    console.log(  this.SO_NO,"90" )

},


    goToPack(){
        this.$router.push('/scan')
    },
    goToPacknew(){
        this.$router.push('/wrongscan')
    },

    // in progress packing detailes
    inprogressPickingDetailes() {
        let getdata = localStorage.getItem("pickitem");
        this.pickItems = JSON.parse(getdata);
           
        pick.inprogressPickingDetailes({
                ITEM: "ORDER_STATUS",
                SALES_ORDER_ID: this.pickItems.SALES_ORDER_SYS_ID,
                PICKING_PACKING_REMARKS:this.PICKING_PACKING_REMARKS,
                ORDER_STATUS:"Packing_Inprogress",
                DETAILS:this.getPackData()
            }).then(response => {
                if (response.status == 'false') {
                    this.sweetAlert = true,
                  
                    this.errorMessage = response.response;
                } else {
                    window.location.href = "/pick";
                    this.successMessage = "Status Updated Successfully";
                  
                  
                }
            })

        },
        gotoCompletePack(){
            let getdata = localStorage.getItem("pickitem");
        this.pickItems = JSON.parse(getdata);
           
        pick.gotoCompletePack({
                ITEM: "ORDER_STATUS",
                ORDER_STATUS:"Packing_Complete",
                PICKING_PACKING_REMARKS:this.PICKING_PACKING_REMARKS,
                SALES_ORDER_ID: this.pickItems.SALES_ORDER_SYS_ID,
                DETAILS:this.getPackCompleteData()
            }).then(response => {
                if (response.status == 'false') {
                    this.showError = true;
                    this.errorMessage = response.response;
                } 
                    // window.location.href = "/pick";
                    // this.successMessage = "Status Updated Successfully";
                   
                    else {
                    setTimeout(() => {
                        this.sweetAlert = true,
                            this.msg = response.response
                        setTimeout(() => { this.sweetAlert = true }, 3000);
                        window.location.href = "/pick";
                    }, 1000)
                

                }
            })

        },
        getPackData(){
            let newdata = localStorage.getItem("packitem");
            this.getDetailesDta = JSON.parse(newdata);
            
            let details_array = [];
            this.getDetailesDta.forEach((sub_item) => {
        let correspondingPack = this.pickItems.DETAILS.find(pack => pack.ITEM_PROCESS_SYS_ID === sub_item.ITEM_PROCESS_SYS_ID);
        
        if ( this.packing_detailes) {
            details_array.push({
                ITEM_PROCESS_SYS_ID: sub_item.ITEM_PROCESS_SYS_ID,
              
                PACKING_QTY: this.packing_detailes
            });
        } else {
            details_array.push({
                ITEM_PROCESS_SYS_ID: sub_item.ITEM_PROCESS_SYS_ID,
                PACKING_QTY: correspondingPack.PACKING_QTY
            });
        }
    });
    
    
      return details_array;
    },
    // getPackCompleteData(){
    //     let newdata = localStorage.getItem("packitem");
    //         this.getDetailesDta = JSON.parse(newdata);
          
    //         let details_array_pack = [];
    //     this.getDetailesDta.forEach((sub_item) => {

    //         let correspondingPack = this.pickItems.DETAILS.find(pack => pack.ITEM_PROCESS_SYS_ID === sub_item.ITEM_PROCESS_SYS_ID);

    //         details_array_pack.push({
    //     ITEM_PROCESS_SYS_ID:sub_item.ITEM_PROCESS_SYS_ID,
    //     PACKING_QTY: this.packing_detailes || correspondingPack ? correspondingPack.PACKING_QTY : sub_item.PACKING_QTY,
         
        
    //     });
    //   });
    
    
    //   return details_array_pack;
    // },
    getPackCompleteData() {
    let newdata = localStorage.getItem("packitem");
    this.getDetailesDta = JSON.parse(newdata);
  
    let details_array_pack = [];
    this.getDetailesDta.forEach((sub_item) => {
        let correspondingPack = this.pickItems.DETAILS.find(pack => pack.ITEM_PROCESS_SYS_ID === sub_item.ITEM_PROCESS_SYS_ID);
        
        if ( this.packing_detailes) {
            details_array_pack.push({
                ITEM_PROCESS_SYS_ID: sub_item.ITEM_PROCESS_SYS_ID,
              
                PACKING_QTY: this.packing_detailes
            });
        } else {
            details_array_pack.push({
                ITEM_PROCESS_SYS_ID: sub_item.ITEM_PROCESS_SYS_ID,
                PACKING_QTY: correspondingPack.PACKING_QTY
            });
        }
    });
    
    return details_array_pack;
},
    updatePackingQty(itemProcessSysId, value,orderQty) {
        if (value > orderQty) {
              alert(`Packing quantity cannot be greater than the order quantity (${orderQty}).`);
              value = orderQty;
          }
        
        // Find the corresponding pack and update the PACKING_QTY
        // let pack = this.pickItems.DETAILS.find(pack => pack.ITEM_PROCESS_SYS_ID === itemProcessSysId);
        // if (pack) {
            
        //   pack.PACKING_QTY = value;
        
        //   this.packing_detailes= pack.PACKING_QTY
        //   console.log(   this.packing_detailes)
        // }
      }
}
})

</script>