import { FormikProps, FieldInputProps } from "formik";

interface SwitchFieldProps {
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  label: string;
  props: any;
}

const SwitchField = ({ field, form, label, ...props }: SwitchFieldProps) => {
  return (
    <div className="grid grid-cols-10 gap-2 mb-2  items-center">
      <p className="font-bold col-span-8">{label}</p>

      <label
        htmlFor={field.name}
        className="flex col-span-2 cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            checked={field.value}
            {...field}
            {...props}
            id={field.name}
            className="sr-only switch-input"
          />
          <div className="box block h-8 w-14 rounded-xl"></div>
          <div className="dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-lg bg-white transition"></div>
        </div>
      </label>
    </div>
  );
};

export default SwitchField;
