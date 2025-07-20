import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const makers = [
  {
    name: 'Sarah',
    role: 'Co-founder & Designer',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBK11u97mA1w8l1FvWEKhYfjATmBZ6-N1xaCmHlkvW9JavgC2q5jOTYWI-DLjCxNiGWldhxCN3y2kEOqC9_0zMKGaBXkaLR00iXX9oVQzqruYte07WoeUTXytFmzwaQHdrjlYSNcUnwW8GUn9SeXG6oJuXJUiYHZfaPhzXr16iUVzKfm3C1NBLFWD69o9lJxJsNgFQxXx3wnLnPO9ojMtp208pB4Nljq8O_X65aC2VJuENX8Ad0nB44maFzmMH1CSVccliG65EjyA',
  },
  {
    name: 'Emily',
    role: 'Co-founder & Crafter',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0QQh7fQjqweFNgaPrB2knMTrkNOUazy0A8lq7A61IPbU9DHoxoEiBRo4-wZ5nkkFKytnCtcjT8m8c_lhoDzuXZpkuxjMjhHzeBaOOKxSA0g4LnUEAoD7T4VkVMnpuAZ_wJCFHieeWhTGBY7Ui0USt6qgkXRQ1qyoy_Yb_uxqbtuA-S7VPshk1kVShoJGX-CrEpn0Xrie2xJ8qJepv1xa2P2GT1DVe9ADBXU7FNCp4uVOYXRZ5WNOjXnaOTl-ms9-u7FrzLFM3QQ',
  },
  {
    name: 'Chloe',
    role: 'Co-founder & Marketer',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs0x2nKPob62QJoSokh31ZKXCyxDHrw8Afx6NGwJfvYZiP7_M_ggig6yvYzca0FlQZAaUoDc1mlBnorfvTzCwVJL3iXuoGLxAMVH4aq0-R1ZDrMnr1voz-KRFCZsJICE4eI_U7VEyJ7RzBYoA8pcGI1Bz2RNUlKEpbn-Q8kcGwQJDLVuCZiq2QRSj1q6dpDqZmnwIdseOgbqKNcaKFJn9guKxBw1XUzq6fZPF4CEIY2uU5TIOFXgKP54AscsIzQ5k3OYb3k5q41A',
  },
];

export default function AboutUsPage() {
  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="text-center py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight text-neutral-dark mb-4">
            Our Story
          </h1>
          <p className="max-w-3xl mx-auto text-lg leading-relaxed text-neutral-dark/80">
            Three friends, one passion. A journey of creativity, laughter, and the warm glow of handmade candles.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-16">
          {/* Story Section */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="mx-auto max-w-lg">
                <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-[4/5] order-last md:order-first">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBqM7bZW14eyo8-Hv7BRwrFH77ZwmI37cbA8l21g0m3G7R1Khkclvg3A10axM0ylV8PwLLGxIXw0IY-ORq5rE8beyiv9aE8DHhK6FEtGNxHoTS-4fRXhVSZLUi0a7SOtFs6l2iqrmybwaVd0RCWbo1MmKIefPC8N2Ek3rB4STh-JmRBim66Z22xviNyouYq4M2lAuFS4xT5cvUMRZh1SDGSPrU1qxzmG5OV0VMKQilWVfibK-XbVci0CdhUdiTMK6qNLkFNCcBsg"
                    alt="Three friends crafting candles together"
                    layout="fill"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="text-left">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">From a Dream to a Wick</h2>
                <p className="text-lg leading-relaxed mb-6 text-neutral-dark/90">
                  Three Chicks and a Wick was born from a shared love for crafting and a desire to create something beautiful and meaningful. Founded by three friends, Sarah, Emily, and Chloe, our journey began in a small workshop filled with laughter, creativity, and the sweet scent of essential oils. We believe in the power of handmade goods to bring warmth and joy into everyday life.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mt-8">
                  <div>
                    <h3 className="text-2xl font-display font-bold mb-2">Our Mission</h3>
                    <p className="leading-relaxed text-neutral-dark/80">
                      To craft high-quality, eco-friendly candles and goods that inspire and uplift, using sustainable materials and a personal touch.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold mb-2">Our Values</h3>
                    <p className="leading-relaxed text-neutral-dark/80">
                      We champion creativity, sustainability, and community, celebrating the simple joys of life through our craft.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="my-16 border-neutral-dark/10" />

          {/* Meet the Makers Section */}
          <section className="mb-16">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-12">Meet the Makers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {makers.map((maker) => (
                  <div key={maker.name} className="flex flex-col items-center group">
                    <div className="relative mb-4 w-40 h-40">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-100 to-amber-100 transform group-hover:scale-110 transition-transform duration-300"></div>
                      <div className="relative w-full h-full rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <Image
                          src={maker.imageUrl}
                          alt={`Portrait of ${maker.name}`}
                          layout="fill"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-display font-bold mt-2">{maker.name}</h3>
                    <p className="text-neutral-dark/80 font-medium">{maker.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <hr className="my-16 border-neutral-dark/10" />

          {/* Join Community Section */}
          <section>
            <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Join Our Community</h2>
                <p className="max-w-2xl mx-auto text-lg text-neutral-dark/80 mb-8">
                    Follow our journey and be the first to know about new scents, special offers, and behind-the-scenes moments.
                </p>
                <div className="flex justify-center gap-6">
                    <Link href="#" className="text-primary hover:scale-110 transition-transform"><Instagram size={32} /></Link>
                    <Link href="#" className="text-primary hover:scale-110 transition-transform"><Facebook size={32} /></Link>
                    <Link href="#" className="text-primary hover:scale-110 transition-transform"><Twitter size={32} /></Link>
                </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 