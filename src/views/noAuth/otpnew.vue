 <template>
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
  </style>
