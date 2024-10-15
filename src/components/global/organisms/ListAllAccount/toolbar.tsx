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

export function DataTableToolbar<TData>({ table }: { table: Table<TData> }) {
  const isFiltered = table.getState().columnFilters.length > 0

  const uniqueRole = Array.from(table.getColumn('roleName')?.getFacetedUniqueValues()?.entries() || []).map(
    ([key]) => key
  )
 

  // const uniqueStatus = Array.from(table.getColumn('status')?.getFacetedUniqueValues()?.entries() || []).map(
  //   ([key]) => key
  // )
  const uniqueStatus = Array.from(table.getColumn('isActive')?.getFacetedUniqueValues()?.entries() || []).map(([key]) => {
    return {
      value: key,
      label: key ? 'Hoạt động' : 'Không hoạt động'
    }
  })
  const resetTrigger = table.getState().columnFilters.length
  return (
    <div className='ml-2 mb-2 flex justify-between'>
      <div className='flex space-x-2 '>
        <Input
          placeholder='Tìm tên tài khoản... '
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />

        <DataTableFacetedFilter column={table.getColumn('roleName')} title='Vai trò' options={uniqueRole} />
     

        <DataTableFacetedFilter column={table.getColumn('isActive')} title='Trạng thái' options={uniqueStatus} />

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
