import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSigner, useProvider, useContract } from "wagmi";
import { Contract } from "ethers";

export default function useLoadSmartContract({
  contractAddress,
}: {
  contractAddress: string | undefined | string[];
}) {
  const [contractDataServer, setContractDataServer] = useState<any>(null);
  //   const [signerS, setSignerS] = useState<any>(null);

  const signer = useSigner();

  useEffect(() => {
    const loadContractData = async () => {
      console.log(contractAddress);
      if (typeof contractAddress == "string") {
        console.log(contractAddress);
        const contractABI = await axios.get(
          `http://localhost:5000/collection/abi/${contractAddress}`,
          {
            params: {
              contractAddress: contractAddress,
            },
          }
        );
        setContractDataServer(contractABI.data);
      }
    };
    loadContractData();
  }, [contractAddress]);

  const contract = useMemo(() => {
    if (!(typeof contractAddress == "string")) {
      return;
    }
    if (!contractDataServer) {
      return;
    }
    if (signer === null) {
      return;
    }
    if (signer === undefined) {
      return;
    }
    if (signer.isSuccess == false) {
    }
    return new Contract(contractAddress, contractDataServer.abi, signer);
  }, [contractDataServer]);

  return {
    contract,
    contractDataServer,
  };
}
