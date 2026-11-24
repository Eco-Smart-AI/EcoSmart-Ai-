import http.server
import socketserver
import os

PORT = 3000
DIRECTORY = "dist"

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Strip query params for file lookup
        clean_path = self.path.split('?')[0].split('#')[0]
        full_path = self.translate_path(clean_path)
        
        if not os.path.exists(full_path):
            if os.path.exists(full_path + '.html'):
                self.path = clean_path + '.html'
            elif not os.path.splitext(clean_path)[1]:
                self.path = '/index.html'
        return super().do_GET()

if __name__ == '__main__':
    # Allow port reuse immediately
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()
