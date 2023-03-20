import { motion } from "framer-motion";
import { PlusIcon, MinusIcon } from "@/assets";
import { FieldInputProps, FormikProps } from "formik";

export interface AttributesFieldProps {
  field: FieldInputProps<any>;
  form: FormikProps<any>;
}

const AttributesField = ({ field, form }: AttributesFieldProps) => {
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

export default AttributesField;
