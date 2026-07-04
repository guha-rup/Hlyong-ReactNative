<template>
    <ion-card class="sweetAlert">
        <ion-text class="sweetText">{{ msg ||"Success"}}</ion-text>
    </ion-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { IonCard,IonText } from "@ionic/vue";
export default defineComponent({
    name: "sweetAlert",
    components:{
        IonCard,IonText
    },
    props:['msg'],
    /*
     setTimeout(() => {
                            this.sweetAlert = true
                            setTimeout(() => { this.sweetAlert = false }, 2000)
                        }, 2000)
    */
})
</script>