import requests
import hmac
import hashlib
import time

API_KEY = "buraya_api_key"
SECRET_KEY = "buraya_secret_key"

host = "https://api.gateio.ws"
url = "/api/v4/spot/accounts"
timestamp = str(int(time.time()))

sign_string = f"/api/v4/spot/accounts\n\n{hashlib.sha512(b'').hexdigest()}\n{timestamp}"
signature = hmac.new(SECRET_KEY.encode(), sign_string.encode(), hashlib.sha512).hexdigest()

headers = {'KEY': API_KEY, 'Timestamp': timestamp, 'SIGN': signature}
response = requests.get(f"{host}{url}", headers=headers)

print(f"Status: {response.status_code}")
print(f"Response: {response.text}")