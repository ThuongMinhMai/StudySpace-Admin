import React, { useEffect, useRef, useState } from 'react'
import {
  Modal,
  Button,
  List,
  ConfigProvider,
  Tooltip,
  Space,
  Select,
  InputRef,
  Divider,
  Input,
  message,
  Form,
  Upload,
  Image
} from 'antd'
import { Edit2, Pen, PenBox, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { EditServiceModal } from './EditServiceModal'
import { UploadOutlined } from '@ant-design/icons'

import studySpaceAPI from '@/lib/studySpaceAPI'
import { Badge } from '../atoms/ui/badge'
// interface Service {
//   Service_StationID: string
//   ServiceID: string
//   Price: number
//   Name: string
//   ImageUrl: string
// }

// // Define the interface for the ServiceType
// interface ServiceType {
//   ServiceTypeID: string
//   ServiceTypeName: string
//   ServiceInStation: Service[]
// }

// // Define the interface for the Station
// interface Station {
//   StationID: string
//   CityID: string
//   CityName: string
//   StationName: string
//   Status: string
//   ServiceTypeInStation: ServiceType[]
// }
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
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [currentAmenti, setCurrentAmenti] = useState<Amenity | null>(null)
  const [updatedAmentiRoom, setUpdatedAmentiRoom] = useState<Room | null>(room) // Local state for updated station data
  const showEditModal = (amenti: Amenity) => {
    setCurrentAmenti(amenti)
    setEditModalVisible(true)
  }

  const hideEditModal = () => {
    setEditModalVisible(false)
    setCurrentAmenti(null) // Clear current service on close
  }
  useEffect(() => {
    setUpdatedAmentiRoom(room)
  }, [room])
  // const handleServiceUpdate = (updateAmenti: Amenity) => {
  //   if (updatedAmentiRoom) {
  //     const updatedServiceTypes = updatedServiceStation.ServiceTypeInStation.map((serviceType) => ({
  //       ...serviceType,
  //       ServiceInStation: serviceType.ServiceInStation.map((service) =>
  //         service.ServiceID === updatedService.ServiceID ? updatedService : service
  //       )
  //     }))
  //     // console.log('cps update', updatedServiceTypes)

  //     setUpdatedServiceStation({
  //       ...updatedServiceStation,
  //       ServiceTypeInStation: updatedServiceTypes
  //     })
  //     // onUpdateService(updatedServiceStation)
  //     onUpdateService({
  //       ...updatedServiceStation,
  //       ServiceTypeInStation: updatedServiceTypes
  //     })
  //   }
  //   hideEditModal() // Close the modal
  // }
  // console.log('After update:', updatedServiceStation)
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
          <div className='mt-4 flex justify-between'>
            {/* <p className='mb-2 font-medium'>Cơ sở vật chất hiện có:</p> */}
            {/* <Button type='primary' className='bg-primary' onClick={onAddAmenti}>
              <Plus />
              Thêm dịch vụ
            </Button> */}
          </div>
          {updatedAmentiRoom?.amitiesInRoom.length ? (
           <List
           dataSource={updatedAmentiRoom.amitiesInRoom}
           renderItem={(amenti) => (
             <div className="border-b border-gray-300 py-4 flex flex-col hover:bg-gray-50 transition duration-150 ease-in-out rounded-lg p-4">
               <div className="flex justify-between items-center mb-2">
                 <h4 className="font-semibold text-lg text-gray-800">{amenti.name}</h4>
                 <Badge variant={amenti.status ? 'success' : 'destructive'} className="text-xs px-2 py-1">
                   {amenti.status ? 'Hoạt động' : 'Không hoạt động'}
                 </Badge>
               </div>
               <p className="text-sm text-gray-500 mb-1">Loại: <span className='text-primary font-medium'>{amenti.type}</span></p>
               <p className="text-sm text-gray-600 mb-1">Số lượng: <span className='text-black font-medium'>{amenti.quantity}</span></p>
               <p className="text-md">{amenti.description}</p>
             </div>
           )}
         />
          ) : (
            <p>Không có tiện nghi nào.</p>
          )}
        </div>
      </Modal>
      {/* <EditServiceModal
        visible={isEditModalVisible}
        onOk={hideEditModal}
        service={currentService}
        onUpdate={handleServiceUpdate}
      /> */}
    </ConfigProvider>
  )
}

