'use client';

export default function NewsletterSignup() {
  return (
    <section className="py-8 sm:py-16">
      <div className="container mx-auto">
        <div className="rounded-3xl bg-[var(--primary)] p-8 sm:p-16 text-center text-white">
          <h2 className="text-4xl font-black tracking-tight">
            Join the Family
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg">
            Sign up for our newsletter to get updates on new products,
            special offers, and more.
          </p>
          <form className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <input
              className="w-full max-w-sm rounded-full border-2 border-gray-200 px-6 py-4 text-center text-[var(--neutral-dark)] placeholder:text-gray-500 transition-colors duration-300 focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
              placeholder="Enter your email"
              type="email"
            />
            <button
              className="btn-secondary w-full sm:w-auto"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
} 