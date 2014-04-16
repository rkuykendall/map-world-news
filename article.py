# import dstk
import json
from sqlalchemy import *

from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

class Article(Base):
    '''Stores received and computed article data.'''
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    title = Column(String)
    summary = Column(String)

    def __repr__(self):
       return "<User(id='%s', title='%s', summary='%s')>" % (
                            self.id, self.title, self.summary)

    # dstk = dstk.DSTK()
   
    def __init__(self):
        pass

    def extract(self):
        target = self.title + ' ' + self.summary 
        
        # self.places = self.dstk.text2places(target)
        # self.sentiment = self.dstk.text2sentiment(target)['score']
        
    def to_json(self):
        return json.dumps(a.id, a.title, a.summary)