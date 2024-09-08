import { constraintErrors } from './constraint-errors';
describe('constraintErrors', () => {
  it('should contain the correct key-value pairs', () => {
    expect(constraintErrors).toEqual({
      UQ_user_external_id: 'error.unique.externalId',
      UQ_user_profile_tag: 'error.unique.profileTag',
    });
  });

  it('should be immutable', () => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    try {
      (constraintErrors as any).UQ_user_external_id =
        'error.modified.externalId';
    } catch (_) {
      //Do Nothing
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */
    expect(constraintErrors.UQ_user_external_id).toBe(
      'error.unique.externalId',
    );
  });
});
