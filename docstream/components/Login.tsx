'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface LoginForm {
  staff_id: string;
  department: string;
  password: string;
  email: string;
}

const Login = () => {
  const router = useRouter()
  const { login } = useAuth()
  const [form, setForm] = useState<LoginForm>({
    staff_id: "",
    department: "",
    password: "",
    email: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const redirectUser = (role: string) => {
    const roleRoutes: { [key: string]: string } = {
      'staff': '/staff/find-company',
      'supervisor': '/supervisor/dashboard',
      'vehicle_officer': '/vehicle-officer/dashboard',
      'corporate': '/corporate/dashboard',
      'ict_staff': '/ict/dashboard',
      'admin': '/admin/dashboard'
    };

    const route = roleRoutes[role.toLowerCase()] || '/staff/find-company';
    console.log('Redirecting to:', route);
    router.push(route);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()
      console.log('Full API response:', data); 

      if (!response.ok) {
        throw new Error(data.detail || data.message || data.error || 'Login failed')
      }

      console.log('Login successful, data:', data);

      const accessToken = data.tokens?.access;
      const userData = data.user;

      if (accessToken && userData) {
        login(accessToken, userData);
        
        // Test if storage worked
        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        console.log('Stored token:', storedToken ? 'Yes' : 'No');
        console.log('Stored user:', storedUser ? 'Yes' : 'No');
        
        // Redirect based on role
        redirectUser(userData.role);
      } else {
        console.error('Missing data in response:', {
          hasTokens: !!data.tokens,
          hasAccessToken: !!data.tokens?.access,
          hasUser: !!data.user
        });
        throw new Error('Invalid response data: missing access token or user data');
      }
      
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Add your staff details to login</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
            <p className="text-red-600 text-xs mt-1">
              Check browser console for more details
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="staff_id" className="block text-sm font-medium text-gray-700 mb-2">
              Staff ID *
            </label>
            <input 
              id="staff_id"
              type="text" 
              name="staff_id" 
              placeholder="Enter your staff ID" 
              required 
              value={form.staff_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input 
              id="email"
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              required 
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <input 
              id="department"
              type="text"
              name="department"
              value={form.department}
              placeholder="Enter your department"
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <input 
              id="password"
              type="password" 
              name="password" 
              value={form.password} 
              placeholder="Enter your password"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/debug-auth" className="text-blue-600 hover:underline text-sm">
            Debug Auth Status
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login