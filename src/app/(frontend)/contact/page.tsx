import type { Metadata } from 'next'
import PageClient from './page.client'

export const metadata: Metadata = {
   title: 'Contact Us',
   description: 'Get in touch with our team',
}

// Form submission handlers
async function handleContactSubmit(formData: FormData) {
   'use server'
   console.log('Contact form submitted', formData) // this shows in the terminal only
   // Process form submission here
}

async function handleNewsletterSubmit(formData: FormData) {
   'use server'
   console.log('Newsletter subscription', formData) // this shows in the terminal only
   // Process newsletter subscription
}

// Contact Form Component
function ContactForm({ onSubmit }: { onSubmit: (formData: FormData) => Promise<void> }) {
   return (
      <form className="space-y-6" action={onSubmit}>
         <div className="space-y-4">
            <div>
               <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
               </label>
               <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-md bg-background border-primary/20"
               />
            </div>

            <div>
               <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
               </label>
               <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2 border rounded-md bg-background border-primary/20"
               />
            </div>

            <div>
               <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
               </label>
               <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-md bg-background border-primary/20"
               />
            </div>

            <div>
               <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
               </label>
               <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-2 border rounded-md bg-background border-primary/20"
               />
            </div>
         </div>

         <div>
            <button
               type="submit"
               className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
               Send Message
            </button>
         </div>
      </form>
   )
}

// Newsletter Form Component
function NewsletterForm({ onSubmit }: { onSubmit: (formData: FormData) => Promise<void> }) {
   return (
      <form className="space-y-4" action={onSubmit}>
         <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow">
               <label htmlFor="newsletter-email" className="sr-only">
                  Email address
               </label>
               <input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Your email address"
                  className="w-full px-4 py-2 border rounded-md bg-background border-primary/20"
               />
            </div>
            <button
               type="submit"
               className="px-5 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
               Subscribe
            </button>
         </div>
         <div className="text-sm text-muted-foreground">
            <label className="flex items-start gap-2">
               <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-0.5"
               />
               <span>
                  {`I agree to receive marketing emails and can unsubscribe at any time.`}
               </span>
            </label>
         </div>
      </form>
   )
}

export default async function ContactPage() {
   return (
      <div className="pt-24 pb-24">
         <PageClient />

         <div className="container">
            <div className="max-w-xl mx-auto">
               <div className="mb-12">
                  <div className="prose dark:prose-invert max-w-none">
                     <h1>Contact Us</h1>
                  </div>
               </div>

               <p className="mb-8 text-muted-foreground">
                  {`We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.`}
               </p>

               <ContactForm onSubmit={handleContactSubmit} />

               <div className="mt-16 pt-8 border-t">
                  <h2 className="text-2xl mb-8">Stay Updated</h2>
                  <p className="mb-6 text-muted-foreground">
                     {`Subscribe to our newsletter to receive updates and news.`}
                  </p>
                  <NewsletterForm onSubmit={handleNewsletterSubmit} />
               </div>
            </div>
         </div>
      </div>
   )
}
