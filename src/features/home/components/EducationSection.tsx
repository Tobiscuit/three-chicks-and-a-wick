import { Leaf, BrainCircuit, Flame } from 'lucide-react';

const educationData = [
  {
    icon: Leaf,
    title: 'The Soul of the Candle: Our Wax',
    description:
      "We exclusively use natural, eco-friendly waxes like soy and coconut wax. They provide a cleaner, longer-lasting burn without the toxins of traditional paraffin, ensuring a healthier home for you and the planet.",
    link: '#',
  },
  {
    icon: BrainCircuit,
    title: 'The Power of Scent',
    description:
      'Scents have a profound effect on our minds. From calming lavender to energizing citrus, our handcrafted fragrances are designed to enhance your mood, sharpen your focus, and transform your space into a sanctuary.',
    link: '#',
  },
  {
    icon: Flame,
    title: 'The Heartbeat of the Flame: The Wick',
    description:
      'The wick is more than just a string. We choose between the gentle crackle of a wooden wick for a cozy ambiance or the classic, steady glow of a cotton wick. Each is chosen to perfectly complement the candle\'s character.',
    link: '#',
  },
];

export default function EducationSection() {
  return (
    <section className="bg-white pt-12 sm:pt-16 pb-12 sm:pb-16">
      <div className="container mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-sans font-black tracking-tight md:text-5xl">
            Mindful Materials, Magical Scents
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-lg text-neutral-dark/80">
            We believe that what goes into your products matters. Discover the
            passion and principles behind every item we craft.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:gap-10">
          {educationData.map((item) => (
            <div key={item.title} className="text-center bg-white/50 rounded-3xl p-8 transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-5 text-xl font-bold font-sans">{item.title}</h3>
              <p className="mt-3 text-base text-neutral-dark/70 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 