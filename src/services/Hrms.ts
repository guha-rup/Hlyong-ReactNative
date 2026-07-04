import apiCall from "./index";

import endpoints from "./endpoints";

class QuotationService {
    prepareQuery(url: String, params: any = {}) {
        return url + "?" + Object.keys(params).map(paramName => paramName + '=' + params[paramName]).join('&');
    }

    getBranches(): Promise<any> {
        const inputData = {
            ITEM: 'VIEW_ALL',
            RECORD_SYS_ID: 0,
        };
        return apiCall.get(this.prepareQuery(endpoints.view_branchs, inputData));
    }

    getAttendences(inputData: any): Promise<any> {
        
        return apiCall.get(this.prepareQuery(endpoints.employee_attandence, inputData));
    }

    getHistoryDatas(inputData: any): Promise<any> {
    return apiCall.get(this.prepareQuery(endpoints.get_attendance_history, inputData));
    }

    getAttendanceHistorys(inputData: any): Promise<any> {
       
        return apiCall.get(this.prepareQuery(endpoints.emp_attendance, inputData));
    }

    getTeamAttendences(inputData: any): Promise<any> {
       
        return apiCall.get(this.prepareQuery(endpoints.individual_attandence, inputData));
    }

    loggedOut(inputData: any): Promise<any> {
       
        return apiCall.post(endpoints.post_login_logout, inputData);
    }

    getProductTypes(): Promise<any> {
        const inputData = {
            ITEM: 'VIEW_ALL'
        };
        return apiCall.get(this.prepareQuery(endpoints.productTypes, inputData));
    }

    getProducts(): Promise<any> {
        const inputData = {
            ITEM: 'VIEW_ALL'
        };
        return apiCall.get(this.prepareQuery(endpoints.productList, inputData));
    }

    searchProducts(searchString: any): Promise<any> {
        const inputData = {
            ITEM: 'VIEW_ALL',
            SEARCH_TEXT: searchString
        };
        return apiCall.get(this.prepareQuery(endpoints.searchProduct, inputData));
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

    addQuotation(inputData: any): Promise<any> {
        const authUser = JSON.parse(localStorage.getItem("userInfo") || '');
        inputData.ORDER_INFO.CREATED_BY = authUser.UserId;
        return apiCall.post(endpoints.addQuotation, inputData);
    }

    addDeliveryAddress(inputData: any): Promise<any> {
        const authUser = JSON.parse(localStorage.getItem("userInfo") || '');
        inputData.CREATED_BY = authUser.UserId;
        inputData.RECORD_SYS_ID = 0;
        inputData.ORGANISATION_SYS_ID= 0;
        inputData.TYPE= "DELIVERY";
        inputData.ADDRESS_OF= "CUSTOMER";
        return apiCall.post(endpoints.addAddress, inputData);
    }

    addBillingAddress(inputData: any): Promise<any> {
        const authUser = JSON.parse(localStorage.getItem("userInfo") || '');
        inputData.CREATED_BY = authUser.UserId;
        inputData.RECORD_SYS_ID = 0;
        inputData.ORGANISATION_SYS_ID= 0;
        inputData.TYPE= "BILLING";
        inputData.ADDRESS_OF= "CUSTOMER";
        return apiCall.post(endpoints.addAddress, inputData);
    }
}

export default new QuotationService;