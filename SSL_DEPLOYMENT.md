# Configuration SSL pour ZbenyaSystems

Ce document fournit les instructions pour configurer correctement le SSL, assurer les redirections HTTPS et mettre en place les en-têtes de sécurité pour le site web ZbenyaSystems.

## Certificat SSL

### Option 1 : Let's Encrypt (Recommandé)

1. Installez Certbot sur votre serveur :
   ```bash
   sudo apt-get update
   sudo apt-get install certbot
   ```

2. Obtenez un certificat pour votre domaine :
   ```bash
   sudo certbot --nginx -d zbenyasystems.com -d www.zbenyasystems.com
   ```

3. Configurez le renouvellement automatique :
   ```bash
   sudo certbot renew --dry-run
   ```

4. Vérifiez que le renouvellement automatique est configuré dans cron :
   ```bash
   sudo crontab -e
   ```
   Une entrée pour certbot renew devrait être présente.

### Option 2 : Certificat SSL avec l'hébergement (GitHub Pages ou Render)

Si vous déployez sur GitHub Pages ou Render, le SSL est généralement fourni automatiquement. Suivez ces étapes :

**Pour GitHub Pages :**
1. Allez dans les paramètres du dépôt GitHub
2. Activez GitHub Pages
3. Configurez votre nom de domaine personnalisé
4. Cochez "Enforce HTTPS"

**Pour Render :**
1. Dans votre tableau de bord Render, allez dans les paramètres de votre service
2. Ajoutez votre domaine personnalisé
3. Le certificat SSL sera automatiquement généré par Render

## Configuration NGINX pour HTTPS (si vous utilisez votre propre serveur)

Ajoutez cette configuration à votre fichier de configuration NGINX :

```nginx
server {
    listen 80;
    server_name zbenyasystems.com www.zbenyasystems.com;
    
    # Redirection HTTP vers HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name zbenyasystems.com www.zbenyasystems.com;
    
    # Certificats SSL
    ssl_certificate /etc/letsencrypt/live/zbenyasystems.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zbenyasystems.com/privkey.pem;
    
    # Paramètres de sécurité SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_dhparam /etc/ssl/certs/dhparam.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    # En-têtes de sécurité HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Autres en-têtes de sécurité
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; frame-src 'none'; object-src 'none'; base-uri 'self';" always;
    
    # Configuration du serveur web
    root /var/www/zbenyasystems.com;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/atom+xml image/svg+xml;
}
```

## En-têtes de sécurité pour Express.js

Si vous utilisez Express.js, ajoutez ces en-têtes de sécurité à votre application :

```javascript
// server/index.ts
import helmet from 'helmet';

// ...
app.use(helmet());
app.use(helmet.hsts({
  maxAge: 31536000,
  includeSubDomains: true,
  preload: true
}));
```

## Vérification de la configuration SSL

Après avoir déployé votre site avec SSL, vérifiez sa configuration avec ces outils :

1. [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
2. [Security Headers](https://securityheaders.com/)
3. [Mozilla Observatory](https://observatory.mozilla.org/)

Visez un score A+ sur SSL Labs et une note élevée sur les autres outils.

## Conformité SGQRI 008 3.0 (Québec)

Pour respecter les normes d'accessibilité du Québec :

1. Assurez-vous que tous les liens sont visibles et accessibles via le clavier
2. Utilisez des contrastes suffisants (ratio minimum de 4.5:1 pour le texte)
3. Implémentez des étiquettes ARIA appropriées
4. Testez avec des lecteurs d'écran
5. Fournissez des descriptions alternatives pour toutes les images

## Mise à jour du fichier DEPLOYMENT.md

Mettez à jour le fichier DEPLOYMENT.md pour inclure ces informations et rappeler l'importance de la configuration SSL pour le SEO et la conformité aux normes.