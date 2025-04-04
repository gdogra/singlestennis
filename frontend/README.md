# SinglesTennis 🎾

[![Backend Deploy](https://github.com/gdogra/singlestennis/actions/workflows/deploy-backend.yml/badge.svg)](https://github.com/gdogra/singlestennis/actions/workflows/deploy-backend.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/2bfc4511-d30a-4d87-bdf8-e9e5f43c621b/deploy-status)](https://app.netlify.com/sites/tennisconnect2/deploys)
[![Frontend Release](https://img.shields.io/github/v/tag/gdogra/singlestennis?label=frontend&sort=semver&color=blue&logo=react)](https://github.com/gdogra/singlestennis/releases)
[![Backend Release](https://img.shields.io/github/v/tag/gdogra/singlestennis?label=backend&sort=semver&color=green&logo=node.js)](https://github.com/gdogra/singlestennis/releases)

**SinglesTennis** is a full-stack tennis challenge and match tracking platform. Built to help players connect, challenge, and track results with ease.

---

## 🛠 Tech Stack

| Layer       | Tech                                |
|-------------|--------------------------------------|
| Frontend    | React + Vite + TailwindCSS          |
| Backend     | Node.js + Express + PostgreSQL      |
| Auth        | JWT + Bcrypt                        |
| DevOps      | GitHub Actions + Docker + Railway   |
| Deployments | Railway (backend), Netlify (frontend) |

---

## 🚀 Quick Start

```bash
git clone https://github.com/gdogra/singlestennis.git
cd singlestennis
docker-compose up --build

