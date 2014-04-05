import article

class Feed:
    '''Stores a list of articles.'''
    
    def __init__(self, file=None, url=None):
        self.articles = []
