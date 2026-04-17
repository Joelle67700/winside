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
   - Ce script crée les tables `users`, `evenements`, `inscriptions` et configure les politiques RLS

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

## Architecture Supabase

### Tables

| Table | Colonnes | Description |
|-------|----------|-------------|
| `users` | `id`, `email`, `name`, `role`, `created_at` | Profils utilisateur (étend Supabase Auth) |
| `evenements` | `id`, `titre`, `date`, `lieu`, `desc`, `created_at`, `updated_at` | Événements de l'association |
| `inscriptions` | `id`, `user_id`, `evenement_id`, `created_at` | Inscriptions aux événements (unique par user+event) |

### Relations
- `inscriptions.user_id` → `users.id` (CASCADE)
- `inscriptions.evenement_id` → `evenements.id` (CASCADE)

### Sécurité
- **RLS** activé sur toutes les tables
- Users: voient leur propre profil, admins voient tout
- Evenements: lecture publique, écriture admin uniquement
- Inscriptions: users voient leurs inscriptions, admins voient tout
- Trigger automatique: création du profil `users` lors de l'inscription Auth

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anonyme Supabase |
