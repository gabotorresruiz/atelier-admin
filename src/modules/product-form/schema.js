import * as yup from 'yup';

const schema = yup.object({
  productName: yup.string().required('Debe ingresar del producto').required(),
  subCategories: yup
    .array()
    .min(1, 'Debe seleccionar al menos una subcategoría')
    .required('Debe seleccionar al menos una subcategoría'),
});

export default schema;
