import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Individual_Job from '../pages/Individual_Post';
import UserContext from '../../UserContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import React from 'react';

const mockUser = {
  _id: '1234',
};

const mockData = {
  data: {
    myPost: {
      _id: "1",
      selectedCandidates: [],
      title: 'Software Developer',
      company: 'Test Company',
      description: 'A great job opportunity',
      location: 'Test City',
      date_posted: '2023-03-22T06:10:34.157Z',
    },
  },
};

jest.spyOn(window, 'fetch').mockResolvedValueOnce({
  json: async () => mockData,
});

describe('Individual_Job component', () => {
  test('renders without crashing', async () => {
    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <MemoryRouter initialEntries={['/jobs/1']}>
          <Routes>
            <Route path="/jobs/:postId" element={<Individual_Job />} />
          </Routes>
        </MemoryRouter>
      </UserContext.Provider>
    );

    await waitFor(() => expect(window.fetch).toHaveBeenCalled());

    expect(screen.getByText(/Job Title:/i)).toBeInTheDocument();
    expect(screen.getByText(/Company:/i)).toBeInTheDocument();
    expect(screen.getByText(/Job description:/i)).toBeInTheDocument();
    expect(screen.getByText(/Location:/i)).toBeInTheDocument();
    expect(screen.getByText(/Date Posted:/i)).toBeInTheDocument();
  });

  test('handles apply button click', async () => {
    // Reset the fetch mock before the test
    window.fetch.mockClear();

    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <MemoryRouter initialEntries={['/jobs/1']}>
          <Routes>
            <Route path="/jobs/:postId" element={<Individual_Job />} />
          </Routes>
        </MemoryRouter>
      </UserContext.Provider>
    );

    await waitFor(() => expect(window.fetch).toHaveBeenCalled());

    const applyButton = screen.getByRole('button', { name: /apply/i });
    fireEvent.click(applyButton);

    await waitFor(() =>
      expect(screen.getByText(/Applied successfully!/i)).toBeInTheDocument()
    );
  });
});
