import pandas as pd
import pprint as pp
url = 'https://www.bls.gov/web/laus/lauhsthl.htm'
tables = pd.read_html(url)
print(tables)
df = tables[0]
print(df.head(51))