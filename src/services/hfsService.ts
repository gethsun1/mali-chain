import {
  Client,
  FileCreateTransaction,
  Hbar,
  TransactionReceipt,
  FileId,
} from "@hashgraph/sdk";

// Use secure environment variables (not exposed to the client)
const operatorId = process.env.OPERATOR_ACCOUNT_ID;
const operatorKey = process.env.OPERATOR_PRIVATE_KEY;

if (!operatorId || !operatorKey) {
  throw new Error("Missing operator account details in .env");
}

// Configure the Hedera client (adjust for testnet/mainnet as needed)
const client = Client.forTestnet();
client.setOperator(operatorId, operatorKey);

/**
 * Uploads a text file (contents) to Hedera File Service and returns the file ID.
 * For short contents (like JSON metadata), FileAppendTransaction isn't necessary.
 */
export async function uploadFileToHFS(contents: string): Promise<string> {
  // Access the operator key via the client's internal _operator property
  const opKey = (client as any)._operator?.key;
  if (!opKey) {
    throw new Error("Operator key not found");
  }

  const fileCreateTx = new FileCreateTransaction()
    .setKeys([opKey])
    .setContents(contents)
    .setMaxTransactionFee(new Hbar(2));

  const fileCreateSubmit = await fileCreateTx.execute(client);
  const fileCreateReceipt: TransactionReceipt = await fileCreateSubmit.getReceipt(client);
  
  const fileId: FileId | null = fileCreateReceipt.fileId;
  if (!fileId) {
    throw new Error("File creation failed, fileId is null");
  }
  console.log("Uploaded file ID:", fileId.toString());
  return fileId.toString();
}

/**
 * Uploads property data to HFS.
 * @param imageContents - The property image data as a string (e.g. Base64 string).
 * @param metadata - A JSON object containing public and sensitive property details.
 *                   Sensitive fields (like KRA PIN, ID number, and title deed hash) should be hashed.
 * @returns The file ID (string) of the uploaded metadata JSON.
 */
export async function uploadPropertyMetadataToHFS(
  imageContents: string,
  metadata: object
): Promise<string> {
  // First, upload the property image to HFS.
  const imageFileId = await uploadFileToHFS(imageContents);
  
  // Enrich metadata with the image reference (you can store the imageFileId or a URL to an HFS gateway)
  const enrichedMetadata = {
    ...metadata,
    propertyImage: imageFileId, // This field references the uploaded image.
  };

  // Convert the enriched metadata to a JSON string.
  const metadataJSON = JSON.stringify(enrichedMetadata);

  // Upload the metadata JSON to HFS.
  const metadataFileId = await uploadFileToHFS(metadataJSON);
  return metadataFileId;
}
