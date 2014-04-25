import dstk
import json
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
        target = self.title + ' ' + self.summary 
        
        self.places = self.dstk.text2places(target)
        self.sentiment = int(self.dstk.text2sentiment(target)['score'])
        
    def to_json(self):
        return json.dumps(a.id, a.title, a.summary)