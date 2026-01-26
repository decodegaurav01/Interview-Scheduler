import axios from "axios";
import { config } from "../config";


export async function getCandidateDashboard() {
  const token = sessionStorage.getItem("token");

  const response = await axios.get(
    `${config.serverUrl}/candidate/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}




export async function bookSlot(slotId) {
  try {
    const token = sessionStorage.getItem("token");

    const response = await axios.post(
      `${config.serverUrl}/candidate/slot-booking`,
      { slotId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Error Slot Booking :", error);
    throw error;
  }
}

export async function getInterviewDetails() {
  const token = sessionStorage.getItem("token");

  const response = await axios.get(
    `${config.serverUrl}/candidate/interview`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(response.data)

  return response.data;
}
