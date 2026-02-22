const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CredentialRegistry", function () {
  it("Should issue and verify a certificate", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    const registry = await ethers.deployContract("CredentialRegistry");

    const certHash = ethers.id("student-123-hash"); // Simulating a SHA-256 hash
    const studentName = "John Doe";
    const ipfsHash = "QmTest123456789";

    // 1. Issue the certificate
    await registry.issueCertificate(certHash, studentName, ipfsHash);

    // 2. Verify the certificate
    const cert = await registry.verifyCertificate(certHash);

    expect(cert.studentName).to.equal(studentName);
    expect(cert.exists).to.equal(true);
    expect(cert.issuer).to.equal(owner.address);
  });

  it("Should fail if a non-owner tries to issue", async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    const registry = await ethers.deployContract("CredentialRegistry");
    const certHash = ethers.id("fail-hash");

    // Attempting to issue from a non-university account should fail
    await expect(
      registry.connect(otherAccount).issueCertificate(certHash, "Hack", "Hash")
    ).to.be.reverted; // This is an OpenZeppelin error
  });
});