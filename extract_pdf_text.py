import json

transcript_path = r'C:\Users\Oscar\.gemini\antigravity\brain\3b2fd6e0-2571-4dd8-b930-b5caeb9b507c\.system_generated\logs\transcript_full.jsonl'

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT' and 'aquí están las bases curriculares' in data.get('content', ''):
            content = data['content']
            print(f"Found! Length: {len(content)}. Start: {content[:200]}")
            print(f"Contains 'Start of PDF': {'Start of PDF' in content}")
