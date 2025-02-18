import axios from 'axios';
import { Person } from './types';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const peopleApi = {
  getAll: async () => {
    const response = await api.get('/people');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/people/${id}`);
    return response.data;
  },

  create: async (data: Omit<Person, 'id'>) => {
    const response = await api.post('/people', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Person>) => {
    const response = await api.put(`/people/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/people/${id}`);
  },
};