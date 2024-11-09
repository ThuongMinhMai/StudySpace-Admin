import { useAuth } from '@/auth/AuthProvider'
import { LogOut } from 'lucide-react'
import OfferCard from './OfferCard'

function RegisterPackage() {
  const { logout } = useAuth()
  
  return (
    <div className='relative bg-gradient-to-r from-[#ffefbd] to-[#FFFFFF]'>
      <div className='fixed top-6 right-6 z-50 cursor-pointer'>
        <LogOut size={30} color='#b30606dd'  onClick={() => logout()}/> 
      </div>
      <section className='room__container lg:px-44 lg:py-6 md:px-6 md:py-10 sm:p-6 p-4'>
        <div>
          <div className='bg-[#FFDFAE]/80 px-8 py-3 text-[#FFA800] font-bold rounded-lg w-fit'>Price Package</div>
        </div>
        <div className='flex flex-col sm:flex-row justify-center items-stretch lg:gap-20 md:gap-28 my-10 ' id='offer'>
          <p className='section__subheader flex-1 text-[#4E4E4E] font-bold text-5xl '>Choose Your Perfect Combo</p>
          <h2 className='section__header flex-1 text-[#67625D] font-light text- leading-loose tracking-wider'>
            Choose your perfect combo membership to unlock exclusive benefits and tailored services that fit your study
            and work needs perfectly!
          </h2>
        </div>
        <div className='room__grid mt-16 grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'>
          <OfferCard />
        </div>
      </section>
    </div>
  )
}

export default RegisterPackage
