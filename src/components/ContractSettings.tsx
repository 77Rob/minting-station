import { createCompilerInput } from "@/compiler/index";
import {
  downloadDependenciesForSource,
  generateContractSource,
  getValidContractName,
} from "@/solidity-codegen";
import {
  Formik,
  Field,
  Form,
  FormikHelpers,
  FieldInputProps,
  FormikProps,
} from "formik";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SwitchField from "@/components/SwitchField";
import { OptionalInputField } from "@/components/OptionalInputField";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import Button from "./Button";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  prepareContract,
  saveContractValues,
  initialState,
  CollectionType,
  deployContract,
  translateDeploymentStatus,
  initialContractState,
} from "@/store/contractReducer";
import { useCompiler } from "@/compiler";
import { useAccount, useProvider, useSigner } from "wagmi";
import ConfirmationButton from "./ConfirmationButton";
import { CogIcon } from "@heroicons/react/24/solid";

interface ILabelField {
  label: string;
  field: FieldInputProps<any>;
  form: FormikProps<any>;
}

export const LabelField = ({ label, field, form, ...props }: ILabelField) => {
  return (
    <div>
      <label htmlFor={field.name} className="label">
        {label}
      </label>
      <input className="input" {...field} {...props} />
    </div>
  );
};

const withFramerMotion = (Component: any, i: number) => {
  return (props: any) => (
    <motion.div
      layout
      viewport={{ margin: "600px" }}
      initial={{ opacity: 0, y: -20 }}
      whileInView={{
        opacity: 1,
        transition: {
          type: "spring",
          delay: i * 0.15,
        },
        y: 0,
      }}
    >
      <Component {...props} />
    </motion.div>
  );
};

interface IContractSettings {
  baseUri: string;
}

const DeploymentModal = ({ setOpen }: any) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.contract);

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4  text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          className="inline-block align-bottom bg-base-300 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-base-100 px-4 pt-5 pb-8 sm:p-8 sm:pb-12">
            <div className="sm:flex sm:items-start">
              <button
                onClick={() => setOpen(false)}
                className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-base-300 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  className="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium "
                  id="modal-headline"
                ></h3>
              </div>
            </div>
          </div>
          <div className="bg-base-200 text-4xl px-4 py-3 sm:px-6 gap-2 sm:flex sm:flex-row-reverse">
            {translateDeploymentStatus(state.status)}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContractSettings = ({ baseUri }: IContractSettings) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const dispatch = useAppDispatch();
  const compiler = useCompiler();
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();
  const { status: walletConnectionStatus } = useAccount();

  const state = useAppSelector((state) => state.contract);
  const [showDeploymentModal, setShowDeploymentModal] = useState(false);

  type Values = {
    image?: string;
    tokenName: string;
    ticker: string;
    royaltyBps?: string;
    price?: string;
    supply?: string;
    description?: string;
    multimint?: number;
    limitPerWallet?: number;
    mintSpecifiedIds: boolean;
    onlyOwnerCanMint: boolean;
    enumerable: boolean;
    externalURL: string;
    activateAutomatically: boolean;
  };

  const initialValues: Values = {
    tokenName: "",
    ticker: "",
    externalURL: "",
    onlyOwnerCanMint: false,
    enumerable: false,
    mintSpecifiedIds: false,
    activateAutomatically: true,
  };

  const getState = () => {
    return state;
  };

  return (
    <div className="card w-full px-12" id="ultimateRef">
      {showDeploymentModal && (
        <DeploymentModal setOpen={setShowDeploymentModal} />
      )}
      <Formik
        initialValues={initialContractState}
        onSubmit={async (
          values: any,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          setShowDeploymentModal(true);
          await deployContract({
            dispatch,
            getState,
            compiler,
            values,
            signer,
            provider,
            collectionType: CollectionType.ImagesProvided,
          });
        }}
      >
        <Form className="space-y-3">
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

          <motion.button
            whileTap={{ scale: 0.97 }}
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
          </motion.button>
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
          <Button
            type="submit"
            className="btn-primary  px-8 w-full text-center"
          >
            DEPLOY COLLECTION
          </Button>
        </Form>
      </Formik>
    </div>
  );
};
