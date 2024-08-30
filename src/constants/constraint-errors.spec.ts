import { constraintErrors } from './constraint-errors';
describe('constraintErrors', () => {
  it('should contain the correct key-value pairs', () => {
    expect(constraintErrors).toEqual({
      UQ_user_username: 'error.unique.username',
      UQ_user_email: 'error.unique.email',
    });
  });

  it('should be immutable', () => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    try {
      (constraintErrors as any).UQ_user_username = 'error.modified.username';
    } catch (_) {
      //Do Nothing
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */
    expect(constraintErrors.UQ_user_username).toBe('error.unique.username');
  });
});
