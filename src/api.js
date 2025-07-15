const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('jwt');
}

function authHeaders() {
  const token = getToken();
  console.log('Token from localStorage:', token ? 'Present' : 'Missing');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Helper function to handle API responses
async function handleApiResponse(response) {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else {
    // If response is not JSON, get the text and log it
    const text = await response.text();
    console.error('Non-JSON response:', text);
    throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}`);
  }
}

// Auth
export async function register(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleApiResponse(res);
}

export async function login(data) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleApiResponse(res);
}

export async function verifyEmail(token) {
  const res = await fetch(`${API_URL}/auth/verify-email?token=${token}`);
  return handleApiResponse(res);
}

export async function resendVerification(data) {
  const res = await fetch(`${API_URL}/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleApiResponse(res);
}

export async function verifyByCode(data) {
  const res = await fetch(`${API_URL}/auth/verify-by-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleApiResponse(res);
}

// User
export async function getProfile() {
  const res = await fetch(`${API_URL}/user/profile`, { headers: authHeaders() });
  return handleApiResponse(res);
}

export async function updateProfile(data) {
  const res = await fetch(`${API_URL}/user/profile`, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleApiResponse(res);
}

export async function getOrderHistory() {
  const res = await fetch(`${API_URL}/user/orders`, { headers: authHeaders() });
  return handleApiResponse(res);
}

// Orders
export async function placeOrder(data) {
  const res = await fetch(`${API_URL}/order`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleApiResponse(res);
}

// Gallery
export async function getGallery() {
  const res = await fetch(`${API_URL}/gallery`);
  return handleApiResponse(res);
}

export async function addImage(data) {
  const res = await fetch(`${API_URL}/gallery`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleApiResponse(res);
}

export async function uploadFiles(files, mediaType) {
  console.log('uploadFiles called with:', { filesCount: files.length, mediaType });
  
  const formData = new FormData();
  formData.append('mediaType', mediaType);
  
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
    console.log('Added file:', files[i].name, files[i].type, files[i].size);
  }
  
  const headers = authHeaders();
  console.log('Request headers:', headers);
  
  try {
    const res = await fetch(`${API_URL}/gallery/upload`, {
      method: 'POST',
      headers: { ...headers }, // Don't set Content-Type for FormData
      body: formData
    });
    
    console.log('Upload response status:', res.status);
    console.log('Upload response headers:', Object.fromEntries(res.headers.entries()));
    
    return handleApiResponse(res);
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function deleteImage(id) {
  const res = await fetch(`${API_URL}/gallery/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  return handleApiResponse(res);
}

// Admin
export async function getAllUsers() {
  const res = await fetch(`${API_URL}/admin/users`, { headers: authHeaders() });
  return handleApiResponse(res);
}

export async function getAllOrders() {
  const res = await fetch(`${API_URL}/admin/orders`, { headers: authHeaders() });
  return handleApiResponse(res);
}

export async function getAllGallery() {
  const res = await fetch(`${API_URL}/admin/gallery`, { headers: authHeaders() });
  return handleApiResponse(res);
}

export async function approveOrder(id) {
  console.log('Attempting to approve order:', id);
  const res = await fetch(`${API_URL}/admin/orders/${id}/approve`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' }
  });
  
  console.log('Approve response status:', res.status);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Approve error response:', errorData);
    throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
  }
  
  const result = await res.json();
  console.log('Approve success:', result);
  return result;
}

export async function rejectOrder(id) {
  console.log('Attempting to reject order:', id);
  const res = await fetch(`${API_URL}/admin/orders/${id}/reject`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' }
  });
  
  console.log('Reject response status:', res.status);
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Reject error response:', errorData);
    throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
  }
  
  const result = await res.json();
  console.log('Reject success:', result);
  return result;
}