import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { useAuth } from '@/auth/AuthProvider'
import ImageTab from './ImageTab'
import {
  ArrowLeft,
  CheckCircle,
  DollarSign,
  DoorClosed,
  Edit,
  Edit2,
  Home,
  Info,
  LeafyGreen,
  Loader,
  MapIcon,
  MapPin,
  OctagonAlert,
  Pen,
  Pill,
  Plus,
  Rocket,
  Trash,
  Users,
  XCircle
} from 'lucide-react'
import { Button } from '../atoms/ui/button'
import { Badge } from '../atoms/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../atoms/ui/select'
import { Dialog, DialogContent, DialogOverlay } from '../atoms/ui/dialog'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/ui/table'
import { ConfigProvider, Form, Modal, Tooltip, Select as SelectAnt } from 'antd'
import { Input } from '../atoms/ui/input'
import { Textarea } from '../atoms/ui/textarea'
import { Label } from '../atoms/ui/label'

interface Amity {
  id: number
  name: string
  type: string
  status: boolean
  quantity: number
  description: string
}

interface ListImages {
  imageMenu: string | null
  imageList: string[]
}

interface Room {
  roomName: string
  storeName: string
  capacity: number
  pricePerHour: number
  description: string
  status: boolean
  typeSpace: string
  typeRoom: string
  area: number
  longitude: number
  latitude: number
  isOvernight: boolean
  startTime: string
  endTime: string
  houseRule: string[]
  listImages: ListImages
  address: string
  amitiesInRoom: Amity[]
}

