from app import create_app
from app.services.bot_manager import BotManager

app = create_app()
bot_manager = BotManager()

if __name__ == '__main__':
    print("=== QuantumEdge Trading Bot API ===")
    print("Bot Manager başlatıldı...")
    print("API endpoint'leri:")
    print("  POST /api/bots/create - Bot oluştur")
    print("  POST /api/bots/start/<bot_id> - Bot başlat")
    print("  POST /api/bots/stop/<bot_id> - Bot durdur")
    print("  GET /api/bots/status/<bot_id> - Bot durumu")
    print("  GET /api/bots/list - Tüm botları listele")
    print("  POST /api/bots/stop-all - Tüm botları durdur")
    print("  GET /api/bots/total-profit - Toplam kar")
    print("\nServer başlatılıyor...")
    app.run(debug=True, host='0.0.0.0', port=5000)