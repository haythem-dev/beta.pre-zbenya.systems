
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string; 
  ogUrl?: string;
  twitterCard?: string;
  lang?: string;
  structuredData?: Record<string, any>;
}

export default function SEO({ 
  title = "ZbenyaSystems - Solutions logicielles sur mesure",
  description = "Solutions de développement logiciel personnalisées, applications web et mobiles, et services de freelance pour les entreprises.",
  keywords = "développement logiciel, applications web, applications mobiles, freelance",
  canonical,
  ogType = 'website',
  ogImage = '/images/og-image.jpg', // Chemin vers l'image à utiliser pour les partages
  ogUrl,
  twitterCard = 'summary_large_image',
  lang = 'fr',
  structuredData
}: SEOProps) {
  // Préparer les données structurées pour les moteurs de recherche (Schema.org)
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ZbenyaSystems",
    "url": "https://zbenyasystems.com",
    "logo": "https://zbenyasystems.com/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+21612345678",
      "contactType": "customer service",
      "availableLanguage": ["French", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/zbenyasystems",
      "https://www.linkedin.com/company/zbenyasystems",
      "https://twitter.com/zbenyasystems"
    ]
  };

  const finalStructuredData = structuredData || defaultStructuredData;
  
  // Utilisation sécurisée pour le SSR - pas d'accès à window pendant le rendu serveur
  const getCanonicalUrl = () => {
    try {
      return canonical || (typeof window !== 'undefined' ? window.location.href : '');
    } catch (e) {
      return canonical || '';
    }
  };
  
  const canonicalUrl = getCanonicalUrl();
  const metaOgUrl = ogUrl || canonicalUrl;

  return (
    <Helmet 
      htmlAttributes={{
        lang: lang // Spécification de la langue selon WCAG
      }}
    >
      {/* Balises meta de base */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Balises canoniques pour éviter le contenu dupliqué */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Balises OpenGraph pour les réseaux sociaux */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={metaOgUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="ZbenyaSystems" />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Balises Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Données structurées Schema.org pour le SEO avancé */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Balises spécifiques aux navigateurs et à la sécurité */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* Balises de vérification pour les webmasters */}
      <meta name="robots" content="index, follow" />
      
      {/* Directives de sécurité */}
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      
      {/* Balise pour la couleur du thème sur les navigateurs mobiles */}
      <meta name="theme-color" content="#0056b3" />

      {/* Balises d'accessibilité WCAG/SGQRI 008 3.0 */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Helmet>
  );
}
