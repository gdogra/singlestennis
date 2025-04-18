import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ScoreEntryModal from '@/components/ScoreEntryModal';

// Mock the useScoreService hook
jest.mock('@/services/scoreService', () => ({
  useScoreService: () => ({
    submitMatchScore: jest.fn().mockResolvedValue({ success: true }),
    loading: false,
    error: null
  })
}));

describe('ScoreEntryModal Component', () => {
  const mockMatch = {
    id: '123',
    challenger: { id: 'challenger-id', full_name: 'John Doe' },
    opponent: { id: 'opponent-id', full_name: 'Jane Smith' },
    scheduled_date: '2025-04-15T14:00:00Z'
  };

  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnSuccess.mockClear();
  });

  test('renders match information correctly', () => {
    render(
      <ScoreEntryModal 
        match={mockMatch} 
        onClose={mockOnClose} 
        onSuccess={mockOnSuccess} 
      />
    );
    
    expect(screen.getByText('Enter Match Scores')).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/)).toBeInTheDocument();
    expect(screen.getByText(/Played on:/)).toBeInTheDocument();
  });

  test('allows score entry for each set', () => {
    render(
      <ScoreEntryModal 
        match={mockMatch} 
        onClose={mockOnClose} 
        onSuccess={mockOnSuccess} 
      />
    );
    
    // Find set tabs and score inputs
    const set1Tab = screen.getByRole('button', { name: /Set 1/i });
    const set2Tab = screen.getByRole('button', { name: /Set 2/i });
    const set3Tab = screen.getByRole('button', { name: /Set 3/i });
    
    // Set 1 should be active by default
    expect(set1Tab).toHaveClass('bg-indigo-600');
    
    // Enter scores for set 1
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '6' } });
    fireEvent.change(inputs[1], { target: { value: '4' } });
    
    // Switch to set 2
    fireEvent.click(set2Tab);
    expect(set2Tab).toHaveClass('bg-indigo-600');
    
    // Enter scores for set 2
    fireEvent.change(inputs[0], { target: { value: '7' } });
    fireEvent.change(inputs[1], { target: { value: '6' } });
    
    // Switch to set 3
    fireEvent.click(set3Tab);
    expect(set3Tab).toHaveClass('bg-indigo-600');
    
    // Enter scores for set 3
    fireEvent.change(inputs[0], { target: { value: '6' } });
    fireEvent.change(inputs[1], { target: { value: '3' } });
  });

  test('calls onClose when cancel button is clicked', () => {
    render(
      <ScoreEntryModal 
        match={mockMatch} 
        onClose={mockOnClose} 
        onSuccess={mockOnSuccess} 
      />
    );
    
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
