import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Authenticate from "@/services/Authenticate";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    beforeEnter: Authenticate,
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    beforeEnter: Authenticate,
    component: () => import('@/views/noAuth/Login.vue'),
  },
   {
    path: '/Terms',
    name: 'Terms',
    beforeEnter: Authenticate,
    component: ()=> import('@/views/noAuth/Terms.vue')
  },
  {
        path:'/new',
        name: 'new',
        beforeEnter:Authenticate,
        component: () => ('@/views/noauth/Terms.vue')
  },
  {
    path:'/DataProcessingNotice',
    name:'DataProcessingNotice',
    beforeEnter:Authenticate,
    component:() => import ('@/views/noAuth/DataProcessingNotice.vue')
  },
  {
    path: '/emailverification',
    name: 'emailverification',
    beforeEnter: Authenticate,
    component: () => import('@/views/noAuth/emailverification.vue'),
  },
  
  {
    path: '/otp',
    name: 'otp',
    beforeEnter: Authenticate,
    component: () => import('@/views/noAuth/otp.vue'),
  },
  {
    path: '/resetpassword',
    name: 'resetpassword',
    beforeEnter: Authenticate,
    component: () => import('@/views/noAuth/resetpassword.vue'),
  },
    {
    path: '/resetpassword2',
    name: 'resetpassword2',
    beforeEnter: Authenticate,
    component: () => import('@/views/noAuth/resetpassword2.vue'),
  },

  {
    path: '/dashboard',
    name: 'dashboard',
    beforeEnter: Authenticate,
    component: () => import('@/views/Dashboard.vue'),
  },
  {
    path: '/deliveryjob',
    name: 'deliveryjob',
    beforeEnter: Authenticate,
    component: () => import('@/views/deliveryModule/delivery.vue'),
  },
  {
    path: '/deliveryPending',
    name: 'deliveryPending',
    beforeEnter: Authenticate,
    component: () => import('@/views/deliveryModule/pendingDelivery.vue'),
  },
  {
    path: '/deliverd',
    name: 'deliverd',
    beforeEnter: Authenticate,
    component: () => import('@/views/deliveryModule/Deliverdorder.vue'),
  },
  {
    path: '/pick',
    name: 'pick',
    beforeEnter: Authenticate,
    component: () => import('@/views/picking/pick.vue'),
  },
  {
    path: '/pack',
    name: 'pack',
    beforeEnter: Authenticate,
    component: () => import('@/views/picking/pack.vue'),
  },
  { 
     path:'/ScanProduct',
     name:'ScanProduct',
     beforeEnter: Authenticate,
     component: () => import('@/views/picking/ScanProduct.vue'),
     props: true,
  },
    
  {
    path: '/ScanRightProduct',
    name: 'ScanRightProduct',
    beforeEnter: Authenticate,
    component: () => import('@/views/picking/ScanRightProduct.vue')
  },
  {
    path: '/orderDetailes',
    name: 'orderDetailes',
    beforeEnter: Authenticate,
    component: () => import('@/views/orderHistory.vue'),
  },
  {
    path: '/my-setting',
    name: 'profile',
    beforeEnter: Authenticate,
    component: () => import('@/views/hrms/view-profile.vue'),
  },
  {
    path: '/checkIn',
    name: 'checkIn',
    beforeEnter: Authenticate,
    component: () => import('@/views/hrms/checkIn.vue'),
  },
  {
    path: '/leave',
    name: 'leaves',
    beforeEnter: Authenticate,
    component: () => import('@/views/hrms/leaveapplication.vue'),
  },
  
  {
    path: '/my-payslip',
    name: 'claims',
    beforeEnter: Authenticate,
    component: () => import('@/views/hrms/leaveCllaim.vue'),
  },
  
  {
    path: '/orderdetails/:id',
    name: 'orderDetails',
    beforeEnter: Authenticate,
    component: () => import('@/views/driver/orderDetails.vue'),
  },
  {
    path: '/notdelivered/:id',
    name: 'notdelivered',
    beforeEnter: Authenticate,
    component: () => import('@/views/driver/notDeliverd.vue'),
  },
  {
    path: '/direction/:id',
    name: 'direction',
    beforeEnter: Authenticate,
    component: () => import('@/views/driver/direction.vue'),
  },
  
  {
    path: '/confirm/:id',
    name: 'confirm',
    beforeEnter: Authenticate,
    component: () => import('@/views/driver/confirm.vue'),
  },
  {
    path: '/unassignedOrder',
    name: 'unassignedOrder',
    beforeEnter: Authenticate,
    component: () => import('@/views/supervisor/unassignedOrder.vue'),
  },
  {
    path: '/assignDriver',
    name: 'assignDriver',
    beforeEnter: Authenticate,
    component: () => import('@/views/supervisor/assignDriver.vue'),
  },
 
  //sales order routes
  {
    path: '/sales-orders',
    name: 'SalesOrder',
    beforeEnter: Authenticate,
    component: () => import ('@/views/salesOrder/index.vue')
  },
  {
    path: '/sales-order/:id/view',
    name: 'SalesOrderView',
    beforeEnter: Authenticate,
    component: () => import ('@/views/salesOrder/view.vue')
  },
  {
    path: '/sales-order/customer',
    name: 'AddSaleOrderCustomer',
    beforeEnter: Authenticate,
    component: () => import ('@/views/salesOrder/customers.vue')
  },
  {
    path: '/sales-order/products',
    name: 'AddSaleOrderProducts',
    beforeEnter: Authenticate,
    component: () => import ('@/views/salesOrder/products.vue')
  },
  {
    path: '/sales-order/delivery-address',
    name: 'SaleOrderDeliveryAddress',
    beforeEnter: Authenticate,
    component: () => import ('@/views/salesOrder/deliveryAddress.vue')
  },
  // {
  //   path: '/delivery/:order_id',
  //   name: 'Delivery',
  //   component: () => import('@/views/delivery/delivery.vue')
  // },
  // {
  //   path: '/verification/:order_id',
  //   name: 'Verification',
  //   component: () => import('@/views/delivery/verification.vue')
  // },
  // {
  //   path: '/amount/:order_id',
  //   name: 'Amount',
  //   component: () => import('@/views/delivery/amount.vue')
  // },
  {
    path: '/attendance',
    name: 'Attendance',
    component: () => import('@/views/hrms/attendance.vue')
  },
  {
    path: '/leaves',
    name: 'Leaves',
    component: () => import('@/views/hrms/leaves.vue')
  },
  {
    path: '/hrms',
    name: 'Hrms',
    component: () => import('@/views/hrms/hrms.vue')
  },
  {
    path: '/payroll',
    name: 'Payroll',
    component: () => import('@/views/hrms/payroll.vue')
  },
  {
    path: '/expenseclaim',
    name: 'Expenseclaim',
    component: () => import('@/views/hrms/expenseclaim.vue')
  },
  {
    path: '/addexpenditure',
    name: 'addexpenditure',
    component: () => import('@/views/Expenditure/Addexpendure.vue')
  },
  {
    path: '/viewexpenditure',
    name: 'viewexpenditure',
    component: () => import('@/views/Expenditure/viewExpenditure.vue')
  },
  {
    path: '/editexpenditure',
    name: 'editexpenditure',
    component: () => import('@/views/Expenditure/editExpenditure.vue')
  },

  {
    path: '/sales-order/billing-address',
    name: 'SaleOrderBillingAddress',
    beforeEnter: Authenticate,
    component: () => import ('@/views/salesOrder/billingAddress.vue')
  },
  {
    path: '/sales-order/preview',
    name: 'SaleOrderPreview',
    beforeEnter: Authenticate,
    component: () => import ('@/views/salesOrder/preview.vue')
  },
  {
    path: '/sales-order/payment',
    name: 'SaleOrderPayment',
    beforeEnter: Authenticate,
    component: () => import ('@/views/salesOrder/payment.vue')
  },
  // quotation routes
  {
    path: '/quotations',
    name: 'Quotations',
    beforeEnter: Authenticate,
    component: () => import ('@/views/quotation/index.vue')
  },
  {
    path: '/quotationcustomer',
    name: 'AddQuotationCustomer',
    beforeEnter: Authenticate,
    component: () => import ('@/views/quotation/customers.vue')

  },
  {
    path: '/quotation/products',
    name: 'AddQuotationProducts',
    beforeEnter: Authenticate,
    component: () => import ('@/views/quotation/products.vue')
  },
  {
    path: '/quotation/delivery-address',
    name: 'QuotationDeliveryAddress',
    beforeEnter: Authenticate,
    component: () => import ('@/views/quotation/deliveryAddress.vue')
  },
  {
    path: '/quotation/billing-address',
    name: 'QuotationBillingAddress',
    beforeEnter: Authenticate,
    component: () => import ('@/views/quotation/billingAddress.vue')
  },
  {
    path: '/quotation/preview',
    name: 'QuotationPreview',
    beforeEnter: Authenticate,
    component: () => import ('@/views/quotation/preview.vue')
  },
  {
    path: '/quotation/payment',
    name: 'QuotationPayment',
    beforeEnter: Authenticate,
    component: () => import ('@/views/quotation/payment.vue')
  },

 
  {
    path:'/Profile',
    name:'Profile',
    beforeEnter:Authenticate,
    component:()=> import('@/views/UserProfile/Profile.vue')
  },
  {
    path:'/ChangePassword',
    name:'ChangePassword',
    beforeEnter:Authenticate,
    component:()=> import('@/views/UserProfile/ChangePassword.vue')
  },
  {
    path: '/Scanner',
    name: 'Scanner',
    beforeEnter:Authenticate,
    component:()=>import('@/Views/Scan/Scanner.vue')
  },
  // cyclecount-Route
  {

    path:'/AddWearhouse',
    name:'AddWearhouse',
    beforeEnter:Authenticate,
    component: ()=> import('@/views/CycleCount/AddWearhouse.vue')
  },
   {

    path:'/SelectPlan',
    name:'SelectPlan',
    beforeEnter:Authenticate,
    component: ()=> import('@/views/CycleCount/SelectPlan.vue')
  },

    {

    path:'/SelectTask',
    name:'SelectTask',
    beforeEnter:Authenticate,
    component: ()=> import('@/views/CycleCount/SelectTask.vue')
  },

   {

    path:'/EnterBin',
    name:'EnterBin',
    beforeEnter:Authenticate,
    component: ()=> import('@/views/CycleCount/EnterBin.vue')
  },

  {

    path:'/EnterItem',
    name:'EnterItem',
    beforeEnter:Authenticate,
    component: ()=> import('@/views/CycleCount/EnterItem.vue')
  },

  

   {
    path:'/EnterQuentity',
    name:'EnterQuentity',
    beforeEnter:Authenticate,
    component: ()=> import('@/views/CycleCount/EnterQuentity.vue')
  },

  
   {
    path:'/PlanComplete',
    name:'PlanComplete',
    beforeEnter:Authenticate,
    component: ()=> import('@/views/CycleCount/PlanComplete.vue')
  },

  
  {
    path:'/AddCount',
    name:'AddCount',
    beforeEnter:Authenticate,
    component: ()=> import('@/views/CycleCount/AddCount.vue')
  },
  {
    path:'/ViewCount',
    name:'ViewCount',
    beforeEnter:Authenticate,
    component: ()=>import('@/views/CycleCount/ViewCount.vue')
  },
  {
      path:'/ScanBacode',
      name:'ScanBacode',
      beforeEnter:Authenticate,
      component: ()=> import('@/views/CycleCount/ScanBacode.vue'),
  },

  // Bin Transfer
   {
  path: '/BinScan',
  name:'BinScan',
  beforeEnter:Authenticate,
  component: ()=> import('@/views/BinTransfer/BinScan.vue')
   },
  {
    path: '/BinScanCategory',
  name:'BinScanCategory',
   beforeEnter:Authenticate,
     component: ()=> import('@/views/BinTransfer/BinScanCategory.vue')
  },
      {
  path: '/BinInformationScan',
  name:'BinInformationScan',
  beforeEnter:Authenticate,
  component: ()=> import('@/views/BinTransfer/BinInformationScan.vue')
   },
   {
  path: '/BinProductDetails',
  name:'BinProductDetails',
  beforeEnter:Authenticate,
  component: ()=> import('@/views/BinTransfer/BinProductDetails.vue')
   },

    {
  path: '/BinInformation',
  name:'BinInformation',
  beforeEnter:Authenticate,
  component: ()=> import('@/views/BinTransfer/BinInformation.vue')
   },

    {
    path: '/NewBinTransfer',
    name:'NewBinTransfer',
    beforeEnter:Authenticate,
    component: ()=> import('@/views/BinTransfer/NewBinTransfer.vue'),
     props: true,
    
   },

   {
    path: '/NewBinDetails',
    name:'NewBinDetails',
    beforeEnter:Authenticate,
    component: ()=> import('@/views/BinTransfer/NewBinDetails.vue'),
   },

  //  selfCollected 

 {
    path: '/SelfCollected',
    name:'SelfCollected',
    beforeEnter:Authenticate,
    component: ()=> import('@/views/SelfCollected.vue'),
   },

    {
    path: '/SelfCollectedPendingDelivery',
    name:'SelfCollectedPendingDelivery',
    beforeEnter:Authenticate,
    component: ()=> import('@/views/SelfCollectedPendingDelivery.vue'),
   },

     {
    path: '/SelfCollectedDeliveryOrder',
    name:'SelfCollectedDeliveryOrder',
    beforeEnter:Authenticate,
    component: ()=> import('@/views/SelfCollectedDeliveryOrder.vue'),
   },





]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