interface AddAmentiModalProps {
  visible: boolean
  onOk: () => void
}

// export const AddServiceModal: React.FC<AddAmentiModalProps> = ({ visible, onOk }) => {
//   const [items, setItems] = useState<{ label: string; value: string }[]>([])
//   const [name, setName] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [selectedValues, setSelectedValues] = useState<string[]>([])
//   const [showForm, setShowForm] = useState(false)
//   const inputRef = useRef<InputRef>(null)
//   const [fileLists, setFileLists] = useState<{ [key: string]: any[] }>({})
//   const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({})
//   const [selectedTypeIDs, setSelectedTypeIDs] = useState<{ [key: string]: string }>({}) // New state for selected type IDs
//   const [options, setOptions] = useState([]);
//   const fetchItems = async () => {
//     try {
//       const response = await studySpaceAPI.get('service-management/managed-services')
//       const flattenedItems = response.data.flatMap((serviceType: any) =>
//         serviceType.Services.map((service: any) => ({
//           label: service.ServiceName,
//           value: service.ServiceID
//         }))
//       )
//       setItems(flattenedItems)
//       setLoading(false)
//     } catch (err: any) {
//       message.error('Failed to fetch services')
//       setLoading(false)
//     }
//   }
//     const fetchOptions = async () => {
//       try {
//         const response = await studySpaceAPI.get('service-management/managed-service/types'); // Replace with your API endpoint
//         setOptions(response.data);
//       } catch (error) {
//         message.error('Failed to load options');
//         console.error('Failed to load options:', error);
//       }
//     };

//   useEffect(() => {
//     fetchItems()
//     fetchOptions();
//   }, [])

//   const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setName(event.target.value)
//   }

//   const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
//     e.preventDefault()
//     if (name) {
//       const exists = items.some((item) => item.label === name || item.value === name)
//       if (exists) {
//         message.warning(`${name} đã tồn tại trong list!`)
//         return
//       }
//       const newItem = { label: name, value: name }
//       setItems([...items, newItem])
//       setName('')
//       setTimeout(() => {
//         inputRef.current?.focus()
//       }, 0)
//     }
//   }

//   const handleChange = (value: string[]) => {
//     setSelectedValues(value)
//   }

//   const handleContinue = () => {
//     if (selectedValues.length > 0) {
//       setShowForm(true)
//     } else {
//       message.warning('Please select at least one service.')
//     }
//   }

//   const handleUploadChange = (info: any, serviceID: string) => {
//     if (info.fileList.length > 0) {
//       const file = info.fileList[0].originFileObj
//       if (file) {
//         const reader = new FileReader()
//         reader.onloadend = () => {
//           setImagePreviews((prev) => ({
//             ...prev,
//             [serviceID]: reader.result as string
//           }))
//         }
//         reader.readAsDataURL(file)
//       }
//     }
//   }
//   const handleFormFinish = async (values: any) => {
//     console.log('Submitted values:', values)
//     onOk() // Close the modal after handling the submission
//   }

//   const handleClose = () => {
//     setName('')
//     setSelectedValues([])
//     setShowForm(false)
//     setFileLists({})
//     setImagePreviews({})
//     onOk() // Call the onOk function
//   }
//   const handleTypeIDChange = (value: string, itemValue: string) => {
//     setSelectedTypeIDs((prev) => ({
//       ...prev,
//       [itemValue]: value
//     }))
//   }

