import React, { useState } from 'react';
import { ethers } from 'ethers';
import { contractAddress, contractABI } from '../contractDetails';
import { Search, CheckCircle, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const PublicVerifier = () => {
    const [hash, setHash] = useState('');
    const [result, setResult] = useState(null);

    const verify = async () => {
        try {
            const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
            const contract = new ethers.Contract(contractAddress, contractABI, provider);
            const data = await contract.verifyCertificate(hash);
            setResult(data);
        } catch (error) {
            alert("Certificate not found or invalid hash");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Verify Degree Authenticity</h2>
                <div className="flex gap-2">
                    <input 
                        type="text" placeholder="Enter Certificate Hash (0x...)"
                        className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setHash(e.target.value)}
                    />
                    <button onClick={verify} className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Search size={18} /> Verify
                    </button>
                </div>
            </div>

            {result && result[4] && ( // result[4] is the 'exists' boolean
                <div className="bg-green-50 border border-green-200 p-8 rounded-2xl text-center space-y-4 animate-in fade-in zoom-in duration-300">
                    <CheckCircle className="text-green-500 mx-auto" size={64} />
                    <h3 className="text-2xl font-bold text-green-900">Verified Credential</h3>
                    <div className="text-left bg-white p-4 rounded-lg shadow-inner">
                        <p><strong>Student:</strong> {result[0]}</p>
                        <p><strong>Issuer:</strong> {result[2].substring(0,10)}...</p>
                        <p><strong>Date:</strong> {new Date(Number(result[3]) * 1000).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <QRCodeSVG value={`https://your-demo-url.com/verify?hash=${hash}`} size={128} />
                        <a 
                            href={`https://gateway.pinata.cloud/ipfs/${result[1]}`} 
                            target="_blank" rel="noreferrer"
                            className="text-blue-600 flex items-center gap-1 underline"
                        >
                            View Original PDF <ExternalLink size={14} />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicVerifier;