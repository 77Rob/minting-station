import FileUpload from "@/components/FileUpload";
import { ContractSettings } from "../../components/ContractSettings";
import { useAppDispatch, useAppSelector } from "@/store";
import { IImage, Image, loadImages, uploadImages } from "@/store/imagesReducer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Field, FieldInputProps, Form, Formik, FormikProps } from "formik";
import { LabelField } from "../../components/ContractSettings";
import { PlusIcon, GearIcon, RowsIcon, FourColumnsIcon } from "@/assets";

const Images = () => {
  const dispatch = useAppDispatch();
  const imagesState = useAppSelector((state) => state.images);
  useEffect(() => {
    loadImages(dispatch);
  }, []);

  const [columns, setColumns] = useState(4);

  return (
    <div className="grid grid-cols-7 gap-4 mx-2 my-4">
      <div className="col-span-5 space-y-4">
        <div className="card px-2 py-4 grid grid-cols-5">
          <FileUpload
            className="col-span-2"
            onFiles={(files) => {
              uploadImages(files, dispatch);
            }}
          />
          <div className="col-span-2" />
          <div className="col-span-1 flex flex-col gap-2">
            <button className="btn-red">Reset</button>
            <button className="btn-primary"> Load Demo</button>
          </div>
        </div>
        <div className="card py-2  w-full overflow-auto h-screen">
          <div className="flex items-center justify-start">
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => setColumns(4)}
            >
              <FourColumnsIcon />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.08 }}
              onClick={() => setColumns(1)}
            >
              <RowsIcon />
            </motion.button>
          </div>
          <div className={`grid grid-cols-${columns.toString()} gap-2`}>
            {imagesState.images &&
              imagesState.images?.map((image, index) => (
                <NFTImage key={image.id} {...image} columns={columns} />
              ))}
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <ContractSettings baseUri="" />
      </div>
      <div className="flex items-center justify-center"></div>
    </div>
  );
};

type INFTImage = IImage & {
  columns: number;
};

const NFTImage = ({
  id,
  name,
  url,
  attributes,
  description,
  columns,
}: INFTImage) => {
  const [flipped, setFlipped] = useState(false);

  const SettingsButton = () => {
    return (
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setFlipped((flipped) => !flipped)}
        whileHover={{ scale: 1.08 }}
      >
        <GearIcon />
      </motion.button>
    );
  };

  const NFTSettingsCard = () => {
    return (
      <motion.div
        initial={{ opacity: 0, rotateY: -180 }}
        style={{ display: flipped ? "flex" : "none" }}
        whileInView={{
          transition: { duration: 0.3 },
          opacity: [0.2, 0.5, 1],
          rotateY: [-140, -120, -60, -20, 0],
        }}
        className={`border-2 px-2 py-2 bg-base-100 overflow-y-scroll  border-highlight bprder-2 rounded-xl flex flex-col ${
          columns > 2 && "min-h-[250px]"
        } ${columns !== 1 && "max-h-72"}`}
      >
        <div className="flex justify-between items-center">
          <input
            className="bg-inherit w-6 h-6 border-white border-2 rounded-md ring-0 checked:text-white checked:bg-gray-100 checkbox-fix focus:ring-0  "
            type="checkbox"
          />

          <h1 className="text-xl font-bold">{name}</h1>
          <SettingsButton />
        </div>
        <div className="flex flex-col rounded-xl justify-items-center">
          <Formik
            initialValues={{
              name: name,
              description: description,
              attributes: attributes || [],
            }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            <Form
              className={`${
                columns > 2 ? "space-y-1" : "space-y-4"
              } overflow-y-auto overflow-x-hidden`}
            >
              <Field
                name="name"
                type="text"
                id="name"
                label="Token name"
                placeholder="Token name"
                component={columns > 1 ? LabelFieldSmall : LabelField}
              />
              <div>
                <label
                  htmlFor="description"
                  className="text-sm label font-bold"
                >
                  Description
                </label>
                <Field
                  name="description"
                  as="textarea"
                  className={`${
                    columns > 1 ? "input-sm" : "input"
                  } resize-y overflow-y-hidden`}
                />
              </div>

              <Field name="attributes" component={AttributesField} />
              <button type="submit">Save</button>
            </Form>
          </Formik>
        </div>
      </motion.div>
    );
  };

  const ImageCard = () => {
    return (
      <motion.div
        style={{ display: !flipped ? "flex" : "none" }}
        initial={{ opacity: 0, rotateY: 180 }}
        whileInView={{
          transition: { duration: 0.3, ease: "easeInOut" },
          opacity: 1,
          rotateY: [180, 140, 80, 50, 20],
        }}
        className={`px-2 py-2 bg-base-200 border-highlight border-2 rounded-xl flex flex-col ${
          columns !== 1 && "max-h-285"
        }`}
      >
        <div className="flex justify-between items-center">
          <input
            className="bg-inherit w-6 h-6 border-white border-2 rounded-md ring-0 checked:text-white checked:bg-gray-100 checkbox-fix focus:ring-0  "
            type="checkbox"
          />

          <h1 className="text-xl font-bold">{name}</h1>
          <SettingsButton />
        </div>
        <div className="flex items-center  justify-center  border-4 h-full rounded-xl border-highlight ">
          <img className="object-contain w-full rounded-xl  flex" src={url} />
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <ImageCard />
      <NFTSettingsCard />
    </>
  );
};

interface ILabelFieldSmall {
  label: string;
  field: FieldInputProps<any>;
  form: FormikProps<any>;
}

export const LabelFieldSmall = ({
  label,
  field,
  form,
  ...props
}: ILabelFieldSmall) => {
  return (
    <div className=" rounded-none">
      <label htmlFor={field.name} className="text-sm label font-bold">
        {label}
      </label>
      <input className="input-sm" {...field} {...props} />
    </div>
  );
};

interface IAttributesField {
  field: FieldInputProps<any>;
  form: FormikProps<any>;
}

const AttributesField = ({ field, form }: IAttributesField) => {
  const handleAddAttribute = () => {
    form.setFieldValue("attributes", [...field.value, { name: "", value: "" }]);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <label htmlFor="attributes" className="text-sm label font-bold">
          Attributes
        </label>
        <button onClick={() => handleAddAttribute()}>
          <PlusIcon className="w-5" />
        </button>
      </div>
      <div>
        {field.value &&
          field.value.map((attribute: any, index: number) => {
            return (
              <div key={attribute.id} className="flex">
                <input
                  className="input-sm"
                  required
                  onChange={(e) => {
                    const attributes = [...field.value];
                    attributes[index].name = e.target.value;
                    form.setFieldValue("attributes", attributes);
                  }}
                  value={attribute.name}
                />
                <input
                  className="input-sm"
                  onChange={(e) => {
                    const attributes = [...field.value];
                    attributes[index].value = e.target.value;
                    form.setFieldValue("attributes", attributes);
                  }}
                  value={attribute.value}
                />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Images;
