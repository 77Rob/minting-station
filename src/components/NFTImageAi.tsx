import { useAppDispatch, useAppSelector } from "@/store";
import {
  IImage,
  deselectImage,
  selectImage,
} from "@/store/reducers/imagesReducer";
import { updateMetadata, updateMetadataAi } from "@/store/utils/images";
import { useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Field, Form, Formik } from "formik";
import LabelField from "./LabelField";
import { GearIcon } from "@/assets";
import Button from "@/components/Button";
import LabelFieldSmall from "./LabelFieldSmall";
import AttributesField from "./AttributesField";

type NFTImageAiGeneratedProps = IImage & {
  columns: number;
};

const NFTImageAi = ({
  fileName,
  name,
  url,
  attributes,
  description,
  columns,
}: NFTImageAiGeneratedProps) => {
  const [flipped, setFlipped] = useState(false);

  const styles = {
    card: `backdrop-invert-[.15] rounded-xl flex flex-col ${
      columns !== 1 && "h-80 max-h-80"
    }`,
  };

  const selected = useAppSelector((state) => state.images.selected);

  const NFTHeader = () => {
    return (
      <div className="flex justify-between items-center px-2 py-1 border-2 border-gray-600  rounded-t-xl">
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

        <h1 className="text-xl font-bold overflow-x-auto whitespace-nowrap mx-2">
          {name}
        </h1>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            flip();
          }}
          whileHover={{ scale: 1.08 }}
        >
          <GearIcon />
        </motion.button>
      </div>
    );
  };

  const controls = useAnimation();

  const flip = async () => {
    await controls.start({
      opacity: 0,
      rotateY: !flip ? 200 : -200,
      transition: { duration: 0.3 },
    });
    setFlipped(!flipped);
  };
  const dispatch = useAppDispatch();

  const NFTSettingsCard = () => {
    return (
      <motion.div
        initial={{ opacity: 1, rotateY: 0 }}
        animate={controls}
        className={styles.card + "p-2 overflow-y-auto"}
      >
        <NFTHeader />
        <div className="flex flex-col rounded-xl justify-items-center p-2">
          <Formik
            initialValues={{
              name: name,
              description: description,
              attributes: attributes || [],
            }}
            onSubmit={(values) => {
              updateMetadataAi({
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
              <Button
                type="submit"
                className="py-1 w-full bg-primary rounded-xl"
              >
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
        initial={{ opacity: 1, rotateY: 0 }}
        animate={controls}
        className={styles.card}
      >
        <NFTHeader />
        <div className="flex items-center  justify-center bg  h-full ">
          <img
            className={
              "object-contain min-w-[60%] flex " + (columns == 1 && "min-h-80")
            }
            src={url}
          />
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {!flipped ? <ImageCard /> : <NFTSettingsCard />}
    </AnimatePresence>
  );
};

export default NFTImageAi;
