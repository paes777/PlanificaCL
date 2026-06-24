import g4f
import traceback

try:
    response = g4f.ChatCompletion.create(
        model=g4f.models.default,
        messages=[{'role': 'user', 'content': 'hola'}]
    )
    with open('test_g4f.txt', 'w', encoding='utf-8') as f:
        f.write(str(response))
    print("SUCCESS")
except Exception as e:
    with open('test_g4f_err.txt', 'w', encoding='utf-8') as f:
        f.write(traceback.format_exc())
    print("FAILED")
