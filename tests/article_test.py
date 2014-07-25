import unittest
import os

# Set enviornment before importing any database classes
os.environ["CONFIG_PATH"] = "iris.config.TestingConfig"
from iris.feed import Feed
from reset_db import create_db, destroy_db

class TestArticle(unittest.TestCase):
    def setUp(self):
        feed = Feed('tests/data/2014-04-05_16-54.atom')
        '''
<entry>
    <id>feedzilla.com:368827171</id>
    <title type="html">'Pulse Signal' Detected in Search for Missing Jet
    (TIME Blogs)</title>

    <summary type="html">
        A Chinese search team said it detected signals that could lead to
        the Malaysia Airlines flight's black box, but time is running out

        (lots of awful HTML share links)
    </summary>

    <published>2014-04-05T14:20:00+01:00</published>
    <updated>2014-04-05T14:20:00+01:00</updated>
    <author>
        <name>Sam Frizell</name>
    </author>
    <link rel="alternate" href="http://news.feedzilla.com/en_us/stories/world-news/368827171
    ?count=100&amp;client_source=api&amp;format=atom" />
    <rights type="text"></rights>
    <source>
        <title type="text">TIME Blogs</title><link rel="self"
        href="http://feeds.feedburner.com/timeblogs/middle_east?format=xml" />
    </source>
</entry>
        '''

        create_db()

        self.article1 = feed.articles[368827171]
        self.article1.extract(1)

    def selfDown(self):
        destroy_db

    def test_name(self):
        self.assertEqual(self.article1.author,'Sam Frizell')

    def test_location(self):
        assert 'MYS' in self.article1.countries

    def test_sentiment(self):
        self.assertEqual(self.article1.sentiment,-2.0)
