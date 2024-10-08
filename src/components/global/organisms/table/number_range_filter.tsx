import React, { useState } from 'react'
import { Button } from '@/components/global/atoms/ui/button'
import { Input } from '@/components/global/atoms/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/global/atoms/ui/popover'
import { Slider } from '@/components/global/atoms/ui/slider' // Adjust the import path for Slider if needed
import { Separator } from '../../atoms/ui/separator'

interface NumberRangeFilterProps {
  column: any // Replace with the actual type for your column
  title: string
  resetTrigger: number
  options?: string[] // Add options prop
}

export const NumberRangeFilter: React.FC<NumberRangeFilterProps> = ({
  column,
  title,
  resetTrigger,
  options = [] // Default to an empty array if no options are provided
}) => {
  const [minValue, setMinValue] = useState<number>(0)
  const [maxValue, setMaxValue] = useState<number>(100) // Set default values
  const [isFiltered, setIsFiltered] = useState<boolean>(false)
  const handleApplyFilter = () => {
    column.setFilterValue({ min: minValue, max: maxValue })
    setIsFiltered(true)
  }

  const handleReset = () => {
    setMinValue(0)
    setMaxValue(100) // Reset to default values
    column.setFilterValue(undefined) // Reset filter
    setIsFiltered(false)
  }
  React.useEffect(() => {
    setIsFiltered(false)

}, [resetTrigger])
  return (
    <div className='flex flex-col '>
      <Popover>
        <PopoverTrigger>
          <Button variant='outline' size='sm' className='h-8 border-dashed rounded-md '>
            {title}

            {isFiltered && (
              <>
                <Separator orientation='vertical' className='mx-2 h-4' />
                {`${minValue}-${maxValue}`} {/* Display min-max only if filtered */}
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px]' align='start'>
          <div className='flex flex-col'>
            <Slider
              value={[minValue, maxValue]}
              min={0}
              max={100} // Set max value based on your data
              onValueChange={(value) => {
                setMinValue(value[0])
                setMaxValue(value[1])
              }}
              className='my-4'
            />
            <div className='flex justify-between mb-2 gap-2'>
              <Input
                type='number'
                placeholder='Min'
                value={minValue}
                onChange={(e) => setMinValue(Number(e.target.value))}
                className='h-8 '
              />
              <Input
                type='number'
                placeholder='Max'
                value={maxValue}
                onChange={(e) => setMaxValue(Number(e.target.value))}
                className='h-8'
              />
            </div>
            <hr className='my-2 ' />
            <div className='flex  items-center justify-between'>
              <Button onClick={handleApplyFilter} variant='default' className='h-8 border-dashed '>
                Apply
              </Button>
              <Button onClick={handleReset} variant='outline' className='h-8 border-dashed '>
                Clear
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
