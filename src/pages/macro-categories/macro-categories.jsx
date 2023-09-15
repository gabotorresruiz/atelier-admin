import React from 'react';
import { CustomizedTable } from '../../modules';

const encodedData = [
  { id: 1, name: 'Superficie', createdAt: '2023-08-15' },
  { id: 2, name: 'Tipo', createdAt: '2023-08-16' },
  { id: 3, name: 'Utilidad', createdAt: '2023-08-17' },
];

const MacroCategories = () => (
  <CustomizedTable
    data={encodedData}
    refreshData
    isLoading={false}
    tableTitle='Macro Categorías'
    entity='macro-category'
  />
);

export default MacroCategories;
