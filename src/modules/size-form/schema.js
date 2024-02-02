import * as yup from 'yup';

const schema = yup.object({
  quantity: yup
    .string()
    .required('Debe ingresar una capacidad')
    .test(
      'is-decimal',
      'Ingrese un número válido expresado en litros',
      value => {
        if (!value) return false;

        // Checks if the value is a decimal number or an integer
        const regex = /^\d+(\.\d{1})?$/;
        return regex.test(value);
      },
    ),
});

export default schema;
