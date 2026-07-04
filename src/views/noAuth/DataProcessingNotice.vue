<template>
 <MasterN>

  <div>
        <!-- <ion-col size="1">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </ion-col> -->
          <ion-row>
          <ion-col size="1">
            <i class="fa-solid fa-chevron-left" @click="goToLogin"></i>
          </ion-col>
        </ion-row>
        <h3 class="sub-heading" style="color: black; margin-top: -2px; font-size: 12px; padding-left: 5px;">
        DATA PROTECTION NOTICE FOR EMPLOYEES OF HLY 
      </h3>
    </div>
      <div style="border: 1px solid gray; padding-left: 2px; padding-top: 5px; text-align: center; color: gray;">
           <p>This Data Protection Notice (“Notice”) sets out the basis upon which H. L. Yong Company (Pte) Ltd (“we”, “us” or “our”) may collect, use, disclose or otherwise process personal data of employees in accordance with the Personal Data Protection Act (“PDPA”). This Policy applies to personal data in our possession or under our control, including personal data in the possession of organisations which we have engaged to collect, use, disclose or process personal data for our purposes. </p>

      </div>

      <h5><u>APPLICATION OF THIS NOTICE </u></h5>
      <ul style="list-style: decimal;">
        <li style="color: gray;">This Notice applies to all persons engaged in a contract of service with us (whether on a part-time, temporary or full-time basis) and interns and trainees working at or attached to us (collectively referred to as “employees”), and all references to “employment” shall apply equally to internships and traineeships (as may be applicable). </li>
        
      </ul>
      <h4>PERSONAL DATA </h4>
      <p style="color: gray;">2. As used in this Notice, “personal data” means data, whether true or not, about an employee who can be identified: (a) from that data; or (b) from that data and other information to which we have or are likely to have access.  </p>
<br>
<p style="color: gray;">3.Personal data which we may collect in the context of your employment with us includes, without limitation, your</p>
<ul style="list-style: lower-alpha;">
  <li>Name or alias, gender, NRIC/FIN or passport number, date of birth, nationality, and country and city of birth; </li>
  <li>Mailing address, telephone numbers, email address and other contact details; </li>
  <li>Employment and training history; </li>
  <li>Salary information and bank account details; </li>
  <li>Details of your next-of-kin, spouse and other family members; </li>
  <li>Records on leave of absence from work; </li>
</ul>


</MasterN>
</template>
<script lang="ts">
// import Master from '@/layout/Master.vue';
import { defineComponent } from 'vue';
import MasterN from '../layouts/MasterN.vue';
export default defineComponent({
  name: "Notification",
  components: {
      MasterN
  },
  data() {
      return {}
  },
  methods: {
    
    goToLogin(){
        this.$router.push('/login')
    }
  },
})
</script>