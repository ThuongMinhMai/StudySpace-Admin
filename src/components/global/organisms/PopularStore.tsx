/** @format */
import React from 'react'
import { Table, Image, Typography } from 'antd'

const { Text } = Typography

export type HotBookingStore = {
  storeName: string
  address: string
  imageURL: string
  totalBookings: number
}

interface PopularStoreProps {
    stores: HotBookingStore[]
}

const PopularStore: React.FC<PopularStoreProps> = ({ stores }) => {
  const columns = [
    {
        title: 'Ảnh',
        dataIndex: 'imageURL',
        key: 'imageURL',
        render: (image: string) => (
          <Image
            className="rounded-md"
            src={image}
            alt="Store"
            width={100}
            height={70}
            style={{ objectFit: 'cover', cursor: 'pointer' }}
          />
        ),
      },
      {
        title: 'Tên cửa hàng',
        dataIndex: 'storeName',
        key: 'storeName',
        render: (name: string) => <Text strong>{name}</Text>,
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'address',
        key: 'address',
        render: (address: string) => <Text>{address}</Text>,
      },
      {
        title: 'Tổng lượt đặt',
        dataIndex: 'totalBookings',
        key: 'totalBookings',
        render: (totalBookings: number) => <Text>{totalBookings}</Text>,
      },
  ]

  return <Table columns={columns} dataSource={stores} rowKey='storeName' pagination={false} />
}

export default PopularStore
