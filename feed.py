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
            
            # Set ID as integer, without feedzilla at beginning
            a.id = int(item['id'].replace('feedzilla.com:',''))
            
            # Set author and title, remove unicode
            a.author = item['author'].encode('utf-8')
            a.title = item['title'].encode('utf-8')
            
            # Set summary, get rid of everything after double newline
            summary = item['summary']
            a.summary = summary[:summary.find("\n\n")].encode('utf-8')
            
            # Add the article if it doesn't already exist
            self.articles[a.id] = a