//   // console.log('anh', imagePreviews)
//   return (
//     <ConfigProvider
//       theme={{
//         token: {
//           colorPrimary: '#F97316'
//         },
//         components: {
//           Button: {
//             colorTextLightSolid: '#fff'
//           }
//         }
//       }}
//     >
//       <Modal title='Thêm dịch vụ' visible={visible} onOk={handleClose} onCancel={handleClose}>
//         {!showForm ? (
//           <Space style={{ width: '100%' }} direction='vertical'>
//             <Select
//               mode='multiple'
//               allowClear
//               style={{ width: '100%' }}
//               placeholder='Please select'
//               onChange={handleChange}
//               value={selectedValues}
//               dropdownRender={(menu) => (
//                 <>
//                   {menu}
//                   <Divider style={{ margin: '8px 0' }} />
//                   <Space style={{ padding: '0 8px 4px' }}>
//                     <Input
//                       placeholder='Please enter item'
//                       ref={inputRef}
//                       value={name}
//                       onChange={onNameChange}
//                       onKeyDown={(e) => e.stopPropagation()}
//                     />
//                     <Select
//                       placeholder='Select Type ID'
//                       onChange={(value) => handleTypeIDChange(value, name)}
//                       style={{ width: '150px', marginLeft: '8px' }}
//                       onMouseDown={(e) => e.stopPropagation()}
//                     >
//                       {options.map((option) => (
//                         <Select.Option key={option.ServiceTypeID} value={option.ServiceTypeID}>
//                           {option.Name}
//                         </Select.Option>
//                       ))}
//                     </Select>
//                     <Button type='text' onClick={addItem}>
//                       Add item
//                     </Button>
//                   </Space>
//                 </>
//               )}
//               options={items}
//             />
//             <Button type='primary' onClick={handleContinue}>
//               Continue
//             </Button>
//           </Space>
//         ) : (
//           <Form onFinish={handleFormFinish} className='h-[460px] overflow-y-auto'>
//             <Space direction='vertical' style={{ width: '100%' }}>
//               {selectedValues.map((serviceID) => {
//                 const selectedService = items.find((item) => item.value === serviceID)
//                 return (
//                   <div key={serviceID}>
//                     <h4>{selectedService?.label || serviceID}</h4>
//                     {selectedTypeIDs[serviceID] && (
//                       <Form.Item
//                         name={[serviceID, 'serviceId']} // Use 'serviceId' as the key for ServiceID
//                         label='Service ID'
//                         initialValue={selectedTypeIDs[serviceID]} // Pre-fill with the selected Type ID
//                         rules={[{ required: true, message: 'Please enter a Service ID' }]}
//                       >
//                         <Input placeholder='Enter Service ID' />
//                       </Form.Item>
//                     )}
//                     <Form.Item
//                       name={[serviceID, 'price']}
//                       label='Price'
//                       rules={[
//                         {
//                           required: true,
//                           type: 'number',
//                           message: 'Please enter a valid price',
//                           transform: (value) => (value ? parseFloat(value) : NaN),
//                           validator: (_, value) => {
//                             if (value && value >= 1) {
//                               return Promise.resolve()
//                             }
//                             return Promise.reject(new Error('Price must be greater than or equal to 1'))
//                           }
//                         }
//                       ]}
//                     >
//                       <Input placeholder='Enter price' type='number' />
//                     </Form.Item>
//                     <Form.Item
//                       name={[serviceID, 'image']}
//                       label='Image'
//                       valuePropName='fileList'
//                       getValueFromEvent={({ fileList }) => fileList}
//                       rules={[{ required: true, message: 'Please upload an image' }]}
//                     >
//                       <Upload
//                         listType='picture'
//                         beforeUpload={() => false}
//                         maxCount={1}
//                         onChange={(info) => handleUploadChange(info, serviceID)}
//                       >
//                         <Button icon={<UploadOutlined />}>Upload Image</Button>
//                       </Upload>
//                     </Form.Item>
//                   </div>
//                 )
//               })}
//               <Form.Item>
//                 <Button type='primary' htmlType='submit'>
//                   Submit
//                 </Button>
//               </Form.Item>
//             </Space>
//           </Form>
//         )}
//       </Modal>
//     </ConfigProvider>
//   )
// }
