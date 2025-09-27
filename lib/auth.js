import Cookies from 'js-cookie';

export const setAuthToken = (token) => {
  Cookies.set('token', token, { expires: 7 }); // 7 days
};

export const getAuthToken = () => {
  return Cookies.get('token');
};

export const removeAuthToken = () => {
  Cookies.remove('token');
  Cookies.remove('user');
};

export const setUser = (user) => {
  Cookies.set('user', JSON.stringify(user), { expires: 7 });
};

export const getUser = () => {
  const user = Cookies.get('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const logout = () => {
  removeAuthToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};
