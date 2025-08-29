FROM nginx:1.25-alpine

# Métadonnées
LABEL maintainer="Jimmy PAEPEGAEY <email@example.com>"
LABEL description="Générateur IA de lettres avec apprentissage adaptatif"
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
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
