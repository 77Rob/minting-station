import { useState } from "react";
import { ethers } from "ethers";

type Props = {
  contractAddress: string;
};

const MintNFTButton = ({ contractAddress }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleMint = async () => {
    setIsLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        ["function mint() public returns (uint256)"],
        signer
      );

      const tx = await contract.mint();

      await tx.wait();

      alert("NFT minted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to mint NFT");
    }

    setIsLoading(false);
  };
  const handleCheckBalance = async () => {
    setIsLoading(true);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        ["function balanceOf() public returns (uint256)"],
        signer
      );

      const tx = await contract.mint();

      await tx.wait();

      alert("NFT minted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to mint NFT");
    }

    setIsLoading(false);
  };

  return (
    <button onClick={handleMint} disabled={isLoading}>
      {isLoading ? "Minting..." : "Mint NFT"}
    </button>
  );
};

export default MintNFTButton;
