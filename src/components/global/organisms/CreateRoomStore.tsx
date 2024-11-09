import { useAuth } from '@/auth/AuthProvider'
import studySpaceAPI from '@/lib/studySpaceAPI'
import type { UploadFile, UploadProps } from 'antd'
import { Button, Col, ConfigProvider, Form, Input, InputNumber, Row, Select, Space, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { ArrowLeft, UploadIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
interface Amyti {
  amityId: number
  amityName: string
  amityType: string
  amityStatus: string
  quantity: number
  description: string
}
interface Space {
  id: number
  spaceName: string
}
const CreateRoomStore: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form] = Form.useForm() // Use Ant Design Form hook
  const [imageRoomFileList, setImageRoomFileList] = useState<UploadFile[]>([])
  const [imageMenuFile, setImageMenuFile] = useState<File | null>(null)
  const [spaces, setSpaces] = useState<Space[]>([]) // Adjust type as necessary
  const [amenities, setAmenities] = useState<Amyti[]>([]) // Adjust type as necessary
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const handleGoBack = () => {
    navigate(-1) // Navigate to the previous page
  }

  const onImageRoomChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setImageRoomFileList(newFileList)
    // Update form value manually
    form.setFieldsValue({ ImageRoom: newFileList })
  }

  const onImageRoomPreview = async (file: UploadFile) => {
    let src = file.url as string
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj as File)
        reader.onload = () => resolve(reader.result as string)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spacesResponse, amenitiesResponse] = await Promise.all([
          studySpaceAPI.get('/Space'), // Replace with actual endpoint for spaces
          studySpaceAPI.get(`/Amity/supplier/${user?.userID}`) // Replace with actual endpoint for amenities
        ])
        setSpaces(spacesResponse.data.data) // Adjust based on your API response structure
        setAmenities(amenitiesResponse.data.data) // Adjust based on your API response structure
      } catch (err) {
        setError('Failed to fetch data. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const onFinish = async (values: any) => {
    const imageRoomFiles = values.ImageRoom
    const imageMenuFile = values.ImageMenu && values.ImageMenu[0]
    const houseRules = values.HouseRule ? values.HouseRule.map((ruleObj: { rule: string }) => ruleObj.rule) : []
    const formData = new FormData()
    houseRules.forEach((rule: string) => {
      formData.append('HouseRule[]', rule)
    })
    if (houseRules.length === 0) {
      formData.append('HouseRule[]', '[]');
    }
    formData.append('SpaceId', values.SpaceId)
    formData.append('RoomName', values.RoomName)
    // formData.append('StoreId', user?.userID)
    if (user?.userID) {
      formData.append('StoreId', String(user.userID)) // Append as a string, but it's still a valid numeric value.
    } else {
      console.warn('User ID is missing, cannot set StoreId.')
    }
    formData.append('Type', values.Type)
    formData.append('Capacity', values.Capacity)

    // formData.append('PricePerHour', values.PricePerHour)
    formData.append('PricePerHour', (values.PricePerHour / 1000).toString())
    formData.append('Description', values.Description)
    // formData.append('Amities', JSON.stringify(values.Amenities))
    // values.Amenities.forEach((amenity:any) => {
    //   console.log("trong map chưa string", amenity)
    //   console.log("trong map", JSON.stringify({
    //     amityId: amenity.amityId,
    //     quantity: amenity.quantity
    //   }));
    //   formData.append('Amities', JSON.stringify({
    //     AmityId: amenity.amityId,
    //     Quantity: amenity.quantity
    //   }));
    // });

    // formData.append('Amities', JSON.stringify(amities))
    if (values.Amenities && values.Amenities.length > 0) {
      values.Amenities.forEach((amity: any, index: any) => {
        formData.append(`Amities[${index}][AmityId]`, amity.amityId)
        formData.append(`Amities[${index}][Quantity]`, amity.quantity)
      })
    } else {
      // If there are no amenities, append an empty array
      formData.append('Amities', '[]')
    }
    formData.append('Area', values.Area)
    if (imageMenuFile && imageMenuFile.originFileObj) {
      formData.append('ImageMenu', imageMenuFile.originFileObj)
    } else {
      console.error('ImageMenu file is missing or not set correctly.')
    }

    if (Array.isArray(imageRoomFiles)) {
      imageRoomFiles.forEach((file: UploadFile) => {
        if (file.originFileObj) {
          formData.append('ImageRoom', file.originFileObj)
        }
      })
    }

    // console.log('FormData prepared for submission:')
    // for (let pair of formData.entries()) {
    //   console.log(`${pair[0]}:`, pair[1])
    // }

    try {
      setLoadingCreate(true)
      const response = await studySpaceAPI.post(`/Room`, formData)
      if (response.data.status === 1) {
        // Clear fields in the form
        form.resetFields()
        setLoadingCreate(false)
        toast.success('Tạo phòng thành công!')
        // Navigate to the roomStore
        navigate('/roomStore') // adjust the path based on your routing setup
      } else {
        setLoadingCreate(false)

        toast.error('Tạo phòng thất bại' + response.data.message)
      }
    } catch (error: any) {
      setLoadingCreate(false)

      toast.error(error)
      console.log('errror', error)
    } finally {
      setLoadingCreate(false)
    }
  }

  return (
    <div>
      {loadingCreate && (
        <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50'>
          <div className='flex flex-col items-center'>
            <div className='flex space-x-1'>
              <div className='w-2 h-2 bg-green-700 rounded-full animate-bounce delay-100'></div>
              <div className='w-2 h-2 bg-green-700 rounded-full animate-bounce delay-200'></div>
              <div className='w-2 h-2 bg-green-700 rounded-full animate-bounce delay-300'></div>
            </div>
            <p className='text-2xl text-primary'>Đang tạo phòng... Vui lòng chờ!</p>
          </div>
        </div>
      )}
      <Button type='link' onClick={handleGoBack}>
        <ArrowLeft className='w-8 h-8 text-primary' />
      </Button>
      <div className='text-center text-2xl font-medium text-primary'>Tạo mới phòng</div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#647c6c'
          },
          components: {
            Button: {
              colorTextLightSolid: '#fff'
            }
          }
        }}
      >
        <Form
          layout='vertical'
          onFinish={onFinish}
          style={{ marginTop: '20px' }}
          form={form} // Bind the form instance
        >
          <Form.Item name='RoomName' label='Tên phòng' rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name='SpaceId'
                label='Loại không gian'
                rules={[{ required: true, message: 'Vui lòng chọn loại không gian' }]}
              >
                <Select loading={loading} disabled={loading} placeholder='Chọn không gian'>
                  {spaces.map((space) => (
                    <Select.Option key={space.id} value={space.id}>
                      {space.spaceName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name='Type'
                label='Loại phòng'
                rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
              >
                <Select placeholder='Chọn loại phòng'>
                  <Select.Option value='BASIC'>Basic</Select.Option>
                  <Select.Option value='PREMIUM'>Premium</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name='Capacity'
                label='Sức chứa'
                rules={[{ required: true, message: 'Vui lòng nhập sức chứa của phòng' }]}
              >
                <InputNumber min={1} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name='PricePerHour'
                label='Giá/Giờ(VNĐ)'
                rules={[{ required: true, message: 'Vui lòng nhập giá/giờ' }]}
              >
                {/* <InputNumber min={0} step={0.01} /> */}
                <InputNumber
                  style={{ width: '50%' }}
                  min={1}
                  step={0.001}
                  formatter={(value) => {
                    if (value === undefined || value === null) return '' // Handle empty or undefined values
                    // Ensure value is a string before using replace
                    const valueStr = String(value)
                    return valueStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.') // Format with thousands separator
                  }}
                  parser={(value: string | undefined) => {
                    // Ensure value is parsed as a number
                    return parseFloat((value || '').replace(/\./g, '') || '0') // Return parsed number
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name='Area'
                label='Diện tích(M2)'
                rules={[{ required: true, message: 'Vui lòng nhập diện tích' }]}
              >
                <InputNumber min={0} step={0.1} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name='Description' label='Mô tả' rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.List name='HouseRule'>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space key={key} align='baseline'>
                        <Form.Item
                          {...restField}
                          name={[name, 'rule']}
                          fieldKey={[fieldKey || name, 'rule']}
                          rules={[{ required: true, message: 'Vui lòng nhập quy định phòng' }]}
                        >
                          <Input placeholder='Quy định phòng' />
                        </Form.Item>
                        <Button type='link' onClick={() => remove(name)} style={{ padding: 0, color: 'red' }}>
                          Xóa
                        </Button>
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type='dashed' onClick={() => add()} block>
                        Thêm quy định
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>

            <Col span={12}>
              <Form.List name='Amenities'>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Space key={key} align='baseline' style={{ display: 'flex', marginBottom: 8 }}>
                        <Form.Item
                          {...restField}
                          name={[name, 'amityId']}
                          fieldKey={[fieldKey || name, 'amityId']}
                          rules={[{ required: true, message: 'Chọn tiện ích' }]}
                        >
                          <Select placeholder='Chọn tiện ích'>
                            {amenities
                              .filter((amenity) => amenity.amityStatus === 'Active')
                              .map((amenity) => (
                                <Select.Option key={amenity.amityId} value={amenity.amityId}>
                                  {amenity.amityName}
                                </Select.Option>
                              ))}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, 'quantity']}
                          fieldKey={[fieldKey || name, 'quantity']}
                          rules={[{ required: true, message: 'Nhập số lượng' }]}
                        >
                          <InputNumber min={1} placeholder='Số lượng' />
                        </Form.Item>
                        <Button type='link' onClick={() => remove(name)} style={{ padding: 0, color: 'red' }}>
                          Xóa
                        </Button>
                      </Space>
                    ))}
                    <Form.Item>
                      <Button type='dashed' onClick={() => add()} block>
                        Thêm tiện ích
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Col>
          </Row>
          {/* 
        <Form.Item
          name='ImageMenu'
          label='Image Menu'
          rules={[{ required: true, message: 'Please upload an image for the menu' }]}
        >
          <Upload
            accept='image/*'
            listType='picture-card'
            maxCount={1}
            onChange={onImageMenuChange}
            beforeUpload={() => false} // Disable automatic upload
          >
            + Upload
          </Upload>
        </Form.Item> */}
          <Form.Item
            name='ImageMenu'
            label='Ảnh Menu'
            valuePropName='fileList'
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload
              name='ImageMenu'
              listType='picture'
              maxCount={1} // Only one file allowed
              beforeUpload={() => false} // Prevents auto-upload
            >
              <Button icon={<UploadIcon className='w-4 h-4' />}>Tải lên ảnh Menu</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name='ImageRoom'
            label='Ảnh phòng'
            rules={[{ required: false, message: 'Vui lòng chọn ít nhất 1 ảnh phòng' }]}
          >
            <ImgCrop rotationSlider>
              <Upload
                accept='image/*'
                listType='picture-card'
                fileList={imageRoomFileList}
                onChange={onImageRoomChange}
                onPreview={onImageRoomPreview}
                beforeUpload={() => false} // Disable automatic upload
              >
                {imageRoomFileList.length < 5 && '+ Tải lên'}
              </Upload>
            </ImgCrop>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' size='large' className='w-full'>
              Tạo phòng
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  )
}

export default CreateRoomStore
