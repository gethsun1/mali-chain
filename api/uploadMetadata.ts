import { Client, FileCreateTransaction, Hbar, TransactionReceipt } from "@hashgraph/sdk";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Load operator credentials from environment variables (set in Vercel dashboard)
  const operatorId = process.env.OPERATOR_ACCOUNT_ID;
  const operatorKey = process.env.OPERATOR_PRIVATE_KEY;

  if (!operatorId || !operatorKey) {
    return res.status(500).json({ error: "Missing operator account details in environment variables" });
  }

  try {
    // Configure the Hedera client
    const client = Client.forTestnet();
    client.setOperator(operatorId, operatorKey);

    const { contents } = req.body;
    if (!contents) {
      return res.status(400).json({ error: "Missing contents in request body" });
    }

    // Create file on Hedera File Service
    const fileCreateTx = new FileCreateTransaction()
      .setKeys([client.operatorKey])
      .setContents(contents)
      .setMaxTransactionFee(new Hbar(2));

    const fileCreateSubmit = await fileCreateTx.execute(client);
    const fileCreateReceipt: TransactionReceipt = await fileCreateSubmit.getReceipt(client);
    
    const fileId = fileCreateReceipt.fileId;
    if (!fileId) {
      return res.status(500).json({ error: "File creation failed, fileId is null" });
    }
    console.log("Uploaded file ID:", fileId.toString());
    return res.status(200).json({ fileId: fileId.toString() });
  } catch (error: any) {
    console.error("Error in uploadMetadata:", error);
    return res.status(500).json({ error: error.message });
  }
}

