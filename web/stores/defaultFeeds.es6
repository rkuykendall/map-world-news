let defaults = {
  'Reuters': 'http://feeds.reuters.com/Reuters/worldNews',
  'Associated Press': 'http://hosted2.ap.org/atom/APDEFAULT/cae69a7523db45408eeb2b3a98c0c9c5',
  'BBC': 'http://feeds.bbci.co.uk/news/world/rss.xml',
  'Fox': 'http://feeds.foxnews.com/foxnews/world',
  'NPR': 'http://www.npr.org/rss/rss.php?id=1004',
  'USNews': 'http://www.usnews.com/rss/news',
  'CNN': 'http://rss.cnn.com/rss/cnn_world.rss',
  'NYTimes Middle East': 'http://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml',
  'NYTimes Europe': 'http://rss.nytimes.com/services/xml/rss/nyt/Europe.xml',
  'NYTimes Asia Pacific': 'http://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml',
  'NYTimes Africa': 'http://rss.nytimes.com/services/xml/rss/nyt/Africa.xml',
  'NYTimes Americas': 'http://rss.nytimes.com/services/xml/rss/nyt/Americas.xml'
}

let keys = Object.keys(defaults);
let defaultFeeds = {}

for (let key of keys) {
  defaultFeeds[key] = {
    url: defaults[key],
    fetched: false,
    show: false,
    data: [],
    failed: false
  }
}

module.exports = defaultFeeds;
