import urllib.request,re,pathlib
p=pathlib.Path('public/fonts');p.mkdir(exist_ok=True)
queries=[('DM+Sans:wght@100..1000','dm-sans'),('Instrument+Serif','instrument-serif'),('Instrument+Serif:ital@1','instrument-serif-italic')]
for query,name in queries:
 req=urllib.request.Request('https://fonts.googleapis.com/css2?family='+query+'&display=swap',headers={'User-Agent':'Mozilla/5.0'})
 css=urllib.request.urlopen(req,timeout=20).read().decode();urls=re.findall(r'url\((https://fonts.gstatic.com/[^)]+)\)',css)
 data=urllib.request.urlopen(urls[-1],timeout=20).read();(p/(name+'.ttf')).write_bytes(data);print(name,len(data))
