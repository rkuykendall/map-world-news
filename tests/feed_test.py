import unittest
import os

# Set enviornment before importing any database classes
os.environ["CONFIG_PATH"] = "iris.config.TestingConfig"
from iris.feed import Feed


class TestFeed(unittest.TestCase):
    def test_from_file(self):
        feed = Feed('tests/data/2014-04-05_16-54.atom')
        self.assertEqual(len(feed.articles), 89)

    def test_duplicate_articles(self):
        feed = Feed('tests/data/2014-04-05_16-54.atom')
        feed.add_feed('tests/data/2014-04-05_16-54.atom')
        self.assertEqual(len(feed.articles), 89)
