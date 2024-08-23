import React, { useState } from 'react';
import Swal from 'sweetalert2'
import './TickerForm.css';

const TicketForm = ({userId,onTicketCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/create-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId,title, description })
      });

      if (!res.ok) {
        throw new Error('Failed to submit ticket');
      }
      const data = await res.json();
      console.log(data);
      await Swal.fire({
        title: "Ticket created!",
        text: "You ticket has been created successfully",
        icon: "success"
      });
      onTicketCreated();
      // Redirect to ticket list or show success message
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form className="ticket-form" onSubmit={handleSubmit}>
      <input 
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <button className="submit-ticket" type="submit">Submit Ticket</button>
    </form>
  );
};

export default TicketForm;
