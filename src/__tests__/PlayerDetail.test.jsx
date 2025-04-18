import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PlayerDetail from '@/components/PlayerDetail';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('PlayerDetail Component', () => {
  const mockPlayer = {
    id: '123',
    full_name: 'John Doe',
    skill_level: 'intermediate',
    matches_count: 10,
    win_rate: '60%'
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('renders player information correctly', () => {
    render(
      <BrowserRouter>
        <PlayerDetail player={mockPlayer} onClose={mockOnClose} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Player Profile')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('intermediate')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <BrowserRouter>
        <PlayerDetail player={mockPlayer} onClose={mockOnClose} />
      </BrowserRouter>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('shows challenge button', () => {
    render(
      <BrowserRouter>
        <PlayerDetail player={mockPlayer} onClose={mockOnClose} />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('button', { name: /challenge to a match/i })).toBeInTheDocument();
  });
});
