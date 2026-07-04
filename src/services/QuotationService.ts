import apiCall from "./index";

import endpoints from "./endpoints";

class QuotationService {
    prepareQuery(url: String, params: any = {}) {
        return url + "?" + Object.keys(params).map(paramName => paramName + '=' + params[paramName]).join('&');
    }

    getOrders(status: any): Promise<any> {
        const inputData = {
            ITEM: 'VIEW_ALL',
            ORDER_STATUS: status
        };
        return apiCall.get(this.prepareQuery(endpoints.quotationList, inputData));
    }

    getOrderById(id: any): Promise<any> {
        const inputData = {
            ITEM: 'SPECIFIC',
            QUOTATION_ID: id
        };
        return apiCall.get(this.prepareQuery(endpoints.quotationById, inputData));
    }

    updateStatus(id: any, status: string ="ORDER_APPROVAL"): Promise<any> {
        const inputData: any = {
            ITEM: status,
            QUOTATION_ID: id
        };
        const authUser = JSON.parse(localStorage.getItem("userInfo") || '');
        inputData.CREATED_BY = authUser.UserId;
        return apiCall.post(endpoints.quotationStatusUpdate, inputData);
    }

    getOrdersBySearch(searchText: any): Promise<any> {
        const inputData = {
            SEARCH_TEXT: searchText,
            ITEM: 'SPECIFIC'
        }
        return apiCall.get(this.prepareQuery(endpoints.quotationSearch, inputData));
    }

    getCustomerList(searchTex: any): Promise<any> {
        const inputData = {
            ITEM: 'VIEW_ALL',
            SEARCH_TEXT: searchTex
        };
        return apiCall.get(this.prepareQuery(endpoints.customerSearch, inputData));
    }

    getSpecificCustomer(customerId: Number): Promise<any> {
        const inputData = {
            ITEM: 'SPECIFIC',
            CUSTOMER_SYS_ID: customerId
        }; 
        return apiCall.get(this.prepareQuery(endpoints.getSpecificCustomer, inputData));
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