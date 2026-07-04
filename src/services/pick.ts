import apiCall from "./index";

import endpoints from "./endpoints";
import axios from "axios";
const apiKey = 'AIzaSyATWJJptsF1uqMYKxxAQ8KB64lL7GZ2amc';
const addressurl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

const mapsApiUrl = 'https://maps.googleapis.com/maps/api/directions/json';

class myorders {
  prepareQuery(url: String, params: any = {}) {
    return (
      url +
      "?" +
      Object.keys(params)
        .map((paramName) => paramName + "=" + params[paramName])
        .join("&")
    );
  }

  getLocations(inputData: any): Promise<any>{
    return axios.post(addressurl, inputData  );
}


async getDirections(origin: any, destination: any): Promise<any> {
  
  
  try {
    
    const response = await apiCall.get (endpoints.location_api, {
      params: {
        origin: origin,
        destination:destination
      
    },
    })


    if (response.status == "OK") {
      console.log("response",response.routes[0].overview_polyline.points);
      
      return response.routes[0].overview_polyline.points;
    } else {
    
      throw new Error('Unable to get directions.');
   
    }
  } 
  catch (error) {
  
    throw error;
  }
};
getsuppliername() {
  let userinfonew = JSON.parse(localStorage.getItem("userInfo") || "")
  const inputData = {
    ITEM: "VIEW_ALL",
    ORGANISATION_SYS_ID:userinfonew.Organisation_Sys_Id
  };
  return apiCall.get(this.prepareQuery(endpoints.getsupplier, inputData));
}

UOMProductItem(PRODUCT_SYS_ID: string){
  const inputData = {
    ITEM: "SPECIFIC",
    PRODUCT_SYS_ID: PRODUCT_SYS_ID


  };
  return apiCall.get(this.prepareQuery(endpoints.UOMProduct, inputData));
}
qrcode(scannedData,pack){

  const inputData = {
    ITEM: "SPECIFIC",
    QR_CODE: scannedData


  };
  return apiCall.get(this.prepareQuery(endpoints.qr_code, inputData)); 
}

binbarcodeDynamic(scannedBarcode: string){ 
  const inputData = {
    ITEM: "SPECIFIC",
    BIN_BARCODE : scannedBarcode,
    ORGANISATION_SYS_ID:"64"
  };
  return apiCall.get(this.prepareQuery(endpoints.bin_barcode_details,inputData))
}


BinNameWiseProduct(binName: string) {
  let userinfonew = JSON.parse(localStorage.getItem("userInfo") || "")
  const inputData = {
    ITEM: "SPECIFIC",
    BIN_NAME: binName,
    ORGANISATION_SYS_ID: userinfonew.Organisation_Sys_Id
  };
  return apiCall.get(this.prepareQuery(endpoints.bin_name_wise_product,inputData));
}

SpecificUom(Prductsysid){
   let userinfonew = JSON.parse(localStorage.getItem("userInfo") || "")
  const inputData = {
    ITEM: "SPECIFIC",
    PRODUCT_SYS_ID: Prductsysid,
    ORGANISATION_SYS_ID: userinfonew.Organisation_Sys_Id
  };
  return apiCall.get(this.prepareQuery(endpoints.Product_specific,inputData));
}
salesorderdetailes(searchString){
  const inputData = {
    ITEM: "ORDER_PROCESSING",
    ORDER_ID:searchString
  };
  return apiCall.get(this.prepareQuery(endpoints.salesorder_id, inputData));
}
getCustomer(){
  let userinfonew = JSON.parse(localStorage.getItem("userInfo") || "")
  const inputData = {
    ITEM: "VIEW_ALL",
    ORGANISATION_SYS_ID:userinfonew.Organisation_Sys_Id
  };
  return apiCall.get(this.prepareQuery(endpoints.getCustomer, inputData));
}



getSpecificSupplierCaptureValue(getId){
  const inputData = {
    ITEM: "SPECIFIC",
    VENDOR_SYS_ID:getId
  };
  return apiCall.get(this.prepareQuery(endpoints.specific_supplier, inputData));
}
getSpecificCustomerCaptureValue(getId){
  const inputData = {
    ITEM: "SPECIFIC",
    CUSTOMER_SYS_ID:getId
  };
  return apiCall.get(this.prepareQuery(endpoints.specific_customer, inputData));
}
category(){
  const inputData = {
    ITEM: "VIEW_ALL",
  };
  return apiCall.get(this.prepareQuery(endpoints.category, inputData));
}
getExpenditure(){
  const inputData = {
    ITEM: "VIEW_ALL",
  };
  return apiCall.get(this.prepareQuery(endpoints.get_expenditure, inputData));
}

PostImage(inputData: any): Promise<any> {
        
  const headers = {
      "Content-Type": "multipart/form-data; charset=utf-8; boundary=" +
          Math.random().toString().substr(2),
  }
  return apiCall.post(endpoints.postImageUpload, inputData, { headers });
}
PostImagenew(inputData: any): Promise<any> {
        
  const headers = {
      "Content-Type": "multipart/form-data; charset=utf-8; boundary=" +
          Math.random().toString().substr(2),
  }
  return apiCall.post(endpoints.postImageUpload, inputData, { headers });
}
signatureimage(inputData: any): Promise<any> {
        
  const headers = {
      "Content-Type": "multipart/form-data; charset=utf-8; boundary=" +
          Math.random().toString().substr(2),
  }
  return apiCall.post(endpoints.postImageUpload, inputData, { headers });
}


async getPlaceNameByLatLng(lat: string|number, lng: string|number) {
    try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            latlng: `${lat},${lng}`,
            key: apiKey,
        },
      });
      if (response.data.status === 'OK') {
        return response.data.results[0].formatted_address;
      } else {
        throw new Error('Unable to get place.');
      }
    } catch (error) {
      console.error('Error fetching place:', error);
      throw error;
    }
}

  //Address api call
//   getLocations(inputData: any): Promise<any> {
//     return axios.post(addressurl, inputData);
//   }

pickdate(searchString: any): Promise<any> {
    let userinfonew = JSON.parse(localStorage.getItem("userInfo") || "")

    const inputData = {
      ITEM: "SPECIFIC",
      USER_SYS_ID: userinfonew.UserId, // need to be dynamic
      DATE: searchString,
    };
    return apiCall.get(this.prepareQuery(endpoints.searchOrders, inputData));
  }
  deliveryDATE(searchString: any): Promise<any>{
    let userinfonew = JSON.parse(localStorage.getItem("userInfo") || "")

    const inputData = {
      ITEM: "SPECIFIC",
      USER_SYS_ID: userinfonew.UserId, // need to be dynamic
      DELIVERY_DATE: searchString,
    };
    return apiCall.get(this.prepareQuery(endpoints.deliveryorderlist, inputData));
  }

  getSelfCollected(): Promise<any> {
    const inputData = {
      ITEM: "SELF_COLLECTION",
      DELIVERY_DATE: "NULL",
      USER_SYS_ID: "0",
    };
    return apiCall.get(this.prepareQuery(endpoints.Self_Collected, inputData));
  }

  OrderDetailes(): Promise<any> {
    let userinfonew = JSON.parse(localStorage.getItem("userInfo") || "")

    const inputData = {
      ITEM: "SPECIFIC",
      USER_SYS_ID: userinfonew.UserId, // need to be dynamic
    
    };
    return apiCall.get(this.prepareQuery(endpoints.order_new_detailes, inputData));
  }

  onsearch() : Promise<any>{
    let userinfonew = JSON.parse(localStorage.getItem("userInfo") || "")
    const inputData = {
      ITEM : 'SPECIFIC',
      USER_SYS_ID : userinfonew.UserId
    };
    return apiCall.get(this.prepareQuery(endpoints.User_Profile,inputData));
  }

   productInformationSearch(scannedBarcode: string): Promise<any> {
    const inputData = {
      ITEM: "PRODUCT",
      SEARCH_BARCODE: scannedBarcode
    };
    return apiCall.get(this.prepareQuery(endpoints.Product_Information, inputData));
   }

   binLocationSearch(scannedBarcode: string): Promise<any> {

  //   const testBarcode = "N13-01-04"; 
  // console.log(`[TEST MODE] Overriding scanned value '${scannedBarcode}' with '${testBarcode}'`);
  const inputData = {
    ITEM: "BIN_LOCATION",
    SEARCH_BARCODE: scannedBarcode
  };
  return apiCall.get(this.prepareQuery(endpoints.Bin_Information, inputData));
}

 getWarehouses(): Promise<any> {
    let userinfonew = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const inputData = {
      ITEM: "WAREHOUSE",
      ORGANISATION_SYS_ID: userinfonew.Organisation_Sys_Id || "1"
    };
    return apiCall.get(this.prepareQuery(endpoints.WearHouse_Get, inputData));
  }


