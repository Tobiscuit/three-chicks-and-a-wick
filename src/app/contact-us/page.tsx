import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

export default function ContactUsPage() {
  return (
    <div className="bg-cream text-neutral-dark min-h-screen">
      <main className="container mx-auto py-8 sm:py-12">
        {/* Centered Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-sans font-black tracking-tight text-neutral-dark mb-3">
            Get in Touch
          </h1>
          <p className="text-lg text-neutral-dark/80 max-w-2xl mx-auto">
            Have a question, a brilliant idea for a new scent, or just want to
            say hello? We&apos;re all ears and would love to hear from you.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h2 className="text-3xl font-bold text-neutral-dark mb-6">Send us a Message</h2>
              <form className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-dark/90 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-neutral-light/70 rounded-lg border-2 border-transparent hover:border-[var(--subtle-border)] focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-dark/90 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-neutral-light/70 rounded-lg border-2 border-transparent hover:border-[var(--subtle-border)] focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-neutral-dark/90 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 bg-neutral-light/70 rounded-lg border-2 border-transparent hover:border-[var(--subtle-border)] focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-dark/90 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    placeholder="Your message..."
                    className="w-full px-4 py-3 bg-neutral-light/70 rounded-lg border-2 border-transparent hover:border-[var(--subtle-border)] focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30 transition"
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary w-full">
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-full p-3">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-neutral-dark/80">hello@threechicksandawick.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-full p-3">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-neutral-dark/80">(123) 456-7890</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary rounded-full p-3">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-neutral-dark/80">123 Craft Lane, Creativity City, USA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
