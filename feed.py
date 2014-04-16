import feedparser
import re
from article import Article
import json

class Feed:
    '''Stores a list of articles.'''
    
    def __init__(self, feed=None):
        self.articles = {}
        
        if feed:
            self.add_feed(feed)

    def add_feed(self, feed):
        f = feedparser.parse(feed)
        for item in f['entries']:
            a = Article()
        
            # Set ID as integer, without feedzilla at beginning
            a.id = item['id']
            a.id = re.sub(r'.*feedzilla\.com:(.*)', r'\1', a.id)
            a.id = int(a.id)


        
            # Set source, author and title, remove unicode
            a.author = item['author'].encode('utf-8')
            a.title = item['title'].encode('utf-8')
            a.source=item['source']['links'][0]['href'].encode('utf-8')
                    
            # Set summary, get rid of all the junk at the end
            summary = item['summary']
            summary = summary[:summary.find("\n\n")]
            summary = summary[:summary.find("<")]
            a.summary = summary.encode('utf-8')
        
            # Add the article if it doesn't already exist
            self.articles[a.id] = a

    def to_json(self):
        response = []
        for a_id in self.articles:
            a = self.articles[a_id]
            response.append([a.id, a.title, a.summary])
        return json.dumps(response)