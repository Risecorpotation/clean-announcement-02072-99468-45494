import { useRef, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const TestimonialsCarousel = () => {
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 2400,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [api, setApi] = useState<CarouselApi>();
  const manualClickTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      // Detecta se foi clique manual (não é autoplay)
      if (autoplayPlugin.current && !autoplayPlugin.current.isPlaying()) {
        return;
      }

      // Para o autoplay
      autoplayPlugin.current?.stop();

      // Limpa timeout anterior se existir
      if (manualClickTimeoutRef.current) {
        clearTimeout(manualClickTimeoutRef.current);
      }

      // Reinicia após 3.4 segundos
      manualClickTimeoutRef.current = setTimeout(() => {
        autoplayPlugin.current?.play();
      }, 3400);
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
      if (manualClickTimeoutRef.current) {
        clearTimeout(manualClickTimeoutRef.current);
      }
    };
  }, [api]);
  const testimonials = [
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/01-t-Yg2457Xobqh14GnV.png",
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/02-t-AoP4NDQxREi2yzNe.png",
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/03-t-AGBzvqVEoGSqV8M1.png",
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/04-t-ALp2b8LZx3h0r24N.png",
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/06-t-dJoPNlODwwhzln5l.png",
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/08-t-mnl452EOJGF34ebk.png",
    "https://assets.zyrosite.com/A1az6jRbQRIEyj59/09-t-AMqDp2w39rS1OzWa.png",
  ];

  return (
    <section className="w-full py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-extrabold leading-tight mb-8 md:mb-12 text-[clamp(32px,4.2vw,38px)] max-w-[680px] mx-auto text-center">
          O que <span className="neon-run">nossos membros</span><br />
          estão falando
        </h2>

        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
          }}
          plugins={[autoplayPlugin.current]}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((img, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <div className="rounded-[22px] overflow-hidden bg-transparent shadow-[0_0_18px_rgba(0,0,0,.6)] border border-white/[0.08]">
                    <img
                      src={img}
                      alt={`Depoimento ${index + 1}`}
                      className="w-full h-auto block"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>

      <style>{`
        .neon-run {
          background: linear-gradient(90deg, hsl(var(--foreground)) 0%, hsl(var(--primary)) 25%, hsl(0 92% 55%) 50%, hsl(var(--foreground)) 75%, hsl(var(--primary)) 100%);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: sweep 6s linear infinite;
        }
        @keyframes sweep {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </section>
  );
};

export default TestimonialsCarousel;
