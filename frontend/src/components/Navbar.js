import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

export default function NavbarComponent() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState('');

  // Get the current location object
  const location = useLocation();

  // Access the pathname to get the current page
  const currentPage = location.pathname;

  useEffect(() => {
    if(currentPage !== "/"){
      // Check if the user is already logged in (cookie exists)
      const storedUserToken = Cookies.get('userToken');

      if (storedUserToken) {
        setUserToken(storedUserToken);
        setLoggedIn(true);
      } else {
        setUserToken('');
        setLoggedIn(false);
      }
    }
    
  }, [userToken]);
  
  
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid style={{marginLeft: '60px', marginRight: '60px'}}>
        <Navbar.Brand href="/">Navbar</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px'}}
            navbarScroll
          >
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/">Link</Nav.Link>
            <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="">Action</NavDropdown.Item>
              <NavDropdown.Item href="">Another action</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <></>
            ) : (
              <>
              <Nav.Link href="/user/login">
                <Button variant="outline-success">User Login</Button>
              </Nav.Link>
              <Nav.Link href="/admin/login">
                <Button variant="outline-success">Staff Login</Button>
              </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
