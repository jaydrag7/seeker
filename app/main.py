"""
The main driver code of the app (solution) goes here
FASTAPI stuff
"""
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from . import wiki, openAI, file_reader

app = FastAPI()
app.mount("/../static", StaticFiles(directory="static"))


@app.get('/')
def root() -> dict:
    return {"status": "working"}


@app.get('/wiki/{term}')
def wiki_search(term: str) -> dict:
    wiki_data: dict = wiki.wiki_search(term)
    return wiki_data


@app.get('/generate/terms/{term}')
def generate_terms(term: str) -> dict:
    generated_terms: dict = openAI.generate_keywords(term)
    return generated_terms


@app.get('/new/endpoint')
def test():
    return {"it":"worked"}