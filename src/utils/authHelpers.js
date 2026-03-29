//Managing the JWT Token
//Managing user data in localStorage
//Verifying user login
//Extracting data from the token
//Determining user permissions (Admin)
const TOKEN_KEY = 'hospital_token';
const USER_KEY = 'hospital_user';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      removeToken();
      return false;
    }
    return true;
  } catch {
    removeToken();
    return false;
  }
};

export const isAdmin = () => {
  const decoded = getUserFromToken();
  return decoded?.isAdmin === true;
};

export const getAuthHeaders = () => {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
};
