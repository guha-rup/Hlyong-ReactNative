<template>
    <master>
        <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)"> 
            <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ion-card class="confirmation-card">
    <!--dev-->
            <iframe
                :src="`https://uat-hrms.cssdemo.dev/Attendence-emp?ERP_USER_ID=${this.id}&ERP_SECRET_KEY=${this.secretId}`"
                frameborder="0" style="width: 100%;  height: 50vh;"></iframe>

                <!--prod-->
            <!-- <iframe
                :src="`https://erp-hrmsapi.hupcheong.com/Attendence-emp?ERP_USER_ID=${this.id}&ERP_SECRET_KEY=${this.secretId}`"
                frameborder="0" style="width: 100%;  height: 50vh;"></iframe> -->

                <!--prod for mamami-->
            <!-- <iframe
                :src="`https://erp-hrms.hupcheong.com/Attendence-emp?ERP_USER_ID=${this.id}&ERP_SECRET_KEY=${this.secretId}`"
                frameborder="0" style="width: 100%;  height: 50vh;"></iframe> -->

        </ion-card>

    </master>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { IonRefresher, IonRefresherContent,IonText, IonRow, IonCol, IonCard, IonLabel, IonInput, IonItem, IonSelectOption, IonSelect, IonButton } from '@ionic/vue'


export default defineComponent({
    name: 'confirmation',
    components: {
        IonText, IonRow, IonCol, IonCard, IonLabel, IonInput, IonItem, IonSelectOption, IonSelect, IonButton,IonRefresher, IonRefresherContent
    },
    data() {
        return {
            secretId: "",
            id: ""
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
        }
    }

})
</script>