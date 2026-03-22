# Abricot - Frontend

Application de gestion de projets et de tâches développée avec Next.js.

## Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles utilitaires
- **DaisyUI** - Composants UI

## Installation

```bash
npm install
```

## Démarrage

```bash
npm run dev
```

L'application est accessible sur [http://localhost:8001](http://localhost:8001).

## Variables d'environnement

Créer un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Structure du projet

```
front/
├── app/                    # Pages et composants (App Router)
│   ├── account/            # Page mon compte
│   ├── api/proxy/          # Proxy API pour le backend
│   ├── auth/               # Pages login et register
│   ├── components/         # Composants réutilisables
│   ├── dashboard/          # Page tableau de bord
│   └── projects/           # Pages projets et détails
├── context/                # Contextes React (Auth, Notifications)
├── helpers/                # Fonctions utilitaires
├── hooks/                  # Hooks personnalisés
├── services/               # Services API
└── types/                  # Types TypeScript
```

## Fonctionnalités

- Authentification (login/register)
- Gestion des projets (CRUD)
- Gestion des tâches avec statuts
- Assignation de contributeurs
- Commentaires sur les tâches
- Vue liste et kanban des tâches

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Démarre le serveur de production |
| `npm run lint` | Vérifie le code avec ESLint |
