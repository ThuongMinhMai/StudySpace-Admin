import { ConfigProvider, List, Modal } from 'antd'
import React, { useEffect, useState } from 'react'

import { Badge } from '../atoms/ui/badge'

interface AmentiModalProps {
  visible: boolean
  onOk: () => void
  room: Room | null
  onAddAmenti: () => void
  onUpdateAmenti: (updatedAmenti: any) => void
}
interface Amenity {
  id: number
  name: string
  type: string
  status: boolean
  quantity: number
  description: string
}

interface Room {
  roomId: number
  roomName: string
  storeName: string
  capacity: number
  pricePerHour: number
  description: string
  status: boolean
  area: number
  type: string
  image: string
  address: string
  amitiesInRoom: Amenity[]
}
export const ServiceModal: React.FC<AmentiModalProps> = ({ visible, onOk, room, onAddAmenti, onUpdateAmenti }) => {
  const [updatedAmentiRoom, setUpdatedAmentiRoom] = useState<Room | null>(room) // Local state for updated station data

  useEffect(() => {
    setUpdatedAmentiRoom(room)
  }, [room])

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F97316'
        },
        components: {
          Button: {
            colorTextLightSolid: '#fff'
          }
        }
      }}
    >
      <Modal title='Thông tin tiện ích' visible={visible} onOk={onOk} onCancel={onOk} footer={null}>
        <div className='p-4 h-[500px] overflow-y-auto'>
          <h2 className='text-lg font-semibold mb-2'>
            <span className='text-primary'>{room?.roomName}</span>
          </h2>
          <div className='mt-4 flex justify-between'></div>
          {updatedAmentiRoom?.amitiesInRoom.length ? (
            <List
              dataSource={updatedAmentiRoom.amitiesInRoom}
              renderItem={(amenti) => (
                <div className='border-b border-gray-300 py-4 flex flex-col hover:bg-gray-50 transition duration-150 ease-in-out rounded-lg p-4'>
                  <div className='flex justify-between items-center mb-2'>
                    <h4 className='font-semibold text-lg text-gray-800'>{amenti.name}</h4>
                    <Badge variant={amenti.status ? 'success' : 'destructive'} className='text-xs px-2 py-1'>
                      {amenti.status ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                  </div>
                  <p className='text-sm text-gray-500 mb-1'>
                    Loại: <span className='text-primary font-medium'>{amenti.type}</span>
                  </p>
                  <p className='text-sm text-gray-600 mb-1'>
                    Số lượng: <span className='text-black font-medium'>{amenti.quantity}</span>
                  </p>
                  <p className='text-md'>{amenti.description}</p>
                </div>
              )}
            />
          ) : (
            <p>Không có tiện nghi nào.</p>
          )}
        </div>
      </Modal>
    </ConfigProvider>
  )
}
