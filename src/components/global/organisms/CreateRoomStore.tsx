import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../atoms/ui/button'
import { ArrowLeft } from 'lucide-react'

function CreateRoomStore() {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1) // Navigate to the previous page
  }
  return (
    <div>
      <div>CreateRoomStore</div>
      <Button variant='ghost' onClick={handleGoBack}>
        <ArrowLeft className='w-8 h-8 text-primary' />
      </Button>
    </div>
  )
}

export default CreateRoomStore
