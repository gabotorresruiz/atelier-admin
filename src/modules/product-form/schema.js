import * as yup from 'yup';

const schema = yup.lazy(values =>
  yup.object(
    Object.keys(values).reduce(
      (shape, key) => {
        const newShape = { ...shape };
        if (key.startsWith('price_')) {
          newShape[key] = yup
            .number()
            .typeError('Debe ingresar un número válido para el precio')
            .required('Debe ingresar un precio base')
            .positive('Precio debe ser un número positivo');
        }
        return newShape;
      },
      {
        productName: yup
          .string()
          .required('Debe ingresar el nombre del producto'),
        productDescription: yup
          .string()
          .required('Debe ingresar descripición del producto')
          .required(),
        productCode: yup
          .string()
          .required('Debe ingresar el código del producto'),
        productPrice: yup
          .number()
          .transform(value => (Number.isNaN(value) ? null : value))
          .typeError('El precio debe ser un número')
          .nullable(),
        subCategories: yup
          .array()
          .min(1, 'Debe seleccionar al menos una subcategoría')
          .required('Debe seleccionar al menos una subcategoría'),
        sizes: yup.array().min(1, 'Debe seleccionar al menos una capacidad'),
      },
    ),
  ),
);

export default schema;
