"use client"

import { useEffect, useState } from "react"
import axios, { AxiosError } from 'axios'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@/schemas/signupSchema"
import { Button } from "@/components/ui/button"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { ApiResponse } from "@/types/ApiResponse"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { CircleGauge, Loader } from 'lucide-react';

const page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500)

  const router = useRouter()

  // zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          // console.error('Error during checking for unique:', error);
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast.success("Success", {
        description: response.data.message,
      })
      router.replace(`/verify/${username}`)

    } catch (error) {
      console.error('Error during sign-up:', error);
      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      // ('There was a problem with your sign-up. Please try again.');
      toast.error('Sign Up Failed',
        {
          description: errorMessage,
        }
      );
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>

        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* userbname */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={e => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${usernameMessage === 'Username is unique'
                        ? 'text-green-600'
                        : 'text-red-600'
                        }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className='w-full' type="submit" disabled={isSubmitting}>
              {isSubmitting ?
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </> : ('Sign Up')}

            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default page