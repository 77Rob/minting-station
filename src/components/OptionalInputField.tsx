import { FormikProps, FieldInputProps } from "formik";
import { useState } from "react";
import { PlusIcon, MinusIcon } from "@/assets";

interface OptionalInputFieldProps {
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  defaultValue: any;
  step?: number;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  props: any;
}

const OptionalInputField = ({
  field,
  form,
  defaultValue,
  label,
  step = 1,
  type,
  ...props
}: OptionalInputFieldProps) => {
  const [checked, setChecked] = useState(
    field.value === undefined ? false : true
  );

  const handleChangeChecked = (e: any) => {
    setChecked(!checked);
    form.setFieldValue(
      field.name,
      checked ? undefined : defaultValue ? defaultValue : null
    );
  };

  const handleDecrement = () => {
    if (field.value - step > 0) {
      form.setFieldValue(field.name, (field.value - step).toFixed(2));
    }
  };

  const handleIncrement = () => {
    form.setFieldValue(field.name, parseFloat(field.value) + step);
  };

  return (
    <div className="grid grid-cols-10 gap-2 mb-2  items-center">
      <p className="font-bold col-span-3">{label}</p>

      <label
        htmlFor={field.name}
        className="flex col-span-2 cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => handleChangeChecked(e)}
            id={field.name}
            className="sr-only switch-input"
          />
          <div className="box block h-8 w-14 rounded-xl"></div>
          <div className="dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-lg bg-white transition"></div>
        </div>
      </label>

      {type == "number" && (
        <div className="col-span-5 flex items-center px-2 py-1 border-white border bg-base-200 rounded-xl">
          <button
            className="text-xl flex justify-center w-[20%]"
            onClick={handleDecrement}
          >
            <MinusIcon />
          </button>
          <input
            {...field}
            {...props}
            className="bg-transparent w-[60%] focus:ring-0 border-none text-center"
            disabled={!checked}
            value={checked ? field.value : ""}
            inputMode="none"
            type={type}
          />
          <button
            className="text-xl flex justify-center w-[20%]"
            onClick={() => handleIncrement()}
          >
            <PlusIcon />
          </button>
        </div>
      )}

      {type !== "number" && (
        <input
          {...field}
          {...props}
          disabled={!checked}
          value={checked ? field.value : ""}
          type={type}
          className="col-span-5 input"
        />
      )}
    </div>
  );
};

export default OptionalInputField;
