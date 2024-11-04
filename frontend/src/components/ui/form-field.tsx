// src/components/ui/form-field.tsx
import { Input, InputProps } from './input';
import { useFormContext } from 'react-hook-form';

interface FormFieldProps extends InputProps {
  name: string;
}

export const FormField = ({ name, ...props }: FormFieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <Input
      {...register(name)}
      error={error}
      {...props}
    />
  );
};