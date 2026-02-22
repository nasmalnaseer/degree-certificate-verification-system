export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const contractABI = [
  // Function to issue a new certificate
  "function issueCertificate(bytes32 _certHash, string _studentName, string _ipfsHash) public",
  
  // Function to verify a certificate's authenticity
  "function verifyCertificate(bytes32 _certHash) public view returns (string studentName, string ipfsHash, address issuer, uint256 timestamp, bool exists)",
  
  // Helper to check the University's address (Owner)
  "function owner() public view returns (address)"
];