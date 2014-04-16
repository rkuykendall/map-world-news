import feedparser
import re
from article import *
import json
from sqlalchemy.orm import sessionmaker

class Feed:
    '''Stores a list of articles.'''
    
    def __init__(self, feed=None):
        self.articles = {}
        
        if feed:
            self.add_feed(feed)
            
    def save(self, engine):
        Base.metadata.create_all(engine)
        Session = sessionmaker(bind=engine)
        session = Session()
        for a_id in self.articles:
            session.add(self.articles[a_id])
        session.commit()

    def load(self, engine):
        Session = sessionmaker(bind=engine)
        session = Session()
        for row in session.query(Article).all():
            self.articles.append(row.Article)

    def add_feed(self, feed):
        f = feedparser.parse(feed)
        for item in f['entries']:
            a = Article()
            
            # Set ID as integer, without feedzilla at beginning
            a.id = item['id']
            a.id = re.sub(r'.*feedzilla\.com:(.*)', r'\1', a.id)
            a.id = int(a.id)
            
            # Set source, author and title
            a.author = item['author']
            a.title = item['title']
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
