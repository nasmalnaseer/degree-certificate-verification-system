import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CredentialModule = buildModule("CredentialModule", (m) => {
  const credentialRegistry = m.contract("CredentialRegistry");

  return { credentialRegistry };
});

export default CredentialModule;