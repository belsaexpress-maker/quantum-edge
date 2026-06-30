from flask import Blueprint, request, jsonify
from app.services.bot_manager import BotManager

bot_bp = Blueprint('bot', __name__, url_prefix='/api/bots')
manager = BotManager()

@bot_bp.route('/create', methods=['POST'])
def create_bot():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'JSON data required'}), 400
            
        bot_type = data.get('type')
        symbol = data.get('symbol', 'BTCUSDT')
        capital = data.get('capital', 50)
        kwargs = {k: v for k, v in data.items() if k not in ['type', 'symbol', 'capital']}
        
        if not bot_type:
            return jsonify({'error': 'Bot type required'}), 400
            
        result = manager.create_bot(bot_type, symbol, capital, **kwargs)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bot_bp.route('/start/<bot_id>', methods=['POST'])
def start_bot(bot_id):
    try:
        result = manager.start_bot(bot_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bot_bp.route('/stop/<bot_id>', methods=['POST'])
def stop_bot(bot_id):
    try:
        result = manager.stop_bot(bot_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bot_bp.route('/status/<bot_id>', methods=['GET'])
def get_bot_status(bot_id):
    try:
        result = manager.get_bot_status(bot_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bot_bp.route('/list', methods=['GET'])
def list_bots():
    try:
        result = manager.get_all_bots()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bot_bp.route('/stop-all', methods=['POST'])
def stop_all_bots():
    try:
        result = manager.stop_all_bots()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bot_bp.route('/total-profit', methods=['GET'])
def total_profit():
    try:
        result = {'total_profit': manager.get_total_profit()}
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500