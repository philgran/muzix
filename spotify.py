import urllib2

url = "http://ws.spotify.com/search/1/track.json?q={q}".format(q=query)

resp, content = urllib2.urlopen(url).read()