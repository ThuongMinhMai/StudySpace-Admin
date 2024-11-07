import paymentFailure from '../../../assets/paymentFailure.jpg'
import { Link } from 'react-router-dom'
function PaymentFailure() {
  return (
    <div className='w-screen'>
      <div className='flex flex-col items-center mb-8'>
        <img src={paymentFailure} className='h-[500px] w-[800px]' />
        <div className='text-2xl font-medium'> Payment canceled!</div>
        <div className='text-xl mt-4'>Please try again later or contact the StudySpace admin team!</div>
        <Link to='/' className='underline hover:text-primary font-medium text-xl mt-12'>
          Return
        </Link>
      </div>
    </div>
  )
}

export default PaymentFailure
