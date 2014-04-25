import dstk
import json
import urllib2
from sqlalchemy import *
from database import Base, engine, session

class Article(Base):
    '''Stores received and computed article data.'''
    __tablename__ = 'articles'

    id = Column(Integer, primary_key=True)
    title = Column(String)
    summary = Column(String)
    # places = Column(Integer)
    sentiment = Column(Integer)
    # extracted = Column(Boolean)

    # def __repr__(self):
    #    return "<User(id='%s', title='%s', summary='%s', sentiment='%d')>" % (
    #                         self.id, self.title, self.summary, self.sentiment)

    dstk = dstk.DSTK()
   
    def __init__(self):
        self.sentiment = 0

    def extract(self):
        response=urllib2.urlopen(self.source)
        html=response.read()
        target=self.dstk.html2story(html)
        target=target['story']

        apiSummary=self.title + ' ' + self.summary 
        target = apiSummary+ ' ' + target

        target = target.encode('ascii', 'ignore')
        apiSummary = apiSummary.encode('ascii', 'ignore')


        # print target
        # target = "Test"
        # target = json.dumps(d)
        self.places = self.dstk.text2places(target)


        self.sentiment = int(self.dstk.text2sentiment(apiSummary)['score'])
        
    def to_json(self):
        return json.dumps(a.id, a.title, a.summary)