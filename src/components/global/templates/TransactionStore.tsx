import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Button, Card, Modal, Tag, Tabs, ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import { useEffect, useState } from 'react'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { useAuth } from '@/auth/AuthProvider'

interface Transaction {
  id: number
  date: string
  fee: number
  paymentMethod: string
  status: string
  type: string
}

function TransactionStore() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  //   const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('ALL')

  useEffect(() => {
    // Fetch data from API
    studySpaceAPI
      .get(`/Transactions/sup/${user?.userID}`)
      .then((response) => {
        const { data } = response
        console.log('tran', data.data.transaction)
        setTransactions(data.data.transaction)
        // setFilteredTransactions(data.data.transaction) // Set filtered transactions initially to all
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error)
      })
  }, [user?.userID])

  const showModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setSelectedTransaction(null)
  }

  //   const handleTabChange = (key: string) => {
  //     setActiveTab(key)
  //     if (key === 'ALL') {
  //       setFilteredTransactions(transactions)
  //     } else {
  //       const filtered = transactions.filter((transaction) => transaction.type === key)
  //       setFilteredTransactions(filtered)
  //     }
  //   }
  const filteredTransactions =
    activeTab === 'ALL' ? transactions : transactions.filter((trans) => trans.type === activeTab)
  console.log('hdhfj', filteredTransactions)
  return (
    <div className='transaction-page-container p-4 flex flex-col justify-center items-center m-auto'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Lịch sử giao dịch</h1>
      <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#647C6C'
            },
            components: {
              Button: {
              }
            }
          }}
        >

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)} // Update active tab on change
        centered
        className='w-full'
        tabBarGutter={0}
      >
        <Tabs.TabPane tab={<span className='font-medium'>Tất cả</span>} key='ALL'>
          <div className=''>
            {filteredTransactions.length === 0 ? (
              <div>Không có giao dịch</div>
            ) : (
              <div className='space-y-4 mt-4'>
                {filteredTransactions.map((transaction, index) => (
                  <Card key={`${transaction.id}-${index}`} hoverable>
                    {' '}
                    {/* Use transaction.id directly here */}
                    <div className='flex items-center justify-between p-4'>
                      <p className='text-sm'>
                        <strong>Transaction ID:</strong> {transaction.id}
                      </p>
                      <p className='text-sm'>
                        <strong>Ngày:</strong> {new Date(transaction.date).toLocaleDateString()}
                      </p>
                      <p className='text-sm'>
                        <strong>Phí:</strong> ${transaction.fee.toFixed(2)}
                      </p>
                      <p className='text-sm'>
                        <strong>Phương thức thanh toán:</strong> {transaction.paymentMethod}
                      </p>
                      <p className='text-sm'>
                        <strong>Trạng thái:</strong>{' '}
                        {transaction.status === 'PAID' ? (
                          <Tag color='green'>{transaction.status}</Tag>
                        ) : (
                          <Tag color='red'>{transaction.status}</Tag>
                        )}
                      </p>
                      {/* <Button type='primary' onClick={() => showModal(transaction)}>
                        View Details
                      </Button> */}
                      <p
                        className={`text-sm font-semibold ${transaction.type === 'Room' ? 'text-blue-500' : 'text-green-500'}`}
                      > <strong className='text-black font-bold'>Loại: </strong>
                        {transaction.type}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span className='font-medium'>Phòng</span>} key='Room'>
          <div className=''>
            {filteredTransactions.length === 0 ? (
              <div>Không có giao dịch</div>
            ) : (
              <div className='space-y-4 mt-4'>
                {filteredTransactions.map((transaction, index) => (
                  <Card key={`${transaction.id}-${index}`} hoverable>
                    {' '}
                    {/* Use transaction.id directly here */}
                    <div className='flex items-center justify-between p-4'>
                      <p className='text-sm'>
                        <strong>Transaction ID:</strong> {transaction.id}
                      </p>
                      <p className='text-sm'>
                        <strong>Ngày:</strong> {new Date(transaction.date).toLocaleDateString()}
                      </p>
                      <p className='text-sm'>
                        <strong>Phí:</strong> ${transaction.fee.toFixed(2)}
                      </p>
                      <p className='text-sm'>
                        <strong>Phương thức thanh toán:</strong> {transaction.paymentMethod}
                      </p>
                      <p className='text-sm'>
                        <strong>Trạng thái:</strong>{' '}
                        {transaction.status === 'PAID' ? (
                          <Tag color='green'>{transaction.status}</Tag>
                        ) : (
                          <Tag color='red'>{transaction.status}</Tag>
                        )}
                      </p>
                      {/* <Button type='primary' onClick={() => showModal(transaction)}>
                        View Details
                      </Button> */}
                      <p
                        className={`text-sm font-semibold ${transaction.type === 'Room' ? 'text-blue-500' : 'text-green-500'}`}
                      > <strong className='text-black font-bold'>Loại: </strong>
                        {transaction.type}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span className='font-medium'>Gói</span>} key='Package'>
          <div className=''>
            {filteredTransactions.length === 0 ? (
              <div>Không có giao dịch</div>
            ) : (
              <div className='space-y-4 mt-4'>
                {filteredTransactions.map((transaction, index) => (
                  <Card key={`${transaction.id}-${index}`} hoverable>
                    {' '}
                    {/* Use transaction.id directly here */}
                    <div className='flex items-center justify-between p-4'>
                      <p className='text-sm'>
                        <strong>Transaction ID:</strong> {transaction.id}
                      </p>
                      <p className='text-sm'>
                        <strong>Ngày:</strong> {new Date(transaction.date).toLocaleDateString()}
                      </p>
                      <p className='text-sm'>
                        <strong>Phí:</strong> ${transaction.fee.toFixed(2)}
                      </p>
                      <p className='text-sm'>
                        <strong>Phương thức thanh toán:</strong> {transaction.paymentMethod}
                      </p>
                      <p className='text-sm'>
                        <strong>Trạng thái:</strong>{' '}
                        {transaction.status === 'PAID' ? (
                          <Tag color='green'>{transaction.status}</Tag>
                        ) : (
                          <Tag color='red'>{transaction.status}</Tag>
                        )}
                      </p>
                      {/* <Button type='primary' onClick={() => showModal(transaction)}>
                        View Details
                      </Button> */}
                      <p
                        className={`text-sm font-semibold ${transaction.type === 'Room' ? 'text-blue-500' : 'text-green-500'}`}
                      >
                        <strong className='text-black font-bold'>Loại: </strong>
                        {transaction.type}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Tabs.TabPane>
      </Tabs>
      </ConfigProvider>

      <Modal
        title='Transaction Details'
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key='close' onClick={handleCancel}>
            Close
          </Button>
        ]}
      >
        {selectedTransaction && (
          <div className='p-4'>
            <h2 className='font-semibold text-xl'>Transaction ID: {selectedTransaction.id}</h2>
            <p className='text-sm text-gray-500'>
              <strong>Date:</strong> {new Date(selectedTransaction.date).toLocaleDateString()}
            </p>
            <p className='text-sm text-gray-500'>
              <strong>Fee:</strong> ${selectedTransaction.fee.toFixed(2)}
            </p>
            <p className='text-sm text-gray-500'>
              <strong>Payment Method:</strong> {selectedTransaction.paymentMethod}
            </p>
            <p className='text-sm text-gray-500'>
              <strong>Status:</strong>{' '}
              {selectedTransaction.status === 'PAID' ? (
                <CheckCircleOutlined className='text-green-500' />
              ) : (
                <CloseCircleOutlined className='text-red-500' />
              )}
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TransactionStore
