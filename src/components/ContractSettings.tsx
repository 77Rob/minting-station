import { useCompiler } from "@/compiler";
import OptionalInputField from "@/components/OptionalInputField";
import SwitchField from "@/components/SwitchField";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  deleteCollectionImage,
  deployContract,
  loadCollectionSettings,
} from "@/store/utils/contracts";
import {
  CollectionType,
  initialContractState,
  removeCollectionImage,
  submitContractValues,
} from "@/store/reducers/contractReducer";
import { Field, Form, Formik } from "formik";
import { LayoutGroup } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useProvider, useSigner } from "wagmi";
import Button from "./Button";
import DeploymentModal from "./DeploymentModal";
import LabelField from "./LabelField";
import { withFramerMotion } from "./withFramerMotion";
import { useSnackbar } from "notistack";
import UploadCollectionImage from "./UploadCollectionImage";
import { TrashIcon } from "@heroicons/react/24/solid";

type ContractSettingsProps = {
  collectionType: CollectionType;
};

const ContractSettings = ({ collectionType }: ContractSettingsProps) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const dispatch = useAppDispatch();
  const compiler = useCompiler();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { enqueueSnackbar } = useSnackbar();

  const state = useAppSelector((state) => state.contract);
  const [showDeploymentModal, setShowDeploymentModal] = useState(false);

  const getState = () => {
    return { ...state, enqueueSnackbar };
  };

  useEffect(() => {
    loadCollectionSettings({ dispatch });
  }, []);

  return (
    <div className="card py-6 w-full px-12" id="ultimateRef">
      {showDeploymentModal && (
        <DeploymentModal open={open} setOpen={setShowDeploymentModal} />
      )}
      <Formik
        initialValues={state.contract}
        onSubmit={async (values: any, actions) => {
          setShowDeploymentModal(true);
          dispatch(submitContractValues(values));
          await deployContract({
            dispatch,
            statex: state,
            getState,
            compiler,
            values,
            signer,
            provider,
            collectionType,
          });
        }}
      >
        <Form className="space-y-3">
          <div>
            <h1 className="text-xl w-full text-center mb-3 font-bold">
              Collection Settings
            </h1>
            {state.contract.image ? (
              <div className="flex justify-center items-center flex-col">
                <label className="w-full text-left label ">
                  Collection Image
                </label>
                <div className="bg-base-200 py-2 relative rounded-xl w-full flex justify-center">
                  <Button
                    onClick={() => {
                      deleteCollectionImage({ dispatch });
                    }}
                    className="p-1 rounded-lg absolute top-1 right-1 btn-red"
                    type="button"
                  >
                    <TrashIcon className="h-4 w-4 cursor-pointer" />
                  </Button>
                  <img
                    className="col-span-2 h-56 justify-center object-contain border-solid rounded-xl "
                    src={state.contract.image}
                  />
                </div>
              </div>
            ) : (
              <UploadCollectionImage dispatch={dispatch} getState={getState} />
            )}
          </div>

          <Field
            name="tokenName"
            className="input"
            type="text"
            id="tokenName"
            label="Token Name"
            placeholder="Token Name"
            component={LabelField}
          />
          <Field
            name="externalURL"
            className="input"
            type="text"
            id="externalURL"
            label="External Url"
            placeholder="External Url"
            component={LabelField}
          />
          {CollectionType.BaseURIProvided == collectionType && (
            <Field
              name="tokenURI"
              className="input"
              type="text"
              id="tokenURI"
              label="Token URI"
              placeholder="External Url"
              component={LabelField}
            />
          )}
          <Field
            name="ticker"
            className="input"
            type="text"
            id="ticker"
            placeholder="Short Name"
            label="Short Name"
            component={LabelField}
          />
          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <Field
              name="description"
              as="textarea"
              rows="6"
              className="input resize-y mb-4 px-4"
            />
          </div>
          <Field
            name="supply"
            type="number"
            label="Supply"
            defaultValue={10000}
            step={100}
            component={OptionalInputField}
          />
          <Field
            name="price"
            id="price"
            type="number"
            label="Price $BIT"
            defaultValue={0.1}
            step={0.1}
            component={OptionalInputField}
          />
          <Field
            name="royaltyBps"
            type="number"
            label="Royalties %"
            defaultValue={5}
            step={1}
            component={OptionalInputField}
          />

          <Button
            whileTap={{ scale: 0.97 }}
            type="button"
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowAdvancedOptions((curr) => !curr)}
            className="w-full btn-primary px-3 flex text-center
             items-center mb-4"
          >
            <p className="flex flex-grow justify-center ml-6">
              ADVANCED SETTINGS
            </p>
            {showAdvancedOptions ? (
              <svg
                width="22"
                className="justify-self-end"
                height="13"
                viewBox="0 0 22 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.7122 11.2875L11.7122 1.28751C11.5226 1.09973 11.2666 0.994385 10.9997 0.994385C10.7329 0.994385 10.4768 1.09973 10.2872 1.28751L0.287208 11.2875C0.151548 11.4321 0.0595965 11.6121 0.0219908 11.8068C-0.0156149 12.0015 0.00266206 12.2028 0.0747075 12.3875C0.151209 12.5695 0.279872 12.7248 0.444482 12.8338C0.609092 12.9428 0.802283 13.0006 0.999708 13H20.9997C21.1971 13.0006 21.3903 12.9428 21.5549 12.8338C21.7195 12.7248 21.8482 12.5695 21.9247 12.3875C21.9968 12.2028 22.015 12.0015 21.9774 11.8068C21.9398 11.6121 21.8479 11.4321 21.7122 11.2875V11.2875Z"
                  fill="white"
                />
              </svg>
            ) : (
              <svg
                width="22"
                height="12"
                viewBox="0 0 22 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.9247 0.612505C21.8482 0.430504 21.7195 0.275219 21.5549 0.166221C21.3903 0.0572224 21.1971 -0.000612701 20.9997 4.8951e-06H0.999708C0.802283 -0.000612701 0.609092 0.0572224 0.444482 0.166221C0.279872 0.275219 0.151209 0.430504 0.0747075 0.612505C0.00266206 0.797216 -0.0156149 0.99855 0.0219908 1.19321C0.0595965 1.38788 0.151548 1.56792 0.287208 1.7125L10.2872 11.7125C10.4783 11.8973 10.7338 12.0006 10.9997 12.0006C11.2656 12.0006 11.5211 11.8973 11.7122 11.7125L21.7122 1.7125C21.8479 1.56792 21.9398 1.38788 21.9774 1.19321C22.015 0.99855 21.9968 0.797216 21.9247 0.612505V0.612505Z"
                  fill="white"
                />
              </svg>
            )}
          </Button>
          {showAdvancedOptions && (
            <LayoutGroup>
              <Field
                name="multimint"
                type="number"
                label="Multimint"
                defaultValue={20}
                step={1}
                component={withFramerMotion(OptionalInputField, 1)}
              />
              <Field
                name="limitPerWallet"
                type="number"
                label="Limit Per Wallet"
                defaultValue={20}
                step={1}
                component={withFramerMotion(OptionalInputField, 2)}
              />
              <Field
                name="ownerMintAllowance"
                defaultValue={10}
                type="number"
                step={5}
                label="Owner Mint Allowance"
                component={withFramerMotion(OptionalInputField, 7)}
              />
              <Field
                name="onlyOwnerCanMint"
                label="Only Owner Can Mint"
                component={withFramerMotion(SwitchField, 3)}
              />
              <Field
                name="mintSpecifiedIds"
                label="Mint Specified Ids"
                component={withFramerMotion(SwitchField, 4)}
              />
              <Field
                name="enumerable"
                label="Enumerable"
                component={withFramerMotion(SwitchField, 5)}
              />
              <Field
                name="activateAutomatically"
                label="Activate Automatically"
                component={withFramerMotion(SwitchField, 6)}
              />
            </LayoutGroup>
          )}
          {signer ? (
            <Button
              type="submit"
              className="btn-primary  px-8 w-full text-center"
            >
              DEPLOY COLLECTION
            </Button>
          ) : (
            <Button
              disabled={true}
              type="button"
              className="btn-primary bg-base-200 shadow-none px-8 w-full text-center"
            >
              CONNECT WEB3 WALLET TO CONTINUE
            </Button>
          )}
        </Form>
      </Formik>
    </div>
  );
};
export default ContractSettings;
