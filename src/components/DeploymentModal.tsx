import { useAppSelector } from "@/store";
import {
  DeploymentStatus,
  translateDeploymentStatus,
} from "@/store/contractReducer";
import Button from "./Button";
import { Spinner, Modal } from "flowbite-react";
import Link from "next/link";

const DeploymentModal = ({ setOpen, open }: any) => {
  const state = useAppSelector((state) => state.contract);

  return (
    <>
      <Modal
        className="bg-base-100  backdrop-invert-[0.35] "
        onClose={() => setOpen(false)}
        defaultValue="7xl"
        size="5xl"
        show={open}
      >
        <Modal.Header className="bg-base-100 bg- text-white text-center">
          <p className="text-2xl items-center font-bold text-center   text-white flex-1">
            Smart Contract Deployment In Progress
          </p>
        </Modal.Header>
        <Modal.Body className="bg-base-100 text-white pb-12">
          <div className="w-full flex justify-center items-center gap-x-4 mt-4 gap-y-6 mb-6">
            {state.status !== DeploymentStatus.Idle &&
              state.status !== DeploymentStatus.Error &&
              state.status !== DeploymentStatus.Deployed && (
                <Spinner
                  className="animate-spin"
                  color="info"
                  size="xl"
                  aria-label="Extra large spinner Center-aligned"
                />
              )}

            <h1 className="text-xl font-semibold">
              {translateDeploymentStatus(state.status)}
            </h1>
          </div>
          {state.status == DeploymentStatus.Deployed && (
            <div className="h-full flex items-center flex-col">
              <h1 className="text-xl flex gap-x-2 items-center">
                <p>Contract Deployed at: </p>
                <Link
                  className="text-primary font-bold"
                  href={`https://explorer.testnet.mantle.xyz/address/${state.deploymentAddress}`}
                >
                  {"    "}
                  {state.deploymentAddress}
                </Link>
              </h1>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-base-100 border-gray-600 border-t-4 ">
          {state.deploymentAddress && (
            <div className="flex flex-col items-center justify-center w-full">
              <h1 className="text-xl font-bold mb-6">
                Minting Page Was Generated
              </h1>
              <Link href={`/${state.deploymentAddress}`}>
                <Button>Go To Minting Page</Button>
              </Link>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeploymentModal;
