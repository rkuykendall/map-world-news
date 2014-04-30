# IRIS — Digital Mediated Storytelling Project
### Location extraction and sentiment analysis of world news, mapped.

Iris retrieves the news stories associated with the country you select, extracts all other mentioned countries, and does sentiment analysis to determine how positive or negative the article is. This is used to color other countries red or green based on their relationship to the selected country.

See it online at [iris-app.herokuapp.com](http://iris-app.herokuapp.com/).

**Contributors:**

*   Sahil Ansari (sahil-ansari)
*   Shensi Ding (shensi9)
*   Robert Kuykendall (rkuykendall)
*   Bo Xu (captainbox22)


### Application Setup

1. git clone git@github.com:rkuykendall/IRIS-News.git
2. cd IRIS-News
3. easy_install pip
4. pip install -r requirements.txt

### Starting IRIS
5. python ./server.py
6. visit *http://127.0.0.1:5000/*.

Description of Files
--------------------

**Python Code**

*   article.py
*   feed.py

**Python Tests**

*   feed_test.py
*   article_test.py
*   data/

**Fronted D3, HTML, CSS, and JS Code**

*   static/

**Python Flask / Heroku files**

*   server.py
*   web.py
*   Procfil
*   requirements.txt

**Github files**

*   .gitignore
*   README.md

### Unit Testing

Run *nosetests* in the *dmst-temp-repo* folder. It will run all the tests in *_tests.py* files and you can write more tests or write code to fix the tests that fail.

