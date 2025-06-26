'use client';

import { NumberFormat } from '@/lib/number';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo } from 'react';
import Table from '../common/table';

export const TableMaintenance = ({
  data,
  tableName,
}: {
  data: any;
  tableName?: string;
}) => {
  const columns = useMemo<MRT_ColumnDef<PlantSummary>[]>(
    () => [
      {
        accessorKey: 'unit',
        header: 'Unit',
        size: 120,
      },
      {
        accessorKey: 'problem',
        header: 'Problem',
      },
      {
        accessorKey: 'type',
        header: 'Type',
        size: 120,
      },
      {
        accessorKey: 'hm',
        header: 'HM',
        size: 120,
        Cell: ({ row }) => (
          <div className="text-end">
            {NumberFormat.no(row.original.hm ?? '0')}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
      },
    ],
    [],
  );

  return (
    <Table
      columns={columns as any}
      tableName={`Table ${tableName ?? ''}`}
      data={data || []}
      tableOptions={{
        initialState: {
          showGlobalFilter: false,
        },
      }}
      rowClickAction={(row) => console.log(row.original)}
    />
  );
};
