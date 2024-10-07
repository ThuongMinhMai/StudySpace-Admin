import { fetchUserDetail, updateUserProfile } from '@/apis/userAPI'
import { useAuth } from '@/auth/AuthProvider'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/global/atoms/ui/avatar'
import Loader from '@/components/global/molecules/Loader'
import { formatPrice } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Col, ConfigProvider, Form, Input, Radio, Row, TimePicker } from 'antd'
import { RuleObject } from 'antd/lib/form'
import { Key, PiggyBank } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import Loading from '@/components/global/molecules/Loading'
import moment from 'moment'
function ProfilePage() {
  const { user } = useAuth()
  console.log('us', user?.userID, user?.roleName)
  const { data, isLoading, isError, refetch } = fetchUserDetail(user?.userID || 0, user?.roleName || '')
  console.log('profile', data)
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [form] = Form.useForm()
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    refetch()
  }, [user, queryClient])

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const droppedFile = acceptedFiles[0]
    if (droppedFile && !droppedFile.type.startsWith('image/')) {
      toast.error('Chỉ chấp nhận tệp tin hình ảnh!')
      return
    }
    setFile(droppedFile)
    const reader = new FileReader()

    reader.onloadend = () => {
      setPreview(reader.result)
      setHasChanges(true)
    }

    if (droppedFile) {
      reader.readAsDataURL(droppedFile)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  })

  const onSubmit = async (values: any) => {
    // const formData = new FormData()
    // formData.append('UserName', values.UserName || data?.UserName)
    // formData.append('FullName', values.FullName || data?.FullName)
    // formData.append('Address', values.Address || data?.Address)
    // formData.append('PhoneNumber', values.PhoneNumber || data?.PhoneNumber)
    // formData.append('Password', values.Password)
    // formData.append('NewPassword', values.NewPassword)
    // formData.append('ConfirmPassword', values.ConfirmPassword)
    // if (file) {
    //   formData.append('Avatar', file)
    // } else {
    //   formData.append('Avatar', '')
    // }
    // // // Logging form data
    // // for (let [key, value] of formData.entries()) {
    // //   console.log(`${key}: ${value}`)
    // // }
    // try {
    //   const response = await updateUserProfile(user?.UserID || '', formData)
    //   setLoading(false)
    //   toast.success('Cập nhật profile thành công')
    //   console.log('Profile updated successfully:', response)
    //   console.log('Profile updated successfully:', response.data)
    //   await refetch()
    //   setHasChanges(false)
    //   queryClient.invalidateQueries({ queryKey: ['userDetail', user?.UserID] })
    // } catch (error: any) {
    //   setLoading(false)
    //   toast.error(error.response?.data?.result?.message || 'Mật khẩu cũ không chính xác!')
    //   console.error('Error updating profile:', error)
    // }
  }

  const handleFormSubmit = async (values: any) => {
    setLoading(true)
    await onSubmit(values)
    setHasChanges(false)
  }

  const handleValuesChange = () => {
    setHasChanges(true)
  }

  const validateConfirmPassword = (_rule: RuleObject, value: any) => {
    const passFieldValue = form.getFieldValue('NewPassword')
    if (passFieldValue && !value) {
      return Promise.reject('Vui lòng xác nhận mật khẩu')
    }
    if (value !== passFieldValue) {
      return Promise.reject('Mật khẩu xác nhận không khớp')
    }
    return Promise.resolve()
  }

  const handleTogglePasswordFields = () => {
    setShowPasswordFields((prevShowPasswordFields) => !prevShowPasswordFields)
  }

  const validatePhoneNumber = (_rule: RuleObject, value: any) => {
    if (value && value !== '') {
      const phoneNumberRegex = /^0\d{9}$/
      if (!phoneNumberRegex.test(value)) {
        return Promise.reject('Số điện thoại phải có 10 chữ số và bắt đầu bằng 0')
      }
    }
    return Promise.resolve()
  }
  const handleOverNightChange = (e:any) => {
    const isOverNightChecked = e.target.value;

    // setIsOvernight(isOverNightChecked);

    if (isOverNightChecked) {
      // If overnight is true, set openTime and closeTime to 00:00 and disable the fields
      form.setFieldsValue({
        openTime: moment('00:00', 'HH:mm'),
        closeTime: moment('00:00', 'HH:mm')
      });
    } else {
      // Enable the fields when overnight is false
      form.setFieldsValue({
        openTime: null,
        closeTime: null
      });
    }
  };
  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen w-full'>
        <Loader />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex justify-center items-center min-h-screen w-full'>
        <p>Đã xảy ra lỗi tải thông tin người dùng. Vui lòng thử lại sau!</p>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='flex mt-4 flex-col items-center justify-center'>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#647C6C'
            },
            components: {
              Button: {
                colorTextLightSolid: '#000000'
              }
            }
          }}
        >
          {user && user.roleName === 'Admin' ? (
            <Form
              form={form}
              variant='filled'
              onFinish={handleFormSubmit}
              onValuesChange={handleValuesChange}
              className='w-full max-w-3xl rounded-lg p-4 shadow-mini-content'
              layout='vertical'
              initialValues={{
                Name: data?.name,
                email: data?.email,
                Password: '',
                Avatar: data?.avatarUrl,
                Phone: data?.phone,
                Address: data?.address,
                NewPassword: '',
                ConfirmPassword: ''
              }}
            >
              <div className='flex flex-col items-center justify-center'>
                <div className='shadow-3xl shadow-shadow-500 dark:!bg-navy-800 relative mx-auto w-full rounded-[20px] drop-shadow-md bg-white bg-clip-border p-4 dark:text-white dark:!shadow-none'>
                  <div className='relative flex h-36 w-full justify-center rounded-xl bg-cover'>
                    <img
                      alt='banner'
                      src='https://cdn.eva.vn/upload/4-2017/images/2017-12-20/1513760778-721-cover-1513760779-width1920height1113.jpg'
                      className='absolute flex h-36  w-full object-cover justify-center rounded-xl bg-cover'
                    />
                    <div
                      {...getRootProps()}
                      title='Change avatar'
                      className='dark:!border-navy-700 absolute -bottom-14 flex h-[87px] w-[87px] cursor-pointer items-center justify-center rounded-full border-[4px] hover:border-tertiary border-amber-400'
                    >
                      <input {...getInputProps()} />
                      {!preview ? (
                        <Avatar className='h-full w-full' title='Change avatar'>
                          <AvatarImage className='object-cover' src={data?.avatarUrl} alt='avatar' />
                          <AvatarFallback>{data?.name}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className='h-full w-full' title='Change image'>
                          <AvatarImage className='object-cover' src={preview as string} alt={data?.name} />
                          <AvatarFallback>{data?.name}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                  <div className='mt-16 flex flex-col items-center'>
                    <h4 className='text-navy-700 text-xl font-bold dark:text-white'>{data?.name}</h4>
                    <p className='flex items-center gap-2 text-base font-normal text-gray-600'>
                      <Key size={16} /> {data?.name}
                    </p>
                    {/* <p className='flex items-center gap-2 text-lg text-primary font-medium text-gray-600'>
                      <PiggyBank size={24} /> <span>{formatPrice(data?.Balance || 0)}</span>
                    </p> */}
                  </div>

                  <Form.Item
                    name='Name'
                    label={<span className='font-medium'>Username</span>}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder='Enter username' />
                  </Form.Item>
                 
                  <Form.Item
                    name='Address'
                    label={<span className='font-medium'>Address</span>}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder='Enter address' />
                  </Form.Item>
                  <Form.Item className='hidden' name='avatar' label='Avatar' />

                  <Form.Item
                    name='Phone'
                    label={<span className='font-medium'>PhoneNumber</span>}
                    rules={[{ required: true }, { validator: validatePhoneNumber }]}
                  >
                    <Input placeholder='Enter phone number' />
                  </Form.Item>
                  <Form.Item
                    name='email'
                    label={<span className='font-medium'>Email</span>}
                    rules={[{ required: true }]}
                  >
                    <Input className='cursor-not-allowed' disabled />
                  </Form.Item>

                  {/* <Button type='link' className='mb-2 p-0 text-tertiary' onClick={handleTogglePasswordFields}>
                  {showPasswordFields ? 'Ẩn đổi mật khẩu' : 'Đổi mật khẩu'}
                </Button> */}
                  {data?.password && ( // Check if data.Password has a value
                    <Button type='link' className='mb-2 p-0 text-tertiary' onClick={handleTogglePasswordFields}>
                      {showPasswordFields ? 'Hide password change' : 'Change password'}
                    </Button>
                  )}
                  <Form.Item
                    name='Password'
                    label={<span className='font-medium'>Old Password</span>}
                    hidden={!showPasswordFields}
                  >
                    <Input.Password placeholder='Enter old password' />
                  </Form.Item>
                  <Form.Item
                    name='NewPassword'
                    label={<span className='font-medium'>New Password</span>}
                    hidden={!showPasswordFields}
                  >
                    <Input.Password placeholder='Enter new password' />
                  </Form.Item>

                  <Form.Item
                    name='ConfirmPassword'
                    label={<span className='font-medium'>Confirm New Password</span>}
                    rules={[{ validator: validateConfirmPassword }]}
                    hidden={!showPasswordFields}
                  >
                    <Input.Password placeholder='Confirm new password' />
                  </Form.Item>
                  <Form.Item className='mb-2 flex justify-center'>
                    <Button
                      type='dashed'
                      htmlType='submit'
                      className={`${loading ? 'bg-green-600 text-white' : ''}`}
                      disabled={!hasChanges}
                    >
                      {/* {loading && <Loading />} */}
                      Update
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          ) : (
            <Form
              form={form}
              variant='filled'
              onFinish={handleFormSubmit}
              onValuesChange={handleValuesChange}
              className='w-full max-w-3xl rounded-lg p-4 shadow-mini-content'
              layout='vertical'
              initialValues={{
                ThumbnailUrl: data?.thumbnailUrl,
                Description: data?.description,
                Name: data?.name,
                email: data?.email,
                Address: data?.address,
                Phone: data?.phone,
                Password: '',
                NewPassword: '',
                ConfirmPassword: '',
                OpenTime: moment(data?.openTime),
                CloseTime: moment(data?.closeTime),
                IsOverNight: data?.isOverNight
              }}
            >
              <div className='flex flex-col items-center justify-center'>
                <div className='shadow-3xl shadow-shadow-500 dark:!bg-navy-800 relative mx-auto w-full rounded-[20px] drop-shadow-md bg-white bg-clip-border p-4 dark:text-white dark:!shadow-none'>
                  <div className='relative flex h-36 w-full justify-center rounded-xl bg-cover'>
                    <img
                      alt='banner'
                      src='https://cdn.prod.website-files.com/5f4a004f01308268d80d6e85/667085ef95151c9a4d5488bd_653000a337042e7bc6074ef8_modern%2520office-cafe-experience.png'
                      className='absolute flex h-40  w-full object-cover justify-center rounded-xl bg-cover'
                    />
                    <div
                      {...getRootProps()}
                      title='Change avatar'
                      className='dark:!border-navy-700 absolute -bottom-14 flex h-[87px] w-[87px] cursor-pointer items-center justify-center rounded-full border-[4px] hover:border-tertiary border-amber-400'
                    >
                      <input {...getInputProps()} />
                      {!preview ? (
                        <Avatar className='h-full w-full' title='Change avatar'>
                          <AvatarImage className='object-cover' src={data?.thumbnailUrl} alt='avatar' />
                          <AvatarFallback>{data?.name}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className='h-full w-full' title='Change image'>
                          <AvatarImage className='object-cover' src={preview as string} alt={data?.name} />
                          <AvatarFallback>{data?.name}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                  <div className='mt-16 flex flex-col items-center'>
                    <h4 className='text-navy-700 text-xl font-bold dark:text-white'>{data?.name}</h4>
                    <p className='flex items-center gap-2 text-base font-normal text-gray-600'>
                      <Key size={16} /> {data?.roleName}
                    </p>
                    {/* <p className='flex items-center gap-2 text-lg text-primary font-medium text-gray-600'>
                      <PiggyBank size={24} /> <span>{formatPrice(data?.Balance || 0)}</span>
                    </p> */}
                  </div>

                  <Form.Item
                    name='Name'
                    label={<span className='font-medium'>Store Name</span>}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder='Store Name' />
                  </Form.Item>
                  {/* <Form.Item
                    name='FullName'
                    label={<span className='font-medium'>Họ và tên</span>}
                    rules={[{ required: true, message: 'Họ và tên không được bỏ trống' }]}
                  >
                    <Input placeholder='Họ và tên' />
                  </Form.Item> */}
                  <Form.Item
                    name='Address'
                    label={<span className='font-medium'>Address</span>}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder='Address' />
                  </Form.Item>
                  <Form.Item className='hidden' name='avatar' label='Avatar' />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label={<span className='font-medium'>Is Overnight Service Available?</span>}
                        name='IsOverNight'
                        rules={[{ required: true, message: 'Please choose an option!' }]}
                      >
                        <Radio.Group onChange={handleOverNightChange}>
                          <Radio value={true}>Yes</Radio>
                          <Radio value={false}>No</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={<span className='font-medium'>Description</span>}
                        name='Description'
                        rules={[{ required: true, message: 'Please input a description!' }]}
                      >
                        <Input.TextArea placeholder='Enter a brief description' size='middle' rows={4} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name='Phone'
                    label={<span className='font-medium'>PhoneNumber</span>}
                    rules={[{ required: true }, { validator: validatePhoneNumber }]}
                  >
                    <Input placeholder='PhoneNumber' />
                  </Form.Item>
                  <Form.Item
                    name='email'
                    label={<span className='font-medium'>Email</span>}
                    rules={[{ required: true }]}
                  >
                    <Input className='cursor-not-allowed' disabled />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label={<span className='font-medium'>Open Time</span>}
                        name='OpenTime'
                        rules={[{ required: true, message: 'Please select open time!' }]}
                      >
                        <TimePicker className='w-full' format='HH:mm' disabled={data?.isOverNight} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label={<span className='font-medium'>Close Time</span>}
                        name='CloseTime'
                        rules={[{ required: true, message: 'Please select close time!' }]}
                      >
                        <TimePicker className='w-full' format='HH:mm' disabled={data?.isOverNight} />
                      </Form.Item>
                    </Col>
                  </Row>
                  {/* <Button type='link' className='mb-2 p-0 text-tertiary' onClick={handleTogglePasswordFields}>
                {showPasswordFields ? 'Ẩn đổi mật khẩu' : 'Đổi mật khẩu'}
              </Button> */}
                  {data?.password && ( // Check if data.Password has a value
                    <Button type='link' className='mb-2 p-0 text-tertiary' onClick={handleTogglePasswordFields}>
                      {showPasswordFields ? 'Hide password change' : 'Change password'}
                    </Button>
                  )}
                  <Form.Item
                    name='Password'
                    label={<span className='font-medium'>Old Password</span>}
                    hidden={!showPasswordFields}
                  >
                    <Input.Password placeholder='Enter old password' />
                  </Form.Item>
                  <Form.Item
                    name='NewPassword'
                    label={<span className='font-medium'>New Password</span>}
                    hidden={!showPasswordFields}
                  >
                    <Input.Password placeholder='Enter new password' />
                  </Form.Item>

                  <Form.Item
                    name='ConfirmPassword'
                    label={<span className='font-medium'>Confirm New Password</span>}
                    rules={[{ validator: validateConfirmPassword }]}
                    hidden={!showPasswordFields}
                  >
                    <Input.Password placeholder='Confirm new password' />
                  </Form.Item>
                  <Form.Item className='mb-2 flex justify-center'>
                    <Button
                      type='dashed'
                      htmlType='submit'
                      className={`${loading ? 'bg-green-600 text-white' : ''}`}
                      disabled={!hasChanges}
                    >
                      {/* {loading && <Loading />} */}
                      Update
                    </Button>
                  </Form.Item>
                </div>
              </div>
            </Form>
          )}
        </ConfigProvider>
      </div>
    </div>
  )
}

export default ProfilePage