getCyclePlans(warehouseId: any): Promise<any> {
  const userinfonew = JSON.parse(localStorage.getItem("userInfo") || "{}");
  
  const inputData = {
    ITEM: "SPECIFIC",
    ORGANISATION_SYS_ID: userinfonew.Organisation_Sys_Id || "1",
    WAREHOUSE_SYS_ID: warehouseId,
     ASSIGN_SYS_ID: userinfonew.UserId 
  //  ASSIGN_SYS_ID: "128"
  };

  // const inProgressData = {
  //     ITEM: "SPECIFIC_IN_PROGRESS",
  //     ORGANISATION_SYS_ID: userinfonew.Organisation_Sys_Id || "1",
  //     WAREHOUSE_SYS_ID: warehouseId,
  //     ASSIGN_SYS_ID: userinfonew.UserId 
  //   };

  //    const completedData = {
  //     ITEM: "SPECIFIC_COMPLETED",
  //     ORGANISATION_SYS_ID: userinfonew.Organisation_Sys_Id || "1",
  //     WAREHOUSE_SYS_ID: warehouseId,
  //     ASSIGN_SYS_ID: userinfonew.UserId 
  //   };

    // return Promise.all([
    //   apiCall.get(this.prepareQuery(endpoints.PlanList_Display, inProgressData)),
    //   apiCall.get(this.prepareQuery(endpoints.PlanList_Display, completedData))
    // ]).then(([inProgressRes, completedRes]) => {
    //    let inProgressPlans = Array.isArray(inProgressRes) ? inProgressRes : (inProgressRes?.data || inProgressRes?.response || []);
    //     if (typeof inProgressPlans === 'string') inProgressPlans = [];

    //   let completedPlans = Array.isArray(completedRes) ? completedRes : (completedRes?.data || completedRes?.response || []);
    //   if (typeof completedPlans === 'string') completedPlans = [];
    //   return [...inProgressPlans, ...completedPlans];
  // });

   return apiCall.get(this.prepareQuery(endpoints.PlanList_Display, inputData));
}

verifyBinScan(binName: string, warehouseId: string | number): Promise<any> {
  const userinfonew = JSON.parse(localStorage.getItem("userInfo") || "{}");
  
  const inputData = {
    ITEM: "SPECIFIC",
    ORGANISATION_SYS_ID: userinfonew.Organisation_Sys_Id || "1",
    WAREHOUSE_SYS_ID: warehouseId,
    BIN_NAME: binName
  };

  return apiCall.get(this.prepareQuery(endpoints.PLAN_BIN_SCAN, inputData));
}

getItemList(): Promise<any> {
    let userinfonew = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const inputData = {
      ITEM: "VIEW_ALL",
      PAGE_SIZE:'',
      PAGE_NO: '',
      ORGANISATION_SYS_ID: userinfonew.Organisation_Sys_Id || "1"
    };
    return apiCall.get(this.prepareQuery(endpoints.Item_List, inputData));
  }

  searchProducts(searchText: string): Promise<any> {
  let userinfonew = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const inputData = {
    ITEM: "PRODUCT",
    SEARCH_TEXT: searchText,
    ORGANISATION_SYS_ID: userinfonew.Organisation_Sys_Id || "1"
  };
  return apiCall.get(this.prepareQuery(endpoints.Item_Search, inputData));
}

