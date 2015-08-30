import unittest
import os

# Set enviornment before importing any database classes
os.environ["CONFIG_PATH"] = "api.config.TestingConfig"
from api.feed import Feed


class TestFeed(unittest.TestCase):
    def test_feedzilla(self):
        feed = Feed('tests/data/feedzilla_2014-04-05_16-54.atom')
        self.assertEqual(len(feed.articles), 89)

    def test_reuters(self):
        feed = Feed('tests/data/reuters_worldNews.xml')
        item = feed.articles[0]
        item.extract()

        self.assertTrue('DEU' in item.countries)
        self.assertTrue(item.link[:4] == 'http')
        self.assertTrue(len(item.summary) >= 5)
        self.assertTrue(len(item.title) >= 5)
        self.assertEqual(len(feed.articles), 20)

    def test_bbc(self):
        feed = Feed('tests/data/bbc_world.xml')
        item = feed.articles[0]
        item.extract()

        self.assertTrue('AUT' in item.countries)
        self.assertTrue(item.link[:4] == 'http')
        self.assertTrue(len(item.summary) >= 5)
        self.assertTrue(len(item.title) >= 5)
        self.assertEqual(len(feed.articles), 49)

    def test_ap(self):
        feed = Feed('tests/data/associated_press.xml')
        item = feed.articles[0]
        item.extract()

        self.assertTrue('HUN' in item.countries)
        self.assertTrue(item.link[:4] == 'http')
        self.assertTrue(len(item.summary) >= 5)
        self.assertTrue(len(item.title) >= 5)
        self.assertEqual(len(feed.articles), 5)
