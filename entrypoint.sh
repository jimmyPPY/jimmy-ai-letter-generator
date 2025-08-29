#!/bin/sh

echo "=== Jimmy AI Letter Generator v3.0 ==="
echo "Démarrage du conteneur..."

# Configuration dynamique nginx
if [ ! -z "$NGINX_WORKER_PROCESSES" ]; then
    echo "Configuration workers nginx: $NGINX_WORKER_PROCESSES"
    sed -i "s/worker_processes auto;/worker_processes $NGINX_WORKER_PROCESSES;/" /etc/nginx/nginx.conf
fi

if [ ! -z "$NGINX_WORKER_CONNECTIONS" ]; then
    echo "Configuration connexions nginx: $NGINX_WORKER_CONNECTIONS"
    sed -i "s/worker_connections 1024;/worker_connections $NGINX_WORKER_CONNECTIONS;/" /etc/nginx/nginx.conf
fi

# Vérification des répertoires
echo "Vérification des répertoires..."
mkdir -p /usr/share/nginx/html/data
mkdir -p /usr/share/nginx/html/models
mkdir -p /var/log/nginx

# Permissions
chown -R nginx:nginx /usr/share/nginx/html
chown -R nginx:nginx /var/log/nginx

# Vérification configuration nginx
echo "Test de la configuration nginx..."
nginx -t
if [ $? -ne 0 ]; then
    echo "❌ Erreur dans la configuration nginx"
    exit 1
fi

# Initialisation des modèles IA (si nécessaire)
if [ "$AI_ENABLED" = "true" ]; then
    echo "✅ Mode IA activé"
    # Ici on pourrait télécharger des modèles si nécessaire
else
    echo "⚠️ Mode IA désactivé"
fi

echo "✅ Initialisation terminée"
echo "🚀 Démarrage de nginx..."

# Démarrer nginx avec les arguments passés
exec "$@"
