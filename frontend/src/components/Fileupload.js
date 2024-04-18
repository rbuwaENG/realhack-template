import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { backend_link } from '../backend_link';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import { storage } from '../firebase_config';

function FileUpload() {

    const [upload, setUpload] = useState();

    const phone = localStorage.getItem("phone");

    const uploadFile = () => {
        if (!upload) return;

        const imageRef = ref(storage, `${phone}/${upload.name}`);

        uploadBytes(imageRef, upload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                console.log(url);
            });
        });
    };

    return (
        <>
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>upload pdf file</Form.Label>
                <Form.Control type="file"
                    onChange={(event) => {
                        setUpload(event.target.files[0]);
                    }}
                />
            </Form.Group>
            <Button variant="secondary" onClick={uploadFile}>
                Upload
            </Button>{' '}
        </>
    );
}

export default FileUpload;