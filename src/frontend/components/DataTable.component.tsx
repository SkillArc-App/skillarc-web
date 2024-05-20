import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons'
import {
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  chakra,
} from '@chakra-ui/react'
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  RowData,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'

export interface DataTableProps<TData extends RowData> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  initialSortState?: SortingState
}

function Filter<TData extends RowData>({ column }: { column: Column<TData, unknown> }) {
  const columnFilterValue = column.getFilterValue()

  return (
    <Input
      className="w-36 border shadow rounded"
      onChange={(value) => column.setFilterValue(value.target.value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
  )
}

export default function DataTable<TData extends RowData>({
  data,
  columns,
  initialSortState = [],
}: DataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>(initialSortState)
  const defaultedColumns = React.useMemo(
    () =>
      columns.map((column) => {
        let enableColumnFilter = column.enableColumnFilter

        if (enableColumnFilter == undefined) {
          if (!column.filterFn) {
            enableColumnFilter = false
          }
        }

        return {
          ...column,
          enableColumnFilter,
        }
      }),
    [columns],
  )

  const table = useReactTable({
    columns: defaultedColumns,
    data,
    filterFns: {},
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <TableContainer bg="white" width="100%" overflowY={'scroll'}>
      <Table variant={'simple'} size={'sm'}>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}

                    <chakra.span pl="4">
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'desc' ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </chakra.span>
                    <VStack>
                      {header.column.getCanFilter() ? <Filter column={header.column} /> : null}
                    </VStack>
                  </Th>
                )
              })}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => (
            <Tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                )
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
