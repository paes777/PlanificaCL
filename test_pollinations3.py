import urllib.request
import json

url = "https://text.pollinations.ai/"
data = json.dumps({
    "messages": [{"role": "user", "content": "hola, escribe una respuesta larga"}],
    "model": "openai"
}).encode('utf-8')

req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'})
try:
    response = urllib.request.urlopen(req)
    print(response.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
