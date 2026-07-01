"""
Parmana Model Decoder.

Decode Runtime JSON into Parmana domain models.
"""

from __future__ import annotations

import re
from dataclasses import fields, is_dataclass
from datetime import datetime
from typing import Any, Type, TypeVar, get_args, get_origin, get_type_hints

T = TypeVar("T")


def _snake(name: str) -> str:
    """
    Convert camelCase / PascalCase to snake_case.
    """

    return re.sub(
        r"(?<!^)(?=[A-Z])",
        "_",
        name,
    ).lower()


def decode(
    value: Any,
    model: Type[T],
) -> T:
    """
    Decode Runtime JSON into a Parmana model.
    """

    return _decode(
        value,
        model,
    )


def _decode(
    value: Any,
    model: Any,
) -> Any:
    """
    Recursive decoder.
    """

    if value is None:
        return None

    origin = get_origin(model)

    #
    # list[T]
    #
    if origin is list:

        item_type = get_args(model)[0]

        return [
            _decode(item, item_type)
            for item in value
        ]

    #
    # dict
    #
    if origin is dict:
        return value

    #
    # datetime
    #
    if model is datetime:

        if isinstance(value, datetime):
            return value

        return datetime.fromisoformat(
            value.replace("Z", "+00:00")
        )

    #
    # dataclass
    #
    if is_dataclass(model):

        #
        # Convert Runtime JSON keys
        # camelCase -> snake_case
        #
        normalized = {
            _snake(key): val
            for key, val in value.items()
        }

        #
        # Resolve postponed annotations.
        #
        type_hints = get_type_hints(model)

        kwargs = {}

        for field in fields(model):

            kwargs[field.name] = _decode(
                normalized.get(field.name),
                type_hints[field.name],
            )

        return model(**kwargs)

    #
    # Primitive
    #
    return value