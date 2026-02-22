import axios from 'axios';

const key = process.env.REACT_APP_PINATA_API_KEY;
const secret = process.env.REACT_APP_PINATA_API_SECRET;

export const uploadToIPFS = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    // Prepare the file for the request
    let data = new FormData();
    data.append('file', file);

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'pinata_api_key': key,
                'pinata_secret_api_key': secret,
            },
        });
        
        // This returns the CID (unique link) for the PDF
        return response.data.IpfsHash; 
    } catch (error) {
        console.error("Error uploading to IPFS: ", error);
        return null;
    }
};