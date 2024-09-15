import requests

UNISWAP_API = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"

def test_api():
    response = requests.post(UNISWAP_API, json={})
    print(response.status_code)
    print(response.text)

test_api()