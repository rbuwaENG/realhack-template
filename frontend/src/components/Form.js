import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

function FormComponent() {

    // State variables to store input values
    const [address, setAddress] = useState('');
    const [details, setDetails] = useState('');

    // Event handlers to update state on input change
    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handleDetailsChange = (e) => {
        setDetails(e.target.value);
    };

    const handleButtonClick = () => {
        console.log("address", address)
        console.log("details", details)
    }

    return (
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="name@example.com"
          value={address}
          onChange={handleAddressChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Example textarea</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={details}
          onChange={handleDetailsChange}
        />
        <Button variant="secondary" onClick={handleButtonClick}>
            Secondary
        </Button>{' '}
      </Form.Group>
    </Form>
    );
}

export default FormComponent;