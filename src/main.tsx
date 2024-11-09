import { Toaster as Toast } from '@/components/global/atoms/ui/toaster.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App.tsx'
import ErrorBoundary from './ErrorBoundary'; // Add this import
import { AuthProvider } from './auth/AuthProvider.tsx'
import './index.css'
const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <App />
            <Toast />
            <Toaster position='top-right' richColors />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
