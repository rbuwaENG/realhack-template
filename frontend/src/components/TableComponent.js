import React from 'react';
import Table from 'react-bootstrap/Table';

function TableComponent() {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
          <td>@mdo</td>
          <td>
            <button className="btn btn-primary mr-2">Edit</button>
            <button className="btn btn-danger">Delete</button>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
          <td>
            <button className="btn btn-primary mr-2">Edit</button>
            <button className="btn btn-danger">Delete</button>
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td>Larry the Bird</td>
          <td>@twitter</td>
          <td>
            <button className="btn btn-primary mr-2">Edit</button>
            <button className="btn btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

export default TableComponent;
