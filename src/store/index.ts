import Vuex from "vuex";
import { createStore } from 'vuex';
import salesOrder from "./modules/salesOrder";
import lang from "./modules/lang";

// Create store
export default createStore({
    state: {},
    mutations: {},
    getters: {},
    actions: {},
    modules: {
        salesOrder,
        lang
    }
  })
