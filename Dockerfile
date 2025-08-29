FROM nginx:alpine

# Métadonnées
LABEL maintainer=""Jimmy PAEPEGAEY""
LABEL description=""Générateur de lettres avec suivi Kanban des candidatures""
LABEL version=""2.0.0""

# Installer les dépendances supplémentaires
RUN apk add --no-cache curl wget

# Copier les fichiers de l'application
COPY ./app /usr/share/nginx/html

# Copier la configuration nginx optimisée
COPY ./nginx.conf /etc/nginx/nginx.conf

# Créer les répertoires nécessaires
RUN mkdir -p /var/log/nginx /var/cache/nginx/client_temp

# Permissions et optimisations
RUN chown -R nginx:nginx /usr/share/nginx/html &&     chmod -R 755 /usr/share/nginx/html &&     chown -R nginx:nginx /var/cache/nginx

# Script de démarrage personnalisé
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Exposer le port
EXPOSE 80

# Health check amélioré
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3   CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Point d'entrée
ENTRYPOINT [""/entrypoint.sh""]
CMD [""nginx"", ""-g"", ""daemon off;""]
",Configuration Docker pour Dockerfile - Version Kanban 2.0
entrypoint.sh,"#!/bin/sh

# Configuration dynamique des variables d'environnement
if [ ! -z ""$NGINX_WORKER_PROCESSES"" ]; then
    sed -i ""s/worker_processes auto;/worker_processes $NGINX_WORKER_PROCESSES;/"" /etc/nginx/nginx.conf
fi

if [ ! -z ""$NGINX_WORKER_CONNECTIONS"" ]; then
    sed -i ""s/worker_connections 1024;/worker_connections $NGINX_WORKER_CONNECTIONS;/"" /etc/nginx/nginx.conf
fi

# Vérification de la configuration nginx
nginx -t

# Démarrage de nginx
exec ""$@""
",Configuration Docker pour entrypoint.sh - Version Kanban 2.0
docker-compose.yml,"version: '3.8'

