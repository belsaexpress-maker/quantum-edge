from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # CORS'u etkinleştir
    
    # Bot routes'larını import et ve register et
    from app.routes.bot_routes import bot_bp
    app.register_blueprint(bot_bp)
    
    # Ana sayfa route'u
    @app.route('/')
    def index():
        return {
            'name': 'QuantumEdge Trading Bot API',
            'version': '1.0.0',
            'endpoints': {
                'create_bot': '/api/bots/create (POST)',
                'start_bot': '/api/bots/start/<bot_id> (POST)',
                'stop_bot': '/api/bots/stop/<bot_id> (POST)',
                'bot_status': '/api/bots/status/<bot_id> (GET)',
                'list_bots': '/api/bots/list (GET)',
                'stop_all': '/api/bots/stop-all (POST)',
                'total_profit': '/api/bots/total-profit (GET)'
            }
        }
    
    return app