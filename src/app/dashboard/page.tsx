'use client'

import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Message, User } from '@/model/User'
import { acceptMessagesSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { User as CurrentUser } from 'next-auth';

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(message => message._id !== messageId))
  }

  const { data: session } = useSession();
  const cuser: User = session?.user as User;

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages') ?? true;

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`)

      setValue('acceptMessages', response.data.isAcceptingMessages ?? true);
    } catch (error) {
      console.error('Error during getting isAcceptingMessages:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error during getting isAcceptingMessages', {
        description: axiosError.response?.data.message
          ?? "Failed to fetch message settings"
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast])


  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);

      if (messages.length === 0 && refresh === true)
        toast.info('No Messages Yo',
          { description: 'There are no messages sent to you' });
      else if (refresh) {
        toast.info('Refreshed Messages',
          { description: 'Showing latest messages' });
      }
    } catch (error) {
      console.error('Error during fetching Messages', error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error during fetching Messages', {
        description: axiosError.response?.data.message
          ?? "Failed to fetch messages"
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchAcceptMessages();
    fetchMessages();

  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast(response.data.message,
        { description: 'Accept Message Status Changed' });
    } catch (error) {
      console.error('Internal Error during: Changing Accept Message Status', error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error during: Changing Accept Message Status', {
        description: axiosError.response?.data.message
          ?? "Failed to Change Accept Message Status"
      });
    }
  };

  if (!session || !session.user) {
    return <div>Loading</div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  console.log(baseUrl)
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link Copied!",
      { description: 'Profile link is copied to clipboard' });
  }

  return (
    <section id='dashboard'>
      <div className='container-x'>
        <div className='text-center'>
          <p className='font-semibold'> Welcome, {cuser?.username || cuser?.email} </p>
          <h1 className="text-5xl font-bold">Dashboard</h1>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Copy Your Unique Link</h2>
          <div className="flex items-center ">
            <input
              className="input input-bordered w-full px-2 py-1.5 font-mono bg-neutral-200 rounded-l-lg"
              type="text"
              value={profileUrl}
              disabled
            />
            <Button className='rounded-l-none'
              onClick={copyToClipboard}>Copy Profile Link</Button>
          </div>
        </div>

        <Separator />

        <div className='my-4 flex justify-between items-center'>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>

          <div>
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}

            />
            <span className="ml-2">
              Accept Messages: {acceptMessages ? 'Yes' : 'No'}
            </span>
          </div>

        </div>

        <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                // ? check this
                key={message._id as string}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>

      </div>
    </section>
  );
}

export default Dashboard