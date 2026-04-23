import json
import requests
from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
# Tell Flask-SocketIO to explicitly use the gevent async engine
socketio = SocketIO(app, async_mode='gevent', cors_allowed_origins="*")

# The path to your structured JSON log
LOG_FILE = "/home/noah/cowrie/var/log/cowrie/cowrie.json"

# We use a dictionary to cache IP locations so we don't spam the free API and get banned
ip_cache = {}

def get_geo(ip):
    """Fetches Latitude and Longitude for an IP address"""
    if ip in ip_cache:
        return ip_cache[ip]
    try:
        # ip-api is free for non-commercial use and requires no API key
        response = requests.get(f"http://ip-api.com/json/{ip}?fields=lat,lon").json()
        lat = response.get('lat', 0)
        lon = response.get('lon', 0)
        ip_cache[ip] = (lat, lon)
        return lat, lon
    except:
        return 0, 0

def parse_log_event(line):
    """Converts a raw JSON log line into an actionable Threat Alert"""
    try:
        data = json.loads(line)
        eventid = data.get("eventid")
        ip = data.get("src_ip", "Unknown")
        timestamp = data.get("timestamp", "").split(".")[0].replace("T", " ") 
        
        # Categorize the attack
        attack_type = None
        if eventid == "cowrie.login.success":
            user, pw = data.get('username'), data.get('password')
            attack_type = f"SSH Breach [{user}:{pw}]"
        
        elif eventid == "cowrie.command.input":
            attack_type = f"Script Exec: {data.get('input')}"
        
        elif eventid in ["cowrie.session.file_download", "cowrie.session.file_upload"]:
            url = data.get('url')
            # Grab the SHA256 hash. If it's missing, default to unknown.
            shasum = data.get('shasum', 'UNKNOWN_HASH')
            
            if url:
                attack_type = f"Payload Drop: {url}"
            else:
                attack_type = f"Payload Drop: [SFTP Binary] SHA256:{shasum}"
        
        elif eventid == "cowrie.login.failed":
            # Extracts both username and password for recon scans
            user = data.get('username', 'unknown')
            pw = data.get('password', 'unknown')
            attack_type = f"Recon Scan: Failed '{user}:{pw}'"
        
        if attack_type:
            return {"ip": ip, "type": attack_type, "timestamp": timestamp}
        return None
    except:
        return None

def tail_honeypot_log():
    """Runs in the background, watching for new attacks in real-time"""
    with open(LOG_FILE, 'r') as f:
        # Jump to the end of the file
        f.seek(0, 2)
        while True:
            line = f.readline()
            if not line:
                # Use socketio.sleep to prevent blocking the gevent micro-thread
                socketio.sleep(0.5)
                continue
            
            parsed = parse_log_event(line)
            if parsed:
                lat, lon = get_geo(parsed['ip'])
                parsed['lat'] = lat
                parsed['lon'] = lon
                print(f"[LIVE DETECT] {parsed['ip']} -> {parsed['type']}")
                socketio.emit('new_attack', parsed)

@socketio.on('connect')
def handle_connect():
    """When the dashboard loads, send it the historical data for the map/charts"""
    print("Dashboard Connected. Compiling historical intelligence...")
    history = []
    try:
        with open(LOG_FILE, 'r') as f:
            # Grab the last 1000 lines to parse for history
            lines = f.readlines()[-1000:]
            for line in lines:
                parsed = parse_log_event(line)
                # Cap the history push at 250 events so the browser doesn't freeze on load
                if parsed and len(history) < 250: 
                    lat, lon = get_geo(parsed['ip'])
                    parsed['lat'] = lat
                    parsed['lon'] = lon
                    history.append(parsed)
    except Exception as e:
        print(f"Error reading history: {e}")
    
    socketio.emit('attack_history', history)

if __name__ == '__main__':
    # Start the log-watcher using Flask-SocketIO's built-in greenlet manager
    socketio.start_background_task(tail_honeypot_log)
    
    print("[SYSTEM] Threat Relay Online (gevent engine). Awaiting connections on port 8080...")
    
    # Start the server using the robust gevent worker on localhost only (Nginx handles the public side)
    socketio.run(app, host='127.0.0.1', port=8080)
