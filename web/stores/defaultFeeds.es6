let defaults = {
  'Reuters': 'http://feeds.reuters.com/Reuters/worldNews',
  'Associated Press': 'http://hosted2.ap.org/atom/APDEFAULT/cae69a7523db45408eeb2b3a98c0c9c5',
  'BBC World': 'http://feeds.bbci.co.uk/news/world/rss.xml',
  'BBC Africa': 'http://feeds.bbci.co.uk/news/world/africa/rss.xml',
  'BBC Asia': 'http://feeds.bbci.co.uk/news/world/asia/rss.xml',
  'BBC Europe': 'http://feeds.bbci.co.uk/news/world/europe/rss.xml',
  'BBC Latin America': 'http://feeds.bbci.co.uk/news/world/latin_america/rss.xml',
  'BBC Middle East': 'http://feeds.bbci.co.uk/news/world/middle_east/rss.xml',
  'BBC US & Canada': 'http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml',
  'BBC England': 'http://feeds.bbci.co.uk/news/england/rss.xml',
  'BBC Northern Ireland': 'http://feeds.bbci.co.uk/news/northern_ireland/rss.xml',
  'BBC Scottland': 'http://feeds.bbci.co.uk/news/scotland/rss.xml',
  'BBC Wales': 'http://feeds.bbci.co.uk/news/wales/rss.xml',
  'Fox World': 'http://feeds.foxnews.com/foxnews/world',
  'NPR World': 'http://www.npr.org/rss/rss.php?id=1004',
  'USNews Nation & World': 'http://www.usnews.com/rss/news',
  'CNN World': 'http://rss.cnn.com/rss/cnn_world.rss',
  'NYTimes Middle East': 'http://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml',
  'NYTimes Europe': 'http://rss.nytimes.com/services/xml/rss/nyt/Europe.xml',
  'NYTimes Asia Pacific': 'http://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml',
  'NYTimes Africa': 'http://rss.nytimes.com/services/xml/rss/nyt/Africa.xml',
  'NYTimes Americas': 'http://rss.nytimes.com/services/xml/rss/nyt/Americas.xml',
  'USA Today World': 'http://rssfeeds.usatoday.com/usatodaycomworld-topstories&x=1',
  'ABC World News': 'http://feeds.abcnews.com/abcnews/internationalheadlines',
  'ABD International News': 'http://feeds.abcnews.com/abcnews/worldnewsheadlines',
  'SkyNews World': 'http://feeds.skynews.com/feeds/rss/world.xml',
  'Global News World': 'http://globalnews.ca/world/feed/',
  'CBC World': 'http://www.cbc.ca/cmlink/rss-world',
  'Telegraph Worldnews': 'http://www.telegraph.co.uk/news/worldnews/rss',
  'Reddit /r/worldnews': 'https://www.reddit.com/r/worldnews/.rss',
  'Al Jazeera English': 'http://www.aljazeera.com/xml/rss/all.xml'
}

let autoload = ['Reuters', 'BBC World', 'NPR World']

let keys = Object.keys(defaults);
let defaultFeeds = {}

for (let key of keys) {
  defaultFeeds[key] = {
    url: defaults[key],
    fetched: false,
    show: false,
    failed: false,
    data: [],
    class: 'unselected',
    subtitle: '',
    startload: autoload.indexOf(key) !== -1
  }
}

module.exports = defaultFeeds;
