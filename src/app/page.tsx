'use client';

import { Mail } from 'lucide-react'; // Assuming you have an icon for messages

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

import Autoplay from "embla-carousel-autoplay"

import messages from '@/messages.json'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';


export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="min-h-screen flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-neutral-950 text-neutral-100">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of
            <br />
            Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Trueself - Where your identity remains a secret.
          </p>
          <p>
            Get Anonymous Feedback from anyone
          </p>

          <Link href="/dashboard"
          >
            <Button className='mt-4 text-black' variant={'outline'}>
              Get Started
            </Button>
          </Link>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          className="w-full max-w-xs"
          plugins={[Autoplay({ delay: 5000 })]}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className='bg-neutral-800 text-neutral-100'>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}