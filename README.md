# Winside - Association Culturelle

Plateforme web 3-en-1 pour une association culturelle : site public, espace membres et back-office admin.

## Fonctionnalités

### Public
- Liste des événements à venir
- Détails des événements
- Formulaire de contact

### Membres
- Inscription aux événements (via auth Supabase)
- Profil personnel
- Historique des inscriptions

### Administration
- Dashboard avec statistiques
- CRUD événements
- Gestion des membres
- Export CSV des inscrits

## Stack Technique

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Base de données & Auth**: Supabase (Postgres + Auth)
- **Déploiement**: Vercel

## Structure du Projet

```
src/
├── app/
│   ├── admin/          # Interface admin (dashboard, événements, membres, inscriptions)
│   ├── evenements/     # Agenda public et détails
│   ├── membre/         # Espace membre (profil, historique)
│   ├── login/          # Authentification
│   ├── contact/        # Formulaire de contact
│   └── page.tsx        # Page d'accueil
├── components/
│   ├── admin/          # Composants admin
│   ├── events/         # Composants événements
│   ├── layout/         # Header, Footer
│   ├── member/         # Composants espace membre
│   └── providers/      # Fournisseurs de contexte
├── lib/
│   ├── supabase/       # Configuration Supabase (client, server, types)
│   └── auth.ts         # Utilitaires d'authentification
└── middleware.ts       # Middleware d'authentification et d'autorisation
```

## Installation

1. **Cloner le projet**
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Configurer Supabase**
   - Créer un projet sur [supabase.com](https://supabase.com)
   - Créer un fichier `.env.local` à la racine :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. **Initialiser la base de données**
   - Exécuter le script SQL dans `supabase/schema.sql` via l'interface Supabase (SQL Editor)
   - Ce script crée les tables `profiles`, `events`, `registrations` et configure les politiques RLS

5. **Lancer le développement**
   ```bash
   npm run dev
   ```
   Ouvrir http://localhost:3000

## Déploiement

### Vercel
1. Pousser le code sur GitHub
2. Créer un nouveau projet sur Vercel
3. Configurer les variables d'environnement Supabase
4. Déployer

Le projet est optimisé pour Vercel avec Next.js 14.

## Notes importantes

- L'authentification utilise Supabase Auth avec support OAuth (Google, GitHub)
- Les routes admin sont protégées par middleware (rôle admin requis)
- L'export CSV est généré côté client
- Le middleware gère la redirection des utilisateurs non-authentifiés
- Les politiques RLS (Row Level Security) protègent les données

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase |
