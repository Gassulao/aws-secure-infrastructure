
import os
import time

import psutil

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from urllib.request import urlopen
from urllib.error import URLError
from fastapi import HTTPException
from fastapi.responses import PlainTextResponse

app = FastAPI(title="status-service")

# Permitir que el dashboard local consulte la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_methods=["GET"],
    allow_headers=["*"],
)

START_TIME = time.time()
VERSION = os.getenv("APP_VERSION", "dev")


@app.get("/")
def root():
    return {
        "service": "status-service",
        "version": VERSION,
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/version")
def version():
    return {
        "version": VERSION,
        "uptime_seconds": int(time.time() - START_TIME),
    }


@app.get("/metrics")
def metrics():
    # Uso de CPU
    cpu_usage = psutil.cpu_percent(interval=1)

    # Uso de memoria RAM
    memory = psutil.virtual_memory()

    # Uso del disco
    disk = psutil.disk_usage("/")

    return {
        "cpu_percent": cpu_usage,
        "memory": {
            "total_gb": round(memory.total / (1024 ** 3), 2),
            "used_gb": round(memory.used / (1024 ** 3), 2),
            "percent": memory.percent,
        },
        "disk": {
            "total_gb": round(disk.total / (1024 ** 3), 2),
            "used_gb": round(disk.used / (1024 ** 3), 2),
            "percent": disk.percent,
        },
        "system_uptime_seconds": int(
            time.time() - psutil.boot_time()
        ),
    }

@app.get("/nginx-status", response_class=PlainTextResponse)
def nginx_status():
    try:
        with urlopen(
            "http://127.0.0.1/nginx_status_internal",
            timeout=2
        ) as response:
            return response.read().decode("utf-8")

    except (URLError, TimeoutError, OSError) as exc:
        raise HTTPException(
            status_code=503,
            detail="Nginx statistics unavailable"
        ) from exc