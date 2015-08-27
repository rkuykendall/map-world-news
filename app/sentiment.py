import re

from sentiment_words import SENTIMENT_WORDS

# *****************************************************************************
#
# All code (C) Pete Warden, 2011
# Converted to Python by Robert Kuykendall, 2014
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
# *****************************************************************************


# This function scans through the text, and makes a naive guess at the
# sentiment based on how often words flagged as positive or negative appear.
def text2sentiment(text):
    words = re.split(r"[ \t.,;!]+", text.lower())
    total = 0
    matches = 0
    for index, word in enumerate(words):
        try:
            second_word = words[index+1]
        except IndexError:
            second_word = ''

        try:
            third_word = words[index+2]
        except IndexError:
            third_word = ''

        for candidate in [
                word, ' '.join([word, second_word]),
                ' '.join([word, second_word, third_word])]:

            try:
                total += SENTIMENT_WORDS[candidate]
                matches += 1
            except KeyError:
                pass

    if matches == 0:
        result = 0
    else:
        result = total / float(matches)

    return result
