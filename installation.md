# 📋 Guide d'installation - Jimmy AI Generator v3.0

## Prérequis

- **Docker** et **Docker Compose** installés
- **Git** pour cloner le repository
- **Portainer** (optionnel, pour interface graphique)
- 4GB RAM minimum, 8GB recommandé
- 2GB d'espace disque libre

## Installation rapide

### 1. Cloner le repository
```bash
git clone https://github.com/VOTRE_USERNAME/jimmy-ai-letter-generator.git
cd jimmy-ai-letter-generator
```

### 2. Démarrer avec Docker Compose
```bash
# Démarrage en arrière-plan
docker-compose up -d

# Vérifier les logs
docker-compose logs -f
```

### 3. Accéder à l'application
- **URL**: http://localhost:8080
- **Health check**: http://localhost:8080/health

## Installation avec Portainer

### Via Git Repository
1. Portainer → Stacks → Add stack
2. Name: `jimmy-ai-generator`
3. Build method: **Git Repository**
4. Repository URL: `https://github.com/VOTRE_USERNAME/jimmy-ai-letter-generator`
5. Compose path: `docker-compose.yml`
6. Deploy the stack

### Via Web editor
1. Portainer → Stacks → Add stack
2. Name: `jimmy-ai-generator`
3. Copier le contenu de `docker-compose.yml`
4. Deploy the stack

## Configuration avancée

### Variables d'environnement
```yaml
environment:
  - TZ=Europe/Paris
  - APP_VERSION=3.0.0
  - AI_ENABLED=true
  - NODE_ENV=production
  - DEBUG_MODE=false
```

### Ports personnalisés
```yaml
ports:
  - ""8081:80""  # Changer le port externe
```

### Volumes persistants
Les données sont automatiquement persistées dans:
- `jimmy-userdata`: Données utilisateur et apprentissage
- `jimmy-models`: Modèles IA TensorFlow.js
- `jimmy-logs`: Logs application et nginx

## Vérification de l'installation

### Health checks
```bash
# Vérifier l'état des containers
docker-compose ps

# Tester le health endpoint
curl http://localhost:8080/health
```

### Logs et monitoring
```bash
# Logs en temps réel
docker-compose logs -f jimmy-ai-generator

# Métriques nginx
curl http://localhost:8080/nginx-metrics
```

## Mise à jour

### Automatique (avec CI/CD)
Les mises à jour se font automatiquement via GitHub Actions.

### Manuelle
```bash
# Arrêter l'application
docker-compose down

# Mettre à jour le code
git pull origin main

# Redémarrer avec la nouvelle version
docker-compose up -d --build
```

## Sauvegarde et restauration

### Sauvegarde automatique
Le service `jimmy-backup` sauvegarde automatiquement les données chaque nuit.

### Sauvegarde manuelle
```bash
# Créer une sauvegarde
docker run --rm \
  -v jimmy-ai-generator_jimmy-userdata:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/jimmy-backup-$(date +%Y%m%d).tar.gz /data
```

### Restauration
```bash
# Restaurer depuis une sauvegarde
docker run --rm \
  -v jimmy-ai-generator_jimmy-userdata:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/jimmy-backup-YYYYMMDD.tar.gz -C /
```

## Dépannage

### Problèmes courants

#### Port déjà utilisé
```bash
# Changer le port dans docker-compose.yml
ports:
  - ""8081:80""  # Au lieu de 8080:80
```

#### Container ne démarre pas
```bash
# Vérifier les logs
docker-compose logs jimmy-ai-generator

# Vérifier la configuration nginx
docker-compose exec jimmy-ai-generator nginx -t
```

#### Données perdues
```bash
# Vérifier les volumes
docker volume ls | grep jimmy

# Inspecter un volume
docker volume inspect jimmy-ai-generator_jimmy-userdata
```

### Commandes utiles

```bash
# Redémarrer uniquement l'application
docker-compose restart jimmy-ai-generator

# Reconstruire l'image
docker-compose build --no-cache

# Nettoyer les données (ATTENTION: perte définitive)
docker-compose down -v
```

## Support et aide

- 📖 **Documentation**: [README.md](../README.md)
- 🐛 **Issues**: GitHub Issues
- 💬 **Discussions**: GitHub Discussions

## Sécurité

- L'application fonctionne avec des utilisateurs non-root
- Les données sont stockées localement (confidentialité)
- HTTPS recommandé en production via reverse proxy
- Sauvegarde chiffrée recommandée pour les données sensibles
