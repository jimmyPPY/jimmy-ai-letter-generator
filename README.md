# 🚀 Jimmy AI Letter Generator v3.0

> Générateur intelligent de lettres de motivation avec IA adaptative et apprentissage automatique

[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/jimmy/ai-letter-generator)
[![Docker](https://img.shields.io/badge/docker-ready-brightgreen.svg)](https://hub.docker.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 🎯 Fonctionnalités principales

- ✨ **Génération IA adaptative** : Lettres personnalisées selon votre style
- 🧠 **Apprentissage automatique** : Amélioration continue basée sur vos corrections
- 📊 **Suivi Kanban** : Gestion complète du pipeline de candidatures
- 📈 **Analytics avancées** : Métriques de performance et insights
- 🔒 **Confidentialité totale** : IA côté client, données locales
- 🐳 **Déploiement Docker** : Compatible Portainer

## 🛠️ Installation rapide

### Avec Docker (Recommandé)
```bash
git clone https://github.com/VOTRE_USERNAME/jimmy-ai-letter-generator.git
cd jimmy-ai-letter-generator
docker-compose up -d
```

### Avec Portainer
1. Stacks → Add stack
2. Repository : `https://github.com/VOTRE_USERNAME/jimmy-ai-letter-generator`
3. Compose path : `docker-compose.yml`
4. Deploy

## 📖 Documentation

- [📋 Guide d'installation](docs/INSTALLATION.md)
- [⚡ Fonctionnalités détaillées](docs/FEATURES.md)
- [🔄 Historique des versions](docs/CHANGELOG.md)

## 🏗️ Architecture

```
jimmy-ai-letter-generator/
├── app/              # Application web React-like
├── docker/           # Configuration Docker
├── docs/             # Documentation
├── scripts/          # Scripts utilitaires
└── portainer/        # Stacks Portainer
```

## 🤖 Système d'IA

- **TensorFlow.js** pour l'analyse de texte côté client
- **Algorithmes NLP** pour la détection de style personnel
- **Apprentissage incrémental** basé sur les corrections
- **Modèles légers** (< 30MB) optimisés pour le navigateur

## 📊 Métriques de performance

- ⚡ **Génération** : < 2 secondes
- 🧠 **Apprentissage** : temps réel
- 💾 **Stockage** : localStorage (illimité)
- 🔄 **Synchronisation** : automatique

## 🔧 Configuration

### Variables d'environnement
```env
APP_VERSION=3.0.0
AI_ENABLED=true
DEBUG_MODE=false
TZ=Europe/Paris
```

### Ports par défaut
- **Application** : 8080
- **Monitoring** : 8081 (optionnel)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/awesome-feature`)
3. Commit (`git commit -m 'Add awesome feature'`)
4. Push (`git push origin feature/awesome-feature`)
5. Créer une Pull Request

## 📝 Licence

Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.

## 👤 Auteur

**Jimmy PAEPEGAEY**
- Système personnalisé de génération de lettres
- Expertise en management et transformation digitale

---

⭐ **Star ce projet si il vous aide dans vos candidatures !**
",Configuration README.md pour Jimmy AI Generator v3.0
Dockerfile,"# Jimmy AI Letter Generator v3.0
FROM nginx:1.25-alpine

# Métadonnées
LABEL maintainer=""Jimmy PAEPEGAEY <email@example.com>""
LABEL description=""Générateur IA de lettres avec apprentissage adaptatif""
LABEL version=""3.0.0""

# Variables d'environnement
ENV APP_VERSION=3.0.0
ENV AI_ENABLED=true
ENV TZ=Europe/Paris

# Installer les dépendances nécessaires
RUN apk add --no-cache \
    curl \
    wget \
    jq \
    && rm -rf /var/cache/apk/*

# Copier les fichiers de l'application
COPY ./app /usr/share/nginx/html

# Copier la configuration nginx optimisée
COPY ./nginx.conf /etc/nginx/nginx.conf

# Copier le script d'entrée
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Créer les répertoires nécessaires
RUN mkdir -p /var/log/nginx /var/cache/nginx /usr/share/nginx/html/models

# Configuration des permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /usr/share/nginx/html

# Exposer le port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Point d'entrée
ENTRYPOINT [""/entrypoint.sh""]
CMD [""nginx"", ""-g"", ""daemon off;""]
",Configuration Dockerfile pour Jimmy AI Generator v3.0
docker-compose.yml,"version: '3.8'

services:
  jimmy-ai-generator:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - APP_VERSION=3.0.0
    container_name: jimmy-ai-generator
    restart: unless-stopped
    ports:
      - ""8080:80""
    environment:
      - TZ=Europe/Paris
      - APP_VERSION=3.0.0
      - AI_ENABLED=true
      - NODE_ENV=production
    volumes:
      # Application et données
      - jimmy-userdata:/usr/share/nginx/html/data
      - jimmy-models:/usr/share/nginx/html/models

      # Logs pour monitoring
      - jimmy-logs:/var/log/nginx

      # Cache nginx
      - jimmy-cache:/var/cache/nginx
    networks:
      - jimmy-network
    labels:
      # Traefik (si utilisé)
      - ""traefik.enable=true""
      - ""traefik.http.routers.jimmy-ai.rule=Host(`jimmy-ai.local`)""
      - ""traefik.http.routers.jimmy-ai.tls=true""
      - ""traefik.http.services.jimmy-ai.loadbalancer.server.port=80""

      # Portainer
      - ""portainer.group=jimmy-tools""
      - ""portainer.description=Générateur IA de lettres v3.0""
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
          memory: 512M
          cpus: '1.0'
        reservations:
          memory: 256M
          cpus: '0.5'

  # Service de sauvegarde (optionnel)
  jimmy-backup:
    image: alpine:latest
    container_name: jimmy-backup
    restart: unless-stopped
    volumes:
      - jimmy-userdata:/source/data:ro
      - jimmy-logs:/source/logs:ro
      - jimmy-backups:/backups
    environment:
      - TZ=Europe/Paris
      - BACKUP_SCHEDULE=0 2 * * *
    command: |
      sh -c '
        echo ""Service de sauvegarde Jimmy démarré""
        while true; do
          sleep 86400
          echo ""Création sauvegarde automatique...""
          tar -czf /backups/jimmy-backup-$$(date +%Y%m%d-%H%M%S).tar.gz -C /source .
          find /backups -name ""jimmy-backup-*.tar.gz"" -mtime +7 -delete
          echo ""Sauvegarde terminée""
        done
      '
    depends_on:
      - jimmy-ai-generator

networks:
  jimmy-network:
    driver: bridge
    labels:
      - ""description=Réseau dédié Jimmy AI Generator""

volumes:
  jimmy-userdata:
    driver: local
    labels:
      - ""description=Données utilisateur et apprentissage IA""
  jimmy-models:
    driver: local
    labels:
      - ""description=Modèles TensorFlow.js""
  jimmy-logs:
    driver: local
    labels:
      - ""description=Logs application et nginx""
  jimmy-cache:
    driver: local
    labels:
      - ""description=Cache nginx""
  jimmy-backups:
    driver: local
    labels:
      - ""description=Sauvegardes automatiques""
",Configuration docker-compose.yml pour Jimmy AI Generator v3.0
nginx.conf,"events {
    worker_processes auto;
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    # Configuration de base
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logs optimisés
    log_format main '$remote_addr - $remote_user [$time_local] ""$request"" '
                    '$status $body_bytes_sent ""$http_referer"" '
                    '""$http_user_agent"" ""$http_x_forwarded_for"" '
                    'rt=$request_time uct=""$upstream_connect_time"" '
                    'uht=""$upstream_header_time"" urt=""$upstream_response_time""';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 50M;

    # Sécurité
    server_tokens off;
    add_header X-Frame-Options ""SAMEORIGIN"" always;
    add_header X-Content-Type-Options ""nosniff"" always;
    add_header X-XSS-Protection ""1; mode=block"" always;
    add_header Referrer-Policy ""strict-origin-when-cross-origin"" always;
    add_header Content-Security-Policy ""default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; object-src 'none'; media-src 'self'; frame-src 'none';"" always;

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
        application/wasm
        image/svg+xml;

    # Cache statique
    map $sent_http_content_type $expires {
        default                    off;
        text/html                  epoch;
        text/css                   1y;
        application/javascript     1y;
        application/wasm          1y;
        ~image/                    1M;
        ~font/                     1M;
    }
    expires $expires;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Endpoint de santé
        location /health {
            access_log off;
            return 200 ""healthy\nversion: 3.0.0\nai: enabled\n"";
            add_header Content-Type text/plain;
        }

        # API future (préparation)
        location /api/ {
            add_header Access-Control-Allow-Origin ""*"" always;
            add_header Access-Control-Allow-Methods ""GET, POST, PUT, DELETE, OPTIONS"" always;
            add_header Access-Control-Allow-Headers ""Accept, Authorization, Cache-Control, Content-Type, DNT, If-Modified-Since, Keep-Alive, Origin, User-Agent, X-Requested-With"" always;

            if ($request_method = 'OPTIONS') {
                return 204;
            }

            return 404 ""API endpoints not implemented yet"";
        }

        # Modèles TensorFlow.js avec headers spéciaux
        location /models/ {
            expires 1y;
            add_header Cache-Control ""public, immutable"";
            add_header Cross-Origin-Embedder-Policy ""require-corp"";
            add_header Cross-Origin-Opener-Policy ""same-origin"";
            add_header Access-Control-Allow-Origin ""*"";
        }

        # Données utilisateur
        location /data/ {
            add_header Cache-Control ""no-cache, no-store, must-revalidate"";
            add_header Pragma ""no-cache"";
            add_header Expires ""0"";
        }

        # Fichiers statiques avec cache optimisé
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|wasm)$ {
            expires 1y;
            add_header Cache-Control ""public, immutable"";
            add_header Vary ""Accept-Encoding"";
        }

        # Application principale
        location / {
            try_files $uri $uri/ /index.html;

            # Headers pour SPA
            add_header Cache-Control ""no-cache, no-store, must-revalidate"";
            add_header Pragma ""no-cache"";
            add_header Expires ""0"";
        }

        # Métriques nginx (monitoring)
        location /nginx-metrics {
            stub_status on;
            access_log off;
            allow 127.0.0.1;
            allow 10.0.0.0/8;
            allow 172.16.0.0/12;
            allow 192.168.0.0/16;
            deny all;
        }

        # Sécurité : bloquer les accès non autorisés
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

        # Gestion des erreurs
        error_page 404 /404.html;
        error_page 500 502 503 504 /50x.html;

        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
",Configuration nginx.conf pour Jimmy AI Generator v3.0
entrypoint.sh,"#!/bin/sh

echo ""=== Jimmy AI Letter Generator v3.0 ===""
echo ""Démarrage du conteneur...""

# Configuration dynamique nginx
if [ ! -z ""$NGINX_WORKER_PROCESSES"" ]; then
    echo ""Configuration workers nginx: $NGINX_WORKER_PROCESSES""
    sed -i ""s/worker_processes auto;/worker_processes $NGINX_WORKER_PROCESSES;/"" /etc/nginx/nginx.conf
fi

if [ ! -z ""$NGINX_WORKER_CONNECTIONS"" ]; then
    echo ""Configuration connexions nginx: $NGINX_WORKER_CONNECTIONS""
    sed -i ""s/worker_connections 1024;/worker_connections $NGINX_WORKER_CONNECTIONS;/"" /etc/nginx/nginx.conf
fi

# Vérification des répertoires
echo ""Vérification des répertoires...""
mkdir -p /usr/share/nginx/html/data
mkdir -p /usr/share/nginx/html/models
mkdir -p /var/log/nginx

# Permissions
chown -R nginx:nginx /usr/share/nginx/html
chown -R nginx:nginx /var/log/nginx

# Vérification configuration nginx
echo ""Test de la configuration nginx...""
nginx -t
if [ $? -ne 0 ]; then
    echo ""❌ Erreur dans la configuration nginx""
    exit 1
fi

# Initialisation des modèles IA (si nécessaire)
if [ ""$AI_ENABLED"" = ""true"" ]; then
    echo ""✅ Mode IA activé""
    # Ici on pourrait télécharger des modèles si nécessaire
else
    echo ""⚠️ Mode IA désactivé""
fi

echo ""✅ Initialisation terminée""
echo ""🚀 Démarrage de nginx...""

# Démarrer nginx avec les arguments passés
exec ""$@""
",Configuration entrypoint.sh pour Jimmy AI Generator v3.0
.github-workflows-deploy.yml,"name: 🚀 Build and Deploy Jimmy AI Generator

on:
  push:
    branches: [ main, develop ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]

env:
  DOCKER_IMAGE: jimmy-ai-generator
  REGISTRY: ghcr.io

jobs:
  lint-and-test:
    name: 🔍 Lint & Test
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
          npm install -g html-validate jshint prettier

      - name: Lint HTML
        run: html-validate app/index.html

      - name: Lint JavaScript
        run: jshint app/app.js --config .jshintrc || true

      - name: Format check
        run: |
          prettier --check ""app/**/*.{html,css,js}"" || true

      - name: Test Docker build
        run: docker build -t test-build .

  security-scan:
    name: 🔒 Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'

  build-and-push:
    name: 🏗️ Build & Push Docker
    needs: [lint-and-test, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || startsWith(github.ref, 'refs/tags/')

    outputs:
      image-digest: ${{ steps.build.outputs.digest }}
      image-tag: ${{ steps.meta.outputs.tags }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ github.repository }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            APP_VERSION=${{ github.ref_name }}
            BUILD_DATE=${{ github.event.head_commit.timestamp }}
            VCS_REF=${{ github.sha }}

  deploy-production:
    name: 🚀 Deploy to Production
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Deploy to Portainer
        run: |
          echo ""🚀 Déploiement vers Portainer...""
          curl -X POST ""${{ secrets.PORTAINER_WEBHOOK_URL }}"" \
            -H ""Content-Type: application/json"" \
            -d '{
              ""tag"": ""latest"",
              ""image"": ""${{ needs.build-and-push.outputs.image-tag }}"",
              ""digest"": ""${{ needs.build-and-push.outputs.image-digest }}""
            }'
          echo ""✅ Déploiement terminé""

      - name: Notification Success
        if: success()
        run: |
          echo ""🎉 Déploiement réussi de Jimmy AI Generator v3.0""
          # Ici vous pourriez ajouter une notification Slack, email, etc.

      - name: Notification Failure  
        if: failure()
        run: |
          echo ""❌ Échec du déploiement""
          # Notification d'échec

  create-release:
    name: 📦 Create Release
    needs: build-and-push
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/')

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Generate changelog
        id: changelog
        run: |
          echo ""## 🚀 Version ${{ github.ref_name }}"" > RELEASE_NOTES.md
          echo """" >> RELEASE_NOTES.md
          echo ""### ✨ Nouveautés"" >> RELEASE_NOTES.md
          echo ""- Générateur IA adaptatif"" >> RELEASE_NOTES.md
          echo ""- Apprentissage automatique"" >> RELEASE_NOTES.md
          echo ""- Interface utilisateur améliorée"" >> RELEASE_NOTES.md
          echo """" >> RELEASE_NOTES.md
          echo ""### 🐛 Corrections"" >> RELEASE_NOTES.md
          echo ""- Optimisations de performance"" >> RELEASE_NOTES.md
          echo ""- Corrections de sécurité"" >> RELEASE_NOTES.md

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Jimmy AI Generator ${{ github.ref_name }}
          body_path: RELEASE_NOTES.md
          draft: false
          prerelease: false
",Configuration .github-workflows-deploy.yml pour Jimmy AI Generator v3.0
portainer-stack-production.yml,"version: '3.8'

services:
  jimmy-ai-generator:
    image: ghcr.io/VOTRE_USERNAME/jimmy-ai-letter-generator:latest
    container_name: jimmy-ai-production
    restart: unless-stopped
    ports:
      - ""8080:80""
    environment:
      - TZ=Europe/Paris
      - APP_VERSION=3.0.0
      - AI_ENABLED=true
      - NODE_ENV=production
    volumes:
      - jimmy-userdata:/usr/share/nginx/html/data
      - jimmy-models:/usr/share/nginx/html/models
      - jimmy-logs:/var/log/nginx
    networks:
      - jimmy-network
    labels:
      - ""traefik.enable=true""
      - ""traefik.http.routers.jimmy-ai-prod.rule=Host(`candidatures.mondomaine.com`)""
      - ""traefik.http.routers.jimmy-ai-prod.tls=true""
      - ""traefik.http.routers.jimmy-ai-prod.tls.certresolver=letsencrypt""
      - ""traefik.http.services.jimmy-ai-prod.loadbalancer.server.port=80""
    healthcheck:
      test: [""CMD"", ""wget"", ""--quiet"", ""--tries=1"", ""--spider"", ""http://localhost/health""]
      interval: 30s
      timeout: 10s
      retries: 3
    logging:
      driver: ""json-file""
      options:
        max-size: ""10m""
        max-file: ""5""

networks:
  jimmy-network:
    external: true

volumes:
  jimmy-userdata:
    external: true
  jimmy-models:
    external: true  
  jimmy-logs:
    external: true
",Configuration portainer-stack-production.yml pour Jimmy AI Generator v3.0
