export interface AppErrorBody {
  code: string;
  message: string;
}

export const AppErrors = {
  // Auth
  EMAIL_ALREADY_REGISTERED: {
    code: 'EMAIL_ALREADY_REGISTERED',
    message: 'Email already registered',
  },
  INVALID_CREDENTIALS: {
    code: 'INVALID_CREDENTIALS',
    message: 'Invalid credentials',
  },
  EMAIL_NOT_VERIFIED: {
    code: 'EMAIL_NOT_VERIFIED',
    message: 'Email not verified',
  },
  INVALID_VERIFICATION_TOKEN: {
    code: 'INVALID_VERIFICATION_TOKEN',
    message: 'Invalid verification token',
  },
  VERIFICATION_TOKEN_EXPIRED: {
    code: 'VERIFICATION_TOKEN_EXPIRED',
    message: 'Verification token expired',
  },
  REFRESH_TOKEN_MISSING: {
    code: 'REFRESH_TOKEN_MISSING',
    message: 'Refresh token missing',
  },
  INVALID_REFRESH_TOKEN: {
    code: 'INVALID_REFRESH_TOKEN',
    message: 'Invalid refresh token',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Unauthorized',
  },
  TOKEN_REVOKED: {
    code: 'TOKEN_REVOKED',
    message: 'Token revoked',
  },

  // Users
  EMAIL_ALREADY_IN_USE: {
    code: 'EMAIL_ALREADY_IN_USE',
    message: 'Email already in use',
  },
  PASSWORD_CHANGE_NOT_AVAILABLE: {
    code: 'PASSWORD_CHANGE_NOT_AVAILABLE',
    message: 'Password change not available for OAuth accounts',
  },
  CURRENT_PASSWORD_INCORRECT: {
    code: 'CURRENT_PASSWORD_INCORRECT',
    message: 'Current password is incorrect',
  },

  // Integrations
  INVALID_AMOCRM_CREDENTIALS: {
    code: 'INVALID_AMOCRM_CREDENTIALS',
    message: 'Invalid amoCRM credentials',
  },
  INVALID_OAUTH_STATE: {
    code: 'INVALID_OAUTH_STATE',
    message: 'Invalid OAuth state',
  },
  AMOCRM_INTEGRATION_NOT_FOUND: {
    code: 'AMOCRM_INTEGRATION_NOT_FOUND',
    message: 'amoCRM integration not found',
  },
  INTEGRATION_CREDENTIALS_INVALID: {
    code: 'INTEGRATION_CREDENTIALS_INVALID',
    message: 'Integration credentials are invalid',
  },

  // Deals
  DEAL_NOT_FOUND: {
    code: 'DEAL_NOT_FOUND',
    message: 'Deal not found',
  },

  // Sync
  SYNC_JOB_NOT_FOUND: {
    code: 'SYNC_JOB_NOT_FOUND',
    message: 'Sync job not found',
  },

  // Validation
  VALIDATION_FAILED: {
    code: 'VALIDATION_FAILED',
    message: 'Validation failed',
  },
} as const satisfies Record<string, AppErrorBody>;
