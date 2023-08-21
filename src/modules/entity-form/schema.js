import * as yup from 'yup';

const schema = yup.object({
  entityName: yup.string().required('Debe ingresar un nombre').required(),
});

export default schema;
