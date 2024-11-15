import { useAuth } from '@/auth/AuthProvider'
import studySpaceAPI from '@/lib/studySpaceAPI'
import { formatPrice } from '@/lib/utils'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Button, Card, ConfigProvider, Modal, Tabs, Tag } from 'antd'
import 'antd/dist/reset.css'
import { useEffect, useState } from 'react'

interface Transaction {
  id: number
  date: string
  fee: number
  paymentMethod: string
  status: string
  type: string
  hastag: string
}

function TransactionStore() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [totalCost, setTotalCost] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<string>('ALL')

  useEffect(() => {
    // Fetch data from API
    studySpaceAPI
      .get(`/Transactions/sup/${user?.userID}`)
      .then((response) => {
        const { data } = response
        setTransactions(data.data.transaction)
        setTotalRevenue(data.data.totalRevenue)
        setTotalCost(data.data.totalCost)
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error)
      })
  }, [user?.userID])

  const handleCancel = () => {
    setIsModalVisible(false)
    setSelectedTransaction(null)
  }

  const filteredTransactions =
    activeTab === 'ALL' ? transactions : transactions.filter((trans) => trans.type === activeTab)
  return (
    <div className='transaction-page-container p-4 flex flex-col justify-center items-center m-auto'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Lịch sử giao dịch</h1>
      <span className='flex items-center'>
        <span className='text-green-600 font-bold text-xl'>+{formatPrice(totalRevenue)} </span>
        <span className='mx-2 text-gray-500'>-</span>
        <span className='text-red-600 font-medium text-lg'>-{formatPrice(totalCost)} </span>
      </span>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#647C6C'
          },
          components: {
            Button: {}
          }
        }}
      >
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)} centered className='w-full' tabBarGutter={0}>
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
                          <strong># </strong> {transaction.hastag}
                        </p>
                        <p className='text-sm'>
                          <strong>Transaction ID:</strong> {transaction.id}
                        </p>
                        <p className='text-sm'>
                          <strong>Ngày:</strong> {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        <p className='text-sm'>
                          <strong>Phí:</strong> {transaction.fee.toFixed(2)}VNĐ
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
                          {' '}
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
          <Tabs.TabPane tab={<span className='font-medium'>Phòng</span>} key='ROOM'>
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
                          <strong># </strong> {transaction.hastag}
                        </p>
                        <p className='text-sm'>
                          <strong>Transaction ID:</strong> {transaction.id}
                        </p>
                        <p className='text-sm'>
                          <strong>Ngày:</strong> {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        <p className='text-sm'>
                          <strong>Phí:</strong> {transaction.fee.toFixed(2)}VNĐ
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
                          className={`text-sm font-semibold ${transaction.type === 'ROOM' ? 'text-blue-500' : 'text-green-500'}`}
                        >
                          {' '}
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
          <Tabs.TabPane tab={<span className='font-medium'>Gói</span>} key='PACKAGE'>
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
                          <strong># </strong> {transaction.hastag}
                        </p>
                        <p className='text-sm'>
                          <strong>Transaction ID:</strong> {transaction.id}
                        </p>
                        <p className='text-sm'>
                          <strong>Ngày:</strong> {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        <p className='text-sm'>
                          <strong>Phí:</strong> {transaction.fee.toFixed(2)}VNĐ
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
                          className={`text-sm font-semibold ${transaction.type === 'ROOM' ? 'text-blue-500' : 'text-green-500'}`}
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
            <p className='text-sm'>
              <strong># </strong> {selectedTransaction.hastag}
            </p>
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
