# GasaUnivers - Back API

Backend minimal pour l'application GasaUnivers.

Pré-requis
- Node.js >=16
- MongoDB (local ou distant)

Installation

```bash
cd back-api
npm install
cp .env.example .env
# éditer .env pour mettre votre MONGO_URI et JWT_SECRET
npm run dev
```

Base d'API
- `POST /api/auth/register` : enregistrer un utilisateur (name,email,password,role)
- `POST /api/auth/login` : login -> retourne `token`
- `GET /api/users` : liste utilisateurs (auth requis)
- `GET /api/promotions` : liste promotions

Intégration front
- Point d'entrée: `http://localhost:5000`
- Autoriser CORS depuis votre front (ex: `http://localhost:5173`)
