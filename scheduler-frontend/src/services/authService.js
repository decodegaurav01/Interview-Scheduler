import axios from "axios"

import { config } from "../config"

// ---------Admin Login---------

export async function adminLogin(email, password) {
    try {
        const url = `${config.serverUrl}/auth/admin-login`;
        const body = { email, password };

        const response = await axios.post(url, body);

        console.log(response)

        if (response)
            return response.data;
        else
            return null;
    } catch (e) {
        console.log("error from adminLogin axios " + " " + e);
    }

}

//---------- Candidate Login-----------


export async function candidateLogin(email) {
    try {
        const response = await axios.post(
            `${config.serverUrl}/auth/candidate-login`,
            { email }
        );

        if (response)
            return response.data;
        else
            return null;

    } catch (e) {
        console.log("error from candidateLogin axios " + " " + e);

    }
}
