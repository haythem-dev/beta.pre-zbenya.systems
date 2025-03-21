
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

export default function SEO({ 
  title = "ZbenyaSystems - Solutions logicielles sur mesure",
  description = "Solutions de développement logiciel personnalisées, applications web et mobiles, et services de freelance pour les entreprises.",
  keywords = "développement logiciel, applications web, applications mobiles, freelance"
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
}
