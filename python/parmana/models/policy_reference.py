"""
Policy Reference model.

References the policy used during execution.
"""

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class PolicyReference:
    """
    Immutable reference to a policy.
    """

    policy_name: str

    policy_version: str