import React, { useState } from 'react';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import { uploadToIPFS } from '../ipfsUploader';
import { contractAddress, contractABI } from '../contractDetails';
import { ShieldCheck, Upload, Loader2 } from 'lucide-react';

const AdminDashboard = () => {
    const [file, setFile] = useState(null);
    const [studentName, setStudentName] = useState('');
    const [loading, setLoading] = useState(false);

    const issueDegree = async () => {
        if (!file || !studentName) return alert("Please fill all fields");
        setLoading(true);

        try {
            // 1. Generate SHA-256 Hash of the file
            const reader = new FileReader();
            reader.onload = async (e) => {
                const fileData = CryptoJS.lib.WordArray.create(e.target.result);
                const certHash = "0x" + CryptoJS.SHA256(fileData).toString();

                // 2. Upload to IPFS
                const ipfsHash = await uploadToIPFS(file);
                if (!ipfsHash) throw new Error("IPFS Upload Failed");

                // 3. Trigger MetaMask Transaction
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress, contractABI, signer);

                const tx = await contract.issueCertificate(certHash, studentName, ipfsHash);
                await tx.wait();

                alert(`Degree Issued Successfully!\nHash: ${certHash}`);
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error(error);
            alert("Error issuing degree");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="text-blue-600" size={32} />
                <h1 className="text-2xl font-bold">University Portal</h1>
            </div>
            
            <input 
                type="text" placeholder="Student Full Name"
                className="w-full p-2 border rounded"
                onChange={(e) => setStudentName(e.target.value)}
            />
            
            <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg">
                <input 
                    type="file" id="fileInput" className="hidden" 
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
                    <Upload className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">{file ? file.name : "Upload Degree PDF"}</span>
                </label>
            </div>

            <button 
                onClick={issueDegree}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold flex justify-center items-center gap-2 hover:bg-blue-700 transition"
            >
                {loading ? <Loader2 className="animate-spin" /> : "Anchor to Blockchain"}
            </button>
        </div>
    );
};

export default AdminDashboard;