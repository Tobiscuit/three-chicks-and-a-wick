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
        <div className="text-center mb-16">
          <h1 className="text-5xl font-sans font-black tracking-tight text-neutral-dark mb-6">
            Let&apos;s Chat!
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-neutral-dark/80">
            Have a question, a brilliant idea for a new scent, or just want to
            say hello? We&apos;re all ears and would love to hear from you.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Side: Contact Info */}
            <div className="p-8 lg:p-12 bg-neutral-light/50">
              <h2 className="text-3xl font-bold font-sans mb-6">
                Contact Information
              </h2>
              <p className="text-neutral-dark/80 mb-8">
                Find us on social media or drop us a line directly. We aim to
                respond within 24-48 hours!
              </p>
              <ul className="space-y-8">
                <li>
                  <a
                    href="mailto:support@threechicksandawick.com"
                    className="flex items-center gap-4 group"
                  >
                    <Mail className="h-8 w-8 text-primary/80 group-hover:text-primary transition-colors" />
                    <span className="font-semibold text-neutral-dark group-hover:text-primary transition-colors">
                      support@threechicksandawick.com
                    </span>
                  </a>
                </li>
                <li>
                  <div className="flex items-center gap-4">
                    <Phone className="h-8 w-8 text-primary/80" />
                    <span className="font-semibold text-neutral-dark">
                      +1 (555) 123-4567
                    </span>
                  </div>
                </li>
                <li>
                  <div className="flex items-center gap-4">
                    <MapPin className="h-8 w-8 text-primary/80" />
                    <span className="font-semibold text-neutral-dark">
                      Made with ❤️ in the USA
                    </span>
                  </div>
                </li>
              </ul>
              <div className="mt-12 pt-12 border-t border-neutral-dark/10">
                <h3 className="text-xl font-bold font-sans mb-6">
                  Follow Our Adventures
                </h3>
                <div className="flex space-x-6">
                  <Link
                    href="#"
                    className="text-neutral-dark/60 hover:text-primary transition-colors"
                  >
                    <Instagram size={32} />
                  </Link>
                  <Link
                    href="#"
                    className="text-neutral-dark/60 hover:text-primary transition-colors"
                  >
                    <Facebook size={32} />
                  </Link>
                  <Link
                    href="#"
                    className="text-neutral-dark/60 hover:text-primary transition-colors"
                  >
                    <Twitter size={32} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="p-8 lg:p-12">
              <form action="#" method="POST" className="space-y-8">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-bold text-neutral-dark/90 mb-2"
                  >
                    Full Name
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-neutral-dark/90 mb-2"
                  >
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
                  <label
                    htmlFor="subject"
                    className="block text-sm font-bold text-neutral-dark/90 mb-2"
                  >
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
                  <label
                    htmlFor="message"
                    className="block text-sm font-bold text-neutral-dark/90 mb-2"
                  >
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
                <div>
                  <button type="submit" className="w-full btn-primary">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
