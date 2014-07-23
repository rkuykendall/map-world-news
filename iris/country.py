import string

from country_constants import COUNTRY_NAMES


def extract_countries(text):
    """
    Takes a string of text and returns a list of alpha-3 country codes
    extracted from the content of the text.
    """

    names = {}
    result = set([])

    bad_chars = '(),.?!\"\'-'
    text = text.translate(string.maketrans("", "", ), bad_chars).lower()

    for code in COUNTRY_NAMES:
        for name in COUNTRY_NAMES[code]:
            names[name] = code

    for word in text.split():
        if word in names:
            result.add(names[word])

    return list(result)
