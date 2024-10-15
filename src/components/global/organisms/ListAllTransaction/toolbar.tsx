'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

// import { RoleGate } from '@/auth/role-gate'
// import { AddUser } from '@/components/common/modal/add-user'
import { DataTableFacetedFilter } from '../table/faceted-filter'
import { DataTableViewOptions } from '../table/view-options'
import { Button } from '@/components/global/atoms/ui/button'
import { Input } from '@/components/global/atoms/ui/input'
import { DateRangeFilter } from '../table/date-range-filter'

export function DataTableToolbar<TData>({ table }: { table: Table<TData> }) {
  const isFiltered = table.getState().columnFilters.length > 0

  
  const uniqueType = Array.from(table.getColumn('type')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
  const uniqueMethod = Array.from(table.getColumn('paymentMethod')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
  const uniqueDate = Array.from(table.getColumn('date')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
 
  const uniqueStatus = Array.from(table.getColumn('status')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
  const resetTrigger = table.getState().columnFilters.length


  return (
    <div className='ml-2 mb-2 flex justify-between'>
      <div className='flex space-x-2 '>
        <Input
          placeholder='Tìm tên người giao dịch... '
          value={(table.getColumn('userName')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('userName')?.setFilterValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />

       
        <DataTableFacetedFilter
          column={table.getColumn('type')}
          title='Loại giao dịch'
          options={uniqueType}
        />
        <DataTableFacetedFilter
          column={table.getColumn('paymentMethod')}
          title='Phương thức thanh toán'
          options={uniqueMethod}
        />
     <DateRangeFilter
          column={table.getColumn('date')}
          title='Ngày giao dịch'
          options={uniqueDate}
          resetTrigger={resetTrigger}
        />
        <DataTableFacetedFilter column={table.getColumn('status')} title='Trạng thái' options={uniqueStatus} />

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
