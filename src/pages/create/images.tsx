import FileUpload from "@/components/FileUpload";
import { ContractSettings } from "../../components/ContractSettings";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  IImage,
  Image,
  deleteImages,
  deselectAllImages,
  deselectImage,
  loadImages,
  selectAllImages,
  selectImage,
  updateMetadata,
  uploadImages,
} from "@/store/imagesReducer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Field, FieldInputProps, Form, Formik, FormikProps } from "formik";
import { LabelField } from "../../components/ContractSettings";
import {
  PlusIcon,
  GearIcon,
  RowsIcon,
  FourColumnsIcon,
  MinusIcon,
} from "@/assets";
import { TrashIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Button";

const Images = () => {
  const dispatch = useAppDispatch();
  const imagesState = useAppSelector((state) => state.images);
  useEffect(() => {
    loadImages({ dispatch });
  }, []);

  const [columns, setColumns] = useState(6);

  return (
    <div className="grid grid-cols-7 gap-8 px-8 mx-2 my-4">
      <div className="col-span-5 space-y-4">
        <div className="card px-2 py-4 space-x-8 items-center grid grid-cols-5">
          <FileUpload
            className="col-span-2"
            onFiles={(files) => {
              uploadImages({ images: files, dispatch });
            }}
          />
          <div className="col-span-1 flex flex-col gap-2">
            <Button className="btn-red btn-sm">Reset</Button>
            <Button className="btn-primary btn-sm">Load Demo</Button>
          </div>
          <div className="space-y-2 items-end flex flex-col col-span-2">
            <Button
              className="w-[65%] btn-red px-3 flex text-center
             items-center btn-sm"
              onClick={() =>
                deleteImages({
                  fileNames: imagesState.selected,
                  dispatch,
                })
              }
            >
              <p className="flex flex-grow justify-center ml-6">
                DELETE SELECTED
              </p>
              <TrashIcon className="w-6 justify-self-end" />
            </Button>
            <Button
              className="btn-primary w-[65%]  btn-sm "
              onClick={() => dispatch(selectAllImages())}
            >
              SELECT ALL
            </Button>
            <Button
              className="btn-primary btn-sm  w-[65%] "
              onClick={() => dispatch(deselectAllImages())}
            >
              DESELECT ALL
            </Button>
          </div>
        </div>
        <div className="card py-2  w-full overflow-auto h-screen">
          <div className="flex items-center space-x-2 pb-1 justify-start">
            <Button className="btn-primary p-1" onClick={() => setColumns(4)}>
              <FourColumnsIcon />
            </Button>
            <Button className="btn-primary p-1" onClick={() => setColumns(1)}>
              <RowsIcon />
            </Button>
          </div>
          <div
            className={`grid ${
              columns == 1 ? "gird-cols-1" : "grid-cols-5"
            } gap-2`}
          >
            {imagesState.images &&
              imagesState.images?.map((image, index) => (
                <NFTImage key={image.fileName} {...image} columns={columns} />
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

const NFTHeader = ({
  name,
  fileName,
  setFlipped,
}: {
  name: string;
  fileName: string;
  setFlipped: (flipped: any) => void;
}) => {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.images.selected);

  return (
    <div className="flex justify-between items-center px-2 py-1">
      <input
        className="bg-inherit w-6 h-6 border-white border-2 rounded-md ring-0 checked:text-white checked:bg-gray-100 checkbox-fix focus:ring-0 cursor-pointer"
        type="checkbox"
        checked={selected.includes(fileName)}
        onChange={(e) => {
          if (e.target.checked) {
            dispatch(selectImage(fileName));
          } else {
            dispatch(deselectImage(fileName));
          }
        }}
      />
      <h1 className="text-xl font-bold">{name}</h1>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setFlipped((flipped: boolean) => !flipped)}
        whileHover={{ scale: 1.08 }}
      >
        <GearIcon />
      </motion.button>
    </div>
  );
};

const NFTImage = ({
  fileName,
  name,
  url,
  attributes,
  description,
  columns,
}: INFTImage) => {
  const [flipped, setFlipped] = useState(false);

  // Styles object so changes affect both card and settings
  const styles = {
    card: `border-[3px] bg-base-100 border-highlight rounded-xl flex flex-col  ${
      columns !== 1 && "h-80 max-h-80"
    }`,
  };

  const dispatch = useAppDispatch();

  const NFTSettingsCard = () => {
    return (
      <motion.div
        initial={{ opacity: 0, rotateY: -180 }}
        viewport={{ once: true }}
        style={{ display: flipped ? "flex" : "none" }}
        whileInView={{
          transition: { duration: 0.3 },
          opacity: [0.2, 0.5, 1],
          rotateY: [-140, -120, -60, -20, 0],
        }}
        className={styles.card + "p-2 overflow-y-auto "}
      >
        <NFTHeader name={name} setFlipped={setFlipped} fileName={fileName} />
        <div className="flex flex-col rounded-xl justify-items-center p-2">
          <Formik
            initialValues={{
              name: name,
              description: description,
              attributes: attributes || [],
            }}
            onSubmit={(values) => {
              updateMetadata({
                imageData: {
                  fileName,
                  name: values.name,
                  url: url,
                  description: values.description,
                  attributes: values.attributes,
                },
                dispatch,
              });
            }}
          >
            <Form className={`${columns == 1 ? "space-y-1" : "space-y-4"} `}>
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
              <Button type="submit" className="btn-primary w-full mt-2">
                Save
              </Button>
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
        viewport={{ once: true }}
        whileInView={{
          transition: { duration: 0.3, ease: "easeInOut" },
          opacity: 1,
          rotateY: [180, 140, 80, 50, 20],
        }}
        className={styles.card}
      >
        <NFTHeader name={name} setFlipped={setFlipped} fileName={fileName} />
        <div className="flex items-center  justify-center  border-[3px] h-full border-highlight ">
          <img
            className={
              "object-contain min-w-[60%] flex bg-gray-600" +
              (columns == 1 && "min-h-80")
            }
            src={url}
          />
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
      <div className="flex justify">
        <label className="space-x-2 text-sm label w-[45%] font-bold">
          Name
        </label>
        <label className="text-sm label font-bold">Value</label>
      </div>
      <div className="space-y-1">
        {field.value &&
          field.value.map((attribute: any, index: number) => {
            return (
              <div key={index} className="flex space-x-2">
                <input
                  className="input-sm"
                  required
                  onChange={(e) => {
                    if (e.target.value !== "\n") {
                      const attributes = [...field.value];
                      attributes[index].name = e.target.value;
                      form.setFieldValue("attributes", attributes);
                    }
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
                <motion.button
                  onClick={() => {
                    const attributes = [...field.value];
                    attributes.splice(index, 1);
                    form.setFieldValue("attributes", attributes);
                  }}
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <MinusIcon />
                </motion.button>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Images;