getProductSpecificInfo(productSysId: any) {
  const inputData = {
    ITEM: "SPECIFIC",
    PRODUCT_SYS_ID: productSysId,
  };
  return apiCall.get(this.prepareQuery(endpoints.Product_Unit, inputData));
}

  updatePlanStatus(inputData: any): Promise<any> {
    return apiCall.post(endpoints.Plan_Id_Post, inputData);
  }

  addCycleCountQty(inputData: any): Promise<any> {
    return apiCall.post(endpoints.PLAN_ITEM_Quantity, inputData);
  }
 
  addExpendituresave(inputData: any): Promise<any>{
    return apiCall.post(endpoints.add_expendiure, inputData);
  }
  deleteExpendituresave(inputData: any): Promise<any>{
    return apiCall.post(endpoints.add_expendiure, inputData);
  }
  qrcodepost(inputData:any) : Promise<any>{
    return apiCall.post(endpoints.qty_packed, inputData)
  }
  deliveryStatus(inputData: any): Promise<any> {
    return apiCall.post(endpoints.delivery_job_post, inputData);
  }
  outDeliveryStaus(inputData: any): Promise<any> {
    return apiCall.post(endpoints.delivery_job_post, inputData);
  }
  notdelivery(inputData: any): Promise<any> {
    return apiCall.post(endpoints.delivery_job_post, inputData);
  }
  resetPassword(inputData: any): Promise<any>{
    return apiCall.post(endpoints.resetPassword, inputData);
  }
  emailverifycation(inputData: any): Promise<any>{
    return apiCall.post(endpoints.email_verification, inputData);
  }
  otpVerificationnew(inputData: any): Promise<any>{
    return apiCall.post(endpoints.email_verification, inputData);
  }
  gotoCompletePack(inputData: any): Promise<any> {
    return apiCall.post(endpoints.status_changes, inputData);
  }
  inprogressPickingDetailes(inputData: any): Promise<any> {
    return apiCall.post(endpoints.status_changes, inputData);
  }
  newpassword(inputData: any): Promise<any> {
    return apiCall.post(endpoints. Change_Password, inputData);
  }
  Bin_submit_Details(inputData:any): Promise<any> {
   return apiCall.post(endpoints. Bin_submit, inputData);
  }

  dateSelectedUnassigned(searchString: any): Promise<any> {
    const inputData = {
      ITEM: "VIEW_ALL",

      DELIVERY_DATE: searchString,
    };
    return apiCall.get(this.prepareQuery(endpoints.unassignedOrder, inputData));
  }
  statuschange(inputData: any): Promise<any> {
    const authUser = JSON.parse(localStorage.getItem("userInfo") || "");

    return apiCall.post(endpoints.status_changes, inputData);
  }
  goToConfirm(inputData: any): Promise<any> {
    const authUser = JSON.parse(localStorage.getItem("userInfo") || "");

    return apiCall.post(endpoints.driver_payment, inputData);
  }
  submitForm(inputData: any): Promise<any> {
    return apiCall.post(endpoints.status_changes, inputData);
  }
  submitReason(inputData: any): Promise<any> {
    return apiCall.post(endpoints.cancelOrder, inputData);
  }
  onFileChange(inputData: any): Promise<any> {
    return apiCall.post(endpoints.status_changes, inputData);
  }

  deliveryAddress(customerSysId: any): Promise<any> {
    const inputData = {
      ITEM: "SPECIFIC",
      RECORD_SYS_ID: customerSysId,
      TYPE: "DELIVERY",
    };
    return apiCall.get(this.prepareQuery(endpoints.deliveryAddress, inputData));
  }

  billingAddress(customerSysId: any): Promise<any> {
    const inputData = {
      ITEM: "SPECIFIC",
      RECORD_SYS_ID: customerSysId,
      TYPE: "BILLING",
    };
    return apiCall.get(this.prepareQuery(endpoints.deliveryAddress, inputData));
  }

  getDriver(): Promise<any> {
    const inputData = {
      ITEM: "DRIVER",
    };
    return apiCall.get(this.prepareQuery(endpoints.driver, inputData));
  }
  getpaymentmode() {
    const inputData = {
      ITEM: "VIEW_ALL",
    };
    return apiCall.get(this.prepareQuery(endpoints.modeofpayment, inputData));
  }
  getOrderHistory(): Promise<any> {
    let deliver_sys_id = localStorage.getItem("UserId");
    const inputData = {
      ITEM: "SPECIFIC",
      DELIVERY_PERSON_SYS_ID: deliver_sys_id, //need to be dynamic
      // DELIVERY_DATE : "NULL"
    };
    return apiCall.get(this.prepareQuery(endpoints.orderHIstory, inputData));
  }
}

export default new myorders();
