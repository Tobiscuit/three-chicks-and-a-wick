import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ContactUsPage() {
  return (
    <div className="bg-cream text-neutral-dark min-h-screen">
      <main className="container mx-auto px-6 py-12 md:py-24">
        {/* Centered Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight text-neutral-dark mb-4">
            Let&apos;s Chat!
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-neutral-dark/80">
            Have a question, a brilliant idea for a new scent, or just want to say hello? 
            We&apos;re all ears and would love to hear from you.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Left Side: Contact Info */}
            <div>
              <h2 className="text-3xl font-bold font-display mb-6">Contact Information</h2>
              <p className="text-neutral-dark/80 mb-8">
                Find us on social media or drop us a line directly. We aim to respond within 24-48 hours!
              </p>
              <div className="space-y-4">
                <a href="mailto:support@threechicksandawick.com" className="flex items-center gap-4 group">
                  <Mail className="h-6 w-6 text-primary/80 group-hover:text-primary transition-colors" />
                  <span className="font-semibold text-neutral-dark group-hover:text-primary transition-colors">support@threechicksandawick.com</span>
                </a>
                <div className="flex items-center gap-4">
                  <Phone className="h-6 w-6 text-primary/80" />
                  <span className="font-semibold text-neutral-dark">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="h-6 w-6 text-primary/80" />
                  <span className="font-semibold text-neutral-dark">Made with ❤️ in the USA</span>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-neutral-dark/10">
                 <h3 className="text-xl font-bold font-display mb-4">Follow Our Adventures</h3>
                 <div className="flex space-x-4">
                    <Link href="#" className="text-neutral-dark/60 hover:text-primary transition-colors"><Instagram size={28} /></Link>
                    <Link href="#" className="text-neutral-dark/60 hover:text-primary transition-colors"><Facebook size={28} /></Link>
                    <Link href="#" className="text-neutral-dark/60 hover:text-primary transition-colors"><Twitter size={28} /></Link>
                 </div>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div>
              <form action="#" method="POST" className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-neutral-dark/90 mb-2">Full Name</label>
                  <input type="text" name="name" id="name" placeholder="Your Name" className="form-input" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-neutral-dark/90 mb-2">Email Address</label>
                  <input type="email" name="email" id="email" placeholder="you@example.com" className="form-input" />
                </div>
                 <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-neutral-dark/90 mb-2">Subject</label>
                  <input type="text" name="subject" id="subject" placeholder="How can we help?" className="form-input" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-neutral-dark/90 mb-2">Message</label>
                  <textarea name="message" id="message" rows={5} placeholder="Your message..." className="form-textarea"></textarea>
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