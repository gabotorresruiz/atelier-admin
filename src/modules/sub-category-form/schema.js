import * as yup from 'yup';

const schema = yup.object({
  subCategoryName: yup
    .string()
    .required('Debe ingresar el nombre de la Subcategoría')
    .required(),
  categories: yup
    .array()
    .min(1, 'Debe seleccionar al menos una categoría')
    .required('Debe seleccionar al menos una categoría'),
});

export default schema;
