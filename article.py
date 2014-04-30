import dstk
import json
import urllib2
from sqlalchemy import *
from database import Base, engine, session

# Removed: 'SM': 'SMR',
two2three = {
'AF': 'AFG', 'AX': 'ALA', 'AL': 'ALB', 'DZ': 'DZA', 'AS': 'ASM', 'AD': 'AND', 
'AO': 'AGO', 'AI': 'AIA', 'AQ': 'ATA', 'AG': 'ATG', 'AR': 'ARG', 'AM': 'ARM', 
'AW': 'ABW', 'AU': 'AUS', 'AT': 'AUT', 'AZ': 'AZE', 'BS': 'BHS', 'BH': 'BHR', 
'BD': 'BGD', 'BB': 'BRB', 'BY': 'BLR', 'BE': 'BEL', 'BZ': 'BLZ', 'BJ': 'BEN', 
'BM': 'BMU', 'BT': 'BTN', 'BO': 'BOL', 'BA': 'BIH', 'BW': 'BWA', 'BV': 'BVT', 
'BR': 'BRA', 'IO': 'IOT', 'BN': 'BRN', 'BG': 'BGR', 'BF': 'BFA', 'BI': 'BDI', 
'KH': 'KHM', 'CM': 'CMR', 'CA': 'CAN', 'CV': 'CPV', 'KY': 'CYM', 'CF': 'CAF', 
'TD': 'TCD', 'CL': 'CHL', 'CN': 'CHN', 'CX': 'CXR', 'CC': 'CCK', 'CO': 'COL', 
'KM': 'COM', 'CG': 'COG', 'CD': 'COD', 'CK': 'COK', 'CR': 'CRI', 'CI': 'CIV', 
'HR': 'HRV', 'CU': 'CUB', 'CY': 'CYP', 'CZ': 'CZE', 'DK': 'DNK', 'DJ': 'DJI', 
'DM': 'DMA', 'DO': 'DOM', 'EC': 'ECU', 'EG': 'EGY', 'SV': 'SLV', 'GQ': 'GNQ', 
'ER': 'ERI', 'EE': 'EST', 'ET': 'ETH', 'FK': 'FLK', 'FO': 'FRO', 'FJ': 'FJI', 
'FI': 'FIN', 'FR': 'FRA', 'GF': 'GUF', 'PF': 'PYF', 'TF': 'ATF', 'GA': 'GAB', 
'GM': 'GMB', 'GE': 'GEO', 'DE': 'DEU', 'GH': 'GHA', 'GI': 'GIB', 'GR': 'GRC', 
'GL': 'GRL', 'GD': 'GRD', 'GP': 'GLP', 'GU': 'GUM', 'GT': 'GTM', 'GG': 'GGY', 
'GN': 'GIN', 'GW': 'GNB', 'GY': 'GUY', 'HT': 'HTI', 'HM': 'HMD', 'VA': 'VAT', 
'HN': 'HND', 'HK': 'HKG', 'HU': 'HUN', 'IS': 'ISL', 'IN': 'IND', 'ID': 'IDN', 
'IR': 'IRN', 'IQ': 'IRQ', 'IE': 'IRL', 'IM': 'IMN', 'IL': 'ISR', 'IT': 'ITA', 
'JM': 'JAM', 'JP': 'JPN', 'JE': 'JEY', 'JO': 'JOR', 'KZ': 'KAZ', 'KE': 'KEN', 
'KI': 'KIR', 'KP': 'PRK', 'KR': 'KOR', 'KW': 'KWT', 'KG': 'KGZ', 'LA': 'LAO', 
'LV': 'LVA', 'LB': 'LBN', 'LS': 'LSO', 'LR': 'LBR', 'LY': 'LBY', 'LI': 'LIE', 
'LT': 'LTU', 'LU': 'LUX', 'MO': 'MAC', 'MK': 'MKD', 'MG': 'MDG', 'MW': 'MWI', 
'MY': 'MYS', 'MV': 'MDV', 'ML': 'MLI', 'MT': 'MLT', 'MH': 'MHL', 'MQ': 'MTQ', 
'MR': 'MRT', 'MU': 'MUS', 'YT': 'MYT', 'MX': 'MEX', 'FM': 'FSM', 'MD': 'MDA', 
'MC': 'MCO', 'MN': 'MNG', 'ME': 'MNE', 'MS': 'MSR', 'MA': 'MAR', 'MZ': 'MOZ', 
'MM': 'MMR', 'NA': 'NAM', 'NR': 'NRU', 'NP': 'NPL', 'NL': 'NLD', 'AN': 'ANT', 
'NC': 'NCL', 'NZ': 'NZL', 'NI': 'NIC', 'NE': 'NER', 'NG': 'NGA', 'NU': 'NIU', 
'NF': 'NFK', 'MP': 'MNP', 'NO': 'NOR', 'OM': 'OMN', 'PK': 'PAK', 'PW': 'PLW', 
'PS': 'PSE', 'PA': 'PAN', 'PG': 'PNG', 'PY': 'PRY', 'PE': 'PER', 'PH': 'PHL', 
'PN': 'PCN', 'PL': 'POL', 'PT': 'PRT', 'PR': 'PRI', 'QA': 'QAT', 'RE': 'REU', 
'RO': 'ROU', 'RU': 'RUS', 'RW': 'RWA', 'BL': 'BLM', 'SH': 'SHN', 'KN': 'KNA', 
'LC': 'LCA', 'MF': 'MAF', 'PM': 'SPM', 'VC': 'VCT', 'WS': 'WSM',  
'ST': 'STP', 'SA': 'SAU', 'SN': 'SEN', 'RS': 'SRB', 'SC': 'SYC', 'SL': 'SLE', 
'SG': 'SGP', 'SK': 'SVK', 'SI': 'SVN', 'SB': 'SLB', 'SO': 'SOM', 'ZA': 'ZAF', 
'GS': 'SGS', 'ES': 'ESP', 'LK': 'LKA', 'SD': 'SDN', 'SR': 'SUR', 'SJ': 'SJM', 
'SZ': 'SWZ', 'SE': 'SWE', 'CH': 'CHE', 'SY': 'SYR', 'TW': 'TWN', 'TJ': 'TJK', 
'TZ': 'TZA', 'TH': 'THA', 'TL': 'TLS', 'TG': 'TGO', 'TK': 'TKL', 'TO': 'TON', 
'TT': 'TTO', 'TN': 'TUN', 'TR': 'TUR', 'TM': 'TKM', 'TC': 'TCA', 'TV': 'TUV', 
'UG': 'UGA', 'UA': 'UKR', 'AE': 'ARE', 'GB': 'GBR', 'US': 'USA', 'UM': 'UMI', 
'UY': 'URY', 'UZ': 'UZB', 'VU': 'VUT', 'VE': 'VEN', 'VN': 'VNM', 'VG': 'VGB', 
'VI': 'VIR', 'WF': 'WLF', 'EH': 'SAH', 'YE': 'YEM', 'ZM': 'ZMB', 'ZW': 'ZWE'}

