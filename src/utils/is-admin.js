import jwtDecode from 'jwt-decode';
import getLoggedUser from './get-logged-user';

const isAdmin = () => {
  const { token } = getLoggedUser();
  const { role } = jwtDecode(token);

  return role === 'ADMIN';
};

export default isAdmin;
