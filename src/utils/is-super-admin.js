// import jwtDecode from 'jwt-decode';
// import getLoggedUser from './get-logged-user';

// const isSuperAdmin = () => {
//   const { token } = getLoggedUser();
//   const { role } = jwtDecode(token);

//   return role === 'SUPER_ADMIN';
// };
const isSuperAdmin = () => false;
export default isSuperAdmin;
