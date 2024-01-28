import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function UserLogin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in (cookie exists)
    const userToken = Cookies.get('userToken');

    if (userToken) {
        navigate('/user');
        // Reload the page
        window.location.reload();
    }
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

  const handleButtonClick = () => {
    // Perform login logic, and if successful, store a cookie
    console.log('name:', name);
    console.log('email:', email);
    console.log('password:', password);
    console.log('phone:', phone);

    // Generate a random userToken using uuid
    const userToken = uuidv4();

    // Assuming a successful login, store a cookie
    Cookies.set('userToken', userToken, { expires: 7 }); // Expires in 7 days

    // Redirect to another page
    navigate('/user');

    // Reload the page
    window.location.reload();
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
        <div style={{ display: 'flex' }}>
          <p>Don't have an account ? </p> <a href="/user/register">Register</a>
        </div>
        <Button variant="secondary" onClick={handleButtonClick}>
          Login
        </Button>{' '}
      </Form>
    </div>
  );
}

export default UserLogin;
