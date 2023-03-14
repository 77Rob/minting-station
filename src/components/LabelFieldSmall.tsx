import { FieldInputProps, FormikProps } from "formik";

export interface ILabelFieldSmall {
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
