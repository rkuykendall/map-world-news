import sys
import logging

# Logging
log = logging.getLogger('map-world-news_logger')
log.setLevel(logging.DEBUG)
out_hdlr = logging.StreamHandler(sys.stdout)
out_hdlr.setLevel(logging.INFO)
log.addHandler(out_hdlr)
