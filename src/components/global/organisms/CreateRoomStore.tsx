import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, InputNumber, Select, Space, Upload } from 'antd'
import { ArrowLeft } from 'lucide-react'
import ImgCrop from 'antd-img-crop'
import type { UploadFile, UploadProps } from 'antd'

const CreateRoomStore: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm() // Use Ant Design Form hook
  const [imageRoomFileList, setImageRoomFileList] = useState<UploadFile[]>([])
  const [imageMenuFile, setImageMenuFile] = useState<File | null>(null)
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

  const onImageMenuChange: UploadProps['onChange'] = ({ file }) => {
    if (file.originFileObj) {
      setImageMenuFile(file.originFileObj)
      form.setFieldsValue({ ImageMenu: file.originFileObj })
    }
  }


  const onFinish = (values: any) => {
    // Access the file directly from the values
    const imageMenuFile = values.ImageMenu; // Change this line to access the correct value
    console.log('Form Values:', values);
    console.log('ImageMenu File:', imageMenuFile);

    // Handle form submission here
    // Example: Create a FormData object and append the image file
    const formData = new FormData();
    formData.append('ImageMenu', imageMenuFile); // Assuming imageMenuFile is the file itself

    // You can also append other form fields to the FormData
    formData.append('SpaceId', values.SpaceId);
    formData.append('RoomName', values.RoomName);
    formData.append('StoreId', values.StoreId);
    formData.append('Type', values.Type);
    formData.append('Capacity', values.Capacity);
    formData.append('PricePerHour', values.PricePerHour);
    formData.append('Description', values.Description);
    formData.append('Area', values.Area);

    // Now, send formData to your API endpoint using Axios or Fetch
    console.log('FormData prepared for submission:', formData);

    // Example API call (uncomment and replace with actual endpoint)
    // axios.post('YOUR_API_ENDPOINT', formData)
    //   .then(response => console.log('Success:', response))
    //   .catch(error => console.error('Error:', error));
  };


  return (
    <div>
      <div>Create Room Store</div>
      <Button onClick={handleGoBack}>
        <ArrowLeft className='w-8 h-8 text-primary' />
      </Button>
      <Form
        layout="vertical"
        onFinish={onFinish}
        style={{ marginTop: '20px' }}
        form={form} // Bind the form instance
      >
        <Form.Item
          name="SpaceId"
          label="Space ID"
          rules={[{ required: true, message: 'Please enter the space ID' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="RoomName"
          label="Room Name"
          rules={[{ required: true, message: 'Please enter the room name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="StoreId"
          label="Store ID"
          rules={[{ required: true, message: 'Please enter the store ID' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="Type"
          label="Type"
          rules={[{ required: true, message: 'Please select the room type' }]}
        >
          <Select>
            <Select.Option value="conference">Conference</Select.Option>
            <Select.Option value="meeting">Meeting</Select.Option>
            <Select.Option value="office">Office</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="Capacity"
          label="Capacity"
          rules={[{ required: true, message: 'Please enter the room capacity' }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item
          name="PricePerHour"
          label="Price Per Hour"
          rules={[{ required: true, message: 'Please enter the price per hour' }]}
        >
          <InputNumber min={0} step={0.01} />
        </Form.Item>

        <Form.Item
          name="Description"
          label="Description"
          rules={[{ required: true, message: 'Please enter the description' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="Area"
          label="Area (sqm)"
          rules={[{ required: true, message: 'Please enter the area' }]}
        >
          <InputNumber min={0} step={0.1} />
        </Form.Item>

        <Form.List name="HouseRule">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'rule']}
                    fieldKey={[fieldKey, 'rule']}
                    rules={[{ required: true, message: 'Please enter a house rule' }]}
                  >
                    <Input placeholder="House Rule" />
                  </Form.Item>
                  <Button
                    type="link"
                    onClick={() => remove(name)}
                    style={{ padding: 0, color: 'red' }}
                  >
                    Remove
                  </Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Add House Rule
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.List name="Amenities">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'amenity']}
                    fieldKey={[fieldKey, 'amenity']}
                    rules={[{ required: true, message: 'Missing amenity name' }]}
                  >
                    <Input placeholder="Amenity" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'quantity']}
                    fieldKey={[fieldKey, 'quantity']}
                    rules={[{ required: true, message: 'Missing quantity' }]}
                  >
                    <InputNumber placeholder="Quantity" min={1} />
                  </Form.Item>
                  <Button
                    type="link"
                    onClick={() => remove(name)}
                    style={{ padding: 0, color: 'red' }}
                  >
                    Remove
                  </Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Add Amenity
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          name="ImageMenu"
          label="Image Menu"
          rules={[{ required: true, message: 'Please upload an image for the menu' }]}
        >
          <Upload
            accept="image/*"
            listType="picture-card"
            maxCount={1}
            onChange={onImageMenuChange}
            beforeUpload={() => false} // Disable automatic upload
          >
            + Upload
          </Upload>
        </Form.Item>

        <Form.Item
          name="ImageRoom"
          label="Room Images"
          rules={[{ required: false, message: 'Please upload at least one room image' }]}
        >
          <ImgCrop rotationSlider>
            <Upload
              accept="image/*"
              listType="picture-card"
              fileList={imageRoomFileList}
              onChange={onImageRoomChange}
              onPreview={onImageRoomPreview}
              beforeUpload={() => false} // Disable automatic upload
            >
              {imageRoomFileList.length < 5 && '+ Upload'}
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateRoomStore
