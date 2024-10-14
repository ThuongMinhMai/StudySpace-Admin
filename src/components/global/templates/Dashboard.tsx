/** @format */

import PageTitle from '@/components/global/organisms/PageTitle'
// import Image from "next/image";
import BarChart from '@/components/global/organisms/BarChart'
import Card, { CardContent } from '@/components/global/organisms/Card'
import SalesCard from '@/components/global/organisms/SalesCard'
import { HandCoins, Ticket, Building2, UserRound,BadgeDollarSign,Store } from 'lucide-react'
import { fetchDashboardAdmin } from '@/apis/dashboardAPI'
import Loading from '../molecules/Loading'
import { formatPrice } from '@/lib/utils'
import Loader from '../molecules/Loader'

export default function Home() {
  const { data, isLoading } = fetchDashboardAdmin();
  console.log("dât admin", data)
  const today = new Date();
  const title = `Dashboard tháng ${today.getMonth() + 1}`;
  if (isLoading) return <Loader />;
  return (
    <div className='flex flex-col gap-5  w-full'>
      <PageTitle title={title} />
      <section className='grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4'>
        <Card key={1} amount={formatPrice(data?.totalIncome || 0)} description="" icon={HandCoins} label="Tổng doanh thu" color='red'/>
        <Card key={2} amount={data ? data.totalTransactions.toString() : '0'} description="" icon={BadgeDollarSign} label="Tổng số giao dịch" color='orange' />
        <Card key={3} amount={data ? data.totalBookings.toString() : '0'} description="" icon={Ticket} label="Tổng số đơn đặt" color='blue' />
        <Card key={5} amount={data ? data.accounts.totalStores.toString() : '0'} description="" icon={Store} label="Tổng số cửa hàng" color='teal' />
        <Card key={4} amount={data ? data.accounts.totalUsers.toString() : '0'} description="" icon={UserRound} label="Tổng số khách hàng"  color='green'/>
      </section>
      <section className='grid grid-cols-1  gap-4 transition-all lg:grid-cols-2'>
        <CardContent>
          <p className='mb-4 font-semibold text-xl text-primary'>Doanh thu trong năm</p>

          <BarChart data={data?.monthlyIncome}/>
        </CardContent>
        <CardContent className='flex justify-between gap-4'>
          <section>
            <p className='text-lg font-semibold text-primary'>Những cửa hàng có doanh thu cao nhất</p>
            {/* <p className='text-sm text-gray-400'>You made 265 sales this month.</p> */}
          </section>
          {/* {data?.RevenueOfCompanyInMonths.sort((a,b) => b.TotalRevenueOfCompanyInMonth - a.TotalRevenueOfCompanyInMonth).map((d, i) => (
            <SalesCard key={i} data={d} index={i}/>
          ))} */}
        </CardContent>

        {/*  */}
      </section>
    </div>
  )
}
