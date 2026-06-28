import telegram
import asyncio

TOKEN = "BURAYA_BOT_TOKENINI_YAZ"
CHAT_ID = "BURAYA_CHAT_ID_YAZ"

def notify(message):
    """Event loop hatasını önlemek için her çağrıda yeni bir loop açar."""
    async def send():
        bot = telegram.Bot(token=TOKEN)
        await bot.send_message(chat_id=CHAT_ID, text=message)
    
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(send())
        loop.close()
    except Exception as e:
        print(f"Telegram Bildirim Hatası: {e}")