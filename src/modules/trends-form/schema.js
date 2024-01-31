import * as yup from 'yup';

const schema = yup.object({
  trendName: yup
    .string()
    .required('Debe ingresar nombre de Tendencia')
    .required(),
  trendDescription: yup
    .string()
    .required('Debe ingresar descripición para la tendencia')
    .required(),
});

export default schema;
