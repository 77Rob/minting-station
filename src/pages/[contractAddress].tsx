import React from "react";
import { useRouter } from "next/router";
import useLoadSmartContract from "@/hooks/useLoadSmartContract";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Button";
import { Spinner } from "flowbite-react";
import { parseEther, parseUnits } from "ethers/lib/utils.js";
import { ethers } from "ethers";

const MintingPage = () => {
  const router = useRouter();
  const { contractAddress } = router.query;

  const { contract, data, loading, contractExists } = useLoadSmartContract({
    contractAddress: contractAddress,
  });

  if (loading) {
    return (
      <div className="gap-x-6 flex items-center justify-center pt-48">
        <Spinner
          className="animate-spin w-20 h-20 "
          color="info"
          size="xl"
          aria-label="Extra large spinner Center-aligned"
        />
        <h1 className="text-7xl font-bold">Loading.....</h1>
      </div>
    );
  }

  if (!contractExists) {
    return (
      <div className="text-5xl text-center mx-auto pt-60">
        Contract does not exist
      </div>
    );
  }

  const handleMint = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress as string,
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
  };

  return (
    <div className="flex flex-col justify-center max-w-md py-2 mx-auto space-y-2 ">
      <h1 className="text-4xl font-bold w-full text-center">Collection Page</h1>
      <div className="bg-base-100 flex gap-y-3 justify-center mx-auto px-4 py-3 flex-col rounded-xl">
        <div className="flex justify-center items-center gap-x-4">
          {data?.saleIsActive ? (
            <label className="bg-green-500 px-6 py-1 text-md font-semibold rounded-xl">
              Minting Active
            </label>
          ) : (
            <label className="bg-red-500 px-6 py-1 text-md font-semibold rounded-xl">
              Minting Disabled
            </label>
          )}

          <div
            onClick={() => console.log(data?.maxSupply)}
            className="font-semibold px-6 py-1 text-md rounded-xl"
          >
            Minted: {data?.totalSupply} / {`${data?.maxSupply}`}
          </div>
        </div>
        <img
          className="w-full object-contain rounded-xl bg-base-200"
          src={data?.image}
          alt="NFT"
        />
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{data?.name}</h1>
          <div className="flex items-center gap-x-2">
            <Button className="p-1 rounded-xl bg-base-200">
              <img src="/explorer.svg" className="h-6" />
            </Button>
            <Button className="p-1 rounded-xl bg-base-200">
              <ArrowTopRightOnSquareIcon className="h-6" />
            </Button>
          </div>
        </div>
        <div>
          <h1 className="text-lg font-semibold">Description</h1>
          <h1>{data?.description}</h1>
        </div>
        <div>
          <h1 className="text-lg font-semibold">Owner</h1>
          <h1>{data?.owner}</h1>
        </div>
      </div>
      <Button
        onClick={handleMint}
        className="btn-primary  text-lg font-semibold"
      >
        Mint Price: {!(data?.price == "0") ? `${data?.price} BIT` : "Free"}
      </Button>
    </div>
  );
};

export default MintingPage;
