const API_BASE = '/api';

export const apiRequest = async (endpoint, options = {}) => {
  const { method = 'GET', body, headers = {} } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const textData = await response.text();
    data = { message: textData || `HTTP error ${response.status}` };
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const authApiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('hospital_token');
  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};



// future work -> refresh token system - interceptor 