class Article:
    '''Stores received and computed article data.'''
   
    def __init__(self, **kwargs):
        self.id = int(kwargs['id'].replace('feedzilla.com:',''))
        self.summary_detail = kwargs['summary_detail']
        self.rights = kwargs['rights']
        self.updated_parsed = kwargs['updated_parsed']
        self.published_parsed = kwargs['published_parsed']
        self.title = kwargs['title']
        self.authors = kwargs['authors']
        self.updated = kwargs['updated']
        self.rights_detail = kwargs['rights_detail']
        self.summary = kwargs['summary']
        self.links = kwargs['links']
        self.guidislink = kwargs['guidislink']
        self.title_detail = kwargs['title_detail']
        self.link = kwargs['link']
        self.author = kwargs['author']
        self.published = kwargs['published']
        self.author_detail = kwargs['author_detail']
        self.source = kwargs['source']
