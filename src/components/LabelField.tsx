import { FieldInputProps, FormikProps } from "formik";

interface ILabelField {
  label: string;
  field: FieldInputProps<any>;
  form: FormikProps<any>;
}

export const LabelField = ({ label, field, form, ...props }: ILabelField) => {
  return (
    <div>
      <label htmlFor={field.name} className="label">
        {label}
      </label>
      <input className="input" {...field} {...props} />
    </div>
  );
};
