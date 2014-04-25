DMST Project
============

**Contributors:**

*   Sahil Ansari (sahil-ansari)
*   Shensi Ding (shensi9)
*   Robert Kuykendall (rkuykendall)
*   Bo Xu (captainbox22)

Development Guide
-----------------

### Setup

1. git clone git@github.com:rkuykendall/dmst-temp-repo.git
2. cd dmst-temp-repo
3. easy_install pip
3. pip install -r requirements.txt
4. foreman start 

### Unit Testing
Run *nosetests* in the *dmst-temp-repo* folder. It will run all the tests in *_tests.py* files and you can write more tests or write code to fix the tests that fail.

### D3 Work

All front-end files are in */static/*. Just dragging the *index.html* file into the browser will not work in Chrome, but it works in Firefox. Running setup step 4 and visiting *http://127.0.0.1:5000/*.

### How it will work

Our site will be loaded, and when the user clicks on a country, a request will be sent to *us_articles.json*. D3 will then display the articles in the sidebar, draw lines between countries, and color them based on positive / negativene quality of the article.

### To-Do List

**D3**

1. Create an example *us_articles.json* file, and get D3 to show the articles when you click the US.
2. Add country links to that JSON file, and get D3 to draw lines
3. Add a positive/negative sentiment number to those articles, and make D3 color countries more red or green.


**Python**

1. Filter function in feed, to remove all articles that don't include one country.
2. 

**Database Required**

1. Save articles in database ( Robert is working on this )
3. Add function to do DSTK actions on very small number of un-analyzed articles and save them.
4. Add function to add a feed URL to the database.


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


 