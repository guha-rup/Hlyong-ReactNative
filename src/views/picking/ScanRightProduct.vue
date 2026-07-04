<template>
  <master>
    <ion-page>
      <ion-content class="ion-no-padding">
        <div class="technical-error-portal">
          
          <!-- 1. Ultra-Slim Executive Header -->
          <header class="slim-terminal-header">
            <div class="header-content">
              <div class="title-stack">
                <span class="status-tag"><span class="pulse-ruby"></span> SYSTEM ALERT</span>
                <h1 class="main-title">Validation Error</h1>
              </div>
              <div class="op-badge-error">MISMATCH</div>
            </div>
          </header>

          <div class="terminal-body">
            
            <!-- 2. Rejection Tech Plate -->
            <div class="tech-plate rejection-plate">
              <div class="plate-indicator red"></div>
              
              <div class="alert-icon-section">
                <ion-icon :icon="closeCircleOutline" class="main-alert-icon"></ion-icon>
              </div>

              <div class="product-visual-row">
                <div class="img-wrapper-error">
                  <ion-img :src="generateImageUrl(data?.THUMBNAIL_IMAGE)" class="luxury-thumb" />
                </div>
                <div class="item-text">
                  <span class="ref-label">SCANNED PRODUCT IDENTITY</span>
                  <h2 class="item-name">{{ data?.PRODUCT_NAME || "NO PRODUCT AVAILABLE" }}</h2>
                </div>
              </div>

              <div class="ledger-divider-dashed"></div>

               Error Analysis Grid 
               <div class="error-analysis-grid">
                <div class="analysis-cell">
                  <label class="tiny-label">DETECTED STATUS</label>
                  <span class="val-text crimson">NON-COMPLIANT</span>
                </div>
                <div class="analysis-cell border-left">
                  <label class="tiny-label">ACTION REQUIRED</label>
                  <span class="val-text">RESYNC BARCODE</span>
                </div>
              </div> 

             <div class="error-msg-box">
                <p>The scanned item does not match the fulfillment criteria for this Sales Order. Manual override or correct scanning is mandatory.</p>
              </div>
            </div>

            <!-- 3. Execution Action -->
            <div class="action-stack">
              <ion-button 
                expand="block" 
                class="terminal-action-btn red-gradient" 
                @click="gotorightproduct"
              >
                <ion-icon :icon="refreshOutline" slot="start"></ion-icon>
                RE-INITIATE SCANNING
              </ion-button>
              
              <ion-button fill="clear" class="terminal-cancel-btn" @click="$router.push('/pack')">
                <ion-icon :icon="arrowBackOutline" slot="start"></ion-icon>
                BACK TO LIST
              </ion-button>
            </div>

          </div>
        </div>
      </ion-content>
    </ion-page>
  </master>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { 
  IonPage, IonContent, IonImg, IonIcon, IonButton 
} from '@ionic/vue';
import { 
  closeCircleOutline, refreshOutline, alertCircleOutline, 
  arrowBackOutline 
} from 'ionicons/icons';

export default defineComponent({
  name: 'WrongProduct',
  components: { 
    IonPage, IonContent, IonImg, IonIcon, IonButton 
  },
  setup() {
    // Vite build fix: Explicitly return icons
    return { 
      closeCircleOutline, refreshOutline, alertCircleOutline, 
      arrowBackOutline 
    };
  },
  data() {
    return {
      data: null as any,
      imageUrl: 'https://uat-hlyongapi.cssdemo.dev/public/uploaded_files',
    };
  },
  mounted() {
    const storedData = localStorage.getItem('originalqrcodedata');
    if (storedData) {
      try {
        this.data = JSON.parse(storedData);
      } catch (error) {
        console.error('Error parsing data:', error);
      }
    }
  },
  methods: {
    gotorightproduct() {
      this.$router.push('/pack');
    },
    generateImageUrl(img: string) {
      return img ? `${this.imageUrl}/${img}` : '';
    },
  },
});
</script>

<style scoped>
/* 1. Terminal Layout Background */
.technical-error-portal {
  min-height: 100vh;
  background-color: #F4F7F9; /* Titanium White */
}

/* 2. Slim Executive Header */
.slim-terminal-header {
  background: white;
  padding: 30px 20px 15px;
  border-bottom: 1px solid #E2E8F0;
}

.header-content { display: flex; justify-content: space-between; align-items: flex-end; }

.status-tag {
  display: flex; align-items: center; gap: 5px;
  font-size: 8px; font-weight: 900; color: #94A3B8; letter-spacing: 1px;
}

.pulse-ruby {
  width: 6px; height: 6px; background: #DC2626; border-radius: 50%;
  box-shadow: 0 0 8px rgba(220, 38, 38, 0.4);
}

.main-title { color: #0F172A; font-size: 19px; font-weight: 900; margin: 2px 0 0; letter-spacing: -0.5px; }

.op-badge-error {
  background: #DC2626; color: white; padding: 4px 10px; border-radius: 6px;
  font-size: 9px; font-weight: 900; letter-spacing: 0.5px;
}

.terminal-body { padding: 20px 15px; }

/* 3. Rejection Tech Plate */
.tech-plate {
  background: white; border-radius: 12px; margin-bottom: 25px;
  border: 1px solid #E2E8F0; position: relative; overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.04);
}

.plate-indicator.red { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #DC2626; }

.alert-icon-section {
  text-align: center; padding-top: 20px; margin-bottom: -10px;
}
.main-alert-icon { font-size: 48px; color: #DC2626; opacity: 0.8; }

.product-visual-row { display: flex; align-items: center; gap: 15px; padding: 20px 18px; }

.img-wrapper-error {
  width: 70px; height: 70px; border-radius: 10px;
  background: #F8FAFC; border: 1px solid #F1F5F9;
  padding: 5px; display: flex; align-items: center; justify-content: center;
}

.luxury-thumb { width: 100%; height: 100%; object-fit: contain; filter: grayscale(0.5); }

.ref-label { font-size: 8px; font-weight: 900; color: #94A3B8; letter-spacing: 0.5px; }
.item-name { color: #1E293B; font-size: 15px; font-weight: 800; margin: 2px 0 0; line-height: 1.2; }

.ledger-divider-dashed { height: 1px; border-bottom: 1px dashed #E2E8F0; margin: 0 18px; }

/* Analysis Grid */
.error-analysis-grid { display: grid; grid-template-columns: 1fr 1fr; background: #F8FAFC; border-radius: 8px; margin: 15px 18px; border: 1px solid #E2E8F0; }
.analysis-cell { padding: 10px; }
.border-left { border-left: 1px solid #E2E8F0; }

.tiny-label { font-size: 7.5px; font-weight: 900; color: #94A3B8; margin-bottom: 4px; display: block; }
.val-text { font-size: 11px; font-weight: 800; color: #0F172A; }
.crimson { color: #DC2626 !important; }

.error-msg-box { padding: 0 18px 20px; text-align: center; }
.error-msg-box p { font-size: 11px; color: #64748B; line-height: 1.5; font-weight: 600; margin: 0; }

/* 4. Action Stack */
.action-stack { display: flex; flex-direction: column; gap: 10px; }

.terminal-action-btn {
  --background: #0F172A; --border-radius: 8px; height: 56px;
  font-weight: 900; font-size: 13px; letter-spacing: 0.5px;
  --box-shadow: 0 8px 16px rgba(15, 23, 42, 0.2);
}

.red-gradient {
  --background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%);
  --box-shadow: 0 8px 16px rgba(220, 38, 38, 0.2);
}

.terminal-cancel-btn {
  --color: #94A3B8; font-weight: 800; font-size: 11px;
}

.fade-in { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; } }
</style>