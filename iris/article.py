import json
import datetime

from sqlalchemy import PickleType, Text, Integer, Column, DateTime

from iris import Base, session
from sentiment import text2sentiment
from country import extract_countries


class TextPickleType(PickleType):
    impl = Text


class Article(Base):
    '''Stores received and computed article data.'''

    __tablename__ = 'articles'

    id = Column(Integer, primary_key=True)
    countries = Column(TextPickleType(pickler=json))
    sentiment = Column(Integer)
    last_referenced = Column(DateTime, default=datetime.datetime.now)

    def __init__(self):
        self.sentiment = 0
        self.title = ""
        self.summary = ""
        self.source = ""
        self.trueSource = ""

    def extract(self, allowance):
        """
        Extracts location and sentiment from an article.

        Check to see if the article is in the database. If it is, get the old
        data. If it's not, then extract the data and decrement the allowance.
        """

        query = session.query(Article).get(self.id)

        if (query != None):
            self.countries = query.countries
            self.sentiment = query.sentiment
            query.last_referenced = datetime.datetime.now()
            session.add(query)
            return "Cached"
        else:
            if (allowance > 0):
                apiSummary = self.title + ' ' + self.summary
                target = apiSummary

                target = target.encode('ascii', 'ignore')
                apiSummary = apiSummary.encode('ascii', 'ignore')

                self.countries = extract_countries(target)
                self.sentiment = text2sentiment(apiSummary)

                session.add(self)

                return "Extracted"
            else:
                return "Remove"

    def to_json(self):
        a = self
        a.countries = list(set(a.countries))

        return {
            'aid': a.id,
            'title': a.title,
            'summary': a.summary,
            'sentiment': a.sentiment,
            'link': a.source,
            'countries': a.countries,
            'source': a.trueSource }
