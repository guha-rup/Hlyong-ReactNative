import apiCall from "./index";
import endpoints from "./endpoints";

class AuthService {
    login(inputData: any): Promise<any> {
        return apiCall.post(endpoints.login, inputData);
    }

   
}

export default new AuthService;