// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CredentialRegistry is Ownable {
    struct Certificate {
        string studentName;
        string ipfsHash;    // Link to the PDF on IPFS
        address issuer;      // University's Wallet Address
        uint256 timestamp;   // Date of issuance
        bool exists;         // Helper to check if record is valid
    }

    // Mapping: Certificate Hash (SHA-256) -> Certificate Data
    mapping(bytes32 => Certificate) private certificates;

    event CertificateIssued(bytes32 indexed certHash, string studentName);

    // msg.sender becomes the 'Owner' (the University)
    constructor() Ownable(msg.sender) {}

    function issueCertificate(
        bytes32 _certHash,
        string memory _studentName,
        string memory _ipfsHash
    ) public onlyOwner {
        require(!certificates[_certHash].exists, "Certificate already issued!");

        certificates[_certHash] = Certificate({
            studentName: _studentName,
            ipfsHash: _ipfsHash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit CertificateIssued(_certHash, _studentName);
    }

    function verifyCertificate(bytes32 _certHash) public view returns (
        string memory studentName,
        string memory ipfsHash,
        address issuer,
        uint256 timestamp,
        bool exists
    ) {
        Certificate memory cert = certificates[_certHash];
        require(cert.exists, "Certificate not found");
        return (cert.studentName, cert.ipfsHash, cert.issuer, cert.timestamp, cert.exists);
    }
}