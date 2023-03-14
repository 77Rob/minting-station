import React from "react";
import { useRouter } from "next/router";

const MintingPage = () => {
  const router = useRouter();
  const { contractAddress } = router.query;

  return <div>MintingPage</div>;
};

export default MintingPage;
