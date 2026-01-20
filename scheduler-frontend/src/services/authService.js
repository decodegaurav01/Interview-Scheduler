import axios from "axios"

import{config} from "../config"

export async function adminLogin(email,password) {
    try{
        const url = `${config.serverUrl}/auth/admin-login`;
        const body = {email,password};

        const response = await axios.post(url,body);

        console.log(response)

        if(response)
            return response.data;
        else
            return null;
    }catch(e){
        console.log("error from adminLogin axios "+" "+ e);
    }
    
}