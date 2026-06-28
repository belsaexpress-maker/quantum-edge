import feedparser
import threading
import time
from datetime import datetime

live_news = []
RSS_FEEDS = ["https://cointelegraph.com/rss", "https://coindesk.com/arc/outboundfeeds/rss/"]

def fetch_news():
    global live_news
    all_news = []
    for url in RSS_FEEDS:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:5]:
                all_news.append({
                    "title": entry.title,
                    "source": feed.feed.title if 'title' in feed.feed else "Unknown",
                    "url": entry.link,
                    "time": datetime.now().isoformat(),
                    "summary": entry.summary[:150] if hasattr(entry, 'summary') else ""
                })
        except:
            pass
    live_news = sorted(all_news, key=lambda x: x['time'], reverse=True)[:50]

def start_news_service():
    fetch_news()
    def updater():
        while True:
            time.sleep(600)
            fetch_news()
    threading.Thread(target=updater, daemon=True).start()

def get_live_news():
    return live_news