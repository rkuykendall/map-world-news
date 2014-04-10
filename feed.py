import feedparser
from article import Article

class Feed:
    '''Stores a list of articles.'''
    
    def __init__(self, file=None, url=None):
        self.articles = {}

        if file:
            self.add_file(file)

    def add_file(self, file):
        f = feedparser.parse(file)
        for item in f['entries']:
            a = Article()
            a.id = int(item['id'].replace('feedzilla.com:',''))
            a.author = item['author'].encode('utf-8')
            a.title = item['title'].encode('utf-8')
            summary = item['summary']
            a.summary = summary[:summary.find("\n\n")].encode('utf-8')
            
            # Add the article if it doesn't already exist
            self.articles[a.id] = a
