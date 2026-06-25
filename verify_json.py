import json
import os

print("Starting verification of credentials file...")

if not os.path.exists("service-account.json"):
    print("::error::service-account.json does not exist!")
    exit(1)

try:
    with open("service-account.json", "r") as f:
        data = json.load(f)
    
    print(f"::warning::Project ID from credentials: {data.get('project_id')}")
    print(f"::warning::Client Email from credentials: {data.get('client_email')}")
    print(f"::warning::Credential Type: {data.get('type')}")
    
    pk = data.get('private_key', '')
    print(f"::warning::Private key length: {len(pk)}")
    if pk:
        # Check standard headers
        has_begin = "-----BEGIN PRIVATE KEY-----" in pk
        has_end = "-----END PRIVATE KEY-----" in pk
        print(f"::warning::Private key has BEGIN header: {has_begin}")
        print(f"::warning::Private key has END header: {has_end}")
        # Print a tiny bit of the key to see if there are format anomalies
        print(f"::warning::Private key start: {pk[:40].replace(chr(10), '\\n')}")
        print(f"::warning::Private key end: {pk[-40:].replace(chr(10), '\\n')}")
    else:
        print("::error::Private key is missing or empty in JSON!")

except Exception as e:
    print(f"::error::Failed to parse JSON or verify: {e}")
    exit(1)
