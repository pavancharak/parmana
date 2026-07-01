"""
Parmana SDK Exceptions.
"""


class ParmanaError(Exception):
    """Base SDK exception."""


class ValidationError(ParmanaError):
    """Validation failed."""


class VerificationError(ParmanaError):
    """Verification failed."""


class PolicyViolationError(ParmanaError):
    """Policy evaluation failed."""


class RuntimeError(ParmanaError):
    """Runtime execution failed."""