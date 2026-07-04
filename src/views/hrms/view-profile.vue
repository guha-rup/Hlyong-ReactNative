<template>
    <master>
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)"> 
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ion-card class="confirmation-card">
            <!--dev-->
            <iframe
                :src="`https://uat-hrms.cssdemo.dev/holiday-emp?ERP_USER_ID=${this.id}&ERP_SECRET_KEY=${this.secretId}&Activate_Language=${this.activeLanguage_new}`"
                frameborder="0" style="width: 100%;  height: 80vh;"></iframe>
            <!--Prod-->
            <!-- <iframe
                :src="`https://erp-hrmsapi.hupcheong.com/employee-information?ERP_USER_ID=${this.id}&ERP_SECRET_KEY=${this.secretId}`"
                frameborder="0" style="width: 100%;  height: 50vh;"></iframe> -->

                 <!--prod for mamami-->
            <!-- <iframe
                :src="`https://erp-hrms.hupcheong.com/employee-information?ERP_USER_ID=${this.id}&ERP_SECRET_KEY=${this.secretId}`"
                frameborder="0" style="width: 100%;  height: 80vh;"></iframe> -->
        </ion-card>

    </master>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { IonText, IonRow, IonCol, IonCard, IonLabel, IonInput, IonItem, IonSelectOption, IonSelect, IonButton } from '@ionic/vue'


export default defineComponent({
    name: 'confirmation',
    components: {
        IonText, IonRow, IonCol, IonCard, IonLabel, IonInput, IonItem, IonSelectOption, IonSelect, IonButton
    },
    data() {
        return {
            secretId: "",
            id: "",
            activeLanguage_new:"ENG",
        }
    },

    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            let getDataFromLocal = localStorage.getItem("userInfo");
 
            let jsoin = JSON.parse(getDataFromLocal);
            this.secretId = jsoin.SecretId;
            this.id = jsoin.UserId
          
            
  
         
          



        },
        handleRefresh(event: CustomEvent) {
            setTimeout(() => {
                // Any calls to load data go here
                document.location.reload();
                event.target.complete();
            }, 2000)
        },
    }

})
</script>