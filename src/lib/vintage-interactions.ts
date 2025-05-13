/**
 * VintageInteractions - Efeitos JavaScript puro para interações vintage
 */

export class VintageInteractions {
  
  /**
   * Adiciona efeito de máquina de escrever ao texto
   */
  static typewriterText(element: HTMLElement, text: string, speed: number = 100): Promise<void> {
    return new Promise((resolve) => {
      element.textContent = '';
      let i = 0;
      
      const cursor = document.createElement('span');
      cursor.textContent = '|';
      cursor.className = 'animate-pulse text-primary';
      element.appendChild(cursor);
      
      const timer = setInterval(() => {
        if (i < text.length) {
          element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
          i++;
        } else {
          clearInterval(timer);
          cursor.remove();
          resolve();
        }
      }, speed);
    });
  }

  /**
   * Efeito de papel vintage sendo "carimbado"
   */
  static stampEffect(element: HTMLElement) {
    const originalTransform = element.style.transform;
    const originalOpacity = element.style.opacity;
    
    element.style.transform = 'scale(0.95) rotate(-1deg)';
    element.style.opacity = '0.8';
    element.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    setTimeout(() => {
      element.style.transform = 'scale(1) rotate(0deg)';
      element.style.opacity = '1';
      
      // Cria efeito de "tinta"
      const inkBlot = document.createElement('div');
      inkBlot.className = 'absolute -top-2 -right-2 w-4 h-4 bg-vintage-brown/20 rounded-full animate-ink-splatter';
      element.style.position = 'relative';
      element.appendChild(inkBlot);
      
      setTimeout(() => {
        inkBlot.remove();
        element.style.transform = originalTransform;
        element.style.opacity = originalOpacity;
      }, 600);
    }, 100);
  }

  /**
   * Simula papel sendo inserido na máquina de escrever
   */
  static paperInsertAnimation(container: HTMLElement, content: string) {
    const paper = document.createElement('div');
    paper.className = `
      absolute top-0 left-0 w-full h-full bg-vintage-paper 
      border border-vintage-brown/30 rounded-lg p-4
      transform translate-y-full opacity-0
    `;
    paper.innerHTML = `
      <div class="font-vintage text-vintage-brown">
        ${content}
      </div>
    `;
    
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.appendChild(paper);
    
    // Anima a entrada do papel
    requestAnimationFrame(() => {
      paper.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      paper.style.transform = 'translate-y-0';
      paper.style.opacity = '1';
    });
    
    return paper;
  }

  /**
   * Efeito de tinta se espalhando
   */
  static inkSpread(element: HTMLElement, color: string = 'hsl(var(--vintage-brown))') {
    const rect = element.getBoundingClientRect();
    const drops = 5;
    
    for (let i = 0; i < drops; i++) {
      const drop = document.createElement('div');
      drop.style.position = 'absolute';
      drop.style.width = '3px';
      drop.style.height = '3px';
      drop.style.backgroundColor = color;
      drop.style.borderRadius = '50%';
      drop.style.pointerEvents = 'none';
      drop.style.zIndex = '1000';
      
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height;
      
      drop.style.left = x + 'px';
      drop.style.top = y + 'px';
      
      document.body.appendChild(drop);
      
      // Anima a gota
      const animation = drop.animate([
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(3)', opacity: 0 }
      ], {
        duration: 800,
        easing: 'ease-out'
      });
      
      animation.onfinish = () => drop.remove();
    }
  }

