export default {
    state: {
        selectedCustomer: null,
        customers: [],
        productTypes: [],
        selectedProductType: null,
        products: [],
        cart: [],
        tax: 0,
        selectedDeliveryAddress: null,
        selectedBillingAddress: null,
        errorInfo: null,
        salesOrder: null
    },
    getters: {
        getSelectedCustomer: (state: { selectedCustomer: any; }) => state.selectedCustomer,
        getCustomers: (state: { customers: any; }) => state.customers,
        getProductTypes: (state: { productTypes: any; }) => state.productTypes,
        getProducts: (state: { products: any; }) => state.products,
        getSelectedProductType: (state: { selectedProductType: any }) => state.selectedProductType,
        getCart: (state: { cart: any; }) => state.cart,
        getTotalPrice: (state: { cart: any; tax: any }) => {
            let price: any = 0;
            state.cart.forEach((item: any) => {
                price += (parseFloat(item.grossAmount) - parseFloat(item.discount));
                price -= (parseFloat(state.tax));
            });
            return parseFloat(price).toFixed(2);
        },
        getOrderQuantityFromCart: (state : { cart: any; }) => {
            let quantity = 0;
            state.cart.forEach((item: { quantity: any; }) => {
                quantity += parseInt(item.quantity || 0);
            });
            return quantity;
        },
        getTotalGrossAmountFromCart: (state : { cart: any; }) => {
            let price: any = 0;
            state.cart.forEach((item: { grossAmount: any; }) => {
                price += parseInt(item.grossAmount || 0);
            });
            return parseFloat(price).toFixed(2);
        },
        getDeliveryAddress: (state: { selectedDeliveryAddress: any; }) => state.selectedDeliveryAddress,
        getBillingAddress: (state: { selectedBillingAddress: any; }) => state.selectedBillingAddress,
        getError: (state: { errorInfo: any; }) => state.errorInfo,
        getSalesOrder: (state: { salesOrder: any; }) => state.salesOrder,
    },
    mutations: {
        setSelectedCustomer(state: { selectedCustomer: any; }, data: any) {
            state.selectedCustomer = data;
        },
        setCustomers(state: { customers: any; }, data: any) {
            state.customers = data;
        },
        setProducts(state: { products: any; }, data: any) {
            state.products = data;
        },
        setProductTypes(state: { productTypes: any; }, data: any) {
            state.productTypes = data;
        },
        setSelectedProductType(state: { selectedProductType: any; }, data: any) {
            state.selectedProductType = data;
        },
        addToCart(state: { cart: any; }, data: any) {
            const cart = JSON.parse(JSON.stringify(state.cart));
            const itemIndex = cart.findIndex((item: { PRODUCT_SYS_ID: any; }) => item.PRODUCT_SYS_ID === data.PRODUCT_SYS_ID);
            console.log(itemIndex, data);
            if (cart.length > 0 && itemIndex >= 0) {
                cart[itemIndex].quantity += 1; 
                cart[itemIndex].discount = cart[itemIndex].discount
                    ? cart[itemIndex].discount * cart[itemIndex].quantity
                    : 0;
                cart[itemIndex].grossAmount = cart[itemIndex].SELL_PRICE * cart[itemIndex].quantity;
            } else {
                data['quantity'] = 1;
                data['discount'] = data['discount'] ? data['discount'] : 0;
                data['grossAmount'] = data.SELL_PRICE ? data.SELL_PRICE : 0;
                cart.push(data);
            }
            state.cart = cart;
        },
        updateToCart(state: { cart: any; }, data: any) {
            state.cart = data;
        },
        removeFromCart(state: { cart: any; }, data: any) {
            const cart = JSON.parse(JSON.stringify(state.cart));
            const itemIndex = cart.findIndex((item: { PRODUCT_SYS_ID: any; }) => item.PRODUCT_SYS_ID === data.PRODUCT_SYS_ID);
            if ((itemIndex === 0 || itemIndex) && cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1; 
                cart[itemIndex].discount = cart[itemIndex].discount
                    ? cart[itemIndex].discount * cart[itemIndex].quantity
                    : 0;
                cart[itemIndex].grossAmount = cart[itemIndex].SELL_PRICE * cart[itemIndex].quantity;
            } else {
                cart.splice(itemIndex, 1);
            }
            state.cart = cart;
        },
        setDeliveryAddress(state: { selectedDeliveryAddress: any; }, data: any) {
            state.selectedDeliveryAddress = data;
        },
        setBillingAddress(state: { selectedBillingAddress: any; }, data: any) {
            state.selectedBillingAddress = data;
        },
        setError(state: { errorInfo: any; }, data: any) {
            state.errorInfo = data;
        },
        setSalesOrder(state: { salesOrder: any; }, data: any) {
            state.salesOrder = data;
            // need to create action
        },
    },
    actions: {
        setSelectedCustomer({ commit }: any, data: any) {
            commit("setSelectedCustomer", data);
        },
        setCustomers({ commit }: any, data: any) {
            commit("setCustomers", data);
        },
        setProducts({ commit }: any, data: any) {
            commit("setProducts", data);
        },
        setProductTypes({ commit }: any, data: any) {
            commit("setProductTypes", data);
            if (data.length > 0) {
                commit("setSelectedProductType", data[0].PRODUCT_TYPE_SYS_ID);
            } else {
                commit("setSelectedProductType", null);
            }
        },
        setSelectedProductType({ commit }: any, data: any) {
            commit("setSelectedProductType", data);
        },
        addToCart({ commit }: any, data: any) {
            commit("addToCart", data);
        },
        updateToCart({ commit }: any, data: any) {
            commit("updateToCart", data);
        },
        removeFromCart({ commit }: any, data: any) {
            commit("removeFromCart", data);
        },
        setDeliveryAddress({ commit }: any, data: any) {
            commit("setDeliveryAddress", data);
        },
        setBillingAddress({ commit }: any, data: any) {
            commit("setBillingAddress", data);
        },
        setError({ commit }: any, data: any) {
            commit("setError", data);
        },
    }
}