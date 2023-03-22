import axios from "axios";
import { BigNumber, Contract } from "ethers";
import { formatUnits } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import { useProvider } from "wagmi";

export interface ContractData {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: any[];
  owner: string;
  totalSupply: number;
  maxSupply: number;
  price: number;
  saleIsActive: boolean;
}

export default function useLoadCollection({
  contractAddress,
}: {
  contractAddress: string | undefined | string[];
}) {
  const [data, setData] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [contractExists, setContractExists] = useState<boolean | undefined>(
    undefined
  );
  const [abi, setABI] = useState<any>([]);
  const provider = useProvider();
  const [contract, setContract] = useState<any>(undefined);

  const loadContract = async (ethersContract: any) => {
    const loaded = {
      saleIsActive: Boolean(await ethersContract.saleIsActive()),
      maxSupply: (await ethersContract.MAX_SUPPLY()).toString(),
      owner: await ethersContract.owner(),
      totalSupply:
        (await ethersContract.totalSupply()).toString() || "unlimited",
      price: formatUnits(
        BigNumber.from(
          (
            (ethersContract.PRICE && (await ethersContract.PRICE())) ||
            "0"
          ).toString()
        ),
        18
      ),
    };
    console.log(loaded);
    return loaded;
  };

  useEffect(() => {
    const loadContractData = async () => {
      if (typeof contractAddress == "string") {
        const contractDataRequest = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/collection/${contractAddress}`,
          {}
        );
        if (contractDataRequest.data === undefined) {
          setContractExists(false);
          return;
        }

        let contractData = contractDataRequest.data;
        const contractAbi = JSON.parse(contractData?.abi || "[]");
        const ethersContract = new Contract(
          contractAddress,
          contractAbi,
          provider
        );
        setContract(ethersContract);
        setData({ ...contractData, ...(await loadContract(ethersContract)) });
        setContractExists(true);
        setContract(contract);
        setABI(contractAbi);
        setLoading(false);
      }
    };
    loadContractData();
  }, [contractAddress]);

  return {
    contract,
    data,
    loading,
    contractExists,
  };
}
