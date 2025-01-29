import { useState } from 'react';
import { DispatchFormData } from '@/types/dispatch';
import { validateDispatchForm, ValidationError } from '@/utils/dispatchValidation';
import { DispatchService } from '@/services/dispatchService';
import { useNavigate } from 'react-router-dom';

export function useDispatchForm() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (data: DispatchFormData) => {
    setLoading(true);
    setErrors([]);

    const validationErrors = validateDispatchForm(data);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    const result = await DispatchService.createDispatch(data);
    setLoading(false);

    if (result) {
      navigate('/dispatch/' + result.id);
    }
  };

  return {
    loading,
    errors,
    handleSubmit
  };
}