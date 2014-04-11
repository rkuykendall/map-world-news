import unittest
from feed import *
 
class TestFeed(unittest.TestCase):
    # def setUp(self):

    # def tearDown(self):

    def test_from_feed(self):
        feed = Feed('http://api.feedzilla.com/v1/categories/26/articles.atom?count=10')
        self.assertEqual(len(feed.articles),10)        

    def test_from_file(self):
        feed = Feed('data/2014-04-05_16-54.atom')
        self.assertEqual(len(feed.articles),89)
        
    def test_duplicate_articles(self):
        feed = Feed('data/2014-04-05_16-54.atom')
        feed.add_feed('data/2014-04-05_16-54.atom')
        self.assertEqual(len(feed.articles),89)

    def test_cray(self):
        feed = Feed('data/2014-04-05_16-54.atom')
        feed.add_feed('http://api.feedzilla.com/v1/categories/26/articles.atom?count=10')
        self.assertEqual(len(feed.articles),99)

    def test_cray2(self):
        feed = Feed('data/2014-04-05_16-54.atom')
        feed.add_feed('http://api.feedzilla.com/v1/categories/26/articles.atom?count=10')
        feed.add_feed('http://api.feedzilla.com/v1/categories/26/articles.atom?count=20')
        self.assertEqual(len(feed.articles),109)

