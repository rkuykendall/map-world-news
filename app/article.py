from afinn import Afinn

from country import extract_countries


class Article():
    '''Stores received and computed article data.'''

    def __init__(self):
        self.sentiment = 0
        self.title = ""
        self.summary = ""
        self.source = ""

    def extract(self):
        """
        Extracts location and sentiment from an article.
        """

        apiSummary = self.title + ' ' + self.summary
        target = apiSummary

        target = target.encode('ascii', 'ignore')
        apiSummary = apiSummary.encode('ascii', 'ignore')

        self.countries = extract_countries(target)

        afinn = Afinn()
        self.sentiment = afinn.score(apiSummary)

    def to_json(self):
        a = self
        a.countries = list(set(a.countries))

        return {
            'title': a.title,
            'summary': a.summary,
            'sentiment': a.sentiment,
            'link': a.source,
            'countries': a.countries
        }
