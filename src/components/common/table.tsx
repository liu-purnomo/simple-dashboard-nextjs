import { MantineProvider, useMantineTheme } from '@mantine/core';
import {
  MRT_ColumnDef,
  MRT_GlobalFilterTextInput,
  MRT_ShowHideColumnsButton,
  MRT_TableOptions,
  MRT_ToggleFiltersButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  MantineReactTable,
  useMantineReactTable,
} from 'mantine-react-table';
import { BsTrash } from 'react-icons/bs';

type TableOptions = Omit<MRT_TableOptions<any>, 'data' | 'columns'>;

export default function Table({
  columns,
  data,
  tableOptions,
  deleteAction,
  customButton,
  customLeftButton,
  tableName,
  rowClickAction,
}: {
  columns: MRT_ColumnDef<any>[];
  data: any[];
  tableOptions?: TableOptions;
  deleteAction?: (payload: string[]) => Promise<void>;
  customButton?: React.ReactNode;
  customLeftButton?: React.ReactNode;
  tableName?: string;
  rowClickAction?: (row: any) => void;
}) {
  const globalTheme = useMantineTheme();
  const isDark = false;

  const table = useMantineReactTable({
    columns,
    data: data ? data : [],
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableRowSelection: false,
    paginationDisplayMode: 'pages',
    mantineTableBodyRowProps: (props) => {
      if (rowClickAction) {
        return {
          sx: {
            cursor: 'pointer',
          },
          onClick: () => rowClickAction(props.row),
        };
      }
      return {
        sx: {
          cursor: 'default',
        },
      };
    },
    enablePinning: true,
    mantinePaginationProps: {
      radius: 'xl',
      size: 'md',
    },
    initialState: {
      showGlobalFilter: true,
    },
    mantineSearchTextInputProps: {
      placeholder: 'Search...',
    },

    renderTopToolbar: ({ table }) => {
      async function handleDelete() {
        try {
          const payload = table
            .getSelectedRowModel()
            .flatRows.map((row) => row.original.id);
          if (deleteAction) {
            await deleteAction(payload);
            table.resetRowSelection();
          }
        } catch (error) {
          // console.log(error);
        }
      }

      return (
        <div className="flex justify-between py-2 bg-white dark:bg-black border-b">
          <div>
            <div className="ms-4 flex items-center gap-2">
              {customLeftButton}
              {tableName && (
                <div className="text-lg pt-1 font-bold">{tableName}</div>
              )}
              {table.getIsSomeRowsSelected() || table.getIsAllRowsSelected() ? (
                <button
                  onClick={handleDelete}
                  type="button"
                  className="btn btn-danger gap-1 btn-sm shadow-none"
                >
                  <BsTrash size={18} />
                  {table.getSelectedRowModel().rows.length}
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex justify-between items-center me-2">
            <MRT_GlobalFilterTextInput table={table} />
            <MRT_ToggleGlobalFilterButton table={table} />
            <MRT_ToggleFiltersButton table={table} />
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_ToggleFullScreenButton table={table} />
            {customButton}
          </div>
        </div>
      );
    },

    ...tableOptions,
  });

  return (
    <MantineProvider
      theme={{
        ...globalTheme,
        colorScheme: isDark ? 'dark' : 'light',
      }}
    >
      <MantineReactTable table={table} />
    </MantineProvider>
  );
}
