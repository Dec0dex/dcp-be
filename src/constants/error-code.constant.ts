export enum ErrorCode {
  // Common Validation
  V0000 = 'common.validation.error',

  // Validation
  V0001 = 'user.validation.is_empty',
  V0002 = 'user.validation.is_invalid',

  // Common Error
  E0404 = 'common.error.entity_not_found',
  E0500 = 'common.error.internal_server_error',

  // Errors
  E0001 = 'user.error.suspended',
  E0002 = 'user.error.already_exists',
}
