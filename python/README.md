\# Parmana



> \*\*Proof of Human Authority in AI Systems\*\*



\[!\[PyPI](https://img.shields.io/pypi/v/parmana)](https://pypi.org/project/parmana/)

\[!\[Python](https://img.shields.io/pypi/pyversions/parmana)](https://pypi.org/project/parmana/)

\[!\[License](https://img.shields.io/pypi/l/parmana)](https://github.com/pavancharak/parmana/blob/main/LICENSE)



The official Python SDK for \*\*Parmana Execution Trust Infrastructure\*\*.



Parmana enables organizations to confidently deploy AI in high-impact workflows by ensuring that \*\*only authorized actions are executed\*\* and every execution is accompanied by verifiable execution evidence.



\## Why Parmana



Modern AI systems can:



\- Plan

\- Reason

\- Call tools

\- Invoke APIs

\- Execute business workflows



However, most AI systems cannot answer critical governance questions:



\- Who authorized this execution?

\- Which policy approved it?

\- Was the execution independently verified?

\- Can the execution be replayed?

\- Is there cryptographic evidence of what occurred?



Parmana provides the execution trust layer that answers these questions.



\## Installation



```bash

pip install parmana

```



\### Requirements



\- Python 3.10 or later

\- Parmana Runtime



\## Quick Start



```python

from parmana import ParmanaClient



client = ParmanaClient(

&#x20;   endpoint="http://localhost:3000",

)



print(client.version)

```



\## Runtime Health



```python

status = client.health()



print(status)

```



\## Execute a Business Transaction



```python

from parmana.models import BusinessTransaction



transaction = BusinessTransaction(

&#x20;   business\_transaction\_id="txn-001",

)



trust\_record = client.execute(transaction)



print(trust\_record.trust\_record\_id)

```



\## Verify an Execution



```python

verification = client.verify("txn-001")



print(verification.status)

```



\## Replay an Execution



```python

result = client.replay("txn-001")



print(result.success)

```



\## Execution Lifecycle



```text

Business Transaction

&#x20;       |

&#x20;       v

Execution

&#x20;       |

&#x20;       v

Verification

&#x20;       |

&#x20;       v

Receipt

&#x20;       |

&#x20;       v

Execution Trust Record

```



\## Python SDK



| Method | Description |

|--------|-------------|

| `health()` | Runtime health check |

| `execute()` | Execute a Business Transaction |

| `verify()` | Verify an execution |

| `replay()` | Deterministic replay |

| `receipt()` | Generate an execution receipt |

| `transaction()` | Retrieve a Business Transaction |

| `trust\_record()` | Retrieve an Execution Trust Record |

| `validate\_policy()` | Validate a policy definition |



\## Documentation



\- Documentation: https://docs.parmana.ai

\- GitHub: https://github.com/pavancharak/parmana

\- Issues: https://github.com/pavancharak/parmana/issues



\## License



Apache License 2.0



\---



\*\*Parmana\*\*



\*\*Proof of Human Authority in AI Systems\*\*

