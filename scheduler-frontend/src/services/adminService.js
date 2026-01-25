import axios from "axios";
import { config } from "../config";


// Add Email To Whitelist
export async function addWhitelistEmail(email) {
  try {
    const token = sessionStorage.getItem("token");

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
    const token = sessionStorage.getItem("token");

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
    const token = sessionStorage.getItem("token");

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
    const token = sessionStorage.getItem("token");

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
    const token = sessionStorage.getItem("token");

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
    const token = sessionStorage.getItem("token");

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

//  Update Slot Status

export async function updateSlotStatus(slotId, isActive) {
  const token = sessionStorage.getItem("token");

  const response = await axios.patch(
    `${config.serverUrl}/admin/slots/${slotId}/status`,
    { isActive },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}



// Admin Dashboard

export async function getAllInterviewBookings() {
  try {
    const token = sessionStorage.getItem("token");

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

export async function cancelBooking(bookingId) {
  const token = sessionStorage.getItem("token");

  const response = await axios.delete(
    `${config.serverUrl}/admin/bookings/${bookingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function getDashboardMetrics() {
  const token = sessionStorage.getItem("token");

  const response = await axios.get(
    `${config.serverUrl}/admin/dashboard-metrics`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}



// Admin Logger
export async function getAdminActivityLogs() {
  const token = sessionStorage.getItem("token");

  const response = await axios.get(
    `${config.serverUrl}/admin/activity-logs`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}



//----Interviews---------------//

export async function getAllInterviews() {
  const token = sessionStorage.getItem("token");

  const response = await axios.get(
    `${config.serverUrl}/admin/interviews`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function sendReminder(bookingId) {
  const token = sessionStorage.getItem("token");

  return axios.post(
    `${config.serverUrl}/admin/bookings/${bookingId}/reminder`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function assignInterviewer(bookingId, data) {
  const token = sessionStorage.getItem("token");
  const response = await axios.put(
    `${config.serverUrl}/admin/interviews/${bookingId}/assign`, 
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log(response);
  return response.data;
}