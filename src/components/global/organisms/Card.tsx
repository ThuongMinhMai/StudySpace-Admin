/** @format */

import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import React from 'react'

export type CardProps = {
  label: string
  icon: LucideIcon
  amount: string
  description: string
  color: 'orange' | 'blue' | 'green' | 'purple' | 'teal' | 'red' // New color options
}

export default function Card({ label, icon: Icon, amount, description, color }: CardProps) {
  // Define styles based on the color prop
  const colorStyles = {
    orange: {
      border: 'border-orange-400',
      bg: 'bg-orange-200/40',
      // shadow: 'shadow-orange-400',
      text: 'text-orange-400',
      icon: 'text-orange-500',
      amountText: 'text-orange-700'
    },
    blue: {
      border: 'border-blue-400',
      bg: 'bg-blue-200/40',
      // shadow: 'shadow-blue-400',
      text: 'text-blue-400',
      icon: 'text-blue-500',
      amountText: 'text-blue-700'
    },
    green: {
      border: 'border-green-400',
      bg: 'bg-green-200/40',
      // shadow: 'shadow-green-400',
      text: 'text-green-400',
      icon: 'text-green-500',
      amountText: 'text-green-700'
    },
    purple: {
      border: 'border-purple-400',
      bg: 'bg-purple-200/40',
      // shadow: 'shadow-purple-400',
      text: 'text-purple-400',
      icon: 'text-purple-500',
      amountText: 'text-purple-700'
    },
    teal: {
      border: 'border-teal-400',
      bg: 'bg-teal-200/40',
      // shadow: 'shadow-teal-400',
      text: 'text-teal-400',
      icon: 'text-teal-500',
      amountText: 'text-teal-700'
    },
    red: {
      border: 'border-red-400',
      bg: 'bg-red-200/40',
      // shadow: 'shadow-red-400',
      text: 'text-red-400',
      icon: 'text-red-500',
      amountText: 'text-red-700'
    }
  }

  // Get the styles based on the provided color
  const styles = colorStyles[color]

  return (
    <CardContent className={`${styles.border} ${styles.bg}`}>
      <section className='flex justify-between gap-2'>
        {/* label */}
        <p className={`text-lg font-bold ${styles.text}`}>{label}</p>
        {/* icon */}
        <Icon className={`h-8 w-8 ${styles.icon}`} />
      </section>
      <section className='flex items-center gap-5'>
        <h2 className={`text-2xl font-semibold ${styles.amountText}`}>{amount}</h2>
        <p className='text-xs'>{description}</p>
      </section>
    </CardContent>
  )
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={cn('flex w-full flex-col gap-3 rounded-xl border p-5 shadow', props.className)} />
}
