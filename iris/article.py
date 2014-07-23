import dstk
import json
import urllib2
import datetime

from sqlalchemy import *

from iris import Base, engine, session, log
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

    dstk = dstk.DSTK()

    def __init__(self):
        self.sentiment = 0

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
                apiSummary=self.title + ' ' + self.summary
                # target = apiSummary+ ' ' + target
                target = apiSummary

                target = target.encode('ascii', 'ignore')
                apiSummary = apiSummary.encode('ascii', 'ignore')

                #replace U.S. with United States!!!
                target = target.replace ("U.S.", "United States")
                target = target.replace ("U.S.A", "United States")
                target = target.replace ("America", "United States")
                target = target.replace ("Obama", "United States")

                target = target.replace ("U.K.", "England")
                target = target.replace ("Britain", "England")
                target = target.replace ("England", "England")
                target = target.replace ("London", "England")

                target=target.replace ("Kim Jong-Un", "Democratic Republic of Korea")

                # self.places = self.dstk.text2places(target)
                self.countries = extract_countries(target)
                # self.sentiment = int(self.dstk.text2sentiment(apiSummary)['score'])
                self.sentiment = text2sentiment(apiSummary)

                session.add(self)

                return "Extracted"
            else:
                return "Remove"

    def to_json(self):
        a = self
        a.long= ""
        a.lat= ""
        # for place in a.places:
        #     if place['type'] == "COUNTRY":
        #         try:
        #             a.countries.append(two2three[place['code']])
        #         except KeyError, e:
        #             # The EU is not a country.
        #             pass

        # Remove duplicates
        a.countries = list(set(a.countries))

        # print place['longitude']
        # a.long +=place['longitude'] + ","
        # a.lat +=place['latitude'] + ","

        return {'aid':a.id, 'title':a.title, 'summary':a.summary, 'sentiment':a.sentiment, 'link':a.source, 'countries':a.countries, 'long':a.long, 'lat':a.lat, 'source':a.trueSource}
