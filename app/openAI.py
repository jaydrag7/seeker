"""
All OpenAI based code goes here
"""
import openai
from dotenv import load_dotenv
import os
from pprint import pprint

load_dotenv()
api_key = os.getenv("GPT_SECRET")
openai.api_key = api_key


def generate_keywords(search_term: str) -> list:
    """
    :param search_term: The term to be searched
    :return: A list of keywords relevant to the search term
    """
    with open("../static/keywords_context", "r") as file:
        context: str = file.read()
    generation_context: list[dict] = [{"role": "system", "content": context},
                                      {"role": "user", "content": search_term}]
    completion: dict = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=generation_context,
        temperature=0
    )
    str_terms: str = completion['choices'][0]['message']['content']
    list_terms: list = str_terms.split(', ')
    return list_terms


pprint(generate_keywords("Sociology"))