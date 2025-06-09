import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Save, Edit3, Volume2, VolumeX, Settings, Zap, FileText, Keyboard } from 'lucide-react';
import { 
  typewriterSounds, 
  TypewriterEffects, 
  TypewriterKeyboard, 
  PaperCounter, 
  TypingSpeedMeter 
} from '@/lib/typewriter-effects';

interface Note {
  id: string;
  content: string;
  createdAt: string;
  wordCount: number;
}

const TypewriterWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const paperCounterRef = useRef<PaperCounter | null>(null);
  const speedMeterRef = useRef<TypingSpeedMeter | null>(null);
  const typewriterKeyboardRef = useRef<TypewriterKeyboard | null>(null);

  // Contador de palavras
  const getWordCount = (text: string): number => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  // Função avançada para efeito sonoro de máquina de escrever
  const playAdvancedTypewriterSound = useCallback((char: string) => {
    if (!soundEnabled) return;

    setIsTyping(true);
    
    // Sons diferentes para diferentes tipos de caracteres
    if (char === ' ') {
      typewriterSounds.playKeyPress();
    } else if (char === '\n' || char === '\r') {
      typewriterSounds.playBell();
      // Efeito visual de campainha
      if (modalRef.current) {
        const bell = modalRef.current.querySelector('.typewriter-bell');
        if (bell) {
          TypewriterEffects.ringBell(bell as HTMLElement);
        }
      }
    } else if (/[.!?]/.test(char)) {
      typewriterSounds.playKeyPress();
      // Efeito de respingo de tinta para pontuação
      if (textareaRef.current) {
        const rect = textareaRef.current.getBoundingClientRect();
        TypewriterEffects.createInkSplatter(
          textareaRef.current.parentElement!,
          Math.random() * rect.width,
          Math.random() * rect.height
        );
      }
    } else {
      typewriterSounds.playKeyPress();
    }

    // Adiciona medição de velocidade
    speedMeterRef.current?.addKeyPress();

    setTimeout(() => setIsTyping(false), 100);
  }, [soundEnabled]);

  // Handler avançado para digitação
  const handleAdvancedKeyPress = useCallback((e: React.KeyboardEvent) => {
    const char = e.key;
    playAdvancedTypewriterSound(char);
    
    // Auto-expandir textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      }
    }, 0);

    // Highlight da tecla física no teclado virtual
    if (showKeyboard && typewriterKeyboardRef.current && keyboardRef.current) {
      typewriterKeyboardRef.current.highlightPhysicalKey(char, keyboardRef.current);
    }

    // Verifica se atingiu o final da linha (simulação)
    if (textareaRef.current && textareaRef.current.scrollWidth > textareaRef.current.clientWidth) {
      typewriterSounds.playBell();
    }
  }, [playAdvancedTypewriterSound, showKeyboard]);

  // Handler para mudança de texto
  const handleTextChange = useCallback((value: string) => {
    setCurrentNote(value);
    
    // Inicia medição se não estiver ativa
    if (value.length === 1 && speedMeterRef.current) {
      speedMeterRef.current.startMeasuring();
    }
    
    // Para medição se campo vazio
    if (value.length === 0 && speedMeterRef.current) {
      speedMeterRef.current.stopMeasuring();
    }
  }, []);

  // Salvar anotação com efeitos avançados
  const handleSaveNote = useCallback(() => {
    if (currentNote.trim()) {
      const wordCount = getWordCount(currentNote);
      const newNote: Note = {
        id: Date.now().toString(),
        content: currentNote,
        createdAt: new Date().toLocaleString('pt-BR'),
        wordCount
      };

      setNotes(prev => [newNote, ...prev]);
      setCurrentNote('');
      
      // Efeito sonoro de papel
      if (soundEnabled) {
        typewriterSounds.playPaperSlide();
      }
      
      // Incrementa contador de páginas
      paperCounterRef.current?.increment();
      
      // Efeito visual avançado de salvamento
      if (textareaRef.current) {
        TypewriterEffects.addVintageGlow(textareaRef.current);
        textareaRef.current.style.background = 'hsl(var(--primary) / 0.1)';
        
        setTimeout(() => {
          if (textareaRef.current) {
            TypewriterEffects.removeVintageGlow(textareaRef.current);
            textareaRef.current.style.background = '';
          }
        }, 1000);
      }

      // Para medição de velocidade
      speedMeterRef.current?.stopMeasuring();
    }
  }, [currentNote, soundEnabled]);

  // Handler para teclado virtual
  const handleVirtualKeyPress = useCallback((key: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = currentNote.substring(0, start) + key + currentNote.substring(end);
      
      setCurrentNote(newValue);
      playAdvancedTypewriterSound(key);
      
      // Reposiciona cursor
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        textarea.focus();
      }, 0);
    }
  }, [currentNote, playAdvancedTypewriterSound]);

  // Toggle de som
  const toggleSound = useCallback(() => {
    const newState = typewriterSounds.toggleSounds();
    setSoundEnabled(newState);
    
    if (newState) {
      typewriterSounds.playKeyPress(); // Som de confirmação
    }
  }, []);

  // Inicialização dos componentes JavaScript puro
  useEffect(() => {
    if (isOpen && showAdvanced && modalRef.current) {
      // Inicializa contador de páginas
      if (!paperCounterRef.current) {
        const counterContainer = modalRef.current.querySelector('#paper-counter');
        if (counterContainer) {
          paperCounterRef.current = new PaperCounter(counterContainer as HTMLElement);
        }
      }

      // Inicializa medidor de velocidade
      if (!speedMeterRef.current) {
        const speedContainer = modalRef.current.querySelector('#speed-meter');
        if (speedContainer) {
          speedMeterRef.current = new TypingSpeedMeter(speedContainer as HTMLElement);
        }
      }
    }
  }, [isOpen, showAdvanced]);

  // Inicialização do teclado virtual
  useEffect(() => {
    if (showKeyboard && keyboardRef.current) {
      if (!typewriterKeyboardRef.current) {
        typewriterKeyboardRef.current = new TypewriterKeyboard();
        typewriterKeyboardRef.current.createKeyboard(keyboardRef.current, handleVirtualKeyPress);
      }
    }
  }, [showKeyboard, handleVirtualKeyPress]);

  // Limpar referências ao fechar
  useEffect(() => {
    if (!isOpen) {
      paperCounterRef.current = null;
      speedMeterRef.current = null;
      typewriterKeyboardRef.current = null;
    }
  }, [isOpen]);

  // Focus automático
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleDeleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    paperCounterRef.current?.decrement();
  }, []);

  return (
    <>
      {/* Widget flutuante da máquina de escrever */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="float-animation typewriter-effect p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group"
        >
          <img 
            src="/assets/b186d210-24c0-40a1-a9c8-5f6669a3c00b.png" 
            alt="Máquina de Escrever" 
            className="h-16 w-16 filter drop-shadow-lg group-hover:animate-typewriter-bell"
          />
        </button>
      </div>

      {/* Modal avançado do bloco de notas */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card 
            ref={modalRef}
            className="vintage-paper w-full max-w-4xl max-h-[90vh] overflow-hidden animate-paper-slide"
          >
            <div className="flex items-center justify-between p-4 border-b border-vintage-brown/20">
              <div className="flex items-center space-x-3">
                <img 
                  src="/assets/b186d210-24c0-40a1-a9c8-5f6669a3c00b.png" 
                  alt="Máquina de Escrever" 
                  className="h-8 w-8 typewriter-bell"
                />
                <h2 className="font-vintage text-xl text-vintage-brown">
                  Máquina de Escrever Retrô
                </h2>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="hover:bg-secondary"
                  title="Mostrar/Ocultar Ferramentas Avançadas"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  className="hover:bg-secondary"
                  title="Mostrar/Ocultar Teclado Virtual"
                >
                  <Keyboard className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSound}
                  className="hover:bg-secondary"
                  title={soundEnabled ? "Desativar Sons" : "Ativar Sons"}
                >
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {/* Ferramentas avançadas */}
              {showAdvanced && (
                <div className="flex flex-wrap gap-4 p-4 bg-vintage-pink/20 rounded-lg border border-vintage-brown/20">
                  <div id="paper-counter"></div>
                  <div id="speed-meter"></div>
                  <div className="flex items-center space-x-2 p-2 bg-vintage-paper rounded-lg border border-vintage-brown/20 font-vintage text-vintage-brown text-sm">
                    <FileText className="h-4 w-4" />
                    <span>Palavras: <span className="font-bold">{getWordCount(currentNote)}</span></span>
                  </div>
                </div>
              )}

              {/* Área de digitação */}
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={currentNote}
                    onChange={(e) => handleTextChange(e.target.value)}
                    onKeyDown={handleAdvancedKeyPress}
                    placeholder="Digite sua anotação aqui... ✎"
                    className={`min-h-40 resize-none font-soft text-vintage-brown border-2 transition-all duration-300 ${
                      isTyping ? 'border-primary shadow-md' : 'border-vintage-brown/30'
                    }`}
                    style={{
                      background: 'linear-gradient(to bottom, transparent 95%, hsl(var(--vintage-brown) / 0.1) 100%)',
                      backgroundSize: '100% 1.5em',
                      fontFamily: '"Special Elite", cursive',
                      lineHeight: '1.5em'
                    }}
                  />
                  {isTyping && (
                    <div className="absolute top-2 right-2 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="text-xs text-primary font-vintage">digitando...</span>
                    </div>
                  )}
                </div>
                
                {/* Teclado virtual */}
                {showKeyboard && (
                  <div 
                    ref={keyboardRef}
                    className="bg-vintage-brown/5 p-4 rounded-lg border border-vintage-brown/20"
                  ></div>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={handleSaveNote}
                    disabled={!currentNote.trim()}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground font-soft"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Anotação
                  </Button>
                </div>
              </div>

              {/* Lista de anotações salvas */}
              {notes.length > 0 && (
                <div className="border-t border-vintage-brown/20 pt-4">
                  <h3 className="font-vintage text-vintage-brown mb-3 flex items-center">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Anotações Salvas ({notes.length})
                  </h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {notes.map((note) => (
                      <div 
                        key={note.id} 
                        className="bg-vintage-pink/30 p-3 rounded-lg border border-vintage-brown/20 hover:shadow-md transition-shadow duration-300"
                      >
                        <p className="font-soft text-sm text-vintage-brown whitespace-pre-wrap mb-2">
                          {note.content}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4 text-xs text-vintage-brown/70 font-soft">
                            <span>{note.createdAt}</span>
                            <span>{note.wordCount} palavra{note.wordCount !== 1 ? 's' : ''}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default TypewriterWidget;
