import string

from .country_constants import COUNTRY_NAMES


def extract_countries(text):
    """
    Takes a string of text and returns a list of alpha-3 country codes
    extracted from the content of the text.
    """

    result = set()

    text = text.lower()
    text = text.replace('\'s ', ' ')
    import string
    text = ''.join([c for c in text if c in string.ascii_letters + ' '])
    text = ' {} '.format(text)
    text = text.replace('  ', ' ')

    for code in COUNTRY_NAMES:
        for name in COUNTRY_NAMES[code]:
            if name in text:
                result.add(code)

    return list(result)
