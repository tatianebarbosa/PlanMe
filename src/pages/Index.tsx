import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import TypewriterWidget from '@/components/TypewriterWidget';
import PlannerMensal from '@/components/PlannerMensal';
import AnotacaoList from '@/components/AnotacaoList';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, BookOpen, Heart, Sparkles, Zap, Coffee } from 'lucide-react';
import { VintageInteractions, DOMParticles, StorageManager } from '@/lib/vintage-interactions';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'planner' | 'anotacoes'>('home');
  const [visitCount, setVisitCount] = useState(0);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const particlesRef = useRef<DOMParticles | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  // Efeitos de inicialização com JavaScript puro
  useEffect(() => {
    // Carrega e incrementa contador de visitas
    const savedCount = StorageManager.load<number>('visit_count') || 0;
    const newCount = savedCount + 1;
    setVisitCount(newCount);
    StorageManager.save('visit_count', newCount);

    // Inicializa sistema de partículas
    if (heroRef.current) {
      particlesRef.current = new DOMParticles(heroRef.current);
      particlesRef.current.animate();
    }

    // Efeito de digitação no título principal
    if (titleRef.current && activeTab === 'home') {
      VintageInteractions.typewriterText(
        titleRef.current,
        'Bem-vindo ao PlanMe!',
        100
      );
    }

    // Anima cards com atraso escalonado
    cardRefs.current.forEach((card, index) => {
      if (card) {
        setTimeout(() => {
          VintageInteractions.stampEffect(card);
        }, index * 200);
      }
    });

    // Cleanup
    return () => {
      if (particlesRef.current) {
        particlesRef.current.destroy();
      }
    };
  }, [activeTab]);

  // Handler para mudança de aba com efeitos
  const handleTabChange = (tab: 'home' | 'planner' | 'anotacoes') => {
    // Salva preferência
    StorageManager.save('last_tab', tab);
    
    // Efeito de partículas no clique
    if (particlesRef.current) {
      particlesRef.current.burst(
        window.innerWidth / 2,
        100,
        15
      );
    }

    setActiveTab(tab);
  };

  // Handler para click nos cards com efeitos especiais
  const handleCardClick = (card: HTMLElement, action: () => void) => {
    // Efeito de tinta se espalhando
    VintageInteractions.inkSpread(card);
    
    // Animação de papel inserindo
    setTimeout(() => {
      action();
    }, 300);
  };

  // Contador de estatísticas
  const handleStatsClick = (element: HTMLElement) => {
    const currentNumber = parseInt(element.textContent || '0');
    VintageInteractions.mechanicalCounter(element, currentNumber, currentNumber + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'planner':
        return <PlannerMensal />;
      case 'anotacoes':
        return <AnotacaoList />;
      default:
        return (
          <div className="space-y-12">
            {/* Hero Section */}
            <div ref={heroRef} className="text-center relative px-4 py-14 md:py-16">
                <div className="flex justify-center mb-8">
                  <img 
                    src="/assets/eb543096-c99c-44f7-ae59-6a4aa15e8764.png" 
                    alt="PlanMe Logo" 
                    className="h-44 md:h-48 max-w-[90vw] object-contain w-auto filter drop-shadow-2xl hover:animate-vintage-glow cursor-pointer"
                    onClick={(e) => particlesRef.current?.burst(e.clientX, e.clientY, 20)}
                  />
                </div>
                <h1 ref={titleRef} className="font-vintage text-4xl md:text-6xl text-vintage-brown mb-6">
                  Bem-vindo ao PlanMe!
                </h1>
                <p className="font-soft text-xl text-vintage-brown/80 mb-4 max-w-2xl mx-auto leading-relaxed">
                  Projeto final do curso Desenvolvedor Web no Senac. Um planner digital retrô
                  e fofo para organizar sua vida do seu jeitinho especial! ✨
                </p>
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <Coffee className="h-5 w-5 text-vintage-brown/50" />
                  <span className="font-vintage text-sm text-vintage-brown/70">
                    Visita #{visitCount}
                  </span>
                  <Zap className="h-5 w-5 text-vintage-brown/50" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => handleTabChange('planner')}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground font-soft text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Ver Meu Planner
                  </Button>
                  <Button
                    onClick={() => handleTabChange('anotacoes')}
                    variant="outline"
                    className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-soft text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Minhas Anotações
                  </Button>
                </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="vintage-paper hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/30 transition-colors duration-300">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-vintage text-xl text-vintage-brown mb-4">
                    Planner Mensal
                  </h3>
                  <p className="font-soft text-vintage-brown/80 leading-relaxed">
                    Visualize seus compromissos, eventos e lembretes em um calendário 
                    fofo e organizado.
                  </p>
                </CardContent>
              </Card>

              <Card className="vintage-paper hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/30 transition-colors duration-300">
                    <BookOpen className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-vintage text-xl text-vintage-brown mb-4">
                    Anotações Retrô
                  </h3>
                  <p className="font-soft text-vintage-brown/80 leading-relaxed">
                    Crie, edite e organize suas anotações com categorias 
                    personalizadas e busca inteligente.
                  </p>
                </CardContent>
              </Card>

              <Card className="vintage-paper hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/30 transition-colors duration-300">
                    <Heart className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-vintage text-xl text-vintage-brown mb-4">
                    Widget Flutuante
                  </h3>
                  <p className="font-soft text-vintage-brown/80 leading-relaxed">
                    Máquina de escrever vintage sempre à disposição para 
                    capturar suas ideias rapidamente.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quote Section */}
            <section className="px-4 py-12 text-center">
                <Sparkles className="h-12 w-12 text-vintage-brown/50 mx-auto mb-6" />
                <blockquote className="font-vintage text-2xl text-vintage-brown mb-4 italic">
                  "A organização é a chave para transformar sonhos em realidade"
                </blockquote>
                <p className="font-soft text-vintage-brown/70">
                  - Filosofia PlanMe
                </p>
            </section>

            {/* Como Usar Section */}
            <Card className="vintage-paper">
              <CardContent className="p-8">
                <h2 className="font-vintage text-3xl text-vintage-brown text-center mb-8">
                  Como usar o PlanMe
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-vintage font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-vintage text-lg text-vintage-brown mb-2">
                          Planeje seu mês
                        </h4>
                        <p className="font-soft text-vintage-brown/80">
                          Use o planner mensal para visualizar e organizar seus compromissos.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-vintage font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-vintage text-lg text-vintage-brown mb-2">
                          Anote suas ideias
                        </h4>
                        <p className="font-soft text-vintage-brown/80">
                          Capture pensamentos e tarefas em anotações organizadas por categoria.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-vintage font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-vintage text-lg text-vintage-brown mb-2">
                          Use o widget flutuante
                        </h4>
                        <p className="font-soft text-vintage-brown/80">
                          Clique na máquina de escrever para anotações rápidas em qualquer momento.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-vintage-flower rounded-full flex items-center justify-center text-white font-vintage font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="font-vintage text-lg text-vintage-brown mb-2">
                          Organize do seu jeito
                        </h4>
                        <p className="font-soft text-vintage-brown/80">
                          Personalize categorias, busque rapidamente e mantenha tudo organizado.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main Content */}
      <main className="container mx-auto w-full flex-1 px-6 py-12">
        {renderContent()}
      </main>

      {/* Widget Flutuante da Máquina de Escrever */}
      <TypewriterWidget />

      {/* Footer */}
      <footer className="vintage-paper border-t border-vintage-brown/20 mt-auto">
        <div className="container mx-auto px-6 py-8 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/b186d210-24c0-40a1-a9c8-5f6669a3c00b.png" 
              alt="PlanMe Typewriter" 
              className="h-12 w-12 opacity-50"
            />
          </div>
          <p className="font-soft text-vintage-brown/70">
            PlanMe © 2025 - Projeto Final Senac | Desenvolvedor Web
          </p>
          <p className="font-vintage text-sm text-vintage-brown/50 mt-2">
            Seu planner, do seu jeitinho ✨
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