  /**
   * Contador vintage com efeito mecânico
   */
  static mechanicalCounter(element: HTMLElement, from: number, to: number, duration: number = 1000) {
    const increment = to > from ? 1 : -1;
    const steps = Math.abs(to - from);
    const stepDuration = duration / steps;
    
    let current = from;
    element.textContent = current.toString();
    
    const counter = setInterval(() => {
      current += increment;
      element.textContent = current.toString();
      
      // Efeito visual de "clique" mecânico
      element.style.transform = 'scale(1.1)';
      element.style.color = 'hsl(var(--primary))';
      
      setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.color = '';
      }, 50);
      
      if (current === to) {
        clearInterval(counter);
      }
    }, stepDuration);
  }

  /**
   * Efeito de página virando
   */
  static pageFlip(element: HTMLElement, direction: 'left' | 'right' = 'right') {
    const flipDirection = direction === 'right' ? 1 : -1;
    
    element.style.transition = 'transform 0.6s ease-in-out';
    element.style.transformOrigin = direction === 'right' ? 'left center' : 'right center';
    element.style.transformStyle = 'preserve-3d';
    
    // Primeira metade da animação
    element.style.transform = `rotateY(${90 * flipDirection}deg)`;
    
    setTimeout(() => {
      // Muda o conteúdo no meio da animação
      element.style.transform = `rotateY(${90 * flipDirection}deg) scale(0.8)`;
      
      setTimeout(() => {
        // Segunda metade da animação
        element.style.transform = 'rotateY(0deg) scale(1)';
        
        setTimeout(() => {
          element.style.transform = '';
          element.style.transition = '';
        }, 600);
      }, 50);
    }, 300);
  }

  /**
   * Simula digitação em tempo real com erros e correções
   */
  static realisticTyping(
    element: HTMLElement, 
    text: string, 
    options: {
      speed?: number;
      errorRate?: number;
      correctionDelay?: number;
    } = {}
  ): Promise<void> {
    return new Promise((resolve) => {
      const {
        speed = 150,
        errorRate = 0.05,
        correctionDelay = 300
      } = options;

      let currentText = '';
      let i = 0;
      
      const type = () => {
        if (i < text.length) {
          const char = text.charAt(i);
          
          // Simula erro de digitação
          if (Math.random() < errorRate && char !== ' ') {
            const wrongChar = String.fromCharCode(char.charCodeAt(0) + (Math.random() > 0.5 ? 1 : -1));
            currentText += wrongChar;
            element.textContent = currentText + '|';
            
            // Corrige após um tempo
            setTimeout(() => {
              currentText = currentText.slice(0, -1);
              element.textContent = currentText + '|';
              setTimeout(type, speed / 2);
            }, correctionDelay);
          } else {
            currentText += char;
            element.textContent = currentText + '|';
            i++;
            setTimeout(type, speed + Math.random() * 50);
          }
        } else {
          element.textContent = currentText;
          resolve();
        }
      };
      
      type();
    });
  }
}

/**
 * DOMParticles - Sistema de partículas em JavaScript puro
 */
export class DOMParticles {
  private particles: HTMLElement[] = [];
  private container: HTMLElement;
  private animationId: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';
  }

  createParticle(config: {
    x: number;
    y: number;
    size: number;
    color: string;
    life: number;
    vx?: number;
    vy?: number;
  }) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = config.size + 'px';
    particle.style.height = config.size + 'px';
    particle.style.backgroundColor = config.color;
    particle.style.borderRadius = '50%';
    particle.style.left = config.x + 'px';
    particle.style.top = config.y + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '999';
    
    const particleData = {
      element: particle,
      x: config.x,
      y: config.y,
      vx: config.vx || (Math.random() - 0.5) * 2,
      vy: config.vy || (Math.random() - 0.5) * 2,
      life: config.life,
      maxLife: config.life
    };
    
    this.container.appendChild(particle);
    this.particles.push(particle);
    
    return particleData;
  }

  burst(x: number, y: number, count: number = 10) {
    for (let i = 0; i < count; i++) {
      this.createParticle({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        size: Math.random() * 4 + 2,
        color: `hsl(${Math.random() * 60 + 15}, 70%, 60%)`,
        life: Math.random() * 2000 + 1000,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 1
      });
    }
  }

  update() {
    this.particles = this.particles.filter(particle => {
      const rect = particle.getBoundingClientRect();
      const containerRect = this.container.getBoundingClientRect();
      
      // Remove partículas que saíram da tela ou expiraram
      if (rect.top > containerRect.bottom || 
          rect.bottom < containerRect.top ||
          rect.left > containerRect.right ||
          rect.right < containerRect.left) {
        particle.remove();
        return false;
      }
      
      return true;
    });
  }

  animate() {
    this.update();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    cancelAnimationFrame(this.animationId);
    this.particles.forEach(particle => particle.remove());
    this.particles = [];
  }
}

/**
 * StorageManager - Gerenciador de localStorage com efeitos
 */
export class StorageManager {
  private static readonly PREFIX = 'planme_';
  
  static save(key: string, data: any, showEffect: boolean = true): void {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      if (showEffect) {
        this.showSaveEffect();
      }
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }
  
  static load<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      if (item) {
        const parsed = JSON.parse(item);
        return parsed.data;
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
    }
    return null;
  }
  
  static remove(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }
  
  static clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
  
  private static showSaveEffect(): void {
    const toast = document.createElement('div');
    toast.className = `
      fixed top-4 right-4 z-50 px-4 py-2 bg-primary text-primary-foreground 
      rounded-lg shadow-lg font-vintage text-sm
      transform translate-x-full opacity-0
      transition-all duration-300
    `;
    toast.textContent = '💾 Salvo!';
    
    document.body.appendChild(toast);
    
    // Anima entrada
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    });
    
    // Remove após 2 segundos
    setTimeout(() => {
      toast.style.transform = 'translateX(full)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
}