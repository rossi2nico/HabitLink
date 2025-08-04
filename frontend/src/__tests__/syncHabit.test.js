import { syncHabit } from '../hooks/useHabits'

global.fetch = jest.fn();

describe('syncHabit', () => {
  let user, dispatch, setIsLoading, setError;

  beforeEach(() => {
    user = { token: 'fake-token' };
    dispatch = jest.fn();
    setIsLoading = jest.fn();
    setError = jest.fn();

    fetch.mockClear();
  });

  it('returns false and sets error if no user', async () => {
    const result = await syncHabit.call({ user: null, setError, setIsLoading, dispatch }, 'habit1', 'user1', 'public');
    expect(result).toBe(false);
    expect(setError).toHaveBeenCalledWith('You must be logged in');
  });

  it('handles successful sync and fetch', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'newHabit' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'originalHabit' }),
      });

    const context = { user, dispatch, setIsLoading, setError };

    // Bind function context to mimic use in React component if needed
    const result = await syncHabit.call(context, 'habit1', 'user1', 'public');

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'SYNC_HABIT',
      payload: { newHabit: { id: 'newHabit' }, originalHabit: { id: 'originalHabit' } },
    });
    expect(result).toBe(true);
  });

  // Add tests for error cases on fetch responses...
});
