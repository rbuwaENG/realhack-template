import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'

function AdminLogin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const tokenVerify = async() => {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    if (token && tokenExpiration) {
      const expirationTime = parseInt(tokenExpiration);
      if (Date.now() < expirationTime) {
        // Token is still valid, set it in axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Send a request to verify the token with the backend
          const response = await axios.get('http://localhost:8000/login');

          if(response.status == 200){
            console.log('Token verified:', response.data);
            navigate('/admin');
            // Reload the page
            window.location.reload();
          }
        } catch (error) {
          console.error('Error verifying token:', error);
        }
      }
    }
  }

  useEffect(() => {
    tokenVerify();
  }, [navigate]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleButtonClick = async() => {
    // Perform login logic, and if successful, store a cookie
    console.log('name:', name);
    console.log('email:', email);
    console.log('password:', password);
    console.log('phone:', phone);

    try {
      const response = await axios.post('http://localhost:8000/token', {
        phone: phone,
        password: password
      });

      if(response.status == 200){
        const token = response.data.access_token;
        const tokenExpiration = Date.now() + response.data.expires_in * 1000; // Convert expiration time to milliseconds
        // Store token and expiration time in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiration', tokenExpiration);
        // Set token in axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('Login successful!');
        
        // Redirect to another page
        navigate('/admin');

        // Reload the page
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Form style={{ width: '400px', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="email@gmail.com"
            value={email}
            onChange={handleEmailChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="name"
            placeholder="Phone"
            value={phone}
            onChange={handlePhoneChange}
          />
        </Form.Group>
        <Button variant="secondary" onClick={handleButtonClick}>
          Login
        </Button>{' '}
      </Form>
    </div>
  );
}

export default AdminLogin;
