import React from 'react';
import { CustomizedTable } from '../../modules';

const encodedData = [
  { id: 1, name: 'Exterior', createdAt: '2023-08-15' },
  { id: 2, name: 'Interior', createdAt: '2023-08-16' },
  { id: 3, name: 'Piso', createdAt: '2023-08-17' },
  { id: 4, name: 'Metal', createdAt: '2023-09-05' },
  { id: 5, name: 'Madera', createdAt: '2023-09-06' },
  { id: 6, name: 'Azulejos', createdAt: '2023-09-07' },
];

const MacroCategories = () => (
  <CustomizedTable
    data={encodedData}
    refreshData
    isLoading={false}
    tableTitle='Categorías'
    entity='category'
  />
);

export default MacroCategories;
