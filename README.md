DMST Project
============

**Contributors:**

*   Sahil Ansari (sahil-ansari)
*   Shensi Ding (shensi9)
*   Robert Kuykendall (rkuykendall)
*   Bo Xu (captainbox22)



### Setup Instructions for Professors

1. git clone git@github.com:rkuykendall/dmst-temp-repo.git
2. cd dmst-temp-repo
3. easy_install pip
4. pip install -r requirements.txt

### Running the demo
5. python server.py
6. visit *http://127.0.0.1:5000/*.



Development Guide
-----------------

### Setup Instructions

1. git clone git@github.com:rkuykendall/dmst-temp-repo.git
2. cd dmst-temp-repo
3. easy_install pip
4. pip install -r requirements.txt
5. python server.py

### Unit Testing
Run *nosetests* in the *dmst-temp-repo* folder. It will run all the tests in *_tests.py* files and you can write more tests or write code to fix the tests that fail.

### D3 Work

All front-end files are in */static/*. Just dragging the *index.html* file into the browser will not work in Chrome, but it works in Firefox. Running setup step 4 and visiting *http://127.0.0.1:5000/*.

### How it will work

Our site will be loaded, and when the user clicks on a country, a request will be sent to *us_articles.json*. D3 will then display the articles in the sidebar, and color the countries based on positive / negative quality of the article.

##Heroku app

Alternatively, go to http://iris-app.herokuapp.com/, where the app is already up and running.

Description of Files
--------------------

**Python Code**

*   article.py
*   feed.py

**Python Server Code**

*   web.py
*   server.py

**Python Tests**

*   feed_test.py
*   article_test.py
*   data/

**D3 Code**

*   static/

**Github files** (ignorable)

*   .gitignore
*   README.md

**Heroku / Flask files** (ignorable)

*   index.py
*   Procfil
*   requirements.txt


 