import React from 'react';
import { CustomizedTable } from '../../modules';

const encodedData = [
  { id: 1, name: 'Sub categoría 1', createdAt: '2023-08-15' },
  { id: 2, name: 'Sub categoría 2', createdAt: '2023-08-16' },
  { id: 3, name: 'Sub categoría 3', createdAt: '2023-08-17' },
];

const SubCategories = () => (
  <CustomizedTable
    data={encodedData}
    refreshData
    isLoading={false}
    tableTitle='Sub Categorías'
    entity='sub-category'
  />
);

export default SubCategories;
