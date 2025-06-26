'use client';

import { NumberFormat } from '@/lib/number';
import { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo } from 'react';
import Table from '../common/table';

export const TableFuelOut = ({
  data,
  tableName,
}: {
  data: any;
  tableName?: string;
}) => {
  const columns = useMemo<MRT_ColumnDef<FuelOutRow>[]>(
    () => [
      {
        accessorKey: 'unit',
        header: 'Unit',
        size: 120,
      },
      {
        accessorKey: 'qty',
        header: 'Qty (Liter)',
        size: 140,
        Cell: ({ row }) => (
          <div className="text-end">{NumberFormat.no(row.original.qty)}</div>
        ),
      },
      {
        accessorKey: 'remainingEstimate',
        header: 'Remaining (Liter) est',
        Cell: ({ row }) => (
          <div className="text-end">
            {NumberFormat.no(row.original.remainingEstimate)}
          </div>
        ),
      },
      {
        accessorKey: 'hm',
        header: 'HM',
        size: 120,
        Cell: ({ row }) => (
          <div className="text-end">{NumberFormat.no(row.original.hm)}</div>
        ),
      },
      {
        accessorKey: 'time',
        header: 'Time',
        size: 120,
        Cell: ({ row }) => <div className="text-end">{row.original.time}</div>,
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
