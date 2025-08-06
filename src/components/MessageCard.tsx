'use client'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
      toast.error('Sign Up Failed', {
        description: response?.data.message,
      });
      onMessageDelete(message._id as string);
    } catch (error) {
      console.error('Internal Error during Verification:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Sign Up Failed', {
        description: axiosError.response?.data.message || "Internal Error during Verification",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>

        <AlertMessage handleDeleteConfirm={handleDeleteConfirm} />

        <CardDescription>Card Description</CardDescription>
        <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}
export default MessageCard

const AlertMessage = ({ handleDeleteConfirm }: any) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>
          <X className="w-5 h-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this message.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogCancel>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction onClick={handleDeleteConfirm}>
          Continue
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  )
}