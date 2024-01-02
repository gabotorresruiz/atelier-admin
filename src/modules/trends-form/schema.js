import * as yup from 'yup';

const schema = yup.object({
  trendName: yup
    .string()
    .required('Debe ingresar nombre de Tendencia')
    .required(),
});

export default schema;
