import { Instagram, Facebook, Twitter, Mail, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const socialLinks = [
  {
    name: 'Instagram',
    icon: Instagram,
    href: '#',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    href: '#',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    href: '#',
  },
];

const ContactInfo = () => (
  <div className="flex flex-col justify-center">
    <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">
      Get in Touch!
    </h1>
    <p className="mt-4 text-lg text-gray-600">
      We&apos;re here to help! Whether you have a question about our products,
      need assistance with an order, or just want to share your thoughts,
      we&apos;d love to hear from you.
    </p>
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-zinc-900">
        Contact Information
      </h3>
      <div className="mt-3 text-base text-gray-600 space-y-2">
        <p className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-[var(--primary-600)]" />
            <a
            className="text-[var(--primary-600)] font-medium hover:underline"
            href="mailto:support@threegirlsandawick.com"
            >
            support@threegirlsandawick.com
            </a>
        </p>
        <p className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-[var(--primary-600)]" />
            <span className='font-medium'>+1 (555) 123-4567</span>
        </p>
        <p className="text-sm pt-2">
          We aim to respond within 24-48 hours.
        </p>
      </div>

    </div>
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-zinc-900">Follow Us</h3>
      <div className="mt-4 flex space-x-6">
        {socialLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-gray-500 hover:text-[var(--primary-600)] transition-colors"
          >
            <span className="sr-only">{link.name}</span>
            <link.icon className="h-7 w-7" />
          </Link>
        ))}
      </div>
    </div>
  </div>
);

const ContactForm = () => (
  <div className="bg-white p-8 rounded-xl shadow-inner border border-gray-100">
    <form action="#" className="space-y-6" method="POST">
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="name"
        >
          Name
        </label>
        <div className="mt-1">
          <input
            autoComplete="name"
            className="form-input block w-full rounded-full border-gray-300 shadow-sm focus:border-[var(--primary-500)] focus:ring-[var(--primary-500)] sm:text-sm h-12 px-5"
            id="name"
            name="name"
            placeholder="Your Name"
            type="text"
          />
        </div>
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="email"
        >
          Email
        </label>
        <div className="mt-1">
          <input
            autoComplete="email"
            className="form-input block w-full rounded-full border-gray-300 shadow-sm focus:border-[var(--primary-500)] focus:ring-[var(--primary-500)] sm:text-sm h-12 px-5"
            id="email"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
        </div>
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="subject"
        >
          Subject
        </label>
        <div className="mt-1">
          <input
            className="form-input block w-full rounded-full border-gray-300 shadow-sm focus:border-[var(--primary-500)] focus:ring-[var(--primary-500)] sm:text-sm h-12 px-5"
            id="subject"
            name="subject"
            placeholder="How can we help?"
            type="text"
          />
        </div>
      </div>
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="message"
        >
          Message
        </label>
        <div className="mt-1">
          <textarea
            className="form-textarea block w-full rounded-2xl border-gray-300 shadow-sm focus:border-[var(--primary-500)] focus:ring-[var(--primary-500)] sm:text-sm p-5"
            id="message"
            name="message"
            placeholder="Your message..."
            rows={5}
          ></textarea>
        </div>
      </div>
      <div>
        <button
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-[var(--primary-600)] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-500)] transition-transform duration-300 ease-in-out hover:scale-105"
          type="submit"
        >
          Send Message
        </button>
      </div>
    </form>
  </div>
);


export default function ContactUsPage() {
    return (
        <div className="bg-white" style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans', sans-serif" }}>
            <style jsx global>{`
              body {
                background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23edb5c4" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
              }
            `}</style>
            <Header />
            <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
                <div
                    className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg"
                >
                    <ContactInfo />
                    <ContactForm />
                </div>
            </main>
            <Footer />
        </div>
    )
} 