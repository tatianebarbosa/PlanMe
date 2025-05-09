/**
 * TypewriterSounds - Sistema de sons para máquina de escrever
 * JavaScript puro para efeitos sonoros realistas
 */

export class TypewriterSounds {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    this.initAudioContext();
  }

  /**
   * Inicializa o contexto de áudio
   */
  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext não suportado neste navegador', error);
      this.isEnabled = false;
    }
  }

  /**
   * Gera som de tecla da máquina de escrever
   */
  public playKeyPress() {
    if (!this.isEnabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Conecta os nós
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Configura o som da tecla
    oscillator.frequency.setValueAtTime(
      200 + Math.random() * 100, // Frequência aleatória para variedade
      this.audioContext.currentTime
    );
    oscillator.type = 'square';

    // Envelope do som
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);

    // Toca o som
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  /**
   * Gera som de campainha (final da linha)
   */
  public playBell() {
    if (!this.isEnabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Som de campainha
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  /**
   * Som de papel sendo inserido/removido
   */
  public playPaperSlide() {
    if (!this.isEnabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * Ativa/desativa os sons
   */
  public toggleSounds() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  /**
   * Verifica se os sons estão habilitados
   */
  public isAudioEnabled() {
    return this.isEnabled && this.audioContext !== null;
  }
}

/**
 * TypewriterEffects - Efeitos visuais em JavaScript puro
 */
export class TypewriterEffects {
  
  /**
   * Cria efeito de tinta respingando
   */
  static createInkSplatter(element: HTMLElement, x: number, y: number) {
    const splatter = document.createElement('div');
    splatter.className = 'absolute w-2 h-2 bg-vintage-brown rounded-full animate-ink-splatter pointer-events-none';
    splatter.style.left = `${x}px`;
    splatter.style.top = `${y}px`;
    
    element.appendChild(splatter);
    
    // Remove o elemento após a animação
    setTimeout(() => {
      if (splatter.parentNode) {
        splatter.parentNode.removeChild(splatter);
      }
    }, 400);
  }

  /**
   * Efeito de tecla pressionada
   */
  static animateKeyPress(key: HTMLElement) {
    key.classList.add('animate-key-press');
    
    setTimeout(() => {
      key.classList.remove('animate-key-press');
    }, 100);
  }

  /**
   * Efeito de papel deslizando
   */
  static animatePaperSlide(paper: HTMLElement) {
    paper.classList.add('animate-paper-slide');
    
    setTimeout(() => {
      paper.classList.remove('animate-paper-slide');
    }, 500);
  }

  /**
   * Adiciona brilho vintage ao texto
   */
  static addVintageGlow(element: HTMLElement) {
    element.classList.add('animate-vintage-glow');
  }

  /**
   * Remove brilho vintage
   */
  static removeVintageGlow(element: HTMLElement) {
    element.classList.remove('animate-vintage-glow');
  }

  /**
   * Efeito de campaninha visual
   */
  static ringBell(bell: HTMLElement) {
    bell.classList.add('animate-typewriter-bell');
    
    setTimeout(() => {
      bell.classList.remove('animate-typewriter-bell');
    }, 300);
  }
}

/**
 * TypewriterKeyboard - Simulação de teclado de máquina de escrever
 */
export class TypewriterKeyboard {
  private keys: string[] = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Z', 'X', 'C', 'V', 'B', 'N', 'M'
  ];

  /**
   * Cria teclado virtual de máquina de escrever
   */
  public createKeyboard(container: HTMLElement, onKeyPress: (key: string) => void) {
    const keyboard = document.createElement('div');
    keyboard.className = 'grid grid-cols-10 gap-1 p-4 bg-vintage-brown/10 rounded-lg';

    this.keys.forEach((key, index) => {
      const keyElement = document.createElement('button');
      keyElement.textContent = key;
      keyElement.className = `
        w-8 h-8 bg-vintage-paper border-2 border-vintage-brown/30 rounded 
        font-vintage text-xs text-vintage-brown
        hover:bg-vintage-brown/20 hover:border-vintage-brown/50
        active:transform active:scale-95
        transition-all duration-100
        typewriter-keys
      `;

      // Quebra de linha para layout do teclado
      if (index === 10 || index === 19) {
        keyboard.appendChild(document.createElement('div')); // Espaçador
      }

      keyElement.addEventListener('click', () => {
        TypewriterEffects.animateKeyPress(keyElement);
        onKeyPress(key);
      });

      keyboard.appendChild(keyElement);
    });

    // Adiciona tecla de espaço
    const spaceBar = document.createElement('button');
    spaceBar.textContent = 'ESPAÇO';
    spaceBar.className = `
      col-span-6 h-8 bg-vintage-paper border-2 border-vintage-brown/30 rounded 
      font-vintage text-xs text-vintage-brown
      hover:bg-vintage-brown/20 hover:border-vintage-brown/50
      active:transform active:scale-95
      transition-all duration-100
      typewriter-keys mt-2
    `;

    spaceBar.addEventListener('click', () => {
      TypewriterEffects.animateKeyPress(spaceBar);
      onKeyPress(' ');
    });

    keyboard.appendChild(spaceBar);
    container.appendChild(keyboard);

    return keyboard;
  }

  /**
   * Simula pressionar tecla baseado no evento do teclado físico
   */
  public highlightPhysicalKey(key: string, keyboard: HTMLElement) {
    const keyElement = Array.from(keyboard.querySelectorAll('button')).find(
      btn => btn.textContent === key.toUpperCase()
    );

    if (keyElement) {
      TypewriterEffects.animateKeyPress(keyElement as HTMLElement);
    }
  }
}

/**
 * PaperCounter - Contador de páginas com efeito vintage
 */
export class PaperCounter {
  private count: number = 0;
  private element: HTMLElement | null = null;

  constructor(container: HTMLElement) {
    this.createElement(container);
  }

  private createElement(container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = `
      flex items-center space-x-2 p-2 bg-vintage-paper rounded-lg border border-vintage-brown/20
      font-vintage text-vintage-brown text-sm
    `;
    
    this.element.innerHTML = `
      <span>📄</span>
      <span>Páginas: <span class="page-count font-bold">0</span></span>
    `;

    container.appendChild(this.element);
  }

  public increment() {
    this.count++;
    this.updateDisplay();
    this.animateUpdate();
  }

  public decrement() {
    if (this.count > 0) {
      this.count--;
      this.updateDisplay();
      this.animateUpdate();
    }
  }

  public reset() {
    this.count = 0;
    this.updateDisplay();
    this.animateUpdate();
  }

  private updateDisplay() {
    if (this.element) {
      const countElement = this.element.querySelector('.page-count');
      if (countElement) {
        countElement.textContent = this.count.toString();
      }
    }
  }

  private animateUpdate() {
    if (this.element) {
      this.element.classList.add('animate-key-press');
      setTimeout(() => {
        this.element?.classList.remove('animate-key-press');
      }, 100);
    }
  }

  public getCount() {
    return this.count;
  }
}

/**
 * TypingSpeedMeter - Medidor de velocidade de digitação
 */
export class TypingSpeedMeter {
  private startTime: number = 0;
  private keyCount: number = 0;
  private element: HTMLElement | null = null;
  private isActive: boolean = false;

  constructor(container: HTMLElement) {
    this.createElement(container);
  }

  private createElement(container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = `
      flex items-center space-x-2 p-2 bg-vintage-paper rounded-lg border border-vintage-brown/20
      font-vintage text-vintage-brown text-sm
    `;
    
    this.element.innerHTML = `
      <span>⚡</span>
      <span>Velocidade: <span class="wpm-count font-bold">0</span> WPM</span>
    `;

    container.appendChild(this.element);
  }

  public startMeasuring() {
    this.startTime = Date.now();
    this.keyCount = 0;
    this.isActive = true;
  }

  public addKeyPress() {
    if (this.isActive) {
      this.keyCount++;
      this.updateWPM();
    }
  }

  public stopMeasuring() {
    this.isActive = false;
  }

  private updateWPM() {
    if (!this.isActive || this.startTime === 0) return;

    const elapsedMinutes = (Date.now() - this.startTime) / 60000;
    const wordsTyped = this.keyCount / 5; // Média de 5 caracteres por palavra
    const wpm = elapsedMinutes > 0 ? Math.round(wordsTyped / elapsedMinutes) : 0;

    if (this.element) {
      const wpmElement = this.element.querySelector('.wpm-count');
      if (wpmElement) {
        wpmElement.textContent = wpm.toString();
      }
    }
  }
}

// Exporta instância global dos efeitos sonoros
export const typewriterSounds = new TypewriterSounds();