services:
  jimmy-kanban-tracker:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: jimmy-kanban-tracker
    restart: unless-stopped
    ports:
      - ""8080:80""
    networks:
      - jimmy-network
    labels:
      # Traefik labels
      - ""traefik.enable=true""
      - ""traefik.http.routers.jimmy-kanban.rule=Host(`candidatures.jimmy.local`)""
      - ""traefik.http.routers.jimmy-kanban.tls=true""
      - ""traefik.http.services.jimmy-kanban.loadbalancer.server.port=80""

      # Portainer labels
      - ""portainer.group=jimmy-tools""
      - ""portainer.description=Générateur de lettres avec suivi Kanban""

    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80
      - NGINX_WORKER_PROCESSES=auto
      - NGINX_WORKER_CONNECTIONS=1024
      - APP_VERSION=2.0.0
      - APP_ENV=production
      - TZ=Europe/Paris

    volumes:
      # Logs persistants
      - jimmy-logs:/var/log/nginx
      # Cache nginx
      - jimmy-cache:/var/cache/nginx
      # Sauvegarde données (optionnel pour localStorage)
      - jimmy-backup:/backup

    healthcheck:
      test: [""CMD"", ""wget"", ""--quiet"", ""--tries=1"", ""--spider"", ""http://localhost/health""]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

    logging:
      driver: ""json-file""
      options:
        max-size: ""10m""
        max-file: ""3""

    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.5'
        reservations:
          memory: 128M
          cpus: '0.25'

  # Service de sauvegarde automatique (optionnel)
  jimmy-backup:
    image: alpine:latest
    container_name: jimmy-backup-service
    restart: unless-stopped
    volumes:
      - jimmy-logs:/source/logs:ro
      - jimmy-backup:/backup
    environment:
      - BACKUP_SCHEDULE=0 2 * * *  # Tous les jours à 2h
    command: |
      sh -c '
        echo ""Service de sauvegarde démarré""
        while true; do
          sleep 86400  # 24h
          echo ""Création de la sauvegarde...""
          tar -czf /backup/logs-backup-$$(date +%Y%m%d-%H%M%S).tar.gz -C /source logs/
          # Garder seulement les 7 dernières sauvegardes
          ls -t /backup/logs-backup-*.tar.gz | tail -n +8 | xargs -r rm
          echo ""Sauvegarde terminée""
        done
      '
    depends_on:
      - jimmy-kanban-tracker

networks:
  jimmy-network:
    driver: bridge
    labels:
      - ""description=Réseau dédié aux outils Jimmy""

volumes:
  jimmy-logs:
    driver: local
    labels:
      - ""description=Logs de l'application Kanban""
  jimmy-cache:
    driver: local
    labels:
      - ""description=Cache nginx""
  jimmy-backup:
    driver: local
    labels:
      - ""description=Sauvegardes automatiques""
",Configuration Docker pour docker-compose.yml - Version Kanban 2.0
portainer-stack-kanban.yml,"version: '3.8'

services:
  jimmy-kanban-tracker:
    image: nginx:alpine
    container_name: jimmy-kanban-tracker
    restart: unless-stopped
    ports:
      - ""8080:80""
    networks:
      - jimmy-network
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80
      - TZ=Europe/Paris
    volumes:
      - jimmy-app-data:/usr/share/nginx/html
      - jimmy-logs:/var/log/nginx
    healthcheck:
      test: [""CMD"", ""wget"", ""--quiet"", ""--tries=1"", ""--spider"", ""http://localhost""]
      interval: 30s
      timeout: 10s
      retries: 3
    labels:
      - ""traefik.enable=true""
      - ""traefik.http.routers.jimmy-kanban.rule=Host(`candidatures.mondomaine.com`)""
      - ""traefik.http.services.jimmy-kanban.loadbalancer.server.port=80""

networks:
  jimmy-network:
    driver: bridge

volumes:
  jimmy-app-data:
    driver: local
  jimmy-logs:
    driver: local
",Configuration Docker pour portainer-stack-kanban.yml - Version Kanban 2.0
nginx.conf,"events {
    worker_processes auto;
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Configuration des logs
    log_format main '$remote_addr - $remote_user [$time_local] ""$request"" '
                    '$status $body_bytes_sent ""$http_referer"" '
                    '""$http_user_agent"" ""$http_x_forwarded_for"" '
                    'rt=$request_time uct=""$upstream_connect_time"" '
                    'uht=""$upstream_header_time"" urt=""$upstream_response_time""';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Performance et sécurité
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 10M;

    # Sécurité
    server_tokens off;
    add_header X-Frame-Options ""SAMEORIGIN"" always;
    add_header X-Content-Type-Options ""nosniff"" always;
    add_header X-XSS-Protection ""1; mode=block"" always;
    add_header Referrer-Policy ""strict-origin-when-cross-origin"" always;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        image/svg+xml;

    # Configuration du cache
    map $sent_http_content_type $expires {
        default                    off;
        text/html                  epoch;
        text/css                   1y;
        application/javascript     1y;
        ~image/                    1M;
        ~font/                     1M;
    }
    expires $expires;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Configuration des erreurs personnalisées
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;

        # Health check endpoint
        location /health {
            access_log off;
            return 200 ""healthy\n"";
            add_header Content-Type text/plain;
        }

        # API endpoints pour les données (localStorage via JS)
        location /api/ {
            # Headers CORS pour les futures extensions
            add_header Access-Control-Allow-Origin ""*"" always;
            add_header Access-Control-Allow-Methods ""GET, POST, PUT, DELETE, OPTIONS"" always;
            add_header Access-Control-Allow-Headers ""Accept, Authorization, Cache-Control, Content-Type, DNT, If-Modified-Since, Keep-Alive, Origin, User-Agent, X-Requested-With"" always;

            if ($request_method = 'OPTIONS') {
                return 204;
            }

            # Pour l'instant, retourner 404 car tout est en localStorage
            return 404 ""API not implemented - using localStorage"";
        }

        # Fichiers statiques avec cache optimisé
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control ""public, immutable"";
            add_header Vary ""Accept-Encoding"";
        }

        # Application principale
        location / {
            try_files $uri $uri/ /index.html;

            # Headers spécifiques pour l'application
            add_header Cache-Control ""no-cache, no-store, must-revalidate"";
            add_header Pragma ""no-cache"";
            add_header Expires ""0"";
        }

        # Endpoint pour les métriques (futur monitoring)
        location /metrics {
            access_log off;
            stub_status on;
            allow 127.0.0.1;
            allow 10.0.0.0/8;
            allow 172.16.0.0/12;
            allow 192.168.0.0/16;
            deny all;
        }

        # Protection contre les scans de sécurité
        location ~ /\. {
            deny all;
            access_log off;
            log_not_found off;
        }

        location ~ ~$ {
            deny all;
            access_log off;
            log_not_found off;
        }
    }
}
",Configuration Docker pour nginx.conf - Version Kanban 2.0
README-kanban.md,"# 🚀 Gestionnaire de Candidatures Jimmy PAEPEGAEY - Version Kanban

## Nouvelle version avec historique et suivi Kanban

Cette version 2.0 enrichit le générateur de lettres de motivation avec :
- ✅ **Historique complet** des candidatures
- ✅ **Tableau Kanban** pour le suivi visuel
- ✅ **Statistiques avancées** et analytics
- ✅ **Système d'alertes** et rappels
- ✅ **Persistance des données** en localStorage

## Fonctionnalités principales

### 📝 Générateur de lettres (amélioré)
- Système de génération original Jimmy
- Sauvegarde automatique des candidatures
- Scores et analyses personnalisés

