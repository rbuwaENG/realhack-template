import React, { useState } from 'react';
import axios from 'axios';
import { backend_link } from '../backend_link';

function FileDownload() {

    const handleDownload = async () => {
        
    }

    return (
        <div>
            <button onClick={handleDownload}>Download File</button>
        </div>
    );
}

export default FileDownload;
