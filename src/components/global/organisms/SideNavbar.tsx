/** @format */
'use client'

import { useState } from 'react'
import { Nav } from '../atoms/ui/nav'

interface SideNavbarProps {
  isAdmin: boolean
}

import { useWindowWidth } from '@react-hook/window-size'
import {
  BadgeDollarSign,
  ChevronRight,
  DoorOpen,
  FileBox,
  LayoutDashboard,
  Presentation,
  Store,
  UsersRound
} from 'lucide-react'
import { Button } from '../atoms/ui/button'

export default function SideNavbar({ isAdmin }: SideNavbarProps) {
  // console.log('admin ơ nav', isAdmin)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const onlyWidth = useWindowWidth()
  const mobileWidth = onlyWidth < 768

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed)
  }
  const adminLinks = [
    {
      title: 'Dashboard',
      href: '/home/admin',
      icon: LayoutDashboard,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Cửa hàng',
      href: '/stores',
      icon: Store,
      variant: 'ghost' as 'default' | 'ghost'
    },
    {
      title: 'Quản lí phòng',
      href: '/allRooms',
      icon: DoorOpen,
      variant: 'ghost' as 'default' | 'ghost'
    },
    {
      title: 'Quản lý đặt chỗ',
      href: '/bookingAll',
      icon: FileBox,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Quản lý giao dịch',
      href: '/transactionsAll',
      icon: BadgeDollarSign,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Tài khoản người dùng',
      href: '/accounts',
      icon: UsersRound,
      variant: 'ghost' as 'default' | 'ghost'
    }
    // {
    //   title: 'Đăng xuất',
    //   href: '/login',
    //   icon: LogOut,
    //   variant: 'ghost' as 'default' | 'ghost'
    // }
  ]

  const managerLinks = [
    {
      title: 'Dashboard',
      href: '/home/store',
      icon: LayoutDashboard,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Quản lý phòng',
      href: '/roomStore',
      icon: DoorOpen,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Quản lý đặt chỗ',
      href: '/bookingStore',
      icon: FileBox,
      variant: 'default' as 'default' | 'ghost'
    },
    {
      title: 'Quản lí tiện ích',
      href: '/amities',
      icon: Presentation,
      variant: 'default' as 'default' | 'ghost'
    }
    // {
    //   title: 'Trạm dừng',
    //   href: '/stations',
    //   icon: LandPlot,
    //   variant: 'default' as 'default' | 'ghost'
    // },
    // {
    //   title: 'Chuyến xe mẫu',
    //   href: '/templates',
    //   icon: SwatchBook,
    //   variant: 'default' as 'default' | 'ghost'
    // },
    // {
    //   title: 'Đăng xuất',
    //   href: '/login',
    //   icon: LogOut,
    //   variant: 'ghost' as 'default' | 'ghost'
    // }
  ]
  return (
    <div className='relative min-w-[80px] min-h-screen h-fit transition-all duration-300 ease-in-out border-r px-3 pb-10 pt-24'>
      {!mobileWidth && (
        <div className='absolute right-[-20px] top-24 '>
          <Button
            onClick={toggleSidebar}
            variant='secondary'
            className=' rounded-full p-2 transition-transform duration-300'
            style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <ChevronRight className='text-primary' />
          </Button>
        </div>
      )}

      <Nav
        isCollapsed={mobileWidth ? true : isCollapsed}
        links={isAdmin ? adminLinks : managerLinks}
        // links={adminLinks }
      />
    </div>
  )
}
