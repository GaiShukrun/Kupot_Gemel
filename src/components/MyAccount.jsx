import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import TicketForm from './TicketForm';
import './MyAccount.css';

function MyAccount() {
  const {userId, userFirstName, userLastName} = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [showTicketForm, setShowTicketForm] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserTickets();
    }
  }, [userId]);

  const fetchUserTickets = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/get-user-tickets/${userId}`, {
        headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
      });
      if (!response.ok) {
        throw new Error('Error fetching user tickets');
      }
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching user tickets:', error);
    }
  };

  const toggleTicketForm = () => {
    setShowTicketForm(!showTicketForm);
  };

  const handleTicketCreated = () => {
    fetchUserTickets();
    setShowTicketForm(false);
  };

  const getBorderColor = (status) => {
    switch(status) {
      case 'Open':
        return '#007bff';  
      case 'In progress':
        return '#ffc107';  
      case 'Closed':
        return 'black';
      default:
        return '#007bff';  
    }
  };


  const sortedTickets = tickets.sort((a, b) => {
    const statusOrder = ['Open', 'In progress', 'Closed'];
    if (statusOrder.indexOf(a.status) !== statusOrder.indexOf(b.status)) {
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

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

        {tickets.length > 0 ? (
          <ul className="ticket-list">
            {sortedTickets.map(ticket => (
              <li 
                key={ticket._id} 
                className="ticket-item" 
                style={{ borderLeftColor: getBorderColor(ticket.status) }}
              >
                <h4>{ticket.title}</h4>
                <p>Status: {ticket.status}</p>
                {!ticket.response ? (
                  <p>Still no response</p>
                ) : (
                  <p>Response: {ticket.response}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tickets found.</p>
        )}
      </div>
    </div>
  );
}

export default MyAccount;
