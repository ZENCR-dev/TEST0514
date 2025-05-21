import { User } from '@/types/auth';

export const mockUsers: User[] = [
  {
    id: 'doctor-001',
    email: 'doctor@example.com',
    password: 'Doctor123', // Note: In a real app, passwords would never be stored like this
    name: 'Dr. Smith',
    role: 'doctor',
    createdAt: new Date(2023, 0, 15).toISOString()
  },
  {
    id: 'pharmacy-001',
    email: 'pharma@example.com',
    password: 'Pharma123',
    name: 'Wellington TCM Pharmacy',
    role: 'pharmacy',
    createdAt: new Date(2023, 1, 20).toISOString(),
    location: {
      address: '123 Lambton Quay, Wellington',
      lat: -41.2887953,
      lng: 174.7772114
    }
  },
  {
    id: 'admin-001',
    email: 'admin@example.com',
    password: 'Admin123',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date(2022, 11, 1).toISOString()
  }
]; 