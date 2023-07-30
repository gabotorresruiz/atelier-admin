import * as yup from 'yup';

const schema = yup
  .object({
    email: yup
      .string()
      .required('Debe ingresar un email')
      .email('Debe ingresar un email válido'),
    password: yup
      .string()
      .required('Debe ingresar una contraseña')
      .min(8, `La contraseña debe tener 8 caractéres como mínimo`),
  })
  .required();

export default schema;
