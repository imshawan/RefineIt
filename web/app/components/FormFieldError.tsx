import { FieldErrors } from "react-hook-form"

interface FormFieldErrorProps {
    errors: FieldErrors
    field: string
}

export const FormFieldError: React.FC<FormFieldErrorProps> = ({errors, field}) => {
    return (
        <div className="mt-1">
            {errors && errors[field] && <small className="p-error mt-2">{String(errors[field]?.message)}</small>}
        </div>
    )}