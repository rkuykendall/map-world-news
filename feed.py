import feedparser
from article import Article

class Feed:
    '''Stores a list of articles.'''
    
    def __init__(self, file=None, url=None):
        self.articles = []
        if file:
            f = feedparser.parse(file)
            for item in f['entries']:
                # The double ** takes every item in the dictionary
                # and makes it a different argument calling the Article class.
                self.articles.append(Article(**item))
