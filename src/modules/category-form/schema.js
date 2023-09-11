import * as yup from 'yup';

const schema = yup.object({
  categoryName: yup
    .string()
    .required('Debe ingresar el nombre de la Categoría')
    .required(),
});

export default schema;
