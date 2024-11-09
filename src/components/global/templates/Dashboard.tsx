/** @format */

import PageTitle from '@/components/global/organisms/PageTitle'
// import Image from "next/image";
import { fetchDashboardAdmin } from '@/apis/dashboardAPI'
import BarChart from '@/components/global/organisms/BarChart'
import Card, { CardContent } from '@/components/global/organisms/Card'
import { formatPrice } from '@/lib/utils'
import { BadgeDollarSign, HandCoins, Store, Ticket, UserRound } from 'lucide-react'
import Loader from '../molecules/Loader'
import PopularStore from '../organisms/PopularStore'

export default function Home() {
  const { data, isLoading } = fetchDashboardAdmin()
  const today = new Date()
  const title = `Dashboard tháng ${today.getMonth() + 1}`
  if (isLoading) return <Loader />
  return (
    <div className='flex flex-col gap-5  w-full'>
      <PageTitle title={title} />
      <section className='grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4'>
        <Card
          key={1}
          amount={formatPrice(data?.totalIncome || 0)}
          description=''
          icon={HandCoins}
          label='Tổng doanh thu'
          color='red'
        />
        <Card
          key={2}
          amount={data ? data.totalTransactions.toString() : '0'}
          description=''
          icon={BadgeDollarSign}
          label='Tổng số giao dịch'
          color='orange'
        />
        <Card
          key={3}
          amount={data ? data.totalBookings.toString() : '0'}
          description=''
          icon={Ticket}
          label='Tổng số đơn đặt'
          color='blue'
        />
        <Card
          key={4}
          amount={data ? data.accounts.totalStores.toString() : '0'}
          description=''
          icon={Store}
          label='Tổng số cửa hàng'
          color='teal'
        />
        <Card
          key={5}
          amount={data ? data.accounts.totalUsers.toString() : '0'}
          description=''
          icon={UserRound}
          label='Tổng số khách hàng'
          color='green'
        />
        <Card
          key={6}
          amount={data ? formatPrice(data.totalInThisMonth.totalRevenueInMonth) : '0'}
          description=''
          icon={HandCoins}
          label='Doanh thu trong tháng'
          color='purple'
        />
        <Card
          key={7}
          amount={data ? data.totalInThisMonth.totalBookingsInMonth.toString() : '0'}
          description=''
          icon={Ticket}
          label='Tổng số lượt đặt phòng trong tháng'
          color='red'
        />
        <Card
          key={8}
          amount={data ? data.totalInThisMonth.totalTransactionsInMonth.toString() : '0'}
          description=''
          icon={BadgeDollarSign}
          label='Tổng giao dịch trong tháng'
          color='orange'
        />
      </section>
      <section className='grid grid-cols-1  gap-4 transition-all lg:grid-cols-2'>
        <CardContent>
          <p className='mb-4 font-semibold text-xl text-primary'>Doanh thu trong năm</p>

          <BarChart data={data?.monthlyIncome} />
        </CardContent>
        <CardContent className='flex justify-start gap-4'>
          <section>
            <p className='text-lg font-semibold text-primary'>Những cửa hàng có doanh thu cao nhất</p>
          </section>
          <PopularStore stores={data?.hotBookingStore || []} />
        </CardContent>
      </section>
    </div>
  )
}
