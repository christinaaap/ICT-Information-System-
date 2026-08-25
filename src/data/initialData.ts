import { User, Asset, Ticket, Attendance, LeaveRequest, IctDocument } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    name: 'Administrator',
    email: 'admin.ict@dslng.com',
    password: 'password123',
    department: 'Corporate Affairs Director',
    work_location: 'Site Luwuk',
    role: 'admin',
    extension: 'x4401',
    created_at: '2025-01-10T08:00:00Z',
    must_change_password: false,
  },
  {
    id: 2,
    name: 'Rian Pratama',
    email: 'rian.pratama@dslng.com',
    password: 'password123',
    department: 'Corporate Affairs Director',
    work_location: 'Site Luwuk',
    role: 'it_helpdesk',
    extension: 'x4420',
    created_at: '2025-01-15T08:30:00Z',
    must_change_password: false,
  },
  {
    id: 3,
    name: 'Hendra Gunawan',
    email: 'hendra.gunawan@dslng.com',
    password: 'password123',
    department: 'Operations Directorate',
    work_location: 'Site Luwuk',
    role: 'leader',
    extension: 'x4410',
    created_at: '2025-01-12T09:00:00Z',
    must_change_password: false,
  },
  {
    id: 4,
    name: 'Siti Rahmawati',
    email: 'siti.rahmawati@dslng.com',
    password: 'password123',
    department: 'Corporate Affairs Director',
    work_location: 'HO Jakarta',
    role: 'csbo',
    extension: 'x1025',
    created_at: '2025-01-08T07:45:00Z',
    must_change_password: false,
  },
  {
    id: 5,
    name: 'Ir. Agus Wijaya, MM',
    email: 'agus.wijaya@dslng.com',
    password: 'password123',
    department: 'President Directorate',
    work_location: 'HO Jakarta',
    role: 'spmo',
    extension: 'x1002',
    created_at: '2025-01-05T08:00:00Z',
    must_change_password: false,
  },
  {
    id: 6,
    name: 'Dewi Lestari',
    email: 'dewi.lestari@dslng.com',
    password: 'password123',
    department: 'Finance Directorate',
    work_location: 'HO Jakarta',
    role: 'user',
    extension: 'x1044',
    created_at: '2025-02-01T10:00:00Z',
    must_change_password: false,
  },
  {
    id: 7,
    name: 'Farhan Ramadhan',
    email: 'farhan.ramadhan@dslng.com',
    password: 'password123',
    department: 'Operations Directorate',
    work_location: 'Site Luwuk',
    role: 'user',
    extension: 'x4512',
    created_at: '2025-02-10T11:20:00Z',
    must_change_password: false,
  },
  {
    id: 8,
    name: 'Maya Puspita',
    email: 'maya.puspita@dslng.com',
    password: 'password123',
    department: 'President Directorate',
    work_location: 'HO Jakarta',
    role: 'user',
    extension: 'x1008',
    created_at: '2025-02-14T09:15:00Z',
    must_change_password: false,
  },
];

export const INITIAL_ASSETS: Asset[] = [];

export const INITIAL_TICKETS: Ticket[] = [];

export const INITIAL_ATTENDANCES: Attendance[] = [];

export const INITIAL_LEAVES: LeaveRequest[] = [];

export const INITIAL_DOCUMENTS: IctDocument[] = [];
