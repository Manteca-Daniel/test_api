const express = require("express");
const ethers = require("ethers");

const app = express();
const PORT = 3001;

app.use(express.json());

const ABI_MINT = [
  "function mint(address to, uint256 tokenId, uint256 orderId, string memory metadataUrl) public"
];

const ABI_TRANSFER = [
  "function transferAuthorization(uint256 tokenId, address newAuthorized) public"
];

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

app.post("/mint", async (req, res) => {
  const { to, tokenId, orderId, metadataUrl } = req.body;
  
  if (!to || !tokenId || !orderId || !metadataUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  try {
    const contract = new ethers.Contract(contractAddress, ABI_MINT, wallet);
    const tx = await contract.mint(to, tokenId, orderId, metadataUrl);
    await tx.wait();
    res.json({ message: "NFT Minted", txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/transfer-authorization", async (req, res) => {
  const { tokenId, newAuthorized } = req.body;
  
  if (!tokenId || !newAuthorized) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  
  try {
    const contract = new ethers.Contract(contractAddress, ABI_TRANSFER, wallet);
    const tx = await contract.transferAuthorization(tokenId, newAuthorized);
    await tx.wait();
    res.json({ message: "Authorization Transferred", txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
