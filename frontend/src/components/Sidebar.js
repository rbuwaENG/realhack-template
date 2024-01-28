import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/esm/Button';

function Sidebar() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
        <Container fluid>
        <Row style={{ height: '100%' }}>
            {/* Sidebar */}
            <Col md={3} className="bg-light sidebar">
            <Card style={{ height: '100%' }}>
                <Card.Body>
                <Card.Title>Menu</Card.Title>
                {/* Section 1 */}
                <Card.Text>Section 1 Content</Card.Text>
                <Button variant="secondary">
                    Login
                </Button>{' '}
                {/* Section 2 */}
                <Card.Text>Section 2 Content</Card.Text>
                {/* Add more sections as needed */}
                </Card.Body>
            </Card>
            </Col>

            {/* Main Content */}
            <Col md={9} className="main-content">
            {/* Your main content goes here */}
            <h1>Main Content</h1>
            </Col>
        </Row>
        </Container>
    </div>
  );
}

export default Sidebar;
