\# Key Management



\## Overview



Parmana separates cryptographic operations from key management.



Signature providers perform signing and verification. Key providers are responsible for generating, loading, storing, and rotating cryptographic keys.



This separation allows Parmana to support multiple storage backends without changing cryptographic algorithms.



\---



\# Architecture



```text

&#x20;                CryptoBootstrap

&#x20;                       │

&#x20;       ┌───────────────┴───────────────┐

&#x20;       ▼                               ▼

&#x20;Signature Provider               Key Provider

&#x20;       │                               │

&#x20;       ▼                               ▼

Ed25519 / ML-DSA-65          File / KMS / HSM / Vault

```



Signature providers never generate keys directly. They request keys from the configured key provider.



\---



\# Key Provider Interface



All key providers implement a common interface.



Responsibilities include:



\* Generate keys when required

\* Load existing keys

\* Persist keys

\* Return algorithm-specific key material



Current implementation:



\* FileKeyProvider



Future implementations:



\* AWS KMS Key Provider

\* Azure Key Vault Provider

\* Google Cloud KMS Provider

\* HashiCorp Vault Provider

\* PKCS#11 Hardware Security Module Provider



\---



\# FileKeyProvider



The default implementation stores keys on the local filesystem.



Configured through:



```dotenv

KEY\_PROVIDER=local



PARMANA\_KEY\_DIR=D:/last/parmana/keys

```



Repository layout:



```text

keys/



&#x20;   ed25519-private.pem

&#x20;   ed25519-public.pem



&#x20;   dilithium3-private.key

&#x20;   dilithium3-public.key

```



Keys are generated automatically if they do not already exist.



\---



\# Supported Algorithms



Current algorithms:



| Algorithm | Storage    |

| --------- | ---------- |

| Ed25519   | PEM        |

| ML-DSA-65 | Raw binary |



Additional algorithms can be added without modifying the rest of the runtime.



\---



\# Key Lifecycle



```text

Application Starts

&#x20;       │

&#x20;       ▼

Signature Provider

&#x20;       │

&#x20;       ▼

Key Provider

&#x20;       │

&#x20;       ▼

Keys Exist?

&#x20;       │

&#x20;  ┌────┴────┐

&#x20;  │         │

&#x20; Yes        No

&#x20;  │         │

Load Keys  Generate Keys

&#x20;  │         │

&#x20;  └────┬────┘

&#x20;       ▼

Return Key Material

```



The application never signs using ephemeral keys unless explicitly configured to do so.



\---



\# Security



Private keys must never be committed to source control.



Recommended `.gitignore` entries:



```text

keys/

\*\*/keys/



\*.pem

\*.key

```



Production deployments should use managed key services or hardware-backed storage instead of filesystem keys.



\---



\# Design Principles



Parmana follows these principles:



\* Cryptographic algorithms are replaceable.

\* Key storage is replaceable.

\* Business logic is independent of cryptography.

\* Configuration determines which provider is active.

\* Persistent keys are required for deterministic verification.



