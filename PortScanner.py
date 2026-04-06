import socket
import sys
from datetime import datetime
target = ""
if len(sys.argv) == 2:
    target = socket.gethostbyname(sys.argv[1])
else:
    print("Invalid amount of arguments.")
    print("Syntax: python3 scanner.py <ip>")
if not target:
    target = input("Enter the ip address")
#Prints Header
print("-"*50)
print(f"Scanning target:{target}")
print(f"Time started:{datetime.now()}")
print("-"*50)
try:
    for port in range(1,150):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        socket.setdefaulttimeout(1)
        result = s.connect_ex((target,port))
        if result == 0:
            print(f"Port {port} is open")
        s.close()
except KeyboardInterrupt:
    print("\nExiting program")
    sys.exit()
except socket.gaierror:
    print("Hostname could not be resolved")
    sys.exit()
except socket.error:
    print("Could not connect to server.")
    sys.exit()
