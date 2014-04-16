# import dstk
import json

class Article:
    '''Stores received and computed article data.'''
    # dstk = dstk.DSTK()
   
    def __init__(self):
        pass

    def extract(self):
        target = self.title + ' ' + self.summary 
        
        # self.places = self.dstk.text2places(target)
        # self.sentiment = self.dstk.text2sentiment(target)['score']
        
    def to_json(self):
        return json.dumps(a.id, a.title, a.summary)