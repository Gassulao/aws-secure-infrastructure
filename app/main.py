import os
import time

from fastapi import FastAPI

app = FastAPI(title="status-service")

START_TIME = time.time()
VERSION = os.getenv("APP_VERSION", "dev")


@app.get("/")
def root():
    return {"service": "status-service", "version": VERSION}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/version")
def version():
    return {
        "version": VERSION,
        "uptime_seconds": int(time.time() - START_TIME),
    }