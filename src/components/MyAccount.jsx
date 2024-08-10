import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import TicketForm from './TicketForm';
import './MyAccount.css';

function MyAccount() {
  const {userId, userFirstName, userLastName} = useContext(AuthContext);
  const [showTicketForm, setShowTicketForm] = useState(false);

 

  const toggleTicketForm = () => {
    setShowTicketForm(!showTicketForm);
  };

  const handleTicketCreated = () => {
    fetchUserTickets();
    setShowTicketForm(false);
  };




  return (
    <div className="my-account">
      <h2>My Account</h2>
      {userFirstName &&  (
        <div className="user-info">
          <h2>Welcome, {userLastName} {userFirstName}!</h2>          
        </div>
      )}

      <div className="tickets-section">
        <h3>My Tickets</h3>
        <button onClick={toggleTicketForm}>
          {showTicketForm ? 'Cancel' : 'Create New Ticket'}
        </button>
        
        {showTicketForm && <TicketForm onTicketCreated={handleTicketCreated} userId={userId}/>}

        
      </div>
    </div>
  );
}

export default MyAccount;
