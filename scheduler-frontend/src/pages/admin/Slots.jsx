'use client';

import React from "react"

import { useEffect, useState } from 'react';
import { Plus, Trash2, Calendar, Clock } from 'lucide-react';
import { Navbar } from "../../components/Navbar";
import '../../styles/admin/Slot.css'
import { createSlot, deleteSlot, getAllSlots, updateSlotStatus } from "../../services/adminService";
import StatusAlert from "../../components/StatusAlert";



export default function Slots() {
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    slotDate: '',
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await getAllSlots();
      console.log(response)

      if (response) {
        setSlots(response);
      } else {
        setSlots([]);
      }

    } catch (error) {
      console.error('Failed to fetch slots:', error);
      setError('Failed to load slots');
      setSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSlot = async () => {
    setError('');
    setSuccess('');

    if (!formData.slotDate || !formData.startTime || !formData.endTime) {
      setError('Please fill in all fields');
      return;
    }


    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time');
      return;
    }
    const selectedDate = new Date(formData.slotDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError('Cannot create slots for past dates');
      return;
    }

    setIsSaving(true);

    try {
      const response = await createSlot(formData)
      console.log(response)

      if (response === 'Slot already exists')
        setError('Slot already exists')
      else {
        setFormData({ slotDate: '', startTime: '', endTime: '' });

        setSuccess(
          `Slot created for ${formData.slotDate} from ${formData.startTime} to ${formData.endTime}`
        );

        fetchSlots();
      }

    } catch (err) {
      setError(err ? err.message : 'Failed to create slot');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) {
      return;
    }

    try {

      await deleteSlot(id);


      setSlots((prevSlots) => prevSlots.filter((s) => s.id !== id));
      setSuccess('Slot deleted successfully');


      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete slot';
      setError(errorMessage);
      setSuccess('');
    }
  };

  const handleToggleStatus = async (slot) => {
    try {
      await updateSlotStatus(slot.id, !slot.isActive);
      fetchSlots()

      setSlots((prev) =>
        prev.map((s) =>
          s.id === slot.id
            ? { ...s, is_active: !s.isActive }
            : s
        )
      );


    } catch (err) {
      console.log(err)
      setError("Failed to update slot status");
    }
  };


  return (
    <>
      <Navbar role="admin" />

      <div className="slot-page">
        <div className="slot-container">
          <header className="slot-header">
            <h1 className="slot-title">Interview Slots Management</h1>
            <p className="slot-subtitle">Create and manage available interview time slots</p>
          </header>

          <div className="create-slot-card">
            <h2 className="card-heading">Create New Slot</h2>

            <StatusAlert
              error={error}
              success={success}
              reset={() => { setError(''); setSuccess(''); }}
            />

            <div className="slot-form-container">
              <div className="slot-form-grid">

                <div className="input-group">
                  <label className="input-label">Date</label>
                  <input
                    type="date"
                    value={formData.slotDate}
                    onChange={(e) => setFormData({ ...formData, slotDate: e.target.value })}
                    className="slot-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="slot-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="slot-input"
                    required
                  />
                </div>
              </div>


              <button
                type="button"
                disabled={isSaving}
                className="btn-create-slot"
                onClick={handleCreateSlot}
              >
                <Plus className="w-4 h-4" />
                {isSaving ? 'Creating...' : 'Create Slot'}
              </button>
            </div>
          </div>

          <div className="slots-list-card">
            <div className="list-header px-6 py-4 border-b border-slate-100">
              <h2 className="card-heading mb-0">
                Available Slots ({slots?.length ?? 0})
              </h2>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <div className="loading-spinner h-8 w-8 border-2 border-slate-200 border-b-slate-900 rounded-full animate-spin inline-block"></div>
                <p className="mt-4 text-slate-500">Loading slots...</p>
              </div>
            ) : (slots?.length === 0) ? (
              <div className="p-12 text-center text-slate-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No slots created yet. Create one above to get started.</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="slots-table">
                  <thead className="slots-thead">
                    <tr>
                      <th className="slots-th">Date</th>
                      <th className="slots-th">Time</th>
                      <th className="slots-th">Booking</th>
                      <th className="slots-th">Active</th>
                      <th className="slots-th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots?.map((slot) => (
                      <tr key={slot.id} className={`slots-tr ${slot.isBooked ? 'slots-tr-booked' : ''}`}>
                        <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {slot.date || 'No Date'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {slot.startTime} - {slot.endTime}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`status-badge ${slot.isBooked ? 'badge-booked' : 'badge-available'}`}>
                            {slot.isBooked ? 'Booked' : 'Available'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-500">
                              {slot.isActive ? "Active" : "Frozen"}
                            </span>

                            <button
                              onClick={() => handleToggleStatus(slot)}
                              disabled={slot.isBooked}
                              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-all duration-300
      ${slot.isBooked ? "opacity-30 cursor-not-allowed grayscale" : "cursor-pointer"}
      ${slot.isActive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-slate-300"}`}
                            >
                              <span className="sr-only">Toggle Slot</span>


                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm
        ${slot.isActive ? "translate-x-6" : "translate-x-1"}`}
                              />
                            </button>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleDeleteSlot(slot.id)}

                            className={`btn-delete-slot`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
