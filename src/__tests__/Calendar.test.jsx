import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Calendar from '@/pages/Calendar';

// Mock the useCalendarService hook
jest.mock('@/services/calendarService', () => ({
  useCalendarService: () => ({
    getMatches: jest.fn().mockResolvedValue({ 
      data: [
        {
          id: '123',
          scheduled_date: '2025-04-15T14:00:00Z',
          challenger: { id: 'challenger-id', full_name: 'John Doe' },
          opponent: { id: 'opponent-id', full_name: 'Jane Smith' },
          user_id: 'challenger-id'
        }
      ], 
      error: null 
    }),
    rescheduleMatch: jest.fn().mockResolvedValue({ success: true }),
    loading: false,
    error: null
  })
}));

// Mock the ScoreEntryModal component
jest.mock('@/components/ScoreEntryModal', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ match, onClose }) => (
    <div data-testid="mock-score-entry-modal">
      <button onClick={onClose}>Close</button>
    </div>
  ))
}));

describe('Calendar Component', () => {
  beforeEach(() => {
    // Reset date to a fixed value for consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-04-01'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders calendar with month navigation', async () => {
    render(
      <BrowserRouter>
        <Calendar />
      </BrowserRouter>
    );
    
    // Wait for the calendar to load
    await waitFor(() => {
      expect(screen.getByText('Match Calendar')).toBeInTheDocument();
    });
    
    // Check for month navigation
    expect(screen.getByText('April 2025')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    
    // Check for day headers
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getByText('Thu')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  test('navigates between months', async () => {
    render(
      <BrowserRouter>
        <Calendar />
      </BrowserRouter>
    );
    
    // Wait for the calendar to load
    await waitFor(() => {
      expect(screen.getByText('April 2025')).toBeInTheDocument();
    });
    
    // Navigate to next month
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText('May 2025')).toBeInTheDocument();
    
    // Navigate to previous month
    fireEvent.click(screen.getByRole('button', { name: /Previous/i }));
    expect(screen.getByText('April 2025')).toBeInTheDocument();
  });
});
