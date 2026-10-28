import os
import sys
import subprocess
import time
import webbrowser
import signal

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")

    print("=" * 70)
    print("   BRANDGUARD AUTONOMOUS GOVERNANCE PLATFORM — UNIFIED RUNNER")
    print("=" * 70)
    print("🚀 Initializing Full-Stack BrandGuard System...")

    # 1. Start FastAPI Backend (port 8000)
    print("📡 [1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_cmd = [sys.executable, "run.py"]
    backend_proc = subprocess.Popen(
        backend_cmd,
        cwd=backend_dir,
        shell=False
    )

    time.sleep(2)

    # 2. Start Vite Frontend (port 5173)
    print("⚡ [2/2] Launching Vite Frontend on http://127.0.0.1:5173 ...")
    frontend_cmd = "npm run dev -- --host 127.0.0.1 --port 5173"
    frontend_proc = subprocess.Popen(
        frontend_cmd,
        cwd=root_dir,
        shell=True
    )

    time.sleep(2)

    print("\n" + "=" * 70)
    print("✨ PLATFORM IS LIVE & READY!")
    print("🌐 Frontend Portal:  http://127.0.0.1:5173")
    print("⚙️  Backend API:      http://127.0.0.1:8000")
    print("📖 Swagger Docs:     http://127.0.0.1:8000/docs")
    print("=" * 70)
    print("💡 Press Ctrl+C at any time to gracefully shut down both services.\n")

    # Automatically open browser to the professional website
    try:
        webbrowser.open("http://127.0.0.1:5173")
    except Exception:
        pass

    try:
        # Keep runner alive while child processes run
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("⚠️ Backend server stopped unexpectedly.")
                break
            if frontend_proc.poll() is not None:
                print("⚠️ Frontend server stopped unexpectedly.")
                break
    except KeyboardInterrupt:
        print("\n🛑 Shutting down BrandGuard services...")
    finally:
        try:
            backend_proc.terminate()
        except Exception:
            pass
        try:
            frontend_proc.terminate()
        except Exception:
            pass
        print("✔ BrandGuard successfully stopped. Good day!")

if __name__ == "__main__":
    main()
