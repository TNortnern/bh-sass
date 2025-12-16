import type { PayloadRequest } from 'payload'

/**
 * Defense-in-Depth Validation for Stripe Endpoints
 *
 * Multi-layer validation framework:
 * Layer 1: Entry Point - Validate input at API boundary
 * Layer 2: Business Logic - Ensure data makes sense for operation
 * Layer 3: Environment Guards - Prevent dangerous operations in wrong context
 * Layer 4: Debug Instrumentation - Log context for forensics
 */

export interface ValidationContext {
  req: PayloadRequest
  operationName: string
  requiredFields?: string[]
  fieldValidators?: Record<string, (value: any) => boolean | string>
}

export interface ValidationResult {
  valid: boolean
  error?: string
  code?: number
  context?: Record<string, any>
}

/**
 * Layer 1: Entry Point Validation
 * Validates all inputs at API boundary
 */
export function validateRequestInput(
  body: any,
  requiredFields: string[],
  fieldValidators?: Record<string, (value: any) => boolean | string>,
): ValidationResult {
  // Check for required fields
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null) {
      return {
        valid: false,
        error: `Missing required field: ${field}`,
        code: 400,
        context: { field, providedFields: Object.keys(body) },
      }
    }
  }

  // Apply custom field validators
  if (fieldValidators) {
    for (const [field, validator] of Object.entries(fieldValidators)) {
      if (body[field] !== undefined) {
        const result = validator(body[field])
        if (result !== true) {
          return {
            valid: false,
            error: typeof result === 'string' ? result : `Invalid field: ${field}`,
            code: 400,
            context: { field, value: typeof body[field] },
          }
        }
      }
    }
  }

  return { valid: true }
}

/**
 * Layer 2: Authorization Validation
 * Ensures user has permission for this operation
 */
export function validateTenantAccess(
  user: any,
  targetTenantId: string | number,
): ValidationResult {
  // Get user's tenant ID
  const userTenantId = typeof user.tenantId === 'number'
    ? user.tenantId
    : typeof user.tenantId === 'object' && user.tenantId
      ? user.tenantId.id
      : null

  // Super admins bypass this check
  if (user.role === 'super_admin') {
    return { valid: true }
  }

  // Regular users must match tenant
  if (!userTenantId || userTenantId !== targetTenantId) {
    return {
      valid: false,
      error: 'Forbidden',
      code: 403,
      context: {
        userTenantId,
        targetTenantId,
        userRole: user.role,
      },
    }
  }

  return { valid: true }
}

/**
 * Layer 3: Business Logic Validation
 * Ensures the operation makes sense in context
 */
export function validateBusinessLogic(
  data: any,
  rules: Array<{
    condition: (data: any) => boolean
    message: string
  }>,
): ValidationResult {
  for (const rule of rules) {
    if (!rule.condition(data)) {
      return {
        valid: false,
        error: rule.message,
        code: 400,
        context: { failedRule: rule.message },
      }
    }
  }

  return { valid: true }
}

/**
 * Layer 4: Debug Instrumentation
 * Logs context for forensics without leaking sensitive data
 */
export function logOperationContext(
  operationName: string,
  user: any,
  context: Record<string, any> = {},
  sensitiveFields = ['email', 'password', 'token', 'secret', 'api_key'],
): void {
  // Sanitize sensitive data from logs
  const sanitized = sanitizeForLogging(context, sensitiveFields)

  console.log(`[STRIPE:${operationName}] Initiated`, {
    userId: user?.id,
    userRole: user?.role,
    tenantId: typeof user?.tenantId === 'object' ? user?.tenantId?.id : user?.tenantId,
    timestamp: new Date().toISOString(),
    ...sanitized,
  })
}

/**
 * Layer 4: Debug Instrumentation (Error)
 * Logs error context without leaking sensitive data
 */
export function logOperationError(
  operationName: string,
  error: Error,
  context: Record<string, any> = {},
  sensitiveFields = ['email', 'password', 'token', 'secret', 'api_key'],
): void {
  const sanitized = sanitizeForLogging(context, sensitiveFields)

  console.error(`[STRIPE:${operationName}] Error`, {
    errorType: error.name,
    errorMessage: error.message,
    timestamp: new Date().toISOString(),
    ...sanitized,
  })
}

/**
 * Helper: Remove sensitive data from objects
 */
export function sanitizeForLogging(
  obj: Record<string, any>,
  sensitiveFields: string[] = ['email', 'password', 'token', 'secret', 'api_key'],
): Record<string, any> {
  if (!obj || typeof obj !== 'object') return obj

  const result = { ...obj }

  for (const field of sensitiveFields) {
    if (result[field]) {
      result[field] = `[REDACTED]`
    }
  }

  return result
}

/**
 * Response helper: Return validation error with proper formatting
 */
export function validationErrorResponse(result: ValidationResult): Response {
  return Response.json(
    {
      error: result.error || 'Validation Error',
      code: result.code?.toString(),
    },
    { status: result.code || 400 },
  )
}

/**
 * Comprehensive validation orchestrator
 * Applies all four layers in sequence
 */
export async function validateStripeOperation(
  context: ValidationContext,
): Promise<ValidationResult> {
  const { req, operationName, requiredFields = [], fieldValidators } = context

  try {
    // Layer 1: Entry Point Validation
    const body = (await req.json?.()) || {}

    const inputValidation = validateRequestInput(body, requiredFields, fieldValidators)
    if (!inputValidation.valid) {
      logOperationError(operationName, new Error('Input validation failed'), inputValidation.context)
      return inputValidation
    }

    // Layer 2: Authorization Check
    if (!req.user) {
      return {
        valid: false,
        error: 'Unauthorized',
        code: 401,
      }
    }

    const authValidation = validateTenantAccess(req.user, body.tenantId)
    if (!authValidation.valid) {
      logOperationError(operationName, new Error('Authorization failed'), {
        user: req.user.id,
        targetTenantId: body.tenantId,
      })
      return authValidation
    }

    // Layer 3: Business Logic Validation (if needed, handled by caller)

    // Layer 4: Debug Instrumentation
    logOperationContext(operationName, req.user, {
      tenantId: body.tenantId,
      requiredFieldsPresent: Object.keys(body).filter(k => requiredFields.includes(k)),
    })

    return { valid: true }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    logOperationError(operationName, error)

    return {
      valid: false,
      error: 'Internal validation error',
      code: 500,
    }
  }
}
