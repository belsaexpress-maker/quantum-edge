from OpenSSL import crypto
import os

def generate_self_signed_cert():
    """Self-signed SSL sertifikası oluşturur"""
    # Anahtar oluştur
    key = crypto.PKey()
    key.generate_key(crypto.TYPE_RSA, 2048)
    
    # Sertifika oluştur
    cert = crypto.X509()
    cert.get_subject().C = "TR"
    cert.get_subject().ST = "Istanbul"
    cert.get_subject().L = "Istanbul"
    cert.get_subject().O = "Quantum Edge"
    cert.get_subject().CN = "localhost"
    cert.set_serial_number(1000)
    cert.gmtime_adj_notBefore(0)
    cert.gmtime_adj_notAfter(365 * 24 * 60 * 60)  # 1 yıl
    cert.set_issuer(cert.get_subject())
    cert.set_pubkey(key)
    cert.sign(key, 'sha256')
    
    # Dosyalara kaydet
    cert_dir = os.path.join(os.path.dirname(__file__), '..', 'ssl')
    os.makedirs(cert_dir, exist_ok=True)
    
    with open(os.path.join(cert_dir, 'cert.pem'), 'wb') as f:
        f.write(crypto.dump_certificate(crypto.FILETYPE_PEM, cert))
    
    with open(os.path.join(cert_dir, 'key.pem'), 'wb') as f:
        f.write(crypto.dump_privatekey(crypto.FILETYPE_PEM, key))
    
    return cert_dir

# Sertifikayı oluştur
ssl_path = generate_self_signed_cert()
print(f"SSL sertifikası oluşturuldu: {ssl_path}")