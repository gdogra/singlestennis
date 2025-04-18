# SingleTennis Application

A modern tennis matchmaking web application built with Vite, React, and Supabase.

## Features

- **Player Directory**: Browse and filter players by skill level
- **Challenge Flow**: Challenge other players to matches
- **Match Calendar**: Schedule and manage your tennis matches
- **Score Entry**: Record match scores with tennis-specific validation
- **Match History & Leaderboards**: Track your performance and see rankings
- **Avatar Support**: Upload and manage your profile picture

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **State Management**: React Context API
- **Routing**: React Router
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js 16+
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/singletennis.git
cd singletennis
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp frontend/.env.example frontend/.env
```
Edit the `.env` file with your Supabase credentials.

4. Start the development server
```bash
pnpm dev
```

## Project Structure

```
singletennis/
├── frontend/               # Frontend application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layers
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Application entry point
│   ├── .env.example        # Example environment variables
│   └── package.json        # Frontend dependencies
└── package.json            # Root package.json for monorepo
```

## Testing

Run the test suite with:
```bash
pnpm test
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
