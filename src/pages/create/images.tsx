import { Formik, Field, Form, FormikHelpers } from "formik";

const Images = () => {
  return (
    <div className="grid grid-cols-7 gap-4 mx-4 my-4">
      <div className="col-span-5 space-y-6">
        <div className="card w-full">
          <button className="btn-primary">Upload</button>
        </div>
        <div className="card w-full overflow-auto h-96"></div>
      </div>

      <div className="col-span-2">
        <ContractSettings />
      </div>
    </div>
  );
};

const ContractSettings = () => {
  type Values = {
    baseUri: string;
    image?: string;
    tokenName: string;
    ticker: string;
    royaltyBps?: string;
    price?: string;
    supply?: string;
    description?: string;
    multimint?: number;
    limitPerWallet?: number;
    mintSpecifiedIds?: boolean;
    onlyOwnerCanMint: boolean;
    enumerable: boolean;
    activateAutomatically: boolean;
  };
  const initialValues: Values = {
    baseUri: "",
    tokenName: "",
    ticker: "",
    onlyOwnerCanMint: false,
    enumerable: false,
    activateAutomatically: true,
  };
  return (
    <div className="card w-full h-screen">
      <Formik
        initialValues={initialValues}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          console.log(values);
        }}
      >
        <Form>
          <label htmlFor="tokenName" className="label">
            Token Name
          </label>
          <Field
            name="tokenName"
            className="input"
            type="text"
            id="tokenName"
            placeholder="Token Name"
          />
          <label htmlFor="tokenName" className="label">
            Short Name
          </label>
          <Field
            name="ticker"
            className="input"
            type="text"
            id="ticker"
            placeholder="Short Name"
          />

          <button className="btn-primary  px-8 w-full text-center">
            DEPLOY COLLECTION
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Images;
