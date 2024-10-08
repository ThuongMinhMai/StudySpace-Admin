import background from '@/assets/background1.jpg'
import Icon from '@/assets/LOGO SS 04.png'
import { useAuth } from '@/auth/AuthProvider'
import { TSignInSchema, signInSchema } from '@/components/Schema/LoginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '../atoms/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../atoms/ui/form'
import { Input } from '../atoms/ui/input'
import { useToast } from '../atoms/ui/use-toast'
import { RadioGroup, RadioGroupItem } from '../atoms/ui/radio-group'

function SignInForm() {
  const { loginSupplier, loginAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const form = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'supplier' // Default to supplier
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(values: TSignInSchema) {
    setIsSubmitting(true)
    try {
      if (values.role === 'admin') {
        await loginAdmin(values.email, values.password)
      } else {
        await loginSupplier(values.email, values.password)
      }

      // Navigate to home or dashboard
      // navigate('/home')
    } catch (error: any) {
      const messageError = error.response?.data?.message || 'Unknown error'
      toast({
        variant: 'destructive',
        description: messageError,
        title: 'Lỗi đăng nhập'
      })
      if (messageError === 'Email chưa được xác thực.') {
        navigate(`/auth/${error.response.data.userId}/verify-email?email=${error.response.data.email}`)
      }
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <div className='container relative grid flex-col items-center justify-center min-h-screen lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative flex-col hidden h-full p-10 text-white bg-muted dark:border-r lg:flex'>
          <div className='absolute inset-0 bg-left-top bg-cover overflow-hidden'>
            <img
              src='https://p16-va.lemon8cdn.com/tos-alisg-v-a3e477-sg/oQADpfn1Q8ETg9C1MADQAk9ABQiBbtxYkGeNgN~tplv-tej9nj120t-origin.webp'
              alt='Sign Up'
              className='lg:max-w-full lg:h-auto h-full w-auto object-cover'
            />
          </div>
        </div>
        <div className='py-4 lg:p-8'>
          <div className='py-4 lg:p-8'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
              <div className='flex flex-col space-y-2 text-center'>
                <h1 className='text-2xl font-semibold tracking-tight'>Đăng nhập</h1>
                <p className='text-sm text-muted-foreground'>
                  để tiếp tục với <img className='inline w-5 h-5 mb-3' alt='icon' src={Icon} /> StudySpace
                </p>
              </div>
              <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder='Nhập email ...' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu</FormLabel>
                          <FormControl>
                            <Input type='password' placeholder='Nhập mật khẩu ...' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='role'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Đăng nhập với vai trò</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} value={field.value} className='flex space-x-4'>
                              <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='supplier' id='supplier' />
                                <label htmlFor='supplier'>Nhà cung cấp</label>
                              </div>
                              <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='admin' id='admin' />
                                <label htmlFor='admin'>Admin</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button disabled={loading} type='submit' className='w-full text-white'>
                      {loading && <Loader className='w-4 h-4 animate-spin' />} Đăng nhập
                    </Button>
                  </form>
                </Form>
              </>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default SignInForm
