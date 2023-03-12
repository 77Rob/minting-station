import FileUpload from "@/components/FileUpload";
import { ContractSettings } from "../../components/ContractSettings";
import { useAppDispatch, useAppSelector } from "@/store";
import { IImage, Image, loadImages, uploadImages } from "@/store/imagesReducer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Field, Form, Formik } from "formik";
import { LabelField } from "../../components/ContractSettings";

const Images = () => {
  const dispatch = useAppDispatch();
  const imagesState = useAppSelector((state) => state.images);
  console.log(imagesState.images);

  useEffect(() => {
    loadImages(dispatch);
  }, []);

  const [columns, setColumns] = useState(4);

  const FourCols = () => {
    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 5H6C5.44772 5 5 5.44772 5 6V14C5 14.5523 5.44772 15 6 15H14C14.5523 15 15 14.5523 15 14V6C15 5.44772 14.5523 5 14 5Z"
          fill="#FFFFFF"
        />
        <path
          d="M26 5H18C17.4477 5 17 5.44772 17 6V14C17 14.5523 17.4477 15 18 15H26C26.5523 15 27 14.5523 27 14V6C27 5.44772 26.5523 5 26 5Z"
          fill="#FFFFFF"
        />
        <path
          d="M14 17H6C5.44772 17 5 17.4477 5 18V26C5 26.5523 5.44772 27 6 27H14C14.5523 27 15 26.5523 15 26V18C15 17.4477 14.5523 17 14 17Z"
          fill="#FFFFFF"
        />
        <path
          d="M26 17H18C17.4477 17 17 17.4477 17 18V26C17 26.5523 17.4477 27 18 27H26C26.5523 27 27 26.5523 27 26V18C27 17.4477 26.5523 17 26 17Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  };

  const Rows = () => {
    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M28 19V24C28 24.5304 27.7893 25.0391 27.4142 25.4142C27.0391 25.7893 26.5304 26 26 26H6C5.46957 26 4.96086 25.7893 4.58579 25.4142C4.21071 25.0391 4 24.5304 4 24V19C4 18.4696 4.21071 17.9609 4.58579 17.5858C4.96086 17.2107 5.46957 17 6 17H26C26.5304 17 27.0391 17.2107 27.4142 17.5858C27.7893 17.9609 28 18.4696 28 19ZM26 6H6C5.46957 6 4.96086 6.21071 4.58579 6.58579C4.21071 6.96086 4 7.46957 4 8V13C4 13.5304 4.21071 14.0391 4.58579 14.4142C4.96086 14.7893 5.46957 15 6 15H26C26.5304 15 27.0391 14.7893 27.4142 14.4142C27.7893 14.0391 28 13.5304 28 13V8C28 7.46957 27.7893 6.96086 27.4142 6.58579C27.0391 6.21071 26.5304 6 26 6Z"
          fill="#FFFFFF"
        />
      </svg>
    );
  };

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
            <div className="flex">
              <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.08 }}
                onClick={() =>
                  setColumns((columns) =>
                    columns == 1 || columns == 5 ? 4 : 5
                  )
                }
              >
                <FourCols />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.08 }}
                onClick={() => setColumns(1)}
              >
                <Rows />
              </motion.button>
            </div>
          </div>
        </div>
        <div className="card w-full overflow-auto h-screen">
          <div className={`grid grid-cols-${columns} gap-2`}>
            {imagesState.images?.map((image, index) => (
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

const PlusIcon = () => {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.93408 8.5625H13.9341"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.43408 3.0625V14.0625"
        stroke="white"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

const NFTImage = ({
  id,
  name,
  url,
  attributes,
  description,
  columns,
}: IImage & { columns: number }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <>
      <motion.div
        style={{ display: !flipped ? "flex" : "none" }}
        initial={{ opacity: 0, rotateY: 180 }}
        whileInView={{
          transition: { duration: 0.3, ease: "easeInOut" },
          opacity: 1,
          rotateY: [180, 140, 80, 50, 20],
        }}
        className="px-2 py-2 bg-base-200 border-highlight border-2 rounded-xl flex flex-col"
      >
        <div className="flex justify-between items-center">
          <input
            className="bg-inherit w-6 h-6 border-white border-2 rounded-md ring-0 checked:text-white checked:bg-gray-100 checkbox-fix focus:ring-0  "
            type="checkbox"
          />

          <h1 className="text-xl font-bold">{name}</h1>
          <motion.button
            onClick={() => setFlipped((flipped) => !flipped)}
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.08 }}
          >
            <svg
              width="29"
              height="29"
              viewBox="0 0 29 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M26.8961 12.1544C26.869 12.0321 26.8158 11.9171 26.7404 11.817C26.6649 11.717 26.5688 11.6344 26.4586 11.5747L23.8555 10.131C23.717 9.84661 23.5638 9.57317 23.3961 9.31067L23.4399 6.33567C23.4409 6.21089 23.4161 6.08724 23.3672 5.97244C23.3183 5.85765 23.2462 5.75418 23.1555 5.66848C21.8594 4.49332 20.3265 3.60943 18.6602 3.0763C18.5405 3.03898 18.4143 3.02749 18.2899 3.04257C18.1654 3.05765 18.0456 3.09897 17.9383 3.1638L15.3899 4.69504C15.0727 4.68411 14.7664 4.68411 14.4492 4.69504L11.9008 3.1638C11.7935 3.09897 11.6737 3.05765 11.5493 3.04257C11.4248 3.02749 11.2986 3.03898 11.1789 3.0763C9.51038 3.60984 7.97691 4.49783 6.68362 5.67942C6.59212 5.76217 6.5194 5.86354 6.47035 5.97674C6.42129 6.08994 6.39705 6.21232 6.39924 6.33567L6.45393 9.31067C6.27893 9.57317 6.12581 9.84661 5.97268 10.131L3.3805 11.5747C3.26894 11.6326 3.17175 11.7147 3.09605 11.815C3.02035 11.9153 2.96805 12.0313 2.943 12.1544C2.57108 13.8625 2.57108 15.6307 2.943 17.3388C2.97016 17.4611 3.02328 17.5762 3.09876 17.6762C3.17424 17.7762 3.27032 17.8588 3.3805 17.9185L5.98362 19.3622C6.12317 19.6452 6.28024 19.9192 6.45393 20.1825L6.39924 23.1575C6.39824 23.2823 6.42298 23.406 6.47191 23.5208C6.52084 23.6356 6.59291 23.739 6.68362 23.8247C7.98154 24.9974 9.51381 25.881 11.1789 26.4169C11.2986 26.4542 11.4248 26.4657 11.5493 26.4506C11.6737 26.4356 11.7935 26.3942 11.9008 26.3294L14.4492 24.7982H15.3899L17.9492 26.3294C18.0823 26.4169 18.2385 26.4626 18.3977 26.4607C18.4866 26.4568 18.5748 26.4421 18.6602 26.4169C20.3287 25.8834 21.8622 24.9954 23.1555 23.8138C23.247 23.731 23.3197 23.6297 23.3688 23.5165C23.4178 23.4033 23.4421 23.2809 23.4399 23.1575L23.3961 20.1825C23.5602 19.92 23.7133 19.6466 23.8664 19.3622L26.4696 17.9185C26.5781 17.8582 26.6725 17.7752 26.7461 17.6752C26.8197 17.5751 26.8709 17.4604 26.8961 17.3388C27.268 15.6307 27.268 13.8625 26.8961 12.1544ZM19.7321 14.7466C19.7321 15.6984 19.4498 16.6289 18.921 17.4203C18.3922 18.2117 17.6406 18.8285 16.7612 19.1928C15.8819 19.557 14.9142 19.6523 13.9807 19.4666C13.0472 19.2809 12.1896 18.8226 11.5166 18.1496C10.8436 17.4765 10.3852 16.619 10.1995 15.6855C10.0138 14.7519 10.1091 13.7843 10.4734 12.9049C10.8376 12.0256 11.4545 11.274 12.2459 10.7452C13.0373 10.2164 13.9677 9.93411 14.9196 9.93411C16.1959 9.93411 17.42 10.4411 18.3225 11.3437C19.225 12.2462 19.7321 13.4703 19.7321 14.7466Z"
                fill="white"
              />
            </svg>
          </motion.button>
        </div>
        <div className="flex items-center  justify-center  border-4 h-full rounded-xl border-highlight ">
          <img className="object-contain w-full rounded-xl  flex" src={url} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, rotateY: -180 }}
        style={{ display: flipped ? "flex" : "none" }}
        whileInView={{
          transition: { duration: 0.3 },
          opacity: [0.2, 0.5, 1],
          rotateY: [-140, -120, -60, -20, 0],
        }}
        className={`border-2 px-2 py-2 bg-base-100 border-highlight bprder-2 rounded-xl flex flex-col ${
          columns > 2 && "min-h-[250px]"
        }`}
      >
        <div className="flex justify-between items-center">
          <input
            className="bg-inherit w-6 h-6 border-white border-2 rounded-md ring-0 checked:text-white checked:bg-gray-100 checkbox-fix focus:ring-0  "
            type="checkbox"
          />

          <h1 className="text-xl font-bold">{name}</h1>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setFlipped((flipped) => !flipped)}
            whileHover={{ scale: 1.08 }}
          >
            <svg
              width="29"
              height="29"
              viewBox="0 0 29 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M26.8961 12.1544C26.869 12.0321 26.8158 11.9171 26.7404 11.817C26.6649 11.717 26.5688 11.6344 26.4586 11.5747L23.8555 10.131C23.717 9.84661 23.5638 9.57317 23.3961 9.31067L23.4399 6.33567C23.4409 6.21089 23.4161 6.08724 23.3672 5.97244C23.3183 5.85765 23.2462 5.75418 23.1555 5.66848C21.8594 4.49332 20.3265 3.60943 18.6602 3.0763C18.5405 3.03898 18.4143 3.02749 18.2899 3.04257C18.1654 3.05765 18.0456 3.09897 17.9383 3.1638L15.3899 4.69504C15.0727 4.68411 14.7664 4.68411 14.4492 4.69504L11.9008 3.1638C11.7935 3.09897 11.6737 3.05765 11.5493 3.04257C11.4248 3.02749 11.2986 3.03898 11.1789 3.0763C9.51038 3.60984 7.97691 4.49783 6.68362 5.67942C6.59212 5.76217 6.5194 5.86354 6.47035 5.97674C6.42129 6.08994 6.39705 6.21232 6.39924 6.33567L6.45393 9.31067C6.27893 9.57317 6.12581 9.84661 5.97268 10.131L3.3805 11.5747C3.26894 11.6326 3.17175 11.7147 3.09605 11.815C3.02035 11.9153 2.96805 12.0313 2.943 12.1544C2.57108 13.8625 2.57108 15.6307 2.943 17.3388C2.97016 17.4611 3.02328 17.5762 3.09876 17.6762C3.17424 17.7762 3.27032 17.8588 3.3805 17.9185L5.98362 19.3622C6.12317 19.6452 6.28024 19.9192 6.45393 20.1825L6.39924 23.1575C6.39824 23.2823 6.42298 23.406 6.47191 23.5208C6.52084 23.6356 6.59291 23.739 6.68362 23.8247C7.98154 24.9974 9.51381 25.881 11.1789 26.4169C11.2986 26.4542 11.4248 26.4657 11.5493 26.4506C11.6737 26.4356 11.7935 26.3942 11.9008 26.3294L14.4492 24.7982H15.3899L17.9492 26.3294C18.0823 26.4169 18.2385 26.4626 18.3977 26.4607C18.4866 26.4568 18.5748 26.4421 18.6602 26.4169C20.3287 25.8834 21.8622 24.9954 23.1555 23.8138C23.247 23.731 23.3197 23.6297 23.3688 23.5165C23.4178 23.4033 23.4421 23.2809 23.4399 23.1575L23.3961 20.1825C23.5602 19.92 23.7133 19.6466 23.8664 19.3622L26.4696 17.9185C26.5781 17.8582 26.6725 17.7752 26.7461 17.6752C26.8197 17.5751 26.8709 17.4604 26.8961 17.3388C27.268 15.6307 27.268 13.8625 26.8961 12.1544ZM19.7321 14.7466C19.7321 15.6984 19.4498 16.6289 18.921 17.4203C18.3922 18.2117 17.6406 18.8285 16.7612 19.1928C15.8819 19.557 14.9142 19.6523 13.9807 19.4666C13.0472 19.2809 12.1896 18.8226 11.5166 18.1496C10.8436 17.4765 10.3852 16.619 10.1995 15.6855C10.0138 14.7519 10.1091 13.7843 10.4734 12.9049C10.8376 12.0256 11.4545 11.274 12.2459 10.7452C13.0373 10.2164 13.9677 9.93411 14.9196 9.93411C16.1959 9.93411 17.42 10.4411 18.3225 11.3437C19.225 12.2462 19.7321 13.4703 19.7321 14.7466Z"
                fill="white"
              />
            </svg>
          </motion.button>
        </div>
        <div className="flex flex-col rounded-xl justify-items-center">
          <Formik
            initialValues={{
              name: name,
              description: description,
              attributes: attributes,
            }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            <Form className={`${columns > 2 ? "space-y-1" : "space-y-4"}`}>
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
              <div>
                <label htmlFor="attributes" className="text-sm label font-bold">
                  Attributes
                </label>
              </div>
            </Form>
          </Formik>
        </div>
      </motion.div>
    </>
  );
};

export const LabelFieldSmall = ({ label, field, form, ...props }: any) => {
  return (
    <div className=" rounded-none">
      <label htmlFor={field.name} className="text-sm label font-bold">
        {label}
      </label>
      <input className="input-sm" {...field} {...props} />
    </div>
  );
};

export default Images;
