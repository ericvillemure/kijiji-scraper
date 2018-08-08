import os
import sys
import fileinput
import pandas as pd
import json
from pandas.io.json import json_normalize
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import numpy as np

def train_model( df ):
    
    X = np.array(df.drop(['price'],1))
    Y = df.drop(['price'],1)
    
    #X = preprocessing.scale(X)


    X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.05, random_state=0)   

    print(X_train)
    print(y_train)
    
