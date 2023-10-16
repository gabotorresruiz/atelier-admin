const getLoggedUser = () => {
  const loggedUser = localStorage.getItem('loggedUser');
  if (loggedUser) return JSON.parse(loggedUser);
  return null;
};

export default getLoggedUser;
