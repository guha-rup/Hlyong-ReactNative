import i18n from "@/lang/lang";

interface Language {
  name: string;
  code: string;
}

interface State {
  languages: Language[];
  activeLanguage: string | null;
}
const getDefaultLanguage = (): string => {
  const storedLanguage = "ENG";
  return storedLanguage ;
};
export default {
  state: {
    languages: [
      {
        name: "English",
        code: "ENG",
      },
      {
        name: "Chinese",
        code: "CHI",
      },
    ],
    activeLanguage: null,
  },
  getters: {
    activeLanguage: (state: State) => state.activeLanguage || getDefaultLanguage(),
    languages: (state: State) => state.languages || [],

  
  },
 
  mutations: {
    activateLanguage(state: State, data: string) {
      state.activeLanguage = data;
      localStorage.setItem("activeLanguage", JSON.stringify(data));
      i18n.locale = state.activeLanguage.toLowerCase();
    },
    setLanguages(state: State, data: Language[]) {
      state.languages = data;
    },
  },
  actions: {
    setLanguages({ commit }: { commit: any }, data: Language[]) {
      commit("setLanguages", data);
    },
    setActivateLanguage({ commit }: { commit: any }, data: string) {
      console.log("riju");
      
      commit("activateLanguage", data);
    },
  },
};
