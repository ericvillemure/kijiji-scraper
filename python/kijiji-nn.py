import os
import sys
import fileinput
import pandas as pd
import json
from pandas.io.json import json_normalize
from sklearn import preprocessing
import matplotlib.pyplot as plt
import numpy as np
from utils import readJsonFile 

df = readJsonFile()
le = preprocessing.LabelEncoder()
df = df.apply(le.fit_transform)

le = preprocessing.LabelEncoder()
df = df.apply(le.fit_transform)
print(le)
print(df.head())






# print(preprocessing.scale(df['price']))

print('END NN')