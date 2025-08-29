// Jimmy AI Letter Generator v3.0 - Application JavaScript
// Système d'apprentissage adaptatif avec IA côté client

class JimmyAIGenerator {
    constructor() {
        this.currentStep = 1;
        this.currentTab = 'generator';
        this.applications = new Map();
        this.learningData = new Map();
        this.aiModel = null;

        // Configuration Jimmy
        this.jimmyProfile = {
            realisations: {
                transformation_appels: {
                    description: ""Transformation centre d'appels"",
                    chiffres: ""1,6M appels, -60% pertes"",
                    impact: ""Réduction drastique des abandons""
                },
                management: {
                    description: ""Management d'équipe"",
                    chiffres: ""Jusqu'à 45 collaborateurs, 92% satisfaction"",
                    impact: ""Excellence en leadership""
                },
                budget: {
                    description: ""Gestion budgétaire"", 
                    chiffres: ""Gestion 3M€, optimisation continue"",
                    impact: ""Maîtrise financière démontrée""
                },
                projets: {
                    description: ""Projets complexes"",
                    chiffres: ""Carve-in 2 sociétés, 15 agences intégrées"",
                    impact: ""Expertise en intégration""
                },
                revenus: {
                    description: ""Génération de revenus"",
                    chiffres: ""10K€/mois offre cloud INEAT"",
                    impact: ""Contribution directe au CA""
                },
                croissance: {
                    description: ""Croissance d'activité"",
                    chiffres: ""+53% CA en 18 mois (1,5M€ → 2,3M€)"",
                    impact: ""Accélération commerciale""
                }
            },
            experience_sectorielle: {
                defense: ""Armée de l'Air, projets sensibles"",
                medical: ""ECHOSENS, diagnostic hépatique, normes FDA"",
                services: ""LOGISTA HOMETECH, maintenance multi-technique"",
                cloud_it: ""INEAT, infrastructure et services managés""
            },
            style_signature: {
                ouverture: ""C'est avec un intérêt tout particulier"",
                structure: ""Contexte → Défis → Solutions → Résultats"",
                ton: ""Respectueux mais direct"",
                formules: [""Fort de mon expérience"", ""Au regard de mes réalisations""]
            }
        };

        // Critères de scoring
        this.scoringCriteria = {
            management: { points: 2, keywords: [""manager"", ""équipe"", ""collaborateurs"", ""encadrement"", ""management"", ""supervision""] },
            medical_innovation: { points: 2, keywords: [""médical"", ""santé"", ""innovation"", ""R&D"", ""recherche"", ""technologie"", ""digital""] },
            transformation: { points: 2, keywords: [""transformation"", ""projet"", ""changement"", ""conduite du changement"", ""réorganisation""] },
            budget: { points: 1, keywords: [""budget"", ""coût"", ""rentabilité"", ""P&L"", ""résultat"", ""chiffre d'affaires"", ""ROI""] },
            codir: { points: 1, keywords: [""direction"", ""codir"", ""comité"", ""conseil"", ""stratégique"", ""executives""] },
            salaire: { points: 1, patterns: [""80k"", ""80000"", ""100k"", ""120k"", ""€80"", ""k€80""] },
            location: { points: 1, zones: [""paris"", ""ile-de-france"", ""hauts-de-france"", ""nord"", ""lille"", ""remote"", ""télétravail""] }
        };

        // Colonnes Kanban
        this.kanbanColumns = [
            { id: ""a_preparer"", title: ""À préparer"", color: ""#6B7280"" },
            { id: ""envoye"", title: ""Envoyé"", color: ""#3B82F6"" },
            { id: ""relance"", title: ""Relance"", color: ""#F59E0B"" },
            { id: ""entretien"", title: ""Entretien"", color: ""#8B5CF6"" },
            { id: ""en_attente"", title: ""En attente"", color: ""#F97316"" },
            { id: ""accepte"", title: ""Accepté"", color: ""#10B981"" },
            { id: ""refuse"", title: ""Refusé"", color: ""#EF4444"" },
            { id: ""archive"", title: ""Archivé"", color: ""#6B7280"" }
        ];

        this.init();
    }

    init() {
        this.loadData();
        this.initializeUI();
        this.bindEvents();
        this.initializeAI();
        this.updateBadges();

        console.log(""🚀 Jimmy AI Generator v3.0 initialized"");
        this.updateAIStatus(""ready"");
    }

    // === GESTION DES DONNÉES ===
    loadData() {
        try {
            const apps = localStorage.getItem('jimmy_applications');
            if (apps) {
                const appsData = JSON.parse(apps);
                appsData.forEach(app => this.applications.set(app.id, app));
            }

            const learning = localStorage.getItem('jimmy_learning');
            if (learning) {
                const learningData = JSON.parse(learning);
                learningData.forEach(item => this.learningData.set(item.id, item));
            }

            console.log(`📊 Loaded ${this.applications.size} applications and ${this.learningData.size} learning items`);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    saveData() {
        try {
            localStorage.setItem('jimmy_applications', JSON.stringify([...this.applications.values()]));
            localStorage.setItem('jimmy_learning', JSON.stringify([...this.learningData.values()]));
            console.log('💾 Data saved successfully');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // === INITIALISATION UI ===
    initializeUI() {
        this.initializeTabs();
        this.initializeKanban();
        this.populateHistory();
        this.populateCorrections();
        this.updateAnalytics();
    }

    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                // Update active states
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                document.getElementById(targetTab + '-tab').classList.add('active');

                this.currentTab = targetTab;

                // Refresh data for the active tab
                if (targetTab === 'kanban') this.refreshKanban();
                if (targetTab === 'history') this.populateHistory();
                if (targetTab === 'analytics') this.updateAnalytics();
            });
        });
    }

    // === ÉVÉNEMENTS ===
    bindEvents() {
        // Générateur
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeJobPosting());
        document.getElementById('continueToGeneration').addEventListener('click', () => this.generateLetter());
        document.getElementById('saveApplication').addEventListener('click', () => this.saveApplication());

        // Apprentissage
        document.getElementById('letterToCorrect').addEventListener('change', (e) => this.loadLetterForCorrection(e.target.value));
        document.getElementById('analyzeCorrections').addEventListener('click', () => this.analyzeCorrections());
        document.getElementById('saveCorrections').addEventListener('click', () => this.saveCorrections());

        // Historique
        document.getElementById('searchHistory').addEventListener('input', (e) => this.filterHistory());
        document.getElementById('exportHistory').addEventListener('click', () => this.exportHistory());

        // Navigation par étapes
        window.goToStep = (step) => this.goToStep(step);
        window.regenerateLetter = () => this.regenerateLetter();
    }

    // === ANALYSE D'ANNONCE ===
    async analyzeJobPosting() {
        const jobText = document.getElementById('jobText').value.trim();
        if (!jobText) {
            alert('Veuillez coller le texte de l\'annonce d\'emploi');
            return;
        }

        this.showLoading('analyzeBtn');

        try {
            // Analyse avec IA
            const analysis = await this.performJobAnalysis(jobText);

            // Afficher les résultats
            this.displayAnalysisResults(analysis);

            // Passer à l'étape suivante
            this.goToStep(2);

        } catch (error) {
            console.error('Error analyzing job posting:', error);
            alert('Erreur lors de l\'analyse. Veuillez réessayer.');
        } finally {
            this.hideLoading('analyzeBtn');
        }
    }

    async performJobAnalysis(jobText) {
        // Simulation d'analyse IA (remplacé par de vrais modèles plus tard)
        await this.delay(1500);

        // Extraction d'informations
        const info = this.extractJobInfo(jobText);

        // Calcul du score
        const score = this.calculateScore(jobText, info);

        // Détection du secteur
        const sector = this.detectSector(jobText);

        return {
            extractedInfo: info,
            score: score,
            sector: sector,
            originalText: jobText,
            analysisDate: new Date().toISOString()
        };
    }

    extractJobInfo(text) {
        const info = {};

        // Extraction entreprise (patterns courants)
        const companyPatterns = [
            /(?:entreprise|société|groupe|company)\s+([A-Z][A-Za-z\s&-]{2,30})/i,
            /^([A-Z][A-Za-z\s&-]{2,30})\s+(?:recrute|recherche)/i,
            /rejoindre\s+([A-Z][A-Za-z\s&-]{2,30})/i
        ];

        for (const pattern of companyPatterns) {
            const match = text.match(pattern);
            if (match) {
                info.company = match[1].trim();
                break;
            }
        }

        // Extraction poste
        const positionPatterns = [
            /(?:poste|titre)\s*:?\s*([^\n\r]{5,50})/i,
            /(?:cherchons|recherchons)\s+(?:un|une)\s+([^\n\r]{5,50})/i,
            /^([A-Z][^\n\r]{10,50})\s*[-–—]/m
        ];

        for (const pattern of positionPatterns) {
            const match = text.match(pattern);
            if (match) {
                info.position = match[1].trim();
                break;
            }
        }

        // Extraction localisation
        const locationMatch = text.match(/(?:lieu|localisation|région)\s*:?\s*([A-Za-z\s,-]{3,30})/i) ||
                            text.match(/(Paris|Lyon|Marseille|Toulouse|Nice|Nantes|Strasbourg|Montpellier|Bordeaux|Lille|Rennes|Reims|Le Havre|Saint-Étienne|Toulon|Angers|Grenoble|Dijon|Brest|Le Mans|Amiens|Tours|Limoges|Clermont-Ferrand|Villeurbanne|Besançon|Orléans|Metz|Rouen|Mulhouse|Perpignan|Caen|Boulogne-Billancourt|Nancy|Roubaix|Argenteuil|Montreuil)/i);
        if (locationMatch) {
            info.location = locationMatch[1].trim();
        }

        // Extraction salaire
        const salaryMatch = text.match(/(?:salaire|rémunération)\s*:?\s*([0-9,. ]+[k€]?)/i) ||
                          text.match(/([0-9]{2,3}[k€]|[0-9]{4,6}\s*€)/i);
        if (salaryMatch) {
            info.salary = salaryMatch[1].trim();
        }

        // Valeurs par défaut
        info.company = info.company || 'Non détecté';
        info.position = info.position || 'Non détecté';
        info.location = info.location || 'Non détecté';
        info.salary = info.salary || 'Non mentionné';

        return info;
    }

    calculateScore(text, info) {
        let totalScore = 0;
        const details = [];
        const textLower = text.toLowerCase();

        // Vérifier chaque critère
        for (const [criterion, config] of Object.entries(this.scoringCriteria)) {
            let points = 0;
            let matches = [];

            if (config.keywords) {
                matches = config.keywords.filter(keyword => 
                    textLower.includes(keyword.toLowerCase())
                );
                if (matches.length > 0) points = config.points;
            }

            if (config.patterns) {
                matches = config.patterns.filter(pattern => 
                    textLower.includes(pattern.toLowerCase())
                );
                if (matches.length > 0) points = config.points;
            }

            if (config.zones && info.location) {
                matches = config.zones.filter(zone => 
                    info.location.toLowerCase().includes(zone.toLowerCase())
                );
                if (matches.length > 0) points = config.points;
            }

            if (points > 0) {
                totalScore += points;
                details.push({
                    criterion,
                    points,
                    matches: matches.slice(0, 3) // Limiter à 3 matches
                });
            }
        }

        return {
            total: Math.min(totalScore, 10), // Maximum 10
            details: details
        };
    }

    detectSector(text) {
        const sectors = {
            medical: [""médical"", ""santé"", ""pharmaceutique"", ""hôpital"", ""clinique"", ""diagnostic"", ""thérapeutique""],
            it: [""informatique"", ""développeur"", ""software"", ""cloud"", ""infrastructure"", ""digital"", ""numérique"", ""tech""],
            defense: [""défense"", ""militaire"", ""sécurité"", ""armée"", ""aeronautique"", ""spatial""],
            services: [""service"", ""maintenance"", ""support"", ""conseil"", ""consulting"", ""assistance""]
        };

        const textLower = text.toLowerCase();

        for (const [sector, keywords] of Object.entries(sectors)) {
            const matches = keywords.filter(keyword => textLower.includes(keyword));
            if (matches.length > 0) {
                return sector;
            }
        }

        return 'general';
    }

    displayAnalysisResults(analysis) {
        // Afficher les informations extraites
        const infoContainer = document.getElementById('extractedInfo');
        infoContainer.innerHTML = '';

        Object.entries(analysis.extractedInfo).forEach(([key, value]) => {
            const infoItem = document.createElement('div');
            infoItem.className = 'info-item';
            infoItem.innerHTML = `
                <div class=""info-label"">${this.getInfoLabel(key)}</div>
                <div class=""info-value"">${value}</div>
            `;
            infoContainer.appendChild(infoItem);
        });

        // Afficher le score
        const scoreValue = document.getElementById('scoreValue');
        const scoreDetails = document.getElementById('scoreDetails');
        const recommendation = document.getElementById('recommendation');

        scoreValue.textContent = analysis.score.total;

        // Mettre à jour le cercle de score (CSS custom property)
        const scoreCircle = document.querySelector('.score-circle');
        scoreCircle.style.setProperty('--score', analysis.score.total);

        // Afficher les détails du score
        scoreDetails.innerHTML = '';
        analysis.score.details.forEach(detail => {
            const scoreItem = document.createElement('div');
            scoreItem.className = 'score-item';
            scoreItem.innerHTML = `
                <span>${this.getCriterionLabel(detail.criterion)}</span>
                <span class=""score-points"">+${detail.points} pt${detail.points > 1 ? 's' : ''}</span>
            `;
            scoreDetails.appendChild(scoreItem);
        });

        // Recommandation
        let recClass, recText;
        if (analysis.score.total >= 7) {
            recClass = 'high';
            recText = '🚀 Excellent match ! Génération automatique recommandée.';
        } else if (analysis.score.total >= 4) {
            recClass = 'medium';
            recText = '⚠️ Match modéré. Vérifiez les détails avant de continuer.';
        } else {
            recClass = 'low';
            recText = '❌ Score faible. Cette opportunité ne correspond pas à vos critères.';
        }

        recommendation.className = `recommendation ${recClass}`;
        recommendation.textContent = recText;

        // Stocker l'analyse pour la génération
        this.currentAnalysis = analysis;
    }

    // === GÉNÉRATION DE LETTRE ===
    async generateLetter() {
        if (!this.currentAnalysis) {
            alert('Aucune analyse disponible');
            return;
        }

        this.goToStep(3);

        try {
            // Génération avec IA adaptative
            const letter = await this.performLetterGeneration(this.currentAnalysis);

            // Afficher la lettre
            this.displayGeneratedLetter(letter);

            // Stocker pour sauvegarde
            this.currentLetter = letter;

        } catch (error) {
            console.error('Error generating letter:', error);
            alert('Erreur lors de la génération. Veuillez réessayer.');
        }
    }

    async performLetterGeneration(analysis) {
        // Simulation de génération IA adaptative
        await this.delay(2000);

        // Appliquer l'apprentissage si disponible
        const adaptedStyle = this.applyLearning(analysis.sector);

        // Générer la lettre selon le style Jimmy adapté
        const letter = this.buildLetter(analysis, adaptedStyle);

        return {
            content: letter,
            sector: analysis.sector,
            company: analysis.extractedInfo.company,
            position: analysis.extractedInfo.position,
            generatedAt: new Date().toISOString(),
            adaptations: adaptedStyle.adaptations || []
        };
    }

    applyLearning(sector) {
        // Récupérer les apprentissages pour ce secteur
        const sectorLearning = [...this.learningData.values()]
            .filter(item => item.sector === sector)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10); // Derniers 10 apprentissages

        const adaptedStyle = {
            vocabulary: new Map(),
            phrasings: [],
            structure: 'default',
            adaptations: []
        };

        // Appliquer les adaptations vocabulaire
        sectorLearning.forEach(learning => {
            if (learning.modifications.vocabulary) {
                Object.entries(learning.modifications.vocabulary).forEach(([original, replacement]) => {
                    adaptedStyle.vocabulary.set(original, replacement);
                });
                adaptedStyle.adaptations.push(`Vocabulaire adapté: ${learning.modifications.vocabulary.length} modifications`);
            }
        });

        return adaptedStyle;
    }

    buildLetter(analysis, adaptedStyle) {
        const { company, position } = analysis.extractedInfo;
        const sector = analysis.sector;

        // Sélectionner les réalisations pertinentes
        const relevantAchievements = this.selectRelevantAchievements(sector, analysis.score.details);

        // Construire la lettre selon la structure Jimmy
        let letter = '';

        // En-tête
        letter += `Madame, Monsieur,

`;

        // Ouverture signature Jimmy
        letter += `${this.jimmyProfile.style_signature.ouverture} que je vous adresse ma candidature pour le poste de ${position} au sein de ${company}.

`;

        // Contexte et analyse entreprise
        letter += this.buildContextSection(company, sector, adaptedStyle);

        // Défis identifiés et solutions
        letter += this.buildChallengesSection(analysis, adaptedStyle);

        // Réalisations quantifiées
        letter += this.buildAchievementsSection(relevantAchievements, adaptedStyle);

        // Vision contribution future
        letter += this.buildContributionSection(position, sector, adaptedStyle);

        // Clôture proactive
        letter += `Je serais ravi de vous rencontrer pour échanger sur les enjeux de ${company} et vous présenter plus en détail mon approche.

`;
        letter += `Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

`;
        letter += `Jimmy PAEPEGAEY`;

        // Appliquer les adaptations vocabulaire
        return this.applyVocabularyAdaptations(letter, adaptedStyle);
    }

    selectRelevantAchievements(sector, scoreDetails) {
        const achievements = [];

        // Toujours inclure management si pertinent
        if (scoreDetails.some(d => d.criterion === 'management')) {
            achievements.push(this.jimmyProfile.realisations.management);
        }

        // Ajouter selon le secteur
        switch (sector) {
            case 'medical':
                achievements.push(this.jimmyProfile.realisations.projets);
                break;
            case 'it':
                achievements.push(this.jimmyProfile.realisations.revenus);
                achievements.push(this.jimmyProfile.realisations.croissance);
                break;
            case 'services':
                achievements.push(this.jimmyProfile.realisations.transformation_appels);
                break;
            default:
                achievements.push(this.jimmyProfile.realisations.budget);
                achievements.push(this.jimmyProfile.realisations.projets);
        }

        return achievements.slice(0, 3); // Maximum 3 réalisations
    }

    buildContextSection(company, sector, adaptedStyle) {
        const sectorContext = {
            medical: ""Dans un contexte de transformation digitale du secteur de la santé"",
            it: ""Face aux enjeux de transformation numérique et d'innovation technologique"",
            services: ""Dans un environnement de service client en constante évolution"",
            general: ""Dans le contexte actuel de transformation des entreprises""
        };

        return `${sectorContext[sector] || sectorContext.general}, ${company} représente pour moi une opportunité exceptionnelle de mettre mon expertise au service d'une organisation à fort potentiel.

`;
    }

    buildChallengesSection(analysis, adaptedStyle) {
        let section = ""Fort de mon expérience en management opérationnel et transformation d'entreprise, j'identifie dans votre annonce des enjeux qui correspondent parfaitement à mon parcours :

"";

        analysis.score.details.forEach(detail => {
            const challengeText = this.getChallengeText(detail.criterion);
            if (challengeText) {
                section += `• ${challengeText}
`;
            }
        });

        return section + ""
"";
    }

    buildAchievementsSection(achievements, adaptedStyle) {
        let section = ""Mes réalisations concrètes illustrent ma capacité à générer des résultats mesurables :

"";

        achievements.forEach(achievement => {
            section += `• **${achievement.description}** : ${achievement.chiffres} - ${achievement.impact}
`;
        });

        return section + ""
"";
    }

    buildContributionSection(position, sector, adaptedStyle) {
        const contributions = {
            medical: ""contribuer à l'excellence opérationnelle et à l'innovation dans le domaine de la santé"",
            it: ""accélérer la transformation digitale et optimiser les performances techniques"",
            services: ""améliorer l'expérience client et l'efficacité opérationnelle"",
            general: ""optimiser les performances et accompagner la croissance""
        };

        return `En tant que ${position}, je pourrai ${contributions[sector] || contributions.general}, en m'appuyant sur ma vision stratégique et mon approche orientée résultats.

`;
    }

    applyVocabularyAdaptations(letter, adaptedStyle) {
        let adaptedLetter = letter;

        // Appliquer les remplacements de vocabulaire appris
        for (const [original, replacement] of adaptedStyle.vocabulary) {
            const regex = new RegExp(`\b${original}\b`, 'gi');
            adaptedLetter = adaptedLetter.replace(regex, replacement);
        }

        return adaptedLetter;
    }

    displayGeneratedLetter(letter) {
        const letterContainer = document.getElementById('letterContainer');
        const letterPreview = document.getElementById('letterPreview');
        const generationStatus = document.getElementById('generationStatus');

        // Masquer le loading et afficher la lettre
        generationStatus.classList.add('hidden');
        letterContainer.classList.remove('hidden');

        letterPreview.textContent = letter.content;
    }

    // === SAUVEGARDE APPLICATION ===
    saveApplication() {
        if (!this.currentAnalysis || !this.currentLetter) {
            alert('Données incomplètes pour la sauvegarde');
            return;
        }

        const priority = document.getElementById('applicationPriority').value;
        const status = document.getElementById('initialStatus').value;
        const notes = document.getElementById('applicationNotes').value;

        const application = {
            id: this.generateId(),
            company: this.currentAnalysis.extractedInfo.company,
            position: this.currentAnalysis.extractedInfo.position,
            sector: this.currentAnalysis.sector,
            location: this.currentAnalysis.extractedInfo.location,
            salary: this.currentAnalysis.extractedInfo.salary,
            score: this.currentAnalysis.score.total,
            priority: priority,
            status: status,
            notes: notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            jobText: this.currentAnalysis.originalText,
            letterContent: this.currentLetter.content,
            analysis: this.currentAnalysis,
            history: [{
                date: new Date().toISOString(),
                status: status,
                action: 'Candidature créée'
            }]
        };

        this.applications.set(application.id, application);
        this.saveData();
        this.updateBadges();

        alert('✅ Candidature sauvegardée avec succès !');

        // Reset du formulaire
        this.resetGenerator();
    }

    // === SYSTÈME D'APPRENTISSAGE ===
    loadLetterForCorrection(applicationId) {
        if (!applicationId) return;

        const application = this.applications.get(applicationId);
        if (!application) return;

        const editor = document.getElementById('comparisonEditor');
        const originalEditor = document.getElementById('editorOriginal');
        const correctedEditor = document.getElementById('editorCorrected');

        originalEditor.textContent = application.letterContent;
        correctedEditor.value = application.letterContent;

        editor.classList.remove('hidden');

        // Stocker l'application en cours de correction
        this.currentCorrectionApp = application;
    }

    analyzeCorrections() {
        if (!this.currentCorrectionApp) return;

        const originalText = document.getElementById('editorOriginal').textContent;
        const correctedText = document.getElementById('editorCorrected').value;

        if (originalText === correctedText) {
            alert('Aucune modification détectée');
            return;
        }

        // Analyser les différences
        const modifications = this.analyzeDifferences(originalText, correctedText);

        // Afficher les insights
        this.displayLearningInsights(modifications);

        // Stocker les modifications pour sauvegarde
        this.currentModifications = modifications;
    }

    analyzeDifferences(original, corrected) {
        const modifications = {
            vocabulary: {},
            style_changes: [],
            structure_changes: [],
            additions: [],
            removals: []
        };

        // Analyse simple des modifications de vocabulaire
        const originalWords = original.toLowerCase().split(/\s+/);
        const correctedWords = corrected.toLowerCase().split(/\s+/);

        // Détecter les remplacements de mots (simplifiée)
        const wordReplacements = this.detectWordReplacements(originalWords, correctedWords);
        modifications.vocabulary = wordReplacements;

        // Détecter les changements de style (longueur de phrases, etc.)
        const originalSentences = original.split(/[.!?]+/).length;
        const correctedSentences = corrected.split(/[.!?]+/).length;

        if (Math.abs(originalSentences - correctedSentences) > 0) {
            modifications.structure_changes.push({
                type: 'sentence_count',
                original: originalSentences,
                corrected: correctedSentences,
                change: correctedSentences - originalSentences
            });
        }

        return modifications;
    }

    detectWordReplacements(originalWords, correctedWords) {
        const replacements = {};

        // Algorithme simple de détection de remplacements
        // (dans un vrai système, on utiliserait des algorithmes plus sophistiqués)

        const commonReplacements = [
            ['très', 'particulièrement'],
            ['important', 'majeur'],
            ['faire', 'réaliser'],
            ['bon', 'excellent'],
            ['grand', 'important']
        ];

        commonReplacements.forEach(([original, replacement]) => {
            const originalCount = originalWords.filter(w => w === original).length;
            const correctedCount = correctedWords.filter(w => w === replacement).length;

            if (originalCount > 0 && correctedCount > originalCount) {
                replacements[original] = replacement;
            }
        });

        return replacements;
    }

    displayLearningInsights(modifications) {
        const insightsList = document.getElementById('insightsList');
        insightsList.innerHTML = '';

        // Insights vocabulaire
        Object.entries(modifications.vocabulary).forEach(([original, replacement]) => {
            const insight = document.createElement('div');
            insight.className = 'insight-item';
            insight.innerHTML = `
                <span class=""insight-icon"">📝</span>
                <div class=""insight-content"">
                    <div class=""insight-title"">Amélioration vocabulaire</div>
                    <div class=""insight-description"">
                        Remplacement de ""${original}"" par ""${replacement}""
                    </div>
                </div>
            `;
            insightsList.appendChild(insight);
        });

        // Insights structure
        modifications.structure_changes.forEach(change => {
            const insight = document.createElement('div');
            insight.className = 'insight-item';
            insight.innerHTML = `
                <span class=""insight-icon"">🏗️</span>
                <div class=""insight-content"">
                    <div class=""insight-title"">Modification structure</div>
                    <div class=""insight-description"">
                        ${change.change > 0 ? 'Ajout' : 'Suppression'} de ${Math.abs(change.change)} phrase(s)
                    </div>
                </div>
            `;
            insightsList.appendChild(insight);
        });

        document.getElementById('learningInsights').classList.remove('hidden');
    }

    saveCorrections() {
        if (!this.currentCorrectionApp || !this.currentModifications) {
            alert('Aucune correction à sauvegarder');
            return;
        }

        // Collecter les évaluations
        const ratings = {};
        document.querySelectorAll('.rating-stars').forEach(ratingElement => {
            const category = ratingElement.dataset.rating;
            const rating = ratingElement.querySelectorAll('.star.filled').length;
            ratings[category] = rating;
        });

        // Créer l'entrée d'apprentissage
        const learningEntry = {
            id: this.generateId(),
            applicationId: this.currentCorrectionApp.id,
            sector: this.currentCorrectionApp.sector,
            originalText: document.getElementById('editorOriginal').textContent,
            correctedText: document.getElementById('editorCorrected').value,
            modifications: this.currentModifications,
            ratings: ratings,
            createdAt: new Date().toISOString(),
            confidence: this.calculateConfidence(this.currentModifications, ratings)
        };

        this.learningData.set(learningEntry.id, learningEntry);
        this.saveData();

        alert('🧠 Apprentissage sauvegardé ! L\'IA s\'améliore...');

        // Reset
        this.currentCorrectionApp = null;
        this.currentModifications = null;
        document.getElementById('comparisonEditor').classList.add('hidden');
    }

    // === KANBAN ===
    initializeKanban() {
        const kanbanBoard = document.getElementById('kanbanBoard');
        kanbanBoard.innerHTML = '';

        this.kanbanColumns.forEach(column => {
            const columnElement = this.createKanbanColumn(column);
            kanbanBoard.appendChild(columnElement);
        });

        this.populateKanbanCards();
        this.initializeDragAndDrop();
    }

    createKanbanColumn(column) {
        const columnDiv = document.createElement('div');
        columnDiv.className = 'kanban-column';
        columnDiv.dataset.status = column.id;

        const apps = [...this.applications.values()].filter(app => app.status === column.id);

        columnDiv.innerHTML = `
            <div class=""column-header"" style=""border-top: 3px solid ${column.color}"">
                <div class=""column-title"">
                    <span style=""color: ${column.color}"">●</span>
                    ${column.title}
                </div>
                <div class=""column-count"">${apps.length}</div>
            </div>
            <div class=""cards-container"" data-status=""${column.id}"">
                <!-- Cards will be populated here -->
            </div>
        `;

        return columnDiv;
    }

    populateKanbanCards() {
        // Vider toutes les colonnes
        document.querySelectorAll('.cards-container').forEach(container => {
            container.innerHTML = '';
        });

        // Ajouter les cartes
        [...this.applications.values()].forEach(app => {
            const card = this.createKanbanCard(app);
            const container = document.querySelector(`.cards-container[data-status=""${app.status}""]`);
            if (container) {
                container.appendChild(card);
            }
        });

        // Mettre à jour les compteurs
        this.updateKanbanCounters();
    }

    createKanbanCard(app) {
        const card = document.createElement('div');
        card.className = `kanban-card priority-${app.priority}`;
        card.dataset.appId = app.id;
        card.draggable = true;

        const daysAgo = Math.floor((new Date() - new Date(app.createdAt)) / (1000 * 60 * 60 * 24));

        card.innerHTML = `
            <div class=""card-header"">
                <div class=""card-company"">${app.company}</div>
                <div class=""card-date"">${daysAgo}j</div>
            </div>
            <div class=""card-position"">${app.position}</div>
            <div class=""card-footer"">
                <div class=""card-score"">${app.score}/10</div>
                <div class=""priority-indicator priority-${app.priority}""></div>
            </div>
        `;

        // Événement pour ouvrir les détails
        card.addEventListener('click', () => this.showApplicationDetails(app));

        return card;
    }

    initializeDragAndDrop() {
        // Drag events pour les cartes
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('kanban-card')) {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.dataset.appId);
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('kanban-card')) {
                e.target.classList.remove('dragging');
            }
        });

        // Drop events pour les colonnes
        document.querySelectorAll('.cards-container').forEach(container => {
            container.addEventListener('dragover', (e) => {
                e.preventDefault();
                container.classList.add('drag-over');
            });

            container.addEventListener('dragleave', () => {
                container.classList.remove('drag-over');
            });

            container.addEventListener('drop', (e) => {
                e.preventDefault();
                container.classList.remove('drag-over');

                const appId = e.dataTransfer.getData('text/plain');
                const newStatus = container.dataset.status;

                this.moveApplication(appId, newStatus);
            });
        });
    }

    moveApplication(appId, newStatus) {
        const app = this.applications.get(appId);
        if (!app) return;

        const oldStatus = app.status;
        app.status = newStatus;
        app.updatedAt = new Date().toISOString();

        // Ajouter à l'historique
        app.history.push({
            date: new Date().toISOString(),
            status: newStatus,
            action: `Déplacé de ""${this.getStatusLabel(oldStatus)}"" vers ""${this.getStatusLabel(newStatus)}""`
        });

        this.applications.set(appId, app);
        this.saveData();

        // Rafraîchir le Kanban
        this.populateKanbanCards();
        this.updateBadges();
    }

    // === HISTORIQUE ===
    populateHistory() {
        const tableBody = document.getElementById('historyTableBody');
        tableBody.innerHTML = '';

        const apps = [...this.applications.values()]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        apps.forEach(app => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(app.createdAt).toLocaleDateString('fr-FR')}</td>
                <td>${app.company}</td>
                <td>${app.position}</td>
                <td>${this.getSectorLabel(app.sector)}</td>
                <td><span class=""score-badge"">${app.score}/10</span></td>
                <td><span class=""status-badge status-${app.status}"">${this.getStatusLabel(app.status)}</span></td>
                <td>
                    <button class=""btn-sm"" onclick=""app.showApplicationDetails('${app.id}')"">👁️</button>
                    <button class=""btn-sm"" onclick=""app.editApplication('${app.id}')"">✏️</button>
                    <button class=""btn-sm btn-danger"" onclick=""app.deleteApplication('${app.id}')"">🗑️</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // === ANALYTICS ===
    updateAnalytics() {
        const apps = [...this.applications.values()];
        const learning = [...this.learningData.values()];

        // Métriques de base
        document.getElementById('aiImprovement').textContent = this.calculateAIImprovement(learning);
        document.getElementById('learningCount').textContent = learning.length;
        document.getElementById('styleEvolution').textContent = this.calculateStyleEvolution(learning);
        document.getElementById('successRate').textContent = this.calculateSuccessRate(apps);

        // Insights personnalisés
        this.updatePersonalizedInsights(apps, learning);
    }

    calculateAIImprovement(learning) {
        if (learning.length < 2) return '+0%';

        // Calculer l'amélioration basée sur les notes moyennes
        const recent = learning.slice(-5);
        const older = learning.slice(0, 5);

        const recentAvg = recent.reduce((sum, item) => {
            const ratings = Object.values(item.ratings || {});
            return sum + (ratings.reduce((s, r) => s + r, 0) / ratings.length || 0);
        }, 0) / recent.length;

        const olderAvg = older.reduce((sum, item) => {
            const ratings = Object.values(item.ratings || {});
            return sum + (ratings.reduce((s, r) => s + r, 0) / ratings.length || 0);
        }, 0) / older.length;

        const improvement = ((recentAvg - olderAvg) / olderAvg * 100).toFixed(0);
        return `+${improvement}%`;
    }

    calculateStyleEvolution(learning) {
        // Simuler l'évolution du style basée sur le nombre de corrections
        const evolution = Math.min(learning.length * 2 + 75, 95);
        return `${evolution}%`;
    }

    calculateSuccessRate(apps) {
        const interviews = apps.filter(app => 
            ['entretien', 'en_attente', 'accepte'].includes(app.status)
        ).length;

        const sent = apps.filter(app => app.status !== 'a_preparer').length;

        if (sent === 0) return '0%';

        const rate = (interviews / sent * 100).toFixed(0);
        return `${rate}%`;
    }

    // === UTILITAIRES ===
    generateId() {
        return 'app_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateBadges() {
        const appsCount = this.applications.size;
        const learningCount = this.learningData.size;

        document.getElementById('history-badge').textContent = appsCount;
        document.getElementById('kanban-badge').textContent = appsCount;

        if (learningCount > 0) {
            const correctionBadge = document.getElementById('correction-badge');
            correctionBadge.textContent = learningCount;
            correctionBadge.classList.remove('hidden');
        }
    }

    updateAIStatus(status) {
        const statusElement = document.querySelector('.status-text');
        const indicator = document.querySelector('.status-indicator');

        switch (status) {
            case 'ready':
                statusElement.textContent = 'IA Ready';
                indicator.style.background = '#10b981';
                break;
            case 'learning':
                statusElement.textContent = 'IA Learning...';
                indicator.style.background = '#f59e0b';
                break;
            case 'analyzing':
                statusElement.textContent = 'IA Analyzing...';
                indicator.style.background = '#3b82f6';
                break;
        }
    }

    showLoading(elementId) {
        const element = document.getElementById(elementId);
        element.classList.add('loading');
        element.disabled = true;
    }

    hideLoading(elementId) {
        const element = document.getElementById(elementId);
        element.classList.remove('loading');
        element.disabled = false;
    }

    goToStep(step) {
        // Masquer tous les panneaux
        document.querySelectorAll('.step-panel').forEach(panel => {
            panel.classList.add('hidden');
        });

        // Afficher le panneau cible
        document.querySelector(`[data-step=""${step}""]`).classList.remove('hidden');
        this.currentStep = step;
    }

    resetGenerator() {
        document.getElementById('jobText').value = '';
        document.getElementById('jobUrl').value = '';
        document.getElementById('applicationNotes').value = '';
        this.currentAnalysis = null;
        this.currentLetter = null;
        this.goToStep(1);
    }

    // Labels et libellés
    getInfoLabel(key) {
        const labels = {
            company: 'Entreprise',
            position: 'Poste',
            location: 'Localisation', 
            salary: 'Salaire'
        };
        return labels[key] || key;
    }

    getCriterionLabel(criterion) {
        const labels = {
            management: 'Management d\'équipe',
            medical_innovation: 'Secteur médical/innovation',
            transformation: 'Projets de transformation',
            budget: 'Responsabilités budgétaires',
            codir: 'Rattachement CODIR',
            salaire: 'Salaire 80k+',
            location: 'Localisation acceptable'
        };
        return labels[criterion] || criterion;
    }

    getChallengeText(criterion) {
        const challenges = {
            management: ""Développement et animation d'équipes performantes"",
            medical_innovation: ""Innovation dans le secteur de la santé"",
            transformation: ""Conduite du changement et transformation organisationnelle"",
            budget: ""Pilotage financier et optimisation budgétaire"",
            codir: ""Collaboration avec les instances dirigeantes""
        };
        return challenges[criterion];
    }

    getStatusLabel(status) {
        const labels = {
            a_preparer: 'À préparer',
            envoye: 'Envoyé',
            relance: 'Relance',
            entretien: 'Entretien',
            en_attente: 'En attente',
            accepte: 'Accepté',
            refuse: 'Refusé',
            archive: 'Archivé'
        };
        return labels[status] || status;
    }

    getSectorLabel(sector) {
        const labels = {
            medical: 'Médical',
            it: 'Informatique',
            defense: 'Défense',
            services: 'Services',
            general: 'Général'
        };
        return labels[sector] || sector;
    }

    // Méthodes exposées globalement
    showApplicationDetails(appId) {
        const app = this.applications.get(appId);
        if (!app) return;

        const modal = document.getElementById('applicationModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <div class=""app-details"">
                <h3>${app.company} - ${app.position}</h3>
                <div class=""detail-grid"">
                    <div><strong>Secteur:</strong> ${this.getSectorLabel(app.sector)}</div>
                    <div><strong>Score:</strong> ${app.score}/10</div>
                    <div><strong>Priorité:</strong> ${app.priority}</div>
                    <div><strong>Statut:</strong> ${this.getStatusLabel(app.status)}</div>
                    <div><strong>Créé:</strong> ${new Date(app.createdAt).toLocaleDateString('fr-FR')}</div>
                    <div><strong>Modifié:</strong> ${new Date(app.updatedAt).toLocaleDateString('fr-FR')}</div>
                </div>
                <div class=""letter-preview"">
                    <h4>Lettre de motivation</h4>
                    <div class=""letter-content"">${app.letterContent}</div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    // Initialisation de l'IA (placeholder pour futurs modèles)
    async initializeAI() {
        try {
            // Ici on pourrait charger TensorFlow.js et des modèles
            console.log('🤖 AI system initialized');

            // Simuler le chargement
            await this.delay(1000);

        } catch (error) {
            console.error('AI initialization failed:', error);
        }
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new JimmyAIGenerator();
});

// Gestion du modal
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-close') || 
        (e.target.classList.contains('modal') && e.target === e.currentTarget)) {
        document.getElementById('applicationModal').classList.add('hidden');
    }
});

// Gestion des étoiles de notation
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        const starsContainer = e.target.parentElement;
        const stars = starsContainer.querySelectorAll('.star');
        const rating = Array.from(stars).indexOf(e.target) + 1;

        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('filled');
                star.textContent = '⭐';
            } else {
                star.classList.remove('filled');
                star.textContent = '☆';
            }
        });
    }
});

// Initialiser les étoiles
document.querySelectorAll('.rating-stars').forEach(container => {
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '☆';
        container.appendChild(star);
    }
});

console.log('🚀 Jimmy AI Generator v3.0 loaded');
