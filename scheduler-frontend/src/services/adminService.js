import axios from "axios";
import { config } from "../config";


// Add Email To Whitelist
export async function addWhitelistEmail(email) {
    try {
        const token = localStorage.getItem("token");

        const url = `${config.serverUrl}/admin/add-whitelist`;

        const response = await axios.post(
            url,
            { email },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;

    } catch (e) {
        console.error("Error from addWhitelistEmail axios:", e);
        throw e;
    }
}

// Get Whitelisted Emails
export async function getWhitelistedEmails() {
    try {
        const token = localStorage.getItem("token");

        const url = `${config.serverUrl}/admin/whitelisted-email`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;

    } catch (e) {
        console.error("Error from getWhitelistedEmails axios:", e);
        throw e;
    }
}

// Delete Whitelisted Email
export async function deleteWhitelistedEmail(id) {
    try {
        const token = localStorage.getItem("token");

        const url = `${config.serverUrl}/admin/delete-whitelisted-email/${id}`;

        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;

    } catch (e) {
        console.error("Error from deleteWhitelistedEmail axios:", e);
        throw e;
    }
}