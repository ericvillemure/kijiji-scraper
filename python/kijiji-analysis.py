import pandas as pd
import json
from pandas.io.json import json_normalize    

# with open('./Inputs_Outputs/kijiji-scraper-export.json',"r",-1,"utf-8") as data_file:    
#     print(data_file.readlines())
#     data = json.load(data_file)  


# df = json_normalize(data, 'listings')
data = pd.read_json('https://kijiji-scraper.firebaseio.com/listings.json')
print(data)
# df = pd.DataFrame(data.listings)
# df.head()
# print(df)
print('END')