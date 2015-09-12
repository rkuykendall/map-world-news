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

Base.metadata.create_all(engine)
