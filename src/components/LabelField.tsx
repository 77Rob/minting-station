import { FieldInputProps, FormikProps } from "formik";

interface LabelFieldProps {
  label: string;
  field: FieldInputProps<any>;
  form: FormikProps<any>;
}

const LabelField = ({ label, field, form, ...props }: LabelFieldProps) => {
  return (
    <div>
      <label htmlFor={field.name} className="label">
        {label}
      </label>
      <input className="input" {...field} {...props} />
    </div>
  );
};

export default LabelField;
