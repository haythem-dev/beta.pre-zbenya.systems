import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface AccessibleImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Alternative text obligatoire pour l'accessibilité */
  alt: string;
  /** Largeur de l'image */
  width?: number | string;
  /** Hauteur de l'image */
  height?: number | string;
  /** Description longue pour les images complexes (WCAG) */
  longDesc?: string;
  /** Classe CSS personnalisée */
  className?: string;
  /** Fallback à afficher en cas d'erreur */
  fallback?: React.ReactNode;
  /** Afficher un placeholder pendant le chargement */
  showPlaceholder?: boolean;
  /** Lazy loading pour améliorer les performances */
  lazyLoad?: boolean;
}

/**
 * Composant d'image accessible conforme aux normes WCAG et SGQRI 008 3.0
 */
export const AccessibleImage = React.forwardRef<HTMLImageElement, AccessibleImageProps>(
  ({ 
    src, 
    alt, 
    width, 
    height, 
    longDesc, 
    className, 
    fallback, 
    showPlaceholder = false,
    lazyLoad = true,
    onError,
    ...props 
  }, ref) => {
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setError(true);
      if (onError) {
        onError(e);
      }
    };

    const handleLoad = () => {
      setLoaded(true);
    };

    if (error && fallback) {
      return <>{fallback}</>;
    }

    return (
      <>
        {showPlaceholder && !loaded && (
          <div 
            className={cn(
              "bg-gray-200 animate-pulse rounded",
              className
            )} 
            style={{ width, height }}
            aria-hidden="true"
          />
        )}
        
        <img
          ref={ref}
          src={src}
          alt={alt} // Alt text obligatoire pour WCAG 2.1 (1.1.1 Non-text Content)
          width={width}
          height={height}
          onError={handleError}
          onLoad={handleLoad}
          className={cn(
            className,
            !loaded && showPlaceholder ? "hidden" : "",
            "max-w-full h-auto"
          )}
          loading={lazyLoad ? "lazy" : undefined} // Amélioration des performances
          decoding="async" // Amélioration des performances
          {...(longDesc && { "aria-describedby": `desc-${props.id || Math.random().toString(36).substring(2, 9)}` })}
          {...props}
        />
        
        {/* Description longue conforme à WCAG 2.1 (1.1.1) */}
        {longDesc && (
          <p 
            id={`desc-${props.id || Math.random().toString(36).substring(2, 9)}`} 
            className="sr-only"
          >
            {longDesc}
          </p>
        )}
      </>
    );
  }
);

AccessibleImage.displayName = "AccessibleImage";