DMST Project
============

**Contributors:**

*   Sahil Ansari (sahil-ansari)
*   Shensi Ding (shensi9)
*   Robert Kuykendall (rkuykendall)
*   Bo Xu (captainbox22)

Development Guide
-----------------

I followed [this guide](https://devcenter.heroku.com/articles/getting-started-with-python) for creating a Python Flask app which would run on Heroku. However, you probably don't need to mess with that. Just install [nosetests](https://nose.readthedocs.org/en/latest/) and run *nosetests* in the *dmst-temp-repo* folder. It will run all the tests in *_tests.py* files and you can write more tests or write code to fix the tests that fail. If you want to get the server running, try running these steps:

1. git clone git@github.com:rkuykendall/dmst-temp-repo.git
2. cd dmst-temp-repo
3. easy_install pip
3. pip install -r requirements.txt
4. foreman start

Alternatively, you can work on the HTML/CSS/JS to get D3 working. I uploaded a start as *index.html* and *world-50m.json*. Unfortunately, it fails to load the JSON file if you just view it in the browser, so you need set up a local server.
 
 
Description of Files
--------------------

**Python Code**

*   article.py
*   feed.py

**Python Tests**

*   feed_test.py
*   article_test.py
*   data

**D3 Code**

*   templates/index.html
*   templates/world-50m.json

**Github files** (ignorable)

*   .gitignore
*   README.md

**Heroku / Flask files** (ignorable)

*   index.py
*   static
*   Procfil
*   requirements.txt


 