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
3. pip install Flask gunicorn
4. foreman start

Alternatively, you can work on the HTML/CSS/JS to get D3 working. I uploaded a start as *index.html* and *world-50m.json*. Unfortunately, it fails to load the JSON file if you just view it in the browser, so you need set up a local server.
 
 