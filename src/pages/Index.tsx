import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import MembersCounter from "@/components/MembersCounter";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { useEffect, useRef, useState } from "react";

const Index = () => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isContentRevealed, setIsContentRevealed] = useState(false);

  useEffect(() => {
    // Function to reveal content and persist state
    const revealContentPermanently = (reason: string) => {
      console.log(`Revelando conteúdo: ${reason}`);
      setIsContentRevealed(true);
      localStorage.setItem('riseContentRevealed', 'true');
    };

    // 1. Check if user has seen content before (localStorage)
    const hasSeenBefore = localStorage.getItem('riseContentRevealed') === 'true';
    if (hasSeenBefore) {
      setIsContentRevealed(true);
      console.log('Revelando conteúdo: Usuário retornando');
    }

    // 2. Initialize VTurb player (ALWAYS load the video)
    if (videoContainerRef.current) {
      // Inject VTurb video player
      videoContainerRef.current.innerHTML = `
        <vturb-smartplayer id="vid-68eed696fb7a09347947594e" style="display: block; margin: 0 auto; width: 100%;"></vturb-smartplayer>
      `;
      
      // Load VTurb script
      const script = document.createElement("script");
      script.src = "https://scripts.converteai.net/364a0632-eaa4-40b9-91aa-5c5a18cd191e/players/68eed696fb7a09347947594e/v4/player.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // 3. Function to check VTurb player and set up event listeners
    // Only set up events if content hasn't been revealed yet
    if (!hasSeenBefore) {
      const checkVTurbPlayer = () => {
        if (window.smartplayer?.instances?.length > 0) {
          const playerInstance = window.smartplayer.instances[0];
          
          // Check if in "continue watching" mode
          if (playerInstance.resume?.inResume) {
            revealContentPermanently('Modo resume detectado');
            return;
          }

          // Listen for video ended event
          playerInstance.on('ended', () => {
            revealContentPermanently('Vídeo completado');
          });

          // Listen for progress event (reveal at 90%)
          playerInstance.on('progress', (data: any) => {
            if (data?.progress >= 90) {
              revealContentPermanently('90% do vídeo assistido');
            }
          });
        } else {
          // Player not loaded yet, try again
          setTimeout(checkVTurbPlayer, 500);
        }
      };

      // 4. Timer: Reveal after 1 minute and 40 seconds (100 seconds)
      const originalTimer = setTimeout(() => {
        revealContentPermanently('Timer padrão (1min40s)');
      }, 100000);

      // 5. Fallback timer: Reveal after 2 minutes (120 seconds) for safety
      const fallbackTimer = setTimeout(() => {
        revealContentPermanently('Fallback timer (2min)');
      }, 120000);

      // Start checking for player
      checkVTurbPlayer();

      return () => {
        clearTimeout(originalTimer);
        clearTimeout(fallbackTimer);
      };
    }

  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-12 md:pt-16 pb-6 md:pb-8 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight">
          O acesso que você nunca teve. em um só lugar
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
          chega de pular de curso em curso aqui ta tudo no mesmo lugar
        </p>
      </section>

      {/* VSL Section */}
      <section className="container mx-auto px-4 pb-6 md:pb-8">
        <div className="max-w-4xl mx-auto">
          <div ref={videoContainerRef} className="rounded-xl overflow-hidden" />
        </div>
      </section>

      {/* Spacer - maintains layout before content is revealed */}
      {!isContentRevealed && (
        <section className="container mx-auto px-4 py-6 md:py-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Empty space to maintain layout */}
          </div>
        </section>
      )}

      {/* Content revealed after timer */}
      {isContentRevealed && (
        <>
          {/* CTA Section */}
          <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="text-center max-w-md mx-auto">
          <Button 
            variant="cta" 
            size="lg" 
            className="w-full text-base md:text-lg py-6 md:py-7 font-bold"
            onClick={() => {
              document.getElementById('pricing-section')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
              });
            }}
          >
            QUERO FAZER PARTE AGORA
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 text-center">
            O Que Você Vai Ter Acesso:
          </h2>
          <div className="space-y-4">
            {[
              "Cursos completos dos maiores nomes do marketing digital",
              "Atualizações semanais com novos materiais, estratégias e packs",
              "Fornecedores liberados: acesso aos nossos fornecedores de rateio",
              "Grupo de networking ativo no WhatsApp para troca de ideas",
              "Área exclusiva no Discord com canais por tema e segmento",
              "Afiliação da comunidade liberada pra se afiliar e lucrar com a estrutura ja validada",
              "Ferramentas, templates e scripts que já estão dando resultado pra outros membros",
              "Acesso vitalício. Uma vez pago, é seu pra sempre",
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 md:p-5 rounded-xl bg-card border border-border/60 transition-all hover:border-primary/40 hover:bg-card/80"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center mt-0.5 border border-primary/20">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <p className="text-base md:text-lg text-foreground/90">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsCarousel />

      {/* Members Counter Section */}
      <MembersCounter />

      {/* Guarantee Section */}
      <section className="w-full py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card border border-border rounded-2xl p-6 md:p-10 overflow-hidden">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
            
            {/* Content */}
            <div className="relative z-10 text-center space-y-4 md:space-y-5">
              {/* Badge with "7" */}
              <div className="flex justify-center mb-2">
                <div className="relative">
                  <div className="w-28 h-32 md:w-32 md:h-36 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-[var(--shadow-glow)]">
                    <div className="text-center">
                      <div className="text-5xl md:text-6xl font-black text-white leading-none mb-1">7</div>
                      <div className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">DIAS DE</div>
                      <div className="text-xs md:text-sm font-bold text-white uppercase tracking-wider">GARANTIA</div>
                    </div>
                  </div>
                  {/* Stars decoration */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                Não curtiu? A gente<br />devolve seu dinheiro.
              </h2>

              {/* Description */}
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Você tem até 7 dias para acessar tudo e decidir se a Rise Community é pra você. Caso mude de ideia, devolvemos 100% do valor pago — sem perguntas, sem burocracia e sem estresse.
              </p>
            </div>

            {/* Decorative glow elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-card border border-border/60 rounded-xl p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Tudo isso está incluso no seu acesso
            </h3>
            
            <div className="space-y-3 mb-8">
              {[
                "Comunidade fechada no Discord e telegram (com canais organizados por tema)",
                "Grupos de Networking no WhatsApp com membros ativos",
                "Acesso imediato à afiliação da comunidade — um produto validado pra você começar a faturar ainda hoje.",
                "Atualizações semanais com novos conteúdos e ferramentas",
                "Suporte direto da equipe em caso de dúvidas",
                "Bônus: Fornecedores de rateio",
                "Bônus: Consultar dados via Telegram",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <p className="text-sm md:text-base text-foreground/90">{item}</p>
                </div>
              ))}
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-2">POR APENAS 12X DE</p>
              <div className="mb-2">
                <span className="text-4xl md:text-5xl font-bold text-primary">R$5,81</span>
              </div>
              <p className="text-sm text-muted-foreground">OU R$ 49,90 À VISTA</p>
            </div>

            <Button 
              variant="cta" 
              size="lg" 
              className="w-full text-base md:text-lg py-6 md:py-7 font-bold"
              asChild
            >
              <a href="https://pay.cakto.com.br/9govdjp_605757" target="_blank" rel="noopener noreferrer">
                COMEÇAR AGORA
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* WhatsApp Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-xl mx-auto">
          <div className="bg-card border border-border/60 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ficou com alguma dúvida?</h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe está disponível para te ajudar. É só chamar no WhatsApp e tirar todas as suas dúvidas sobre a comunidade.
            </p>
            <Button variant="whatsapp" size="lg" className="w-full gap-3" asChild>
              <a href="https://wa.me/556181720408?text=Ol%C3%A1%2C+tenho+algumas+d%C3%BAvidas+sobre+a+Rise+Community%2C+poderia+me+ajudar%3F" target="_blank" rel="noopener noreferrer">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Iniciar conversa
              </a>
            </Button>
          </div>
        </div>
      </section>

        </>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground space-y-4">
          <p>© 2025 Rise Community — Todos os direitos reservados.</p>
          <p>
            <a href="#" className="hover:text-foreground transition-colors">Termos de Uso</a>
            {" | "}
            <a href="#" className="hover:text-foreground transition-colors">Política de Privacidade</a>
          </p>
          
          {/* Disclaimer always visible */}
          <p className="max-w-2xl mx-auto">
            As informações fornecidas neste site são utilizadas apenas para oferecer uma experiência personalizada.
          </p>
          <p className="max-w-2xl mx-auto">
            Este site não é afiliado ao Facebook ou à Meta Inc. Resultados podem variar de pessoa para pessoa.
          </p>
          <p className="max-w-2xl mx-auto">
            Seus dados estão protegidos: nunca enviamos spam ou compartilhamos informações com terceiros.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
