import { User } from '@/types/auth';

export const mockUsers: User[] = [
  {
    id: 'doctor-001',
    email: 'doctor@example.com',
    name: 'Dr. Smith',
    role: 'doctor',
  },
  {
    id: 'pharmacy-001',
    email: 'pharma@example.com',
    name: 'Wellington TCM Pharmacy',
    role: 'pharmacy',
  },
  {
    id: 'admin-001',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  }
]; 