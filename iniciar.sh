#!/usr/bin/env bash
# Levanta el sitio en http://localhost:8080 (Ctrl+C para cortar)
cd "$(dirname "$0")"
PUERTO="${1:-8080}"
echo "Sitio Miver en:  http://localhost:$PUERTO"
echo "Editor:          http://localhost:$PUERTO/editor.html"
IP=$(hostname -I 2>/dev/null | awk '{print $1}')
[ -n "$IP" ] && echo "Desde el celu (misma red WiFi): http://$IP:$PUERTO"
exec python3 -m http.server "$PUERTO" --bind 0.0.0.0