interface ApiResponse<T> {
  data: T
}
interface AmytiInRoom {
  amityId: number
  amityName: string
  amityType: string
  amityStatus: string
  quantity: number
  description: string | null | undefined
}
const RoomStoreDetail: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>() // Get the room ID from the URL
  const [room, setRoom] = useState<Room | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // const [showModal, setShowModal] = useState(false)
  const [newStatus, setNewStatus] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [houseRules, setHouseRules] = useState(room?.houseRule || [])
  const [pricePerHour, setPricePerHour] = useState(room?.pricePerHour || 0)
  const [description, setDescription] = useState(room?.description) || ''
  const [newRule, setNewRule] = useState('')
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const [currentAmity, setCurrentAmity] = useState<Amity>()
  const [loadingDelelteAmyti, setLoadingDelelteAmyti] = useState(false)
  const [isAddModalVisible, setAddModalVisible] = useState(false)
  const [amitiesList, setAmitiesList] = useState<AmytiInRoom[]>([])
  const [form] = Form.useForm()
  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    const formData = new FormData()

    formData.append('PricePerHour', pricePerHour !== undefined ? pricePerHour.toString() : '0')
    formData.append('Description', description || '')
    // formData.append("HouseRule",houseRules)
    houseRules.forEach((rule) => {
      formData.append('HouseRule', rule) // Note: Use 'HouseRule' instead of 'HouseRule[]'
    })
    try {
      // Make API request to update the room
      await studySpaceAPI.put(`/Room/${id}`, formData)

      // If successful, show a success message
      toast.success('Cập nhật thông tin phòng thành công')

      // Optionally refresh the room data
      fetchRoomData() // Fetch updated room data
      setIsModalVisible(false)
    } catch (error) {
      console.error('Error updating room:', error)
      toast.error('Cập nhật thông tin phòng thất bại. Vui lòng thử lại.')
    }
  }

  const handleCancel = () => {
    setPricePerHour(room?.pricePerHour || 0)
    setDescription(room?.description || '')
    setHouseRules(room?.houseRule || [])
    setNewRule('')
    setIsModalVisible(false)
  }

  const handleGoBack = () => {
    navigate(-1) // Navigate to the previous page
  }

  const fetchRoomData = async () => {
    try {
      const response = await studySpaceAPI.get<ApiResponse<Room>>(
        `Room/detail-by-store?roomId=${id}&storeId=${user?.userID}`
      )
      console.log('Room data:', response.data.data)
      setRoom(response.data.data)
      setHouseRules(response.data.data.houseRule)
      setDescription(response.data.data.description)
      setPricePerHour(response.data.data.pricePerHour)
    } catch (err) {
      setError('Failed to fetch room data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (status: string) => {
    setNewStatus(status) // Set the new status
    setDialogOpen(true) // Open the dialog
  }

  const confirmStatusChange = async () => {
    if (newStatus !== null && room) {
      try {
        await studySpaceAPI.put(`/Room/status/${id}`)
        setRoom({ ...room, status: newStatus === 'active' ? true : false })
        toast.success('Cập nhật trạng thái phòng thành công')
      } catch (error) {
        toast.error('Lỗi cập nhật trạng thái phòng. Vui lòng thử lại sau!')
        setError('Failed to update room status')
      } finally {
        setDialogOpen(false) // Close the dialog after confirmation
      }
    }
  }
  const handleAddRule = (e: any) => {
    e.preventDefault() // Prevent page reload
    if (newRule.trim()) {
      setHouseRules([...houseRules, newRule])
      setNewRule('')
    }
  }
  const handleRemoveRule = (index: any, e: any) => {
    e.preventDefault()
    setHouseRules(houseRules.filter((_, i) => i !== index)) // Remove the rule
  }

  // Confirmation Modal for Deletion
  const handleDeleteConfirm = async () => {
    setLoadingDelelteAmyti(true)
    try {
      // Make API request to update the room
      await studySpaceAPI.delete(`Amity/room/${id}/amity/${currentAmity?.id}`)

      // If successful, show a success message
      toast.success('Xóa tiện ích thành công')

      // Optionally refresh the room data
      fetchRoomData() // Fetch updated room data
      setDeleteModalVisible(false)
      setLoadingDelelteAmyti(false)
    } catch (error) {
      console.error('Error delete amtyi in room:', error)
      toast.error('Xóa tiện ích thất bại. Vui lòng thử lại.')
      setLoadingDelelteAmyti(false)
    } finally {
      setLoadingDelelteAmyti(false)
    }

    // Call your delete API here using currentAmity.id
  }

  // Edit Modal
  const handleEditConfirm = async () => {
    try {
      // await studySpaceAPI.put(`/Room/${id}`, formData)
      // toast.success('Cập nhật thông tin phòng thành công')
      // fetchRoomData()
      // setIsModalVisible(false)
    } catch (error) {
      // console.error('Error updating room:', error)
      // toast.error('Cập nhật thông tin phòng thất bại. Vui lòng thử lại.')
    }

    console.log('update tien ích tỏng pong', currentAmity)
    // Call your edit API here using currentAmity data
    setEditModalVisible(false)
  }

  const showAddModal = () => {
    setAddModalVisible(true)
  }

  const handleCancelAdd = () => {
    setAddModalVisible(false)
    form.resetFields() // Reset form fields when closing the modal
  }

  const handleAddAmity = async () => {
    try {
      const values = await form.validateFields()
      const { amityId, quantity } = values

      // Construct the API endpoint, replacing with the appropriate room and amity IDs

      // Define the payload based on form values

      // Make the API request
      const response = await studySpaceAPI.post(`/Amity/room/${id}/amity/${amityId}?quantity=${quantity}`)
      console.log('Amity added successfully:', response.data)
      console.log(',', response.data.data)
      if (response.data.status === 1) {
        setAddModalVisible(false)
        form.resetFields()
        fetchRoomData()
        toast.success('Thêm tiện ích thành công')
      } else {
        toast.error('Thêm tiện ích thất bại' + response.data.message)
      }
    } catch (error: any) {
      toast.error('Thêm tiện ích thất bại')
      // Check if the error is related to form validation
      if (error.name === 'Error') {
        console.error('Validation failed:', error)
      } else {
        // Handle API or other errors
        console.error('Error adding amity:', error.response?.data || error.message)
      }
    }
    // form.validateFields().then((values) => {
    //   // Perform the add amity action here with the form values
    //   console.log('Adding amity:', values)
    //   setAddModalVisible(false)
    //   form.resetFields() // Reset form after submission
    // })
  }
  const fetchAmities = async () => {
    try {
      const response = await studySpaceAPI.get(`/Amity/supplier/${user?.userID}`) // Replace with your API endpoint
      setAmitiesList(response.data.data)
    } catch (error) {
      toast.error('Lỗi khi tải danh sách tiện ích')
    }
  }
  useEffect(() => {
    fetchRoomData()
    fetchAmities()
  }, [id])

  if (isLoading) return <div>Đang tải...</div>
  // if (error) return <div>{error}</div>
  if (!room) return <div>Không tìm thấy phòng</div> // Display if room is null

  return (
    <div>
      <div className='flex justify-between'>
        <Button variant='ghost' onClick={handleGoBack}>
          <ArrowLeft className='w-8 h-8 text-primary' />
        </Button>
        <h1 className='text-3xl text-center text-primary font-medium'>{room?.roomName || 'No Data'}</h1>
        <Select onValueChange={handleStatusChange} value={room.status ? 'active' : 'inactive'}>
          <SelectTrigger className='w-48'>
            <Badge variant={room?.status !== undefined ? (room.status ? 'success' : 'destructive') : 'default'}>
              {room?.status !== undefined ? (room.status ? 'Hoạt động' : 'Không hoạt động') : 'No Data'}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='active'>
              <Badge variant='success'>Hoạt động</Badge>
            </SelectItem>
            <SelectItem value='inactive'>
              <Badge variant='destructive'>Không hoạt động</Badge>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Display imageList first */}
      <div>
        {room?.listImages.imageList.length > 0 ? (
          // room.listImages.imageList.map((image, index) => (
          //   <img
          //     key={index}
          //     src={image}
          //     alt={`Room ${room.roomName} image ${index + 1}`}
          //     style={{ width: '100%', maxWidth: '300px', margin: '10px' }}
          //   />
          // ))
          <ImageTab roomPictureDetails={room.listImages.imageList} />
        ) : (
          <p>Không có ảnh cho phòng này</p>
        )}
      </div>

      {/* Then display imageMenu */}
      <div className='w-full'>
        {room?.listImages.imageMenu ? (
          <div>
            <p className='text-primary font-medium text-lg '>Menu</p>
            <img
              className='w-full rounded-md'
              src={
                room.listImages.imageMenu ||
                'https://kamereo.vn/blog/wp-content/uploads/2024/05/mau-menu-cafe-thumbnail.jpg'
              }
              alt='Menu'
            />
          </div>
        ) : (
          <p className='text-primary font-medium text-lg '>Menu: Chưa có ảnh menu</p>
        )}
      </div>

      <div>
        <div className='flex flex-col md:flex-row'>
          {/* Room Information Column */}
          <div className='md:w-1/2 p-4'>
            <div className='flex justify-center items-center gap-3'>
              <h2 className='text-xl font-medium mb-2'>Thông tin phòng</h2>
              <Tooltip title='Chỉnh sửa' className='mr-1'>
                <Edit2 strokeWidth={3} className='cursor-pointer w-4 text-primary' onClick={showModal} />
              </Tooltip>
            </div>
            <table className='w-full table-auto border-collapse border border-gray-300'>
              <tbody>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <Home strokeWidth={2} className='h-5 w-5 mr-2 text-primary' />
                    <p className='text-primary font-medium'>Tên cửa hàng:</p>
                  </td>
                  <td className='p-2'>{room?.storeName || 'No Data'}</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <Users strokeWidth={2} className='h-5 w-5 mr-2 text-primary' />
                    <p className='text-primary font-medium'>Sức chứa:</p>
                  </td>
                  <td className='p-2'>{room?.capacity || 'No Data'} (người)</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <DollarSign strokeWidth={2} className='h-5 w-5 mr-2 text-primary' />
                    <p className='text-primary font-medium'>Giá tiền/giờ:</p>
                  </td>
                  <td className='p-2'>{room?.pricePerHour !== undefined ? room.pricePerHour : 'No Data'}</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <Pill strokeWidth={2} className='h-5 w-5 mr-2 text-primary' />
                    <p className='text-primary font-medium'>Mô tả:</p>
                  </td>
                  <td className='p-2'>{room?.description || 'No Data'}</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <Rocket strokeWidth={2} className='h-5 w-5 mr-2 text-primary' />
                    <p className='text-primary font-medium'>Loại không gian:</p>
                  </td>
                  <td className='p-2'>{room?.typeSpace || 'No Data'}</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <DoorClosed strokeWidth={2} className='h-5 w-5 mr-2 text-primary' />
                    <p className='text-primary font-medium'>Loại phòng:</p>
                  </td>
                  <td className='p-2'>{room?.typeRoom || 'No Data'}</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <Info strokeWidth={2} className='h-5 w-5 mr-2 text-primary' />
                    <p className='text-primary font-medium'>Diện tích:</p>
                  </td>
                  <td className='p-2'>{room?.area ? `${room.area} m²` : 'No Data'}</td>
                </tr>
                <tr className='border-b'>
                  <td className='p-2 flex items-center'>
                    <MapPin strokeWidth={2} className='h-5 w-5 mr-2 text-primary' />
                    <p className='text-primary font-medium'>Địa chỉ:</p>
                  </td>
                  <td className='p-2'>{room?.address || 'No Data'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className='md:w-1/2 p-4'>
            <h2 className='text-xl font-semibold mb-2'>Quy tắc phòng:</h2>

            <table className='w-full table-auto border-collapse border border-gray-300 mb-4'>
              <tbody>
                {room?.houseRule.length > 0 ? (
                  room.houseRule.map((rule, index) => (
                    <tr key={index} className='border-b'>
                      <td className='p-2 flex items-center'>
                        <OctagonAlert className='h-5 w-5 mr-2 text-primary' />
                        {rule}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className='p-2'>No Data</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className='flex justify-between items-center mb-4 mt-10'>
              <h2 className='text-xl font-semibold mb-2'>Tiện ích trong phòng</h2>
              <Button variant='outline' className='text-primary' onClick={showAddModal}>
                <Plus />
                Thêm tiện ích
              </Button>
            </div>
            <Table className='w-full border border-gray-300'>
              <TableHeader>
                <TableRow className='bg-gray-100'>
                  {/* <TableHead className='p-2 text-left'>Status</TableHead> */}
                  <TableHead className='p-2 text-left'>Tiện ích</TableHead>
                  <TableHead className='p-2 text-left'>Số lượng</TableHead>
                  <TableHead className='p-2 text-left'>Mô tả</TableHead>
                  <TableHead className='p-2 text-left'></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {room?.amitiesInRoom.length > 0 ? (
                  room.amitiesInRoom.map((amity) => (
                    <TableRow key={amity.id} className='border-b'>
                      {/* <TableCell className='p-2 flex items-center'>
                        {amity.status ? (
                          <CheckCircle className='h-5 w-5 mr-2 text-green-500' />
                        ) : (
                          <XCircle className='h-5 w-5 mr-2 text-red-500' />
                        )}
                      </TableCell> */}
                      <TableCell className='p-2'>
                        <span>
                          {amity.name} ({amity.type})
                        </span>
                      </TableCell>
                      <TableCell>{amity.quantity}</TableCell>
                      <TableCell>
                        <p className='text-gray-500'>{amity.description || 'Không có mô tả'}</p>
                      </TableCell>
                      <TableCell className='p-2 flex items-center'>
                        {/* <Edit
                          className='h-5 w-5 text-green-500 cursor-pointer mr-2'
                          onClick={() => {
                            setCurrentAmity(amity)
                            setEditModalVisible(true)
                          }}
                        /> */}
                        <Trash
                          className='h-5 w-5 text-red-500 cursor-pointer'
                          onClick={() => {
                            setCurrentAmity(amity)
                            setDeleteModalVisible(true)
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className='p-2' colSpan={3}>
                      Chưa có tiện ích
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogOverlay className='bg-/60' />
          <DialogContent>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Xác nhận thay đổi trạng thái</h3>
            <div className='mt-2'>
              <p>Bạn có chắc chắn muốn thay đổi trạng thái của phòng này?</p>
            </div>
            <div className='mt-4 flex justify-end space-x-2'>
              <Button variant='secondary' onClick={() => setDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={confirmStatusChange} disabled={isLoadingUpdate}>
                {isLoadingUpdate ? <Loader className='animate-spin' /> : 'Xác nhận'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#647c6c'
          },
          components: {
            Button: {}
          }
        }}
      >
        <Modal
          title='Cập nhật thông tin phòng'
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <h2 className='text-lg text-primary font-bold'>{room.roomName}</h2>
          <form className='flex flex-col gap-4'>
            {/* Include your form fields here for updating room details */}
            <div className='flex flex-col gap-4'>
              <Label>Giá:</Label>
              <Input
                type='text'
                value={pricePerHour}
                className='w-full'
                onChange={(e) => setPricePerHour(Number(e.target.value) || 0)}
              />
            </div>
            <div className='flex flex-col gap-4'>
              <Label>Mô tả:</Label>
              <Textarea value={description} className='w-full' onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className='flex flex-col gap-4'>
              <Label>House Rules:</Label>
              <ul>
                {houseRules.map((rule, index) => (
                  <li key={index} className='flex justify-between items-center mb-2'>
                    <span>{rule}</span>
                    <Trash className='w-5 h-5 text-primary' onClick={(e) => handleRemoveRule(index, e)} />
                  </li>
                ))}
              </ul>
              <div className='flex justify-between items-center gap-5'>
                <Input
                  type='text'
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  placeholder='Thêm quy định mới'
                  className=''
                />
                <Button variant='outline_primary' onClick={handleAddRule} className=''>
                  <Plus />
                  Thêm
                </Button>
              </div>
            </div>
          </form>
          <div className='flex justify-end mt-4'>
            <Button variant='outline' onClick={handleCancel} className='mr-2'>
              Hủy
            </Button>
            <Button onClick={handleOk}>Cập nhật</Button>
          </div>
        </Modal>

        <Modal
          title='Xác nhận xóa'
          visible={isDeleteModalVisible}
          onOk={handleDeleteConfirm}
          onCancel={() => setDeleteModalVisible(false)}
          footer={null}
        >
          <p>Bạn có chắc chắn muốn xóa tiện ích này không?</p>
          <div className='flex justify-end mt-4'>
            <Button
              variant='outline'
              disabled={loadingDelelteAmyti}
              onClick={() => setDeleteModalVisible(false)}
              className='mr-2'
            >
              Hủy
            </Button>
            <Button onClick={handleDeleteConfirm} disabled={loadingDelelteAmyti}>
              {loadingDelelteAmyti && <Loader className='animate-spin' />}Xóa
            </Button>
          </div>
        </Modal>

        {/* Edit Modal */}
        <Modal
          title='Chỉnh sửa tiện ích'
          visible={isEditModalVisible}
          onOk={handleEditConfirm}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
        >
          <div className='flex flex-col gap-4'>
            <Label>Tên:</Label>
            <Input
              value={currentAmity?.name}
              onChange={(e) => {
                if (currentAmity) {
                  setCurrentAmity({ ...currentAmity, name: e.target.value })
                }
              }}
            />

            <Label>Số lượng:</Label>
            <Input
              type='number'
              value={currentAmity?.quantity}
              onChange={(e) => {
                if (currentAmity) {
                  setCurrentAmity({ ...currentAmity, quantity: Number(e.target.value) })
                }
              }}
            />

            <Label>Mô tả:</Label>
            <Textarea
              value={currentAmity?.description}
              onChange={(e) => {
                if (currentAmity) {
                  setCurrentAmity({ ...currentAmity, description: e.target.value })
                }
              }}
            />

            <Label>Loại:</Label>
            <Input
              value={currentAmity?.type}
              onChange={(e) => {
                if (currentAmity) {
                  setCurrentAmity({ ...currentAmity, type: e.target.value })
                }
              }}
            />
          </div>
          <div className='flex justify-end mt-4'>
            <Button variant='outline' onClick={() => setEditModalVisible(false)} className='mr-2'>
              Hủy
            </Button>
            <Button onClick={handleEditConfirm}>Cập nhật</Button>
          </div>
        </Modal>

        <Modal
          title='Thêm tiện ích'
          visible={isAddModalVisible}
          onCancel={handleCancelAdd}
          onOk={handleAddAmity}
          okText='Thêm'
          cancelText='Hủy'
        >
          <Form form={form} layout='vertical'>
            <Form.Item
              name='amityId'
              label='Tên tiện ích'
              rules={[{ required: true, message: 'Vui lòng chọn tiện ích' }]}
            >
              <SelectAnt placeholder='Chọn tiện ích'>
                {amitiesList.map((amity) => (
                  <SelectAnt.Option
                    key={amity.amityId}
                    value={amity.amityId}
                    className={`flex justify-between items-center p-2 rounded-md mb-2 border 
                   ${amity.amityStatus === 'Active' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-red-50 border-red-300 text-red-700'}`}
                  >
                    <div className='flex justify-between items-center'>
                      <span>
                        {amity.amityName} ({amity.amityType})
                      </span>
                      <span className='text-sm italic'>
                        {amity.amityStatus === 'Active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </div>
                  </SelectAnt.Option>
                ))}
              </SelectAnt>
            </Form.Item>
            <Form.Item name='quantity' label='Số lượng' rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
              <Input type='number' placeholder='Nhập số lượng' />
            </Form.Item>
          </Form>
        </Modal>
      </ConfigProvider>
    </div>
  )
}

export default RoomStoreDetail
