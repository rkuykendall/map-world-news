import json

from sqlalchemy import PickleType, Column, Integer, String, Text
from api import Base, session, engine


class TextPickleType(PickleType):
    impl = Text


class KvStore(Base):
    __tablename__ = 'kvstore'
    id = Column(Integer, primary_key=True)
    key = Column(String(80), unique=True)
    value = Column(TextPickleType(pickler=json))

    def __init__(self, key, value):
        self.key = key
        self.value = value

    def save(self):
        print "saving..."
        print self.value.keys()
        session.add(self)
        session.commit()
        prune()


def prune():
    """
    Prune the cached extractions database to keep below 10,000 records,
    the free limit on Heroku.
    """

    num = session.query(KvStore.id).count()
    if(num > 9990):
        for resolution in session.query(
                KvStore).order_by(
                KvStore.id.asc()).limit(40):
            session.delete(resolution)

    session.commit()
    return num


Base.metadata.create_all(engine)
