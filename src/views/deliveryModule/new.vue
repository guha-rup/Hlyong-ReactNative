<template>
  <master>
  <h2 class="sub-heading" style="margin-top: -10px; margin-left: 10px;">Delivery Job Details</h2>

  <ion-card class="silver-card" style="border-radius: 10px; background-color: azure; margin-top: 15px;">
    <ul style="margin: 0;">
      <li>
        <div class="d-flex justify-content-between" style="margin-left: 5px;">
          <p style="font-size: 12px;"><b>Order No. {{ this.ORDER_NO }}</b></p>
          <p style="font-size: 12px; margin-right: 8px;">{{ this.DELIVERY_DATE }}</p>
        </div>
      </li>
      <li>
        <div class="d-flex justify-content-between">
          <p style="margin-left: 5px; font-size: 18px;"><b>{{ this.CUSTOMER_NAME }}</b></p>
          <p style="margin-right: 9px; font-size: 18px;"><b>${{ this.DELIVERY_AMOUNT }}</b></p>
        </div>
      </li>
      <li style="font-size: 10px; margin-left: 5px;">{{ this.DELIVERY_ADDRESS }}</li>
      <li style="font-size: 10px; margin-left: 5px; margin-top: -6px;">{{ this.DELIVERY_COUNTRY }} {{ this.DELIVERY_PIN_CODE }}</li>
      <li>
        <div style="display: flex; margin-left: -8px;">
          <ion-img src="/phone.png" style="width: 22px !important; height: 12px; margin-top: -2px; padding-left: 10px;"></ion-img>
          <p style="color:red; font-size: 10px; margin-left: 5px;">Call Customer</p>
        </div>
        <div style="display: flex; padding-left: 237px; margin-top: -10px;">
          <ion-img src="/msg.png" style="width: 22px !important; height: 12px; margin-left: -10px;"></ion-img>
          <p style="color:red; font-size: 10px;">Sms Customer</p>
        </div>
      </li>
    </ul>
  </ion-card>
  <ion-card style="margin-top: 15px;">
  </ion-card>
  <br>
  <p style="margin-left: 5px; margin-top: -30px; font-size: 18px;">Item To Deliver</p>
  <br>
  <ion-card class="white-card" style="margin: 0; margin-top: -8px; border-radius: 10px;" v-for="order in delivery_detailes">
    <ion-row>
      <ion-col size="3">
        <ul class="listcustom pl-0" style="list-style: none;">
          <li>
            <ion-img :src="generateImageUrl(order.THUMBNAIL_IMAGE)" class="menu-logo" style="width: 90px !important; margin-left: -24px; margin-top: 23px; border-radius: 5px;"></ion-img>
          </li>
        </ul>
      </ion-col>
      <ion-col size="8" class="text-right">
        <ul class="listcustom" style="list-style: none; margin-top: 30px;">
          <li class="textcolor" style="font-weight: bold; color: black; font-size: 12px;"><b>{{ order.PRODUCT_NAME }}</b></li>
          <li class="restOfLi" style="font-size: 12px;"><span>{{ order.UOM }}</span></li>
          <li class="restOfLi" style="font-size: 12px;"><span>(Packet)</span></li>
          <li class="restOfLi" style="font-size: 12px; margin-top: 10px;"><span>Quantity: {{ order.PACKING_QTY }}</span></li>
          <li class="textcolor" style="font-size: 13px; margin-top: 3px; color: black;"><b>${{ order.TOTAL_PRICE }}</b></li>
        </ul>
      </ion-col>
    </ion-row>
  </ion-card>
  <br>

  <ion-row class="my-2">
    <ion-col size="2">
    </ion-col>
  </ion-row>
  <!-- Delivery info -->

  <ion-item style="border-radius: 10px; margin-top: -15px;">
    <ion-input type="text" label="Payment Instruction" label-placement="floating" v-model="PAYMENT_INSTRUCTION" class="inputForProfile"></ion-input>
  </ion-item><br>

  <ion-item style="border-radius: 10px; margin-top: -10px;">
    <ion-input type="text" label="Delivery Instruction" label-placement="floating" v-model="DELIVERY_INSTRUCTION" class="inputForProfile"></ion-input>
  </ion-item><br>

  <ion-item style="border-radius: 10px; margin-top: -10px;">
    <ion-input type="text" disabled label="Payment Mode" label-placement="floating" v-model="PAYMENT_MODE" class="inputForProfile" style="font-size: 15px;"></ion-input>
  </ion-item><br>

  <br>
  <div style="float: left; margin-top: -20px; margin-left: 5px;">
    <p>Payment</p>
  </div>
  <br>
  <br>
  <ion-item style="margin-top: -23px; border-radius: 10px;">
    <ion-input type="text" label-placement="floating" value="Amount collected" v-model="COLLECTED_AMOUNT" class="inputForProfile"></ion-input>
  </ion-item>

  <div style="float: right; margin-top: -10px;">
    <h6>Show Payment QR Code</h6>
  </div>
  <br><br><br>
  <div>
    <ion-item style="margin-bottom: 12px; border-radius: 10px; margin-top: -10px;">
      <div>
        <p style="margin-top: 10px; margin-left: 110px;" @click="PaymentProof">Payment proof</p>
        <label class="img-box" for="open-action-sheet" id="open-action-sheet">
          <i class="fa fa-camera" v-show="boxnotopen" style="margin: 10px; width: 80px; height: 80px; font-size: 35px; border: 2px dashed; padding: 20px; border-radius: 8px; margin-left: 120px;"></i>
          <img v-if="this.employee_img" :src="`${this.imageUrl}/${this.employee_img}`" alt="" class="previewImg">
          <img v-else :src="urlnew" alt="" class="previewImg">
        </label>
        <input type="file" name="file" style="display:none;" @change="onFileChange" ref="file">
        <ion-action-sheet trigger="open-action-sheet" class="my-custom-class" :buttons="actionSheetButtons"></ion-action-sheet>
      </div>
    </ion-item>
  </div>

  <br><br>
  <div style="float: left; margin-top: -2px; margin-left: 5px;">
    <p style="margin-top: -23px;">Delivery Acknowledgement</p>
  </div>
  <br><br>
  <ion-item style="border: 2px dashed; border-radius: 12px; text-align: right; margin-top: -35px;">
    <img v-if="this.DELIVERY_ACKNOWLEDGEMENT" class="col-sm-12" :src="`${this.imageUrl}/${this.DELIVERY_ACKNOWLEDGEMENT}`" width="330" height="140" style="border-bottom: 1px solid #000; max-width: 330px" />
    <div class="signature-pad" v-else>
      <SignaturePad @setSignatureValue="setSignatureValue" ref="signaturePad" class="sig-wall"></SignaturePad>
      <i @click="resetSignature" class="mt-2 ml-1 ri-delete-bin-6-line text-danger" id="sig-clearBtn" size="small"></i>
    </div>
  </ion-item>
  <br><br>
  <ion-item style="margin-bottom: 12px; border-radius: 10px; margin-top: -20px;">
    <div style="justify-content: center; align-items: center;">
      <p style="margin-top: 10px; margin-left: 110px;">Delivery proof</p>
      <label class="img-box" for="open-action-sheet-new" id="open-action-sheet-new">
        <i v-show="deliveryproof" class="fa fa-camera" style="margin: 10px; width: 80px; height: 80px; font-size: 35px; border: 2px dashed; padding: 20px; border-radius: 10px; margin-left: 120px;"></i>
        <img v-if="this.DELIVERY_PROOF" :src="`${this.imageUrl}/${this.DELIVERY_PROOF}`" alt="" class="previewImg">
        <img v-else :src="urlnew2" alt="" class="previewImg">
      </label>
      <input type="file" name="file" style="display:none;" @change="onfilenewchange" ref="filenew">
      <ion-action-sheet trigger="open-action-sheet-new" :buttons="actionSheetButtonsnew" class="my-custom-class"></ion-action-sheet>
    </div>
  </ion-item>
  <ion-item style="margin-bottom: 5px; border-radius: 13px;">
    <ion-input type="text" label-placement="floating" label="Remarks" v-model="DELIVERY_REMARKS" class="inputForProfile"></ion-input>
  </ion-item>
  <br>
  <ion-row style="align-items: center; margin-top: -15px;">
    <ion-col size="12">
      <p class="btn btn-green" style="width: 100%; height: 40px; padding-top: 10px;" @click="CompleteJob">Submit</p>
    </ion-col>
  </ion-row>
</master>

</template>