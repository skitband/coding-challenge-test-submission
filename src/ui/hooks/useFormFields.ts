import { useState, ChangeEvent } from 'react';

/**
 * useFormFields - A custom hook for managing form field state generically.
 * @param initialValues - An object with the initial values for the form fields.
 * @returns [fields, handleFieldChange, setFields]
 */
export function useFormFields<T extends Record<string, any>>(initialValues: T) {
  const [fields, setFields] = useState<T>(initialValues);

  function handleFieldChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    let fieldValue: any = value;
    if (type === 'checkbox' && 'checked' in e.target) {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setFields(prev => ({
      ...prev,
      [name]: fieldValue,
    }));
  }

  return [fields, handleFieldChange, setFields] as const;
}
