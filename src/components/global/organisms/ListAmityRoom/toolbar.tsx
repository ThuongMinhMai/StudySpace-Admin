'use client'

import { Button } from '@/components/global/atoms/ui/button'
import { Input } from '@/components/global/atoms/ui/input'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { DataTableFacetedFilter } from '../table/faceted-filter'
import { DataTableViewOptions } from '../table/view-options'

export function DataTableToolbar<TData>({ table }: { table: Table<TData> }) {
  const isFiltered = table.getState().columnFilters.length > 0

  const uniqueAmytiType = Array.from(table.getColumn('amityType')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )

  const uniqueStatus = Array.from(table.getColumn('amityStatus')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )

  return (
    <div className='ml-2 mb-2 flex justify-between'>
      <div className='flex space-x-2 '>
        <Input
          placeholder='Tìm tên tiện ích... '
          value={(table.getColumn('amityName')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('amityName')?.setFilterValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />

        <DataTableFacetedFilter column={table.getColumn('amityType')} title='Loại tiện ích' options={uniqueAmytiType} />

        <DataTableFacetedFilter column={table.getColumn('amityStatus')} title='Trạng thái' options={uniqueStatus} />

        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
            Reset
            <Cross2Icon className='ml-2 size-4' />
          </Button>
        )}
      </div>
      <div>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
