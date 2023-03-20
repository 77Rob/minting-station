import React from "react";
import { useRouter } from "next/router";
import useLoadSmartContract from "@/hooks/useLoadSmartContract";
import { useContractRead } from "wagmi";
import { CORE_ABI } from "@/contracts/";
const MintingPage = () => {
  const router = useRouter();
  const { contractAddress } = router.query;
  console.log(contractAddress);

  const { data } = useContractRead({
    abi: CORE_ABI,
    address: contractAddress as `0x${string}`,
    functionName: "customURI",
  });

  console.log(data);

  const { contractDataServer, contract } = useLoadSmartContract({
    contractAddress: contractAddress,
  });
  if (contractDataServer) {
    console.log(contractDataServer);
    return (
      <div>
        <div>{contractDataServer.name}</div>
      </div>
    );
  }
  return <div>MintingPage</div>;
};

export default MintingPage;
