<!-- <template>
    <ion-page>
      <div class="otp-container">
        <h2 class="sub-heading">OTP Verification</h2>
        <p class="otp-text">OTP is: {{ OTP }}</p>
        <p class="instruction-text">Enter the 6-digit code sent to your email address</p>
        
        <form @submit.prevent="otpVerification" class="otp-form">
          <ion-input v-model="OTP_VERIFY" placeholder="Enter OTP" class="otp-input"></ion-input>
          <ion-button expand="full" class="btn btn-danger" type="submit">Verify & Proceed</ion-button>
        </form>
        
        <div class="resend-container" @click="getOtp">
          <p>Didn't receive the code?</p>
          <p class="resend-text">Resend</p>
        </div>
      </div>
    </ion-page>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { IonButton, IonPage, IonInput } from '@ionic/vue';
  import pick from '@/services/pick';
  
  export default defineComponent({
    components: {
      IonButton, IonPage, IonInput
    },
    data() {
      return {
        OTP_VERIFY: "",
        OTP: ""
      };
    },
    mounted() {
      this.getOtp();
    },
    methods: {
      getOtp() {
        let getdata = localStorage.getItem("userForgotPasswordInfo");
        if (getdata) {
          let opdata = JSON.parse(getdata);
          this.OTP = opdata.OTP;
        }
      },
      otpVerification() {
        if (!this.OTP_VERIFY) {
          alert("Please enter OTP");
          return;
        }
        
        let getdata = localStorage.getItem("userForgotPasswordInfo");
        if (getdata) {
          let opdata = JSON.parse(getdata);
          pick.otpVerificationnew([{
            ITEM: "OTP_VERIFICATION",
            USER_NAME: opdata.USER_NAME,
            OTP: this.OTP_VERIFY
          }]).then(response => {
            if (response.status === 'false') {
              alert("OTP Does Not Match");
            } else {
              this.$router.push('/resetpassword');
            }
          });
        }
      }
    }
  });
  </script>
  
  <style scoped>
  .otp-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    text-align: center;
  }
  .sub-heading {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .otp-text {
    font-size: 16px;
    color: #555;
    margin-bottom: 20px;
  }
  .instruction-text {
    font-size: 14px;
    color: #777;
    margin-bottom: 30px;
  }
  .otp-form {
    width: 100%;
    max-width: 300px;
  }
  .otp-input {
    margin-bottom: 20px;
    border-radius: 12px;
    border: 1px solid #ccc;
    padding: 10px;
  }
  .verify-btn {
    border-radius: 12px;
    background-color: #ff4757;
    color: white;
  }
  .resend-container {
    display: flex;
    gap: 5px;
    margin-top: 15px;
    font-size: 14px;
  }
  .resend-text {
    color: red;
    cursor: pointer;
    font-weight: bold;
  }
  </style> -->
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
          <h3 class="sub-heading" style="color: black; margin-top: 3px; font-size: 20px; text-align: center;">
            AGREEMENT TO OUR LEGAL TERMS
        </h3>
    </div>

        <div style="padding-left: 2px; padding-top: 5px;">
            <p style="font-size: 15px;">We are H. L. Yong Company (Pte) Ltd, doing business as H. L. Yong Company (Pte) Ltd ("Company," “we,” “us,” or “our”), a company registered in Singapore at 7 Toh Tuck Link, #01-01, Singapore 596227 (UEN No. 196200094M) </p>
            <br>
            <p style="font-size: 15px;">We operate the website www.hlyong.com (the “Site”), the mobile application HLY ERP (the “App”), as well as any other related products and services that refer or link to these legal terms (the “Legal Terms”) (collectively, the “Services”). </p>
            <br>
            <p style="font-size: 15px;" >The App is a mobile ERP application that is only authorized for use by staff currently employed by the Company.  </p>
            <br>
            <p style="font-size: 15px;">You can contact us by phone at +65 62583744, or email at sales@hlyong.com. </p>
            <br>
            <p style="font-size: 15px;">These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”), and H. L. Yong Company (Pte) Ltd, and concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.</p>
            <br>
            <p style="font-size: 15px;">Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms from time to time. We will alert you about any changes by updating the “Last updated” date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.</p> 
        </div>

        <h4>1. OUR SERVICES </h4>
        <p style="color: gray;">The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable. </p>
        <h4>2. INTELLECTUAL PROPERTY RIGHTS </h4>
        <h6>Our intellectual property </h6>
        <p style="color: gray;">We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the “Content”), as well as the trademarks, service marks, and logos contained therein (the “Marks”). 

 

Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties in Singapore and around the world. 

 

