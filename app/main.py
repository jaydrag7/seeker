"""
The main driver code of the app (solution) goes here
FASTAPI stuff
"""
from fastapi import FastAPI
from .routers import aiRoutes

app = FastAPI()


@app.get('/')
def root():
    return {"status": "working"}
