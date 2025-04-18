import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import App from '@/App';

// Mock the AuthProvider to simulate authenticated state
jest.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: { id: '123', email: 'test@example.com' },
    isAuthenticated: true,
    loading: false
  })
}));

describe('App Component', () => {
  test('renders main navigation elements', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
    
    // Check for main navigation elements
    expect(screen.getByText(/SingleTennis/i)).toBeInTheDocument();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Players/i)).toBeInTheDocument();
    expect(screen.getByText(/Challenges/i)).toBeInTheDocument();
    expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
  });
});
