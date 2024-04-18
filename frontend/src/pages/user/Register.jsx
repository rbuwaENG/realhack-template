import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import { backend_link } from '../../backend_link';

function UserRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

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

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const getToken = async() => {

    const response = await axios.post(`${backend_link}/token`, {
        phone: phone,
        password: password,
        level: "user"
    });

    const token = response.data.access_token;
    const tokenExpiration = Date.now() + response.data.expires_in * 1000; // Convert expiration time to milliseconds
    
    // Store token and expiration time in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpiration', tokenExpiration);
    localStorage.setItem('phone', phone);
    // Set token in axios headers
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Login successful!');
    
    // Redirect to another page
    navigate("/user");

    // Reload the page
    window.location.reload();
  }

  const handleButtonClick = async() => {
    console.log('name:', name);
    console.log('email:', email);
    console.log('password:', password);
    console.log('phone:', phone);
    console.log('address:', address);

    try {
      const Regresponse = await axios.post(`${backend_link}/register`, {
        name: name,
        email: email,
        password: password,
        phone: phone,
        address: address,
        level: "user"
      });

      console.log(Regresponse)
      getToken();

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
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="address"
            placeholder="Address"
            value={address}
            onChange={handleAddressChange}
          />
        </Form.Group>
        <Button variant="secondary" onClick={handleButtonClick}>
          Register
        </Button>{' '}
      </Form>
    </div>
  );
}

export default UserRegister;
