import os

print("Starting to parse and print deploy.log...")

if not os.path.exists("deploy.log"):
    print("::error::deploy.log not found!")
    exit(1)

try:
    with open("deploy.log", "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    if not content.strip():
        print("::warning::deploy.log is empty!")
        exit(0)

    # Chunk size of 3000 characters to stay within Github Actions limits
    chunk_size = 3000
    total_len = len(content)
    print(f"Total log length: {total_len} characters.")
    
    for i in range(0, total_len, chunk_size):
        chunk = content[i:i+chunk_size]
        # Percent-encode special characters for Github Actions workflow commands
        escaped = chunk.replace('%', '%25').replace('\n', '%0A').replace('\r', '%0D')
        print(f"::warning::[Deploy Log Chunk {i//chunk_size + 1}]%0A{escaped}")

except Exception as e:
    print(f"::error::Error reading deploy.log: {e}")
    exit(1)
