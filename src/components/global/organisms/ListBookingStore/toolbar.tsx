'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

// import { RoleGate } from '@/auth/role-gate'
// import { AddUser } from '@/components/common/modal/add-user'
import { DataTableFacetedFilter } from '../table/faceted-filter'
import { DataTableViewOptions } from '../table/view-options'
import { Button } from '@/components/global/atoms/ui/button'
import { Input } from '@/components/global/atoms/ui/input'
import { NumberRangeFilter } from '../table/number_range_filter'
import { DateRangeFilter } from '../table/date-range-filter'

export function DataTableToolbar<TData>({ table }: { table: Table<TData> }) {
  const isFiltered = table.getState().columnFilters.length > 0

  const uniqueRoomType = Array.from(table.getColumn('roomType')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
  const uniqueSpaceType = Array.from(table.getColumn('spaceType')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
  const uniqueBookedDate = Array.from(table.getColumn('bookedDate')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
  const uniqueCheckin = Array.from(table.getColumn('checkin')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => (key ? 'Đã check in' : 'Chưa check in')
  )
  const uniqueStatus = Array.from(table.getColumn('status')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )

  const resetTrigger = table.getState().columnFilters.length
  return (
    <div className='ml-2 mb-2 flex justify-between'>
      <div className='flex space-x-2 '>
        <Input
          placeholder='Tìm tên người đặt... '
          value={(table.getColumn('userName')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('userName')?.setFilterValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />

        
        <DataTableFacetedFilter column={table.getColumn('status')} title='Trạng thái' options={uniqueStatus} />
        <DataTableFacetedFilter column={table.getColumn('checkin')} title='Checkin' options={uniqueCheckin} />
        <DataTableFacetedFilter column={table.getColumn('roomType')} title='Loại phòng' options={uniqueRoomType} />
        <DataTableFacetedFilter
          column={table.getColumn('spaceType')}
          title='Loại không gian'
          options={uniqueSpaceType}
        />
        <DateRangeFilter
          column={table.getColumn('bookedDate')}
          title='Ngày đặt'
          options={uniqueBookedDate}
          resetTrigger={resetTrigger}
        />
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
