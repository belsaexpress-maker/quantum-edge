import time
from app.services.bot_manager import BotManager

def test_bots():
    manager = BotManager()
    
    print("=== BOT MANAGER TEST ===\n")
    
    # Botları oluştur
    print("1. Botlar oluşturuluyor...")
    grid_bot = manager.create_bot('grid', 'BTCUSDT', 50, grid_levels=5, grid_spacing=0.01)
    momentum_bot = manager.create_bot('momentum', 'ETHUSDT', 20)
    scalping_bot = manager.create_bot('scalping', 'BTCUSDT', 30, max_trades=20)
    
    print(f"Grid Bot: {grid_bot}")
    print(f"Momentum Bot: {momentum_bot}")
    print(f"Scalping Bot: {scalping_bot}\n")
    
    # Botları başlat
    print("2. Botlar başlatılıyor...")
    grid_id = grid_bot['bot_id']
    momentum_id = momentum_bot['bot_id']
    scalping_id = scalping_bot['bot_id']
    
    print(f"Grid Bot başlatıldı: {manager.start_bot(grid_id)}")
    print(f"Momentum Bot başlatıldı: {manager.start_bot(momentum_id)}")
    print(f"Scalping Bot başlatıldı: {manager.start_bot(scalping_id)}\n")
    
    # Botları izle
    print("3. Botlar 15 saniye çalıştırılıyor...")
    for i in range(3):
        time.sleep(5)
        print(f"\n--- {i+1}. kontrol ---")
        all_bots = manager.get_all_bots()
        for bot_id, info in all_bots.items():
            print(f"  {bot_id}: {info['type']} | Active: {info['active']} | Profit: ${info['profit']:.2f} | Trades: {info['trades']}")
        print(f"Toplam Kar: ${manager.get_total_profit():.2f}")
    
    # Detaylı durum
    print("\n4. Detaylı durumlar:")
    print(f"Grid Bot: {manager.get_bot_status(grid_id)}")
    print(f"\nMomentum Bot: {manager.get_bot_status(momentum_id)}")
    print(f"\nScalping Bot: {manager.get_bot_status(scalping_id)}")
    
    # Botları durdur
    print("\n5. Botlar durduruluyor...")
    print(f"Grid Bot durduruldu: {manager.stop_bot(grid_id)}")
    print(f"Momentum Bot durduruldu: {manager.stop_bot(momentum_id)}")
    print(f"Scalping Bot durduruldu: {manager.stop_bot(scalping_id)}")
    
    print(f"\nToplam Kar: ${manager.get_total_profit():.2f}")
    print("\nTest tamamlandı!")

if __name__ == "__main__":
    test_bots()