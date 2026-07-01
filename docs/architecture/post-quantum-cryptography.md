\# Post-Quantum Cryptography



\## Overview



Parmana supports both classical and post-quantum digital signatures.



Digital signatures are used to protect:



\* Execution Trust Records

\* Receipts

\* Verification artifacts



The active signature algorithm is selected through configuration without changing application code.



\---



\# Supported Algorithms



| Algorithm              | Type         | Status    |

| ---------------------- | ------------ | --------- |

| Ed25519                | Classical    | Supported |

| ML-DSA-65 (Dilithium3) | Post-Quantum | Supported |



Future releases may add:



\* ML-DSA-87

\* SLH-DSA (SPHINCS+)



\---



\# Configuration



The signature provider is configured through the environment.



```dotenv

SIGNATURE\_PROVIDER=ed25519

```



or



```dotenv

SIGNATURE\_PROVIDER=dilithium3

```



No application code changes are required.



\---



\# Architecture



```

Application

&#x20;       │

&#x20;       ▼

ReceiptCrypto

&#x20;       │

&#x20;       ▼

CryptoBootstrap

&#x20;       │

&#x20;       ▼

SignatureRegistry

&#x20;       │

&#x20;       ├───────────────┐

&#x20;       ▼               ▼

Ed25519        Dilithium3

```



Only the configured provider is used for signing and verification.



\---



\# Persistent Key Management



Parmana stores signing keys outside individual packages.



```

<repository>/keys/



&#x20;   ed25519-private.pem

&#x20;   ed25519-public.pem



&#x20;   dilithium3-private.key

&#x20;   dilithium3-public.key

```



The directory is configured using:



```dotenv

PARMANA\_KEY\_DIR=D:/last/parmana/keys

```



Keys are automatically generated on first use if they do not already exist.



\---



\# Runtime Selection



The configured provider is selected through the Signature Registry.



```

SignatureRegistry



&#x20;   register(Ed25519)



&#x20;   register(Dilithium3)



&#x20;           │



&#x20;           ▼



config.crypto.signatureProvider

```



The remainder of the Parmana runtime is algorithm-independent.



\---



\# Receipt Signing



Receipt generation uses the configured signature provider.



```

Receipt

&#x20;     │

&#x20;     ▼

Canonical Serialization

&#x20;     │

&#x20;     ▼

Receipt Hash

&#x20;     │

&#x20;     ▼

Configured Signature Provider

&#x20;     │

&#x20;     ▼

Digital Signature

```



Receipts also record the algorithm that produced the signature.



Example:



```json

{

&#x20; "algorithm": "dilithium3",

&#x20; "signature": "<base64>"

}

```



\---



\# Security Considerations



Private keys must never be committed to source control.



The following should be ignored by Git:



```

keys/

\*\*/keys/



\*.pem

\*.key

```



Production deployments should use a secure key management solution such as:



\* AWS KMS

\* Azure Key Vault

\* Google Cloud KMS

\* HashiCorp Vault

\* Hardware Security Modules (HSM)



The current file-based provider is intended for development and local deployments.



\---



\# Benefits



Post-quantum signatures provide resistance against attacks from cryptographically relevant quantum computers.



Parmana's provider-based architecture allows organizations to migrate from classical signatures to post-quantum signatures by changing configuration rather than modifying application code.



This enables gradual adoption while preserving compatibility with existing execution trust workflows.



