import os
import sys
import fileinput
import pandas as pd
import json
from pandas.io.json import json_normalize
from sklearn import preprocessing
import matplotlib.pyplot as plt
import numpy as np

def cleanColumns( df ):
    df = df.drop(['dateFound','url','title','id','dateFound'],1)
    df = df.dropna(subset = ['year','price', 'mileageFromOdometer', 'vehicleTransmission'])
    df = df[(df['mileageFromOdometer'] != 's.o')]


    df['driveWheelConfiguration'] = df['driveWheelConfiguration'].map({
        '4 roues motrices (4x4)': '4 x 4',
        '4 x 4': '4 x 4',
        'Roues motrices avant': 'Roues motrices avant',
        'Roues motrices arrière':'Roues motrices arrière',
        'Autre': 'Autre',
        np.nan: 'Autre'}).astype(str)
    df['fuelType'] = df['fuelType'].fillna('Autre').astype(str)
    df['model'] = df['brand'].astype(str) + '-' + df['model'].astype(str)
    df = df.drop(['brand'],1)

    df['vehicleTransmission'] = df['vehicleTransmission'].fillna('Autre').astype(str)
    #df['year'] = df['year'].fillna(0).astype(int)
    df['year'] = df['year'].astype(int)
    #df['mileageFromOdometer'] = df['mileageFromOdometer'].fillna('999999').replace('s.o', '999999').astype(int)
    df['mileageFromOdometer'] = df['mileageFromOdometer'].astype(int)
    df['price'] = df['price'].astype(float)
    return df

def printSafe( msg ):
    print(msg.encode(sys.stdout.encoding, 'replace').decode(sys.stdout.encoding))

def readJsonFile():
    url = 'https://kijiji-scraper.firebaseio.com/listings.json'
    filename = 'listings.json'
    df = pd.read_json(filename, orient='index', convert_axes=False)
    return cleanColumns(df)

