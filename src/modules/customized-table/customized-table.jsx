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
  enableOnlyUpload = false,
  enableDelete = true,
  headColumns = baseColumns,
}) => (
  <Table
    entity={entity}
    data={data}
    headColumns={headColumns}
    isLoading={isLoading}
    refreshData={refreshData}
    tableTitle={tableTitle}
    enableOnlyUpload={enableOnlyUpload}
    enableDelete={enableDelete}
  />
);

export default CustomizedTable;
