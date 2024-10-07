/** @format */
import React from 'react';
import { Table, Image, Typography } from 'antd';

const { Text } = Typography;

export type Room = {
  name: string;
  type: string;
  image: string;
  totalBooking: number;
};

interface PopularRoomProps {
  rooms: Room[];
}

const PopularRoom: React.FC<PopularRoomProps> = ({ rooms }) => {
  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <Image
          src={image}
          alt="Room"
          width={100}
          height={70}
          style={{ objectFit: 'cover' }}
          preview={false}
        />
      ),
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Text>{type}</Text>,
    },
    {
      title: 'Tổng lượt đặt',
      dataIndex: 'totalBooking',
      key: 'totalBooking',
      render: (totalBooking: number) => <Text>{totalBooking}</Text>,
    },
  ];

  return <Table columns={columns} dataSource={rooms} rowKey="name" pagination={false} />;
};

export default PopularRoom;
