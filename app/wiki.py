import wikipedia
from pprint import pprint


def wiki_search(search_term: str, default: int = 0) -> dict:
    """
    :param default: (optional) Default index of option to use in case of Disambiguation Error
    :param search_term: The term to be searched on wikipedia
    :return: A dictionary containing information on the term
    """
    search_term += '.'
    try:
        search_result = wikipedia.page(search_term)
    except wikipedia.exceptions.DisambiguationError as e:
        search_term = e.options[default]
        search_result = wikipedia.page(search_term)

    search_result_dict = {
        "title": search_result.title,
        "url": search_result.url,
        "summary": search_result.summary
    }

    return search_result_dict
