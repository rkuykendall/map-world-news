# IRIS World News Visualization
### Location extraction and sentiment analysis of world news, mapped.

Iris retrieves the news stories associated with the country you select,
extracts all other mentioned countries, and does sentiment analysis to
determine how positive or negative the article is. This is used to color other
countries red or green based on their relationship to the selected country.

See it online at [iris-app.herokuapp.com](http://iris-app.herokuapp.com/).

**Contributors:**
The project was originally created by a group in a Digital Mediated
Storytelling class at Columbia University.

*   Sahil Ansari (sahil-ansari)
*   Shensi Ding (shensi9)
*   Robert Kuykendall (rkuykendall)
*   Bo Xu (captainbox22)


### Installation

1. ``git clone git@github.com:rkuykendall/IRIS-News.git``
2. ``mkvirtualenv IRIS-News``
3. ``cd IRIS-News``
4. ``easy_install pip``
5. ``pip install -e . --allow-external dstk --allow-unverified dstk``

### Starting the Server
``python -m adful.app`` or ``foreman start`` (after having done ``gem install
foreman``)

### Testing

Runing ``nosetests``  will run all the tests in ``*_tests.py*`` files and you
can write more tests or write code to fix the tests that fail.
