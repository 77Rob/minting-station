import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSigner, useProvider, useContract } from "wagmi";
import { Contract, Signer } from "ethers";

export default function useLoadCollection({
  contractAddress,
}: {
  contractAddress: string | undefined | string[];
}) {
  const [contractData, setContractData] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [contractExists, setContractExists] = useState<boolean | undefined>(
    undefined
  );
  const signer = useSigner();

  useEffect(() => {
    const loadContractData = async () => {
      if (typeof contractAddress == "string") {
        const contractDataRequest = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/collection/${contractAddress}`,
          {
            params: {
              contractAddress: contractAddress,
            },
          }
        );
        if (contractDataRequest.data === undefined) {
          setContractExists(false);
        } else {
          setContractExists(true);
        }
        setContractData(contractDataRequest.data);
        setLoading(false);
      }
    };
    loadContractData();
  }, [contractAddress]);

  const contract = useMemo(() => {
    if (!loading && contractExists) {
      return new Contract(
        contractAddress as string,
        contractData.abi,
        signer as unknown as Signer
      );
    }
  }, [contractData]);

  return {
    contract,
    contractData,
    loading,
    contractExists,
  };
}
