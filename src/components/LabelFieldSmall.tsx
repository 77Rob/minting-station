import { FieldInputProps, FormikProps } from "formik";

interface LabelFieldSmallProps {
  label: string;
  field: FieldInputProps<any>;
  form: FormikProps<any>;
}

const LabelFieldSmall = ({
  label,
  field,
  form,
  ...props
}: LabelFieldSmallProps) => {
  return (
    <div className=" rounded-none">
      <label htmlFor={field.name} className="text-sm label font-bold">
        {label}
      </label>
      <input className="input-sm" {...field} {...props} />
    </div>
  );
};

export default LabelFieldSmall;
