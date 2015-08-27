# Map World News
### Location extraction and sentiment analysis of world news, mapped.

[![Build Status](https://travis-ci.org/rkuykendall/map-world-news.svg?branch=master)](https://travis-ci.org/rkuykendall/map-world-news)

Map World News retrieves the news stories associated with the country you
select, extracts all other mentioned countries, and does sentiment analysis to
determine how positive or negative the article is. This is used to color other
countries red or green based on their relationship to the selected country.

See it online at [mapworldnews.com](http://mapworldnews.com/).

**Contributors:**
The project was originally created by a group in a Digital Mediated
Storytelling class at Columbia University.

*   Sahil Ansari (sahil-ansari)
*   Shensi Ding (shensi9)
*   Robert Kuykendall (rkuykendall)
*   Bo Xu (captainbox22)


### Installation

1. ``git clone git@github.com:rkuykendall/map-world-news.git``
2. ``mkvirtualenv map-world-news``
3. ``cd map-world-news``
4. ``easy_install pip``
5. ``pip install -e .``

### Starting the Server
``python -m app.main`` or ``foreman start`` (after having done ``gem install
foreman``)

### Testing

Running ``nosetests``  will run all the tests in ``*_tests.py*`` files and you
can write more tests or write code to fix the tests that fail.
