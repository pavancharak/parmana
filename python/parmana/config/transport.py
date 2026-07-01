from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class Transport(ABC):
    """
    Base transport abstraction.
    """

    @abstractmethod
    def send(
        self,
        *,
        method: str,
        path: str,
        body: Any | None = None,
    ) -> Any:
        """
        Send a request to the Parmana Runtime.
        """
        raise NotImplementedError