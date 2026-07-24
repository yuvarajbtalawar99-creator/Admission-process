let loggingOut = false;

export const forceLogout = (expired = false) => {
  if (loggingOut) return;
  loggingOut = true;

  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Use location.replace to prevent browser history back-button loops
  window.location.replace(expired ? '/login?expired=true' : '/login');
};
