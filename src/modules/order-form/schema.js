import * as yup from 'yup';

const schema = yup.object({
  status: yup.string().required('Debe ingresar un status'),
});

export default schema;
