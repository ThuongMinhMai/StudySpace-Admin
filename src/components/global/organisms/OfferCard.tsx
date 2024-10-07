import React, { useEffect, useState } from 'react'
import studySpaceAPI from '../../../lib/studySpaceAPI'
import { CircleCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../auth/AuthProvider'
interface OfferData {
  id: number
  name: string
  fee: number
  description: string[]
  duration: number
}

interface ApiResponse {
  status: number
  message: string
  data: OfferData[]
}
function OfferCard() {
  const { user } = useAuth()

  const [offers, setOffers] = useState<OfferData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch data from the API
    studySpaceAPI
      .get('/Packages?pageNumber=1&pageSize=5')
      .then((response) => {
        if (response.data.status === 1) {
          setOffers(response.data.data) // Type is inferred as OfferData[]
        } else {
          setError('Failed to load offers.')
        }
      })
      .catch(() => {
        setError('An error occurred while fetching data.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }
  return (
    <>
      {offers.map((offer) => (
        <div key={offer.id} className='room__card bg-white overflow-hidden rounded-3xl shadow-md'>
          <div className='room__card__details p-4 flex flex-col justify-center items-center gap-10'>
            <h4 className='mt-8 text-center text-2xl font-bold'>{offer.name}</h4>
            <h5 className='mb-4 text-base text-center text-[#FFA800]'>
              <span className='font-extrabold text-xl'>$</span>{' '}
              <span className='font-extrabold text-5xl'>{offer.fee}</span>
              <span className='text-lg text-[#767676] font-medium'>monthly</span>
            </h5>
            <ul className='list-none space-y-8 px-8 text-[#67625D]'>
              {offer.description.map((desc, index) => (
                <li key={index} className='flex items-center'>
                  <CircleCheck className='w-7 h-7 mr-2 flex-shrink-0' color='#FFFF' fill='#FFA800' />
                  {desc}
                </li>
              ))}
            </ul>
            <Link to='' className='mb-8 px-14 py-3 bg-[#FFA800] text-base rounded-lg text-white font-semibold'>
              Register
            </Link>
          </div>
        </div>
      ))}
    </>
  )
}

export default OfferCard
