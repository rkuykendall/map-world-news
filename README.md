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
5. ``pip install -r requirements.txt``


### Starting the Server

1. ``gem install foreman``
2. ``foreman start``


### Testing

Running ``nosetests``  will run all the tests in ``*_tests.py*`` files and you
can write more tests or write code to fix the tests that fail.


### Thanks

*   [Shensi Ding](https://github.com/shensi9), [Sahil Ansari](https://github.com/sahil-ansari), and [Bo Xu](https://github.com/captainbox22)'s work with me on [IRIS](https://github.com/rkuykendall/IRIS-News), the project from which this was based.
*   [Joe Turner](https://github.com/oampo) at [Thinkful](http://www.thinkful.com/) for many months of Python help.
*   Susan McGregor and David Elson of the [Digitally Mediated Storytelling](https://sites.google.com/site/digitallymediatedstorytelling/) class at Columbia University in 2014 where we created IRIS.
*   [Finn Arup](https://github.com/fnielsen/afinn) for his work on simple sentiment analysis.
*   Tom Noda for his [D3 map tutorial](http://www.tnoda.com/blog/2013-12-07) used as the basis for the map.
*   Pete Warden for the [Data Science Toolkit](http://www.datasciencetoolkit.org/), the original sentiment and location extraction code used here.
