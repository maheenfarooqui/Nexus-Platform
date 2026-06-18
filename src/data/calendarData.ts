// src/data/calendarData.ts
import { AvailabilitySlot, MeetingRequest } from '../types';

export const dummySlots: AvailabilitySlot[] = [
  { id: 's1', userId: 'user-1', start: '2026-06-15T09:00:00', end: '2026-06-15T10:00:00' },
  { id: 's2', userId: 'user-1', start: '2026-06-15T11:00:00', end: '2026-06-15T12:00:00' },
  { id: 's3', userId: 'user-1', start: '2026-06-16T14:00:00', end: '2026-06-16T15:00:00' },
];

export const dummyMeetings: MeetingRequest[] = [
  {
    id: 'm1',
    title: 'Seed Funding Discussion',
    senderId: 'user-2',
    senderName: 'Zeeshan (Investor)',
    receiverId: 'user-1',
    start: '2026-06-15T09:00:00',
    end: '2026-06-15T10:00:00',
    status: 'pending'
  },
  {
    id: 'm2',
    title: 'Product Tech Review',
    senderId: 'user-3',
    senderName: 'Ayesha (Entrepreneur)',
    receiverId: 'user-1',
    start: '2026-06-17T16:00:00',
    end: '2026-06-17T17:00:00',
    status: 'accepted'
  }
];