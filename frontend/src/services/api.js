import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Complaint API
export const complaintAPI = {
  logComplaint: async (prompt) => {
    const response = await api.post('/api/complaint/log', { prompt });
    return response.data;
  },

  editComplaint: async (complaintId, prompt) => {
    const response = await api.post('/api/complaint/edit', {
      complaint_id: complaintId,
      prompt,
    });
    return response.data;
  },

  extractFromDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/complaint/extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getComplaint: async (complaintId) => {
    const response = await api.get(`/api/complaint/${complaintId}`);
    return response.data;
  },

  listComplaints: async (skip = 0, limit = 100) => {
    const response = await api.get('/api/complaint/', {
      params: { skip, limit },
    });
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  sendMessage: async (message, complaintId = null) => {
    const response = await api.post('/api/chat/', {
      message,
      complaint_id: complaintId,
    });
    return response.data;
  },
};

export default api;