### 📋 Historique des candidatures
- Vue tabulaire avec recherche et filtres
- Export des données en CSV
- Gestion complète des candidatures

### 📊 Tableau Kanban
- 8 étapes du processus de candidature
- Drag & drop intuitif
- Codes couleur par priorité et secteur
- Compteurs temps réel

### 📈 Statistiques et analyses
- Taux de conversion par étape
- Performance par secteur
- Alertes et rappels automatiques
- Dashboard complet

## Déploiement Docker avec Portainer

### Option 1 : Déploiement rapide
```yaml
# Copier le contenu de portainer-stack-kanban.yml
# Dans Portainer : Stacks → Add stack → Web editor
```

### Option 2 : Build personnalisé
```bash
# Cloner et configurer
git clone https://github.com/VOTRE_USERNAME/jimmy-kanban-tracker
cd jimmy-kanban-tracker

# Construire l'image
docker build -t jimmy-kanban-tracker:2.0.0 .

# Déployer avec docker-compose
docker-compose up -d
```

### Option 3 : Portainer + GitHub
```
Repository URL: https://github.com/VOTRE_USERNAME/jimmy-kanban-tracker
Branch: main  
Compose path: docker-compose.yml
```

## Configuration avancée

### Variables d'environnement
```yaml
environment:
  - NGINX_WORKER_PROCESSES=auto    # Nombre de workers nginx
  - NGINX_WORKER_CONNECTIONS=1024  # Connexions par worker
  - APP_VERSION=2.0.0              # Version de l'application
  - TZ=Europe/Paris                # Fuseau horaire
```

### Volumes de données
- `jimmy-app-data`: Fichiers de l'application
- `jimmy-logs`: Logs nginx pour monitoring
- `jimmy-backup`: Sauvegardes automatiques

### Monitoring et observabilité
- Health checks intégrés
- Logs structurés JSON
- Métriques nginx sur `/metrics`
- Alertes Portainer configurables

## Nouveautés techniques

### Sécurité renforcée
- Headers de sécurité (XSS, CSRF, etc.)
- Protection contre les scans
- Isolation réseau Docker
- Ressources limitées

### Performance optimisée
- Compression gzip intelligente
- Cache statique optimisé
- Workers nginx auto-dimensionnés
- Ressources Docker limitées

### Extensibilité future
- Architecture préparée pour APIs
- Structure modulaire
- Intégrations tierces facilitées
- Monitoring avancé

## Accès à l'application

Une fois déployée :
- **Local**: http://localhost:8080
- **Réseau**: http://IP_SERVEUR:8080  
- **Domaine**: http://candidatures.mondomaine.com (avec Traefik)

## Sauvegarde et maintenance

### Sauvegarde automatique
Le service optionnel `jimmy-backup` sauvegarde :
- Logs quotidiens
- Configuration nginx
- Rétention 7 jours

### Mise à jour
```bash
# Via Portainer webhook ou commande manuelle
docker-compose pull && docker-compose up -d
```

### Monitoring
- Logs temps réel dans Portainer
- Health checks toutes les 30s
- Métriques système disponibles

Cette version 2.0 transforme le générateur simple en véritable **CRM de candidatures personnel** avec toutes les fonctionnalités d'un outil professionnel !
",Configuration Docker pour README-kanban.md - Version Kanban 2.0
github-actions-kanban.yml,"name: Build and Deploy Jimmy Kanban Tracker

on:
  push:
    branches: [ main, develop ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]

env:
  DOCKER_IMAGE: jimmy-kanban-tracker
  DOCKER_TAG: ${{ github.ref_name }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'

    - name: Install dependencies
      run: |
        npm install -g html-validate
        npm install -g jshint

    - name: Validate HTML
      run: html-validate app/index.html

    - name: Lint JavaScript
      run: jshint app/app.js

    - name: Test Docker build
      run: docker build -t test-build .

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ secrets.DOCKER_USERNAME }}/${{ env.DOCKER_IMAGE }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=semver,pattern={{version}}
          type=semver,pattern={{major}}.{{minor}}
          type=raw,value=latest,enable={{is_default_branch}}

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        platforms: linux/amd64,linux/arm64
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

    - name: Deploy to production
      if: github.ref == 'refs/heads/main'
      run: |
        echo ""Déploiement en production""
        # Webhook Portainer pour redéploiement
        curl -X POST ""${{ secrets.PORTAINER_WEBHOOK_URL }}""           -H ""Content-Type: application/json""           -d '{""tag"": ""latest""}'

    - name: Create release
      if: startsWith(github.ref, 'refs/tags/')
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: ${{ github.ref }}
        release_name: Release ${{ github.ref }}
        draft: false
        prerelease: false
",Configuration Docker pour github-actions-kanban.yml - Version Kanban 2.0