The Content and Marks are provided in or through the Services “AS IS” for the Company’s business purpose only.</p>

<h6>Your use of our Services </h6>
<p style="color: gray;">Subject to your compliance with these Legal Terms, including the "PROHIBITED ACTIVITIES" section below, we grant you a non-exclusive, non-transferable, revocable license to access the Services solely to fulfill or facilitate the fulfillment of your job duties within the Company, and only in advancement of the company’s business interests. The Services shall not be used for personal purposes. 

 

Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any purpose whatsoever, without our express prior written permission. 

  

If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to: sales@hlyong.com. If we ever grant you the permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors of the Services, Content, or Marks and ensure that any copyright or proprietary notice appears or is visible on posting, reproducing, or displaying our Content. 

 

We reserve all rights not expressly granted to you in and to the Services, Content, and Marks. 

 

Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately. </p>
<h4>3. USER REPRESENTATIONS </h4>
<p style="color: gray;">By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you will not access the Services through automated or non-human means, whether through a bot, script, or otherwise; (5) you will not use the Services for any illegal or unauthorized purpose; and (6) your use of the Services will not violate any applicable law or regulation. 

  

If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof).  </p>
<h4>4. USER REGISTRATION </h4>
<p style="color: gray;">You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable. </p>
<h4>5. PRODUCTS </h4>
<p style="color: gray;">We make every effort to display as accurately as possible the colors, features, specifications, and details of the products available on the Services. However, we do not guarantee that the colors, features, specifications, and details of the products will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect the actual colors and details of the products. All products are subject to availability, and we cannot guarantee that items will be in stock. We reserve the right to discontinue any products at any time for any reason. Prices for all products are subject to change. </p>
<h4>6. SOFTWARE </h4>
<p style="color: gray;">We may include software for use in connection with our Services. If such software is accompanied by an end user license agreement (“EULA”), the terms of the EULA will govern your use of the software. If such software is not accompanied by a EULA, then we grant to you a non-exclusive, revocable, personal, and non-transferable license to use such software solely in connection with our services and in accordance with these Legal Terms. Any software and any related documentation is provided “AS IS” without warranty of any 

kind, either express or implied, including, without limitation, the implied warranties of merchantability, fitness for a particular purpose, or non-infringement. You accept any and all risk arising out of use or performance of any software. You may not reproduce or redistribute any software. </p>

<h4>7. PROHIBITED ACTIVITIES </h4>
<p style="color: gray;">You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. </p>
<h5>As a user of the Services, you agree not to :</h5>
<ul>
    <li>Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us. </li>
    <li>Make any unauthorized use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses. </li>
    <li>Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein. </li>
    <li>Engage in unauthorized framing of or linking to the Services. </li>
    <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords. </li>
    <li>Make improper use of our support services or submit false reports of abuse or misconduct. </li>
    <li>Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services. </li>
    <li>Attempt to impersonate another user or person or use the username of another user. </li>
    <li>Use any information obtained from the Services in order to harass, abuse, or harm another person. </li>
    <li>Use the Services to extract data for sale or as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise. </li>
    <li>Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services. </li>
    <li>Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services. </li>
    <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you. </li>
    <li>Delete the copyright or other proprietary rights notice from any Content. </li>
    <li>Copy or adapt the Services’ software, including but not limited to Flash, PHP, HTML, JavaScript, or other code. </li>
    <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services. </li>
    <li>Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats (“gifs”), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as “spyware” or “passive collection mechanisms” or “pcms”). </li>
    <li>Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or using or launching any unauthorized script or other software. </li>
    <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services. </li>
    <li>Use the Services in a manner inconsistent with any applicable laws or regulations. </li>
</ul>
    <h4>8. MOBILE APPLICATION LICENSE </h4>
    <h6>Use License </h6>
   <p style="color: gray;">If you access the Services via the App, then we grant you a revocable, non-exclusive, non-transferable, limited right to install and use the App on wireless electronic devices owned or controlled by you, and to access and use the App on such devices strictly in accordance with the terms and conditions of this mobile application license contained in these Legal Terms. You shall not: (1) except as permitted by applicable law, decompile, reverse engineer, disassemble,</p>
   </MasterN>
</template>
<script lang="ts">
// import Master from '@/layout/Master.vue';
import { defineComponent } from 'vue';
import MasterN from '../layouts/MasterN.vue';
import {} from 'ionicons/icons';
import Master from '../layouts/Master.vue';

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