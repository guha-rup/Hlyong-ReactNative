import apiCall from "./index";

import endpoints from "./endpoints";
import axios from "axios";
const apiKey = 'AIzaSyATWJJptsF1uqMYKxxAQ8KB64lL7GZ2amc';
const addressurl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

// Define the URL of the Google Maps Directions API
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

  dateSelected(searchString: any): Promise<any> {
    let userId = localStorage.getItem("UserId");

    const inputData = {
      ITEM: "SPECIFIC",
      DELIVERY_PERSON_SYS_ID: userId, // need to be dynamic
      DELIVERY_DATE: searchString,
    };
    return apiCall.get(this.prepareQuery(endpoints.searchOrders, inputData));
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
