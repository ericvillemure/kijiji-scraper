import os
import sys
import fileinput
import pandas as pd
import json
from pandas.io.json import json_normalize
from sklearn import preprocessing
import matplotlib.pyplot as plt
import numpy as np
from utils import cleanColumns 

url = 'https://kijiji-scraper.firebaseio.com/listings.json'
filename = 'python/listings-utf8.json'

def plot_corr(df, size=8):
    corr = df.corr()
    fig, ax = plt.subplots(figsize=(size,size))
    ax.matshow(corr)
    plt.xticks(range(len(corr.columns)), corr.columns)
    plt.yticks(range(len(corr.columns)), corr.columns)
    plt.show()

df = pd.read_json(filename, orient='index')

df = cleanColumns(df)

le = preprocessing.LabelEncoder()
df = df.apply(le.fit_transform)

print(df.head())

plot_corr(df)

print('END')