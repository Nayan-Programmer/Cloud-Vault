import subprocess
import sys
import os
import signal
import threading

API_PORT = 8080
WEB_PORT = 3000

def stream_output(proc, prefix):
    for line in iter(proc.stdout.readline, b""):
        print(f"[{prefix}] {line.decode().rstrip()}", flush=True)

def main():
    env = os.environ.copy()

    print(f"Starting API server on http://localhost:{API_PORT}/api")
    print(f"Starting web app  on http://localhost:{WEB_PORT}")
    print("Press Ctrl+C to stop both.\n")

    api_env = {**env, "PORT": str(API_PORT), "NODE_ENV": "development"}
    web_env = {**env, "PORT": str(WEB_PORT), "BASE_PATH": "/", "NODE_ENV": "development"}

    api = subprocess.Popen(
        ["pnpm", "--filter", "@workspace/api-server", "run", "dev"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        env=api_env,
    )

    web = subprocess.Popen(
        ["pnpm", "--filter", "@workspace/workspace", "run", "dev"],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        env=web_env,
    )

    threading.Thread(target=stream_output, args=(api, "api "), daemon=True).start()
    threading.Thread(target=stream_output, args=(web, "web "), daemon=True).start()

    def shutdown(sig, frame):
        print("\nShutting down...")
        api.terminate()
        web.terminate()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    api.wait()
    web.wait()

if __name__ == "__main__":
    main()
