import { Link } from 'react-router-dom'
import paymentSuccess from '../../../assets/welcom.avif'
// import { useAuth } from '@/auth/AuthProvider'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/auth/AuthProvider'

function PaymentSuccess() {
  const { fetchUser } = useAuth()
  // const queryClient = useQueryClient()
  // localStorage.removeItem('invoiceData')
  // queryClient.invalidateQueries({ queryKey: ['userDetail', user?.UserID] })
  const handleLinkClick = () => {
    fetchUser()
  }

  return (
    <div className='w-screen flex justify-center items-center mb-8'>
      <div className='flex flex-col items-center'>
        <img src={paymentSuccess} className='w-auto h-[400px]' />
        <div className='text-2xl font-medium'>Payment successful!</div>
        <div className='text-xl mt-4 text-[#166430] font-bold'>Welcome new supplier to us!</div>
        <p className='text-lg mt-4'>
          Thank you for your trust <span className='text-primary font-medium'>The Study Space</span>
        </p>

        <Link to='/' className='underline hover:text-primary font-medium text-xl mt-8' onClick={handleLinkClick}>
          Let's start managing your wonderful space
        </Link>
      </div>
    </div>
  )
}

export default PaymentSuccess
