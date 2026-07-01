$files = @(
    @{
        Path="D:\last\parmana\typescript\src\errors\AuthenticationError.ts"
        Class="AuthenticationError"
        Code="AUTHENTICATION_ERROR"
        Comment="Raised when Runtime authentication fails."
    },
    @{
        Path="D:\last\parmana\typescript\src\errors\AuthorizationError.ts"
        Class="AuthorizationError"
        Code="AUTHORIZATION_ERROR"
        Comment="Raised when Runtime authorization fails."
    },
    @{
        Path="D:\last\parmana\typescript\src\errors\ConfigurationError.ts"
        Class="ConfigurationError"
        Code="CONFIGURATION_ERROR"
        Comment="Raised when SDK configuration is invalid."
    },
    @{
        Path="D:\last\parmana\typescript\src\errors\ExecutionRejectedError.ts"
        Class="ExecutionRejectedError"
        Code="EXECUTION_REJECTED"
        Comment="Raised when execution is rejected."
    },
    @{
        Path="D:\last\parmana\typescript\src\errors\InternalServerError.ts"
        Class="InternalServerError"
        Code="INTERNAL_SERVER_ERROR"
        Comment="Raised when the Runtime encounters an internal error."
    },
    @{
        Path="D:\last\parmana\typescript\src\errors\ReplayError.ts"
        Class="ReplayError"
        Code="REPLAY_ERROR"
        Comment="Raised when deterministic replay fails."
    },
    @{
        Path="D:\last\parmana\typescript\src\errors\TimeoutError.ts"
        Class="TimeoutError"
        Code="TIMEOUT_ERROR"
        Comment="Raised when a Runtime request times out."
    },
    @{
        Path="D:\last\parmana\typescript\src\errors\ValidationError.ts"
        Class="ValidationError"
        Code="VALIDATION_ERROR"
        Comment="Raised when request validation fails."
    },
    @{
        Path="D:\last\parmana\typescript\src\errors\VerificationError.ts"
        Class="VerificationError"
        Code="VERIFICATION_ERROR"
        Comment="Raised when verification fails."
    }
)

foreach ($f in $files) {

$content = @"
import {
  ErrorCode,
  ParmanaError,
} from "./ParmanaError.js";

/**
 * $($f.Comment)
 */
export class $($f.Class) extends ParmanaError {
  constructor(
    message: string,
    options?: {
      requestId?: string;
      cause?: unknown;
    },
  ) {
    super({
      code: ErrorCode.$($f.Code),

      message,

      ...(options?.requestId !== undefined && {
        requestId: options.requestId,
      }),

      ...(options?.cause !== undefined && {
        cause: options.cause,
      }),
    });

    this.name = "$($f.Class)";
  }
}
"@

    Set-Content `
        -Path $f.Path `
        -Value $content `
        -Encoding UTF8
}

Write-Host ""
Write-Host "Done."
Write-Host ""