import requests
import time
from datetime import datetime, timedelta
from pymongo import MongoClient

uri = "mongodb+srv://rsk2176:jZQc3OX0pKC6bTLC@uniswap-analytics.zd9bb.mongodb.net/?retryWrites=true&w=majority&appName=uniswap-analytics"
DB_NAME = "uniswap-analytics"

UNISWAP_API = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"

def fetch_uniswap_data():
    query = """
    {
      uniswapDayDatas(first: 1, orderBy: date, orderDirection: desc) {
        date
        tvlUSD
        volumeUSD
        feesUSD
      }
    }
    """
    response = requests.post(UNISWAP_API, json={'query': query})
    if response.status_code == 200:
        return response.json()['data']['uniswapDayDatas'][0]
    else:
        raise Exception(f"Query failed with status code: {response.status_code}")

def store_data(data):
    client = MongoClient(uri)
    db = client[DB_NAME]
    collection = db.daily_metrics
    collection.insert_one(data)
    client.close()

def main():
    while True:
        try:
            data = fetch_uniswap_data()
            data['timestamp'] = datetime.now()
            store_data(data)
            print(f"Data fetched and stored at {data['timestamp']}")
        except Exception as e:
            print(f"An error occurred: {e}")
        
        time.sleep(600)

if __name__ == "__main__":
    main()