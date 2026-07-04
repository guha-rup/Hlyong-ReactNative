<template>
    <master pageTitle="Sales Order">
      <ion-alert
        :is-open="getError? true : false"
        header="Error"
        sub-header=""
        :message="getError"
        :buttons="alertButtons"
        @didDismiss="setError(null)"
      ></ion-alert>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-input
              class="search"
              type="text"
              label=""
              placeholder="search by name / phone"
              @input="onSearch($event.target.value)"
            ></ion-input>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-grid class="border-bottom">
        <ion-row class="search-heading-section">Search By Status</ion-row>
        <ion-row>
          <ion-col size="4">
              <ion-button  expand="block" class="open" @click="getOrders('Open')">Open</ion-button>
          </ion-col>
          <ion-col size="4">
              <ion-button  expand="block" class="pending" @click="getOrders('Pending')">Pending</ion-button>
          </ion-col>
          <ion-col size="4">
              <ion-button  expand="block" class="completed" @click="getOrders('Completed')">Completed</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-grid>
        <ion-row>
          <ion-col>
              <ion-button  expand="block" class="add-button" @click="$router.push('/sales-order/customer')">Add Sales Order</ion-button>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-card
            class="Order"
            v-for="order in orders"
            :key="order.ORDER_ID"
            @click="onEditSalesOrder(order)"
          >
          <ion-card-content>
            <ion-row>
              <ion-col size="8" class="customer-title">
                  <p>{{ order.CUSTOMER_NAME }}</p>
              </ion-col>
              <ion-col size="4">
                <p style="float:right;">#{{ order.SALES_ORDER_NO }}</p>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="8">
                  <p>{{ order.DELIVERY_DATE }}</p>
              </ion-col>
              <ion-col size="4">
                <p style="float:right;font-weight: 700;">$ {{ order.GRAND_TOTAL }}</p>
              </ion-col>
            </ion-row>
          </ion-card-content>

          </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </master>
  </template>
    
    <script lang="ts">
  import {
      IonGrid,
      IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonInput,
    IonButton,
    IonAlert,
  } from "@ionic/vue";
  import { defineComponent } from "vue";
  import myorders from "@/services/myorders";
  import {create} from 'ionicons/icons';
  import { mapGetters, mapActions } from "vuex";
  
  export default defineComponent({
      name: "SalesOrder",
    components: {
      IonGrid,
      IonRow,
      IonCol,
      IonCard,
      IonCardHeader,
      IonCardTitle,
      IonIcon,
      IonInput,
      IonButton,
      IonAlert,
    },
    data() {
      return {
          orders: [],
          icons: {
            create: create
          },
          alertButtons: ['OK']
      };
    },
    created() {
      this.getOrders();
    },
    methods: {
      ...mapActions([
        "setError",
      ]),
      getOrders(status='Open') {
          myorders.getOrders(status).then(res => {
              this.orders = [];
              if (res.status != 'false') {
                  this.orders = res.response;
              } else {
                this.setError(res.response);
              }
          });
      },
      onEditSalesOrder(order: any) {
        this.$router.push({
          name: 'SalesOrderView',
          params: {
            id: order.ORDER_ID
          }
        })
      },
      onSearch(searchText = '') {
        if (searchText.length >= 3) {
          myorders.getOrdersBySearch(searchText).then((res) => {
          this.orders = [];
            if (res.status != "false") {
              this.orders = res.response;
            } else {
              this.setError(res.response);
            }
          });
        } else if (searchText.length === 0) {
          this.getOrders();
        }
      }
    },
    computed: {
     ...mapGetters([
        "getError"
     ]) 
    }
  });
  </script>
    
  <style scoped>
  ion-input.search {
    box-sizing: border-box;
    background: #f2f2f2;
    border: 1px solid #dcdcdc;
    border-radius: 20px;
  }
  ion-button {
      border-radius: 10px;
      font-style: normal;
      font-weight: 700;
      font-size: 12px;
      line-height: 18px;
      text-align: center;
  }
  ion-button.open {
      --background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(176, 32, 0, 0.2) 100%);
      border: 1px solid rgba(207, 103, 80, 0.5);
      --color: #CF6750;
  }
  ion-button.pending {
      --background:linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(0, 57, 169, 0.2) 100%);
      border: 1px solid rgba(77, 119, 203, 0.5);
      --color:#4D77CB;
  }
  ion-button.completed {
      --background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(88, 0, 142, 0.2) 100%);
      border: 1px solid rgba(145, 77, 187, 0.5);
      --color: #914DBB;
  }
  .search-heading-section {
      font-style: normal;
      font-weight: 400;
      font-size: 15px;
      line-height: 18px;
      color: #5A5A5A;
  }
  .border-bottom {
      border-bottom: 1px solid #DCDCDC;
  }
  ion-button.add-button {
      --background: linear-gradient(180deg, #C49531 0%, #A36626 100%);
      border-radius: 5px;
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #FFFFFF;
  }
  ion-icon {
    color: #4D77CB;
    font-size: 20px;
  }
  .no-wrap {
    white-space: nowrap;
  }
  ion-card.Order {
  background: linear-gradient(
    180deg,
    rgba(242, 242, 242, 0) 0%,
    rgba(196, 149, 49, 0.2) 100%
  );
  min-height: 90px;
  border-radius: 10px;
}
.customer-title {
font-weight: 400;
font-size: 18px;
line-height: 22px;
color: #000000;
}
  </style>
    