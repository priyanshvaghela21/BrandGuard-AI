import uvicorn
import os
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "127.0.0.1")
    print("=" * 65)
    print("[*] BrandGuard FastAPI Governance Backend Starting...")
    print(f"[*] API Server: http://{host}:{port}")
    print(f"[*] Interactive Swagger Docs: http://{host}:{port}/docs")
    print(f"[*] ReDoc: http://{host}:{port}/redoc")
    print("=" * 65)
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
