import string

from country_constants import COUNTRY_NAMES


def extract_countries(text):
    """
    Takes a string of text and returns a list of alpha-3 country codes
    extracted from the content of the text.
    """

    result = set()

    text = text.lower()
    text = text.replace('\'s ', ' ')
    text = ''.join([c for c in text if c in string.letters + ' '])
    text = ' {} '.format(text)
    print text

    for code in COUNTRY_NAMES:
        for name in COUNTRY_NAMES[code]:
            if name in text:
                result.add(code)

    return list(result)
