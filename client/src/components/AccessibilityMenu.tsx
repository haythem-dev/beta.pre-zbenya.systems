import { useState, useEffect } from 'react';
import { SkipForward, Sun, Moon, ZoomIn, ZoomOut, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Menu d'accessibilité conforme aux normes WCAG 2.1 et SGQRI 008 3.0 (Québec)
 * 
 * Fonctionnalités:
 * - Liens d'évitement pour navigation au clavier
 * - Contrôle du contraste
 * - Changement de taille de texte
 * - Raccourcis clavier
 */
export default function AccessibilityMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState(100);
  
  useEffect(() => {
    // Récupérer les préférences sauvegardées
    const savedContrast = localStorage.getItem('highContrast') === 'true';
    const savedTextSize = Number(localStorage.getItem('textSize')) || 100;
    
    setHighContrast(savedContrast);
    setTextSize(savedTextSize);
    
    if (savedContrast) {
      document.body.classList.add('high-contrast');
    }
    
    document.documentElement.style.fontSize = `${savedTextSize}%`;
    
    // Gestion des événements clavier pour l'accessibilité
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+A: Ouvrir/fermer le menu d'accessibilité
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setShowMenu(prev => !prev);
      }
      
      // Alt+C: Aller au contenu principal
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        document.getElementById('main-content')?.focus();
      }
      
      // Alt+M: Aller au menu principal
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        document.querySelector('nav')?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Gestion du mode fort contraste
  const toggleContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('highContrast', String(newValue));
    
    if (newValue) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };
  
  // Ajustement de la taille du texte
  const changeTextSize = (increase: boolean) => {
    const newSize = increase ? Math.min(textSize + 10, 150) : Math.max(textSize - 10, 80);
    setTextSize(newSize);
    localStorage.setItem('textSize', String(newSize));
    document.documentElement.style.fontSize = `${newSize}%`;
  };
  
  return (
    <>
      {/* Bouton d'accessibilité toujours visible */}
      <Button
        variant="outline"
        size="icon"
        className="fixed right-4 bottom-4 z-50 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
        onClick={() => setShowMenu(!showMenu)}
        aria-expanded={showMenu}
        aria-label="Menu d'accessibilité"
        title="Ouvrir le menu d'accessibilité (Alt+A)"
      >
        <Keyboard className="h-5 w-5" aria-hidden="true" />
      </Button>
      
      {/* Menu d'accessibilité */}
      <div
        className={`fixed right-4 bottom-16 z-50 bg-white border rounded-lg shadow-lg p-4 space-y-3 w-64 transition-opacity duration-200 ${
          showMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        role="region"
        aria-label="Options d'accessibilité"
      >
        <h2 className="font-semibold text-lg mb-2">Accessibilité</h2>
        
        {/* Liens d'évitement - SGQRI 008 3.0 */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Navigation rapide</h3>
          <div className="flex flex-col space-y-1">
            <a 
              href="#main-content" 
              className="text-primary hover:underline text-sm flex items-center"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('main-content')?.focus();
              }}
            >
              <SkipForward className="h-4 w-4 mr-2" aria-hidden="true" />
              Aller au contenu (Alt+C)
            </a>
            <a 
              href="#header" 
              className="text-primary hover:underline text-sm flex items-center"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('nav')?.focus();
              }}
            >
              <SkipForward className="h-4 w-4 mr-2" aria-hidden="true" />
              Aller au menu (Alt+M)
            </a>
          </div>
        </div>
        
        {/* Contraste et thème - WCAG 2.1 (1.4.3, 1.4.6) */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Apparence</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={`flex-1 ${highContrast ? 'bg-primary text-white' : ''}`}
              onClick={toggleContrast}
              aria-pressed={highContrast}
              aria-label={highContrast ? "Désactiver le contraste élevé" : "Activer le contraste élevé"}
            >
              {highContrast ? (
                <Moon className="h-4 w-4 mr-2" aria-hidden="true" />
              ) : (
                <Sun className="h-4 w-4 mr-2" aria-hidden="true" />
              )}
              Contraste
            </Button>
          </div>
        </div>
        
        {/* Taille du texte - WCAG 2.1 (1.4.4) */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Taille du texte ({textSize}%)</h3>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => changeTextSize(false)}
              disabled={textSize <= 80}
              aria-label="Réduire la taille du texte"
            >
              <ZoomOut className="h-4 w-4 mr-1" aria-hidden="true" />
              Réduire
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1"
              onClick={() => changeTextSize(true)}
              disabled={textSize >= 150}
              aria-label="Augmenter la taille du texte"
            >
              <ZoomIn className="h-4 w-4 mr-1" aria-hidden="true" />
              Agrandir
            </Button>
          </div>
        </div>
        
        {/* Raccourcis clavier */}
        <div className="border-t pt-2 text-xs text-gray-500">
          <p className="mb-1 font-medium">Raccourcis clavier :</p>
          <ul className="space-y-1">
            <li>Alt+A : Menu d'accessibilité</li>
            <li>Alt+C : Aller au contenu</li>
            <li>Alt+M : Aller au menu</li>
          </ul>
        </div>
      </div>
    </>
  );
}