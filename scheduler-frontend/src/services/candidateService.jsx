import axios from "axios";
import { config } from "../config";

export async function getAvailableSlots() {
  try {
    const token = localStorage.getItem("candidateToken");

    const response = await axios.get(
      `${config.serverUrl}/candidate/available-slots`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;

  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
}



export async function bookSlot(slotId) {
  try {
    const token = localStorage.getItem("candidateToken");

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

