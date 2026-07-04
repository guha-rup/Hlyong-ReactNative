<template>
    <master>
        <h3 class="sub-heading">Change Password</h3>
        <ion-page>
        <div>
         
          
            <form action="">
                <ion-item class="input-field" lines="none">

                    <ion-input label="Current Password" label-placement="floating" type="text" autocomplete="off"></ion-input>
                </ion-item>
                <ion-item class="input-field" lines="none">

                    <ion-input label="New Password" label-placement="floating" type="password" autocomplete="off"></ion-input>
                </ion-item>
                <ion-item class="input-field" lines="none">

<ion-input label="Confirm Password" label-placement="floating" type="password" autocomplete="off"></ion-input>
</ion-item>
                <ion-button class="btn btn-danger">Submit</ion-button>
            </form>
        </div>
    </ion-page>
    
        </master>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Master from '@/layout/Master.vue';
import { IonButton, IonCard, IonRow, IonCol } from '@ionic/vue';
import Master from '../layouts/Master.vue';
export default defineComponent({
    components: { Master, IonButton, IonCard, IonRow, IonCoMasterl },
    name: "Pack",
    data
})

</script>