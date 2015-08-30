import json

from afinn import Afinn

from country import extract_countries


class Article():
    '''Stores received and computed article data.'''

    def __init__(self, item=None):
        self.sentiment = 0
        self.countries = []
        self.title = ""
        self.summary = ""
        self.source = ""

        if item:
            try:
                # Set source, author and title
                self.link = item['links'][0]['href']
                self.title = item.get('title')

                # Set summary, get rid of all the junk at the end
                summary = item.get('summary')
                summary = summary[:summary.find("\n\n")]
                summary = summary[:summary.find("<")]
                self.summary = summary
            except (TypeError, KeyError):
                print "Could not find first link: {}".format(json.dumps(item))

    def extract(self):
        """
        Extracts location and sentiment from an article.
        """

        afinn = Afinn()
        target = self.title + ' ' + self.summary
        target = target.encode('ascii', 'ignore')

        self.sentiment = afinn.score(target)
        self.countries = extract_countries(target)

    def to_json(self):
        json_attributes = (
            'title', 'summary', 'sentiment', 'link', 'countries')

        return json.dumps({key: getattr(self, key) for key in json_attributes})
