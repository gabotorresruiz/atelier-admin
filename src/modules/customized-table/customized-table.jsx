import React from 'react';
import { Table } from '../../components';

const baseColumns = [
  {
    id: 'name',
    label: 'Nombre',
    type: 'text',
  },
  {
    id: 'createdAt',
    label: 'Creado',
    type: 'date',
  },
];

const CustomizedTable = ({
  refreshData,
  isLoading,
  data = [],
  tableTitle,
  entity,
  enableUpload = false,
  enableOnlyUpload = false,
  headColumns = baseColumns,
}) => (
  <Table
    entity={entity}
    data={data}
    headColumns={headColumns}
    isLoading={isLoading}
    refreshData={refreshData}
    tableTitle={tableTitle}
    enableUpload={enableUpload}
    enableOnlyUpload={enableOnlyUpload}
  />
);

export default CustomizedTable;
