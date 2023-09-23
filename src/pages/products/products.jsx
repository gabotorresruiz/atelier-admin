import React from 'react';
import { CustomizedTable } from '../../modules';

const encodedData = [
  { id: 1, name: 'Pintura', createdAt: '2023-09-15' },
  { id: 2, name: 'Pincel', createdAt: '2023-09-16' },
  { id: 3, name: 'Base removedora', createdAt: '2023-09-20' },
];

const Products = () => (
  <CustomizedTable
    data={encodedData}
    refreshData
    isLoading={false}
    tableTitle='Productos'
    entity='product'
  />
);

export default Products;
