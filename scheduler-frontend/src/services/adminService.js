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


//----------------Admin Slot Services----------------//

// Get All Slots
export async function getAllSlots() {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${config.serverUrl}/admin/available-slots`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Error fetching slots:", error);
    throw error;
  }
}


// Create Slot

export async function createSlot(slotData) {
  try {
    const token = localStorage.getItem("token");

    console.log(slotData)

    const response = await axios.post(
      `${config.serverUrl}/admin/create-slot`,
      slotData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Error creating slot:", error);
    throw error;
  }
}

// Delete Slot

export async function deleteSlot(slotId) {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${config.serverUrl}/admin/delete-slot/${slotId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Error deleting slot:", error);
    throw error;
  }
}


// Admin Dashboard

export async function getAllInterviewBookings() {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${config.serverUrl}/admin/interview-bookings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; 

  } catch (error) {
    console.error("Error fetching interview bookings:", error);
    throw error;
  }
}