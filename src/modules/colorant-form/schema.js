import * as yup from 'yup';

const schema = yup.object({
  colorantName: yup
    .string()
    .required('Debe ingresar el nombre del colorante')
    .required(),
  price: yup
    .number()
    .required('Debe ingresar el precio del colorante')
    .required(),
});

export default schema;
