/** @format */

import PageTitle from '@/components/global/organisms/PageTitle'
// import Image from "next/image";
import Card, { CardContent } from '@/components/global/organisms/Card'
import { Bus, Ticket, Route, HandCoins, DoorOpen, BadgeDollarSign } from 'lucide-react'
import { fetchDashboardStore } from '@/apis/dashboardAPI'
import { useAuth } from '@/auth/AuthProvider'
import Loading from '../molecules/Loading'
import { formatPrice } from '@/lib/utils'
import BarChartManager from '../organisms/BarChartManager'
import PopularTripCard from '../organisms/PopularTripCard'
import PopularRoom from '../organisms/PopularRoom'

export default function DashboardStore() {
  const { user } = useAuth()
  const { data, isLoading } = fetchDashboardStore(user?.userID || 0)
  console.log('dashboard sotre', data)

  // if (isLoading) return <Loading />
  return (
    <div className='flex flex-col gap-5  w-full'>
      <PageTitle title={`Dashboard ${data?.storeName}`} />
      <section className='grid w-full grid-cols-1 gap-10 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4'>
        <Card
          key={1}
          amount={data ? formatPrice(data.totalIncome) : '0'}
          description=''
          icon={HandCoins}
          label='Doanh thu cả năm'
          color='red'
        />
        <Card
          key={2}
          amount={data ? data.totalBooking.toString() : '0'}
          description=''
          icon={Ticket}
          label='Tổng số lượt đặt phòng'
          color='orange'
        />
        <Card
          key={3}
          amount={data ? data.totalRoom.toString() : '0'}
          description=''
          icon={DoorOpen}
          label='Tổng số phòng'
          color='blue'
        />
        <Card
          key={4}
          amount={data ? formatPrice(data.totalInThisMonth.totalRevenueInMonth) : '0'}
          description=''
          icon={HandCoins}
          label='Doanh thu trong tháng'
          color='purple'
        />
      </section>
      <section className='grid w-3/5 grid-cols-1 gap-10 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-2 m-auto'>
        <Card
          key={5}
          amount={data ? data.totalInThisMonth.totalBookingsInMonth.toString() : '0'}
          description=''
          icon={Ticket}
          label='Tổng số lượt đặt phòng trong tháng'
          color='teal'
        />
        <Card
          key={6}
          amount={data ? data.totalInThisMonth.totalTransactionsInMonth.toString() : '0'}
          description=''
          icon={BadgeDollarSign}
          label='Tổng giao dịch trong tháng'
          color='orange'
        />
      </section>

      <section className='grid grid-cols-1  gap-4 transition-all lg:grid-cols-2'>
        <CardContent>
          <p className='mb-4 font-semibold text-xl text-primary'>Tổng doanh thu trong năm</p>

          <BarChartManager data={data?.monthRevenue} />
        </CardContent>
        <CardContent className='flex justify-start gap-4'>
          <section>
            <p className='text-lg font-semibold text-primary'>Phòng có lượt đặt cao nhất</p>
            {/* <p className='text-sm text-gray-400'>Những tuyến đường được sử dụng nhiều nhất trong tháng.</p> */}
          </section>
          {/* {data?.popularRooms.map((d, i) => (
            <PopularTripCard data={d} key={i}/>
          ))} */}
          <PopularRoom rooms={data?.popularRooms || []} />
        </CardContent>
      </section>
    </div>
  )
}
