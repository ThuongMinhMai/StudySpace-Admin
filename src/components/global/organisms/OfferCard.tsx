import React, { useEffect, useState } from 'react'
import studySpaceAPI from '../../../lib/studySpaceAPI'
import { CircleCheck } from 'lucide-react'
import { useAuth } from '../../../auth/AuthProvider'
import { Modal, Input, Button, Form, message, ConfigProvider } from 'antd'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

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
  const { user,fetchUser } = useAuth()

  const [offers, setOffers] = useState<OfferData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [selectedOffer, setSelectedOffer] = useState<OfferData | null>(null)
  const [duration, setDuration] = useState<number>(1)
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState<boolean>(false)

  useEffect(() => {
    studySpaceAPI
      .get('/Packages?pageNumber=1&pageSize=5')
      .then((response) => {
        if (response.data.status === 1) {
          setOffers(response.data.data)
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

  const handleRegisterClick = (offer: OfferData) => {
    setSelectedOffer(offer)
    setIsModalVisible(true)
  }

  const handleModalOk = () => {
    if (duration < 1) {
      alert('Duration must be at least 1 month.')
      return
    }
    // Show the confirmation modal
    setIsConfirmModalVisible(true)
    setIsModalVisible(false)
  }

  const handleConfirmModalOk = () => {
    if (selectedOffer) {
      // Simulate API call for package purchase
      studySpaceAPI
        .post('/Payments/supplier', {
          storeID: user?.userID,
          packageID: selectedOffer.id,
          duration,
          amount: selectedOffer.fee,
          description: user?.userID + ' ' + selectedOffer.name
        })
        .then((response) => {
          // if (response.data.status === 1) {
          //   message.success('Package purchased successfully!')
          // } else {
          //   message.error('Failed to purchase package.')
          // }
          message.success(
            <>
              Payment information sent successfully! <strong>Invoice will be canceled after 30 minutes</strong>
            </>,
            5
          )
          setTimeout(() => {
            if (response.data.status === 1) {
              // Redirect to the checkout URL if successful
              fetchUser();
              window.location.href = response.data.data.checkoutUrl
            } else {
              console.log('Error create payment' + response.data.message)
              // Log the error message if the status is not 1
              toast.error('Payment failed' + response.data.message)
            }
          }, 5000)
        })
        .catch(() => {
          message.error('An error occurred while purchasing the package.')
        })
        .finally(() => {
          setIsConfirmModalVisible(false)
        })
    }
  }

  const handleConfirmModalCancel = () => {
    setIsConfirmModalVisible(false)
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
  }

  const handleInputBlur = () => {
    // Ensure the duration is at least 1 month when the input loses focus
    if (duration < 1) {
      setDuration(1)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#647c6c'
        },
        components: {
          Button: {
            colorTextLightSolid: '#fff'
          }
        }
      }}
    >
      {offers.map((offer) => (
        <div key={offer.id} className='room__card bg-white overflow-hidden rounded-3xl shadow-md'>
          <div className='room__card__details p-4 flex flex-col justify-center items-center gap-10'>
            <h4 className='mt-8 text-center text-2xl font-bold'>{offer.name}</h4>
            <h5 className='mb-4 text-base text-center text-[#FFA800]'>
              <span className='font-extrabold text-xl'></span>{' '}
              <span className='font-extrabold text-5xl'>{formatPrice(offer.fee)}/</span>
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
            <button
              onClick={() => handleRegisterClick(offer)}
              className='mb-8 px-14 py-3 bg-[#FFA800] text-base rounded-lg text-white font-semibold'
            >
              Register
            </button>
          </div>
        </div>
      ))}

      {/* Modal for package registration */}
      <Modal
        title={
          <div className='text-center text-lg font-semibold'>
            Register for <span className='font-bold text-[#FFA800]'>{selectedOffer?.name}</span>
          </div>
        }
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText='Proceed to Confirm'
        cancelText='Cancel'
      >
        <div className='flex flex-col justify-center items-center'>
          <div className='space-y-4 my-6'>
            {selectedOffer?.description.map((desc, index) => (
              <div key={index} className='flex items-center'>
                <CircleCheck className='w-6 h-6 mr-2 text-[#647c6c]' />
                <p className='text-base text-[#67625D]'>{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <Form className='flex justify-center items-center'>
          <Form.Item
            className='w-2/3'
            label='Duration (months)'
            rules={[
              { required: true, message: 'Please input the duration!' },
              { type: 'number', min: 1, message: 'Duration must be at least 1 month' }
            ]}
          >
            <Input
              type='number'
              min={1}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              onBlur={handleInputBlur} // Ensure min value is 1 on blur
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Confirmation modal */}
      <Modal
        title='Confirm Purchase'
        visible={isConfirmModalVisible}
        onOk={handleConfirmModalOk}
        onCancel={handleConfirmModalCancel}
        okText='Confirm'
        cancelText='Cancel'
      >
        <p>Are you sure you want to purchase the package for {duration} month(s)?</p>
      </Modal>
    </ConfigProvider>
  )
}

export default OfferCard