class TextPickleType(PickleType):
    impl = Text

class Article(Base):
    '''Stores received and computed article data.'''
    __tablename__ = 'articles'

    id = Column(Integer, primary_key=True)
    # title = Column(String)
    # summary = Column(String)
    places = Column(TextPickleType(pickler=json))
    sentiment = Column(Integer)
    # extracted = Column(Boolean)

    # def __repr__(self):
    #    return "<User(id='%s', title='%s', summary='%s', sentiment='%d')>" % (
    #                         self.id, self.title, self.summary, self.sentiment)

    dstk = dstk.DSTK()
   
    def __init__(self):
        self.sentiment = 0

    def extract(self, allowance):
        '''Check to see if the article is in the database.
           If it is, get the old data. If it's not, then 
           extract the data and decrement the allowance.'''
        
        query = session.query(Article).get(self.id)
        
        if (query != None):
            self.places = query.places
            self.sentiment = query.sentiment
            return "Cached"
        else:
            if (allowance > 0):
                print "Running extraction =>",
                # response=urllib2.urlopen(self.source)
                # html=response.read()
                # target=self.dstk.html2story(html)
                # target=target['story']

                apiSummary=self.title + ' ' + self.summary 
                # target = apiSummary+ ' ' + target
                target = apiSummary

                target = target.encode('ascii', 'ignore')
                apiSummary = apiSummary.encode('ascii', 'ignore')

                #replace U.S. with United States!!!
                target=target.replace ("U.S.", "United States")
                target=target.replace ("U.S.A", "United States")
                target=target.replace ("America", "United States")
                target=target.replace ("Obama", "United States")

                self.places = self.dstk.text2places(target)
                self.sentiment = int(self.dstk.text2sentiment(apiSummary)['score'])
            
                session.add(self)
                session.commit()
                
                print "Done."
                return "Extracted"
            else:
                return "Remove"
        
    def to_json(self):
        a = self
        a.countries = []
        a.long= ""
        a.lat= ""
        for place in a.places:
            if place['type'] == "COUNTRY":
                try:
                    a.countries.append(two2three[place['code']])
                except KeyError, e:
                    # The EU is not a country.
                    pass
        
        # Remove duplicates
        a.countries = list(set(a.countries))
                
            # print place['longitude']
            # a.long +=place['longitude'] + ","
            # a.lat +=place['latitude'] + ","


        
        return {'aid':a.id, 'title':a.title, 'summary':a.summary, 'sentiment':a.sentiment, 'link':a.source, 'countries':a.countries, 'long':a.long, 'lat':a.lat, 'source':a.trueSource}
