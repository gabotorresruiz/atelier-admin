import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().required('Debe ingresar el nombre del Color').required(),
});

export default schema;
