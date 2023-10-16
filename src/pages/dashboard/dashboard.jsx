import React from 'react';
import { getLoggedUser } from '../../utils';

const Dashboard = () => {
  const { user } = getLoggedUser();

  const dashboardStyle = {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    margin: '0 auto',
  };

  const welcomeStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  };

  const userStyle = {
    fontSize: '18px',
  };

  return (
    <div style={dashboardStyle}>
      <div style={welcomeStyle}>¡Bienvenido, {user.name}!</div>
      <div style={userStyle}>Has iniciado sesión en tu panel de control.</div>
    </div>
  );
};

export default Dashboard;
