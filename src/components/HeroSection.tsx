import SteampunkBackground from "@/components/ui/SteampunkBackground";

interface HeroSectionProps {
  isDark: boolean;
}

export default function HeroSection({ isDark }: HeroSectionProps) {
  return (
    <>
      <SteampunkBackground isDark={isDark} />
      <section className="hero-section min-h-screen duration-500">
        <div className="relative z-20 p-4 sm:p-6 lg:p-8">
          <main className="max-w-7xl mx-auto pt-16 sm:pt-20 md:pt-24">
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <h1 className="steampunk-heading-xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 sm:mb-4 transition-colors leading-tight steampunk-decorative">
                Stephanie Anderson
              </h1>
              <p className="hero-subtitle text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-6 lg:mb-8 transition-colors">
                Junior Developer
              </p>
            </div>

            <div className="hero-card steampunk-base-dark p-4 sm:p-6 lg:p-8 rounded-xl transition-all duration-500 max-w-4xl mx-auto">
              {/* Brass Bolts */}
              <div className="brass-bolt bolt-top-left"></div>
              <div className="brass-bolt bolt-top-right"></div>
              <div className="brass-bolt bolt-bottom-left"></div>
              <div className="brass-bolt bolt-bottom-right"></div>
              <h2 className="hero-card-title text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4">
                Welcome to My Victorian Workshop
              </h2>
              <p className="hero-card-text text-base sm:text-lg mb-3 sm:mb-4 leading-relaxed">
                Step into a world where steam-powered innovation meets modern
                web development.
              </p>
              <p className="hero-card-subtext text-sm sm:text-base leading-relaxed">
                Scroll down to explore my mechanical marvels and digital
                contraptions.
              </p>
            </div>
          </main>
        </div>
      </section>
    </>
  );
}
