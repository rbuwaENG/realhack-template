import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Message = ({ text, sender }) => (
  <div className={`message ${sender === 'user' ? 'user-message' : 'other-message'}`}>
    <strong>{sender === 'user' ? 'You' : 'Other User'}</strong>: {text}
  </div>
);

const MessagingChannel = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
      // Simulate receiving a response from the other user after a delay
      setTimeout(() => {
        setMessages([...messages, { text: 'Received your message!', sender: 'other' }]);
      }, 1000);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={8} className="mx-auto">
          <div className="message-container">
            {messages.map((message, index) => (
              <Message key={index} text={message.text} sender={message.sender} />
            ))}
          </div>
          <Form className="message-input">
            <Form.Group controlId="formMessage">
              <Form.Control
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSendMessage}>
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default MessagingChannel;
