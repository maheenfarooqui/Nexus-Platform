// src/pages/calendar/CalendarPage.tsx
import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { dummySlots, dummyMeetings } from '../../data/calendarData';
import { AvailabilitySlot, MeetingRequest } from '../../types';

export const CalendarPage: React.FC = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(dummySlots);
  const [meetings, setMeetings] = useState<MeetingRequest[]>(dummyMeetings);

  // 1. Add Availability Slot Function
  const handleDateSelect = (selectInfo: any) => {
    const title = window.confirm('Are you sure you want to add this slot?');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      const newSlot: AvailabilitySlot = {
        id: String(Date.now()),
        userId: 'user-1',
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      };
      setSlots([...slots, newSlot]);
    }
  };

  // 2. Handle Meeting Accept/Decline
  const handleStatusChange = (id: string, newStatus: 'accepted' | 'declined') => {
    setMeetings(prev =>
      prev.map(meeting => (meeting.id === id ? { ...meeting, status: newStatus } : meeting))
    );
  };

  // FullCalendar ke liye events array prepare karna
  const calendarEvents = [
    ...slots.map(s => ({ id: s.id, title: '🟢 Available Slot', start: s.start, end: s.end, backgroundColor: '#22c55e' })),
    ...meetings
      .filter(m => m.status === 'accepted')
      .map(m => ({ id: m.id, title: `🤝 ${m.title}`, start: m.start, end: m.end, backgroundColor: '#3b82f6' }))
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md space-y-6 mt-6">
      <h1 className="text-3xl font-bold text-gray-800">Meeting Scheduling Calendar</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Pending Requests List */}
        <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Pending Requests</h2>
          {meetings.filter(m => m.status === 'pending').length === 0 ? (
            <p className="text-gray-500 text-sm">No pending requests</p>
          ) : (
            meetings
              .filter(m => m.status === 'pending')
              .map(m => (
                <div key={m.id} className="bg-white p-3 rounded-md shadow-sm mb-3 border-l-4 border-yellow-500">
                  <p className="font-medium text-sm text-gray-800">{m.title}</p>
                  <p className="text-xs text-gray-500">From: {m.senderName}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(m.start).toLocaleDateString()} at {new Date(m.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="mt-2 flex space-x-2">
                    <button 
                      onClick={() => handleStatusChange(m.id, 'accepted')}
                      className="bg-green-500 text-white text-xs px-2 py-1 rounded hover:bg-green-600 transition"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleStatusChange(m.id, 'declined')}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Right Side: FullCalendar Component */}
        <div className="lg:col-span-3">
          <p className="text-sm text-gray-500 mb-2">💡 Tip: "Select or drag any date/time slot on the calendar to set your availability.</p>
          <div className="calendar-container p-2 bg-white border rounded-lg shadow-inner">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek" // Default hafte ka view dikhega slots ke liye
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={calendarEvents} // Hamein hamari slots aur confirmed meetings dikhayega
              select={handleDateSelect} // Click/Drag karke slot banane ke liye
            />
          </div>
        </div>
      </div>
    </div>
  );
};