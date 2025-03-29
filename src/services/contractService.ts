import { ethers } from "ethers";
import { propertyRegistryConfig } from "../config/contractConfig";

// Function to get a provider (this example uses MetaMask via BrowserProvider)
const getProvider = () => {
  if (!(window as any).ethereum) {
    throw new Error("MetaMask is not installed");
  }
  return new ethers.BrowserProvider((window as any).ethereum);
};

export const getPropertyRegistryContract = async () => {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(propertyRegistryConfig.address, propertyRegistryConfig.abi, signer);
};
