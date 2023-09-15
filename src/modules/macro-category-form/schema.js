import * as yup from 'yup';

const schema = yup.object({
  macroCategoryName: yup
    .string()
    .required('Debe ingresar un nombre')
    .required(),
});

export default schema;
