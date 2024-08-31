export enum ErrorCode {
  // Common Validation
  V0000 = 'common.validation.error',

  // Validation
  V0001 = 'user.validation.is_empty',
  V0002 = 'user.validation.is_invalid',

  // Error
  E0001 = 'user.error.username_or_email_exists',
  E0002 = 'user.error.not_found',
  E0404 = 'common.error.entity_not_found',
  E0500 = 'common.error.internal_server_error',
}
