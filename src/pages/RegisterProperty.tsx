import React, { useState } from "react";
import { Box, Button, TextField, Typography, Stack, Paper } from "@mui/material";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { getPropertyRegistryContract } from "../services/contractService";
import { uploadPropertyMetadataToHFS } from "../services/hfsService";

export default function RegisterProperty() {
  // Form state for property details
  const [propertyName, setPropertyName] = useState("");
  const [valuation, setValuation] = useState(0);
  const [locationName, setLocationName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [geoCoordinates, setGeoCoordinates] = useState("");
  const [bedrooms, setBedrooms] = useState(0);
  const [hasSwimmingPool, setHasSwimmingPool] = useState(false);
  // Sensitive details (consider hashing before storage in production)
  const [kraPin, setKraPin] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [titleDeedHash, setTitleDeedHash] = useState("");
  // For property image upload
  const [propertyImageBase64, setPropertyImageBase64] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const { accountId } = useWalletInterface();

  // Handler to convert a selected file to a Base64 string
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPropertyImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    if (!accountId) {
      setStatusMessage("Wallet not connected");
      return;
    }
    if (!propertyImageBase64) {
      setStatusMessage("Please upload a property image");
      return;
    }

    setStatusMessage("Uploading metadata to Hedera File Service...");
    // Build metadata object for HFS upload.
    const metadataObj = {
      propertyName,
      valuation,
      locationName,
      propertyType,
      geoCoordinates,
      bedrooms,
      hasSwimmingPool,
      // Sensitive details – in production, store hashes rather than raw values.
      sensitive: {
        kraPin,
        idNumber,
        titleDeedHash,
      }
    };

    let propertyURI;
    try {
      // Upload metadata along with the property image
      propertyURI = await uploadPropertyMetadataToHFS(propertyImageBase64, metadataObj);
    } catch (error: any) {
      setStatusMessage("Error uploading metadata: " + error.message);
      return;
    }

    setStatusMessage("Registering property on-chain...");
    try {
      const contract = await getPropertyRegistryContract();
      // Call registerProperty on your smart contract.
      const tx = await contract.registerProperty(
        accountId, // registering to the connected wallet's address
        propertyName,
        propertyURI, // Use the file ID from HFS as the propertyURI
        valuation,
        locationName,
        propertyType,
        geoCoordinates,
        bedrooms,
        hasSwimmingPool,
        kraPin,
        idNumber,
        titleDeedHash
      );
      setStatusMessage("Property registered successfully. Tx: " + tx);
    } catch (err: any) {
      setStatusMessage("Error registering property: " + err.message);
    }
  };

  return (
    <Paper sx={{ p: 4, mt: 10, mx: "auto", maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>
        Register Property
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Property Name"
          value={propertyName}
          onChange={(e) => setPropertyName(e.target.value)}
        />
        <TextField
          label="Valuation (KES)"
          type="number"
          value={valuation}
          onChange={(e) => setValuation(Number(e.target.value))}
        />
        <TextField
          label="Location Name"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />
        <TextField
          label="Property Type (e.g., Apartment, Villa)"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        />
        <TextField
          label="Geo Coordinates (lat, long)"
          value={geoCoordinates}
          onChange={(e) => setGeoCoordinates(e.target.value)}
        />
        <TextField
          label="Bedrooms"
          type="number"
          value={bedrooms}
          onChange={(e) => setBedrooms(Number(e.target.value))}
        />
        <TextField
          label="Swimming Pool (true/false)"
          value={hasSwimmingPool ? "true" : "false"}
          onChange={(e) => setHasSwimmingPool(e.target.value.toLowerCase() === "true")}
        />
        <TextField
          label="KRA PIN (hashed)"
          value={kraPin}
          onChange={(e) => setKraPin(e.target.value)}
        />
        <TextField
          label="ID Number (hashed)"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
        />
        <TextField
          label="Title Deed Hash"
          value={titleDeedHash}
          onChange={(e) => setTitleDeedHash(e.target.value)}
        />
        {/* Property Image Upload */}
        <Button variant="contained" component="label">
          Upload Property Image
          <input type="file" hidden onChange={handleImageUpload} />
        </Button>
        {propertyImageBase64 && (
          <Box sx={{ mt: 2 }}>
            <img src={propertyImageBase64} alt="Property Preview" style={{ maxWidth: "100%" }} />
          </Box>
        )}
        <Button variant="contained" onClick={handleRegister} sx={{ mt: 2 }}>
          Register Property
        </Button>
        {statusMessage && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {statusMessage}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
