import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Debe ingresar el nombre de la Marca').required(),
  title: yup.string().required('Debe ingresar un título').required(),
  subtitle: yup.string(),
  email: yup
    .string()
    .required('Debe ingresar un email')
    .email('Debe ingresar un email válido'),
  address: yup.string().required('Debe ingresar una dirección').required(),
  phone: yup
    .string()
    .typeError('Debe ingresar un número válido')
    .required('Debe ingresar un celular de contacto'),
});

export default schema;
