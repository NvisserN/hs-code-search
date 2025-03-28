from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

# Verander naar de static directory
os.chdir('static')

# Start de server
httpd = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
print("Server draait op http://localhost:8000")
httpd.serve_forever()
