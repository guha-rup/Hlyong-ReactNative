<template>
  <div id="app">
      <div @click="send" class="wrapper">
          <canvas :ref="reference" :id="reference" class="signature-pad" width=330 height=140></canvas>
      </div>
  </div>
</template>

<script>
import SignaturePad from 'signature_pad';
export default {
  name: 'MySignaturePad',
  props: {
      reference: {
          type: String,
          default: 'sigCanvas'
      }
  },
  mounted() {
      this.$nextTick(() => { this.drow(); });
  },

  methods: {
      send(){
          let canvas = document.getElementById(this.reference);
          this.$emit('setSignatureValue', canvas.toDataURL("image/png"))
      },

      drow() {
          const signaturePad = new SignaturePad(document.getElementById(this.reference), {
              backgroundColor: 'rgba(255, 255, 255, 0)',
              penColor: 'rgb(0, 0, 0)'
          });
          signaturePad.addEventListener("endStroke", () => {
              this.send();
          }, { once: true });
      },

      resetSign(){
          this.drow();
      },

      
  },

};
</script>

<style>

</style>
