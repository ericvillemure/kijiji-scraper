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

    df['driveWheelConfiguration'] = df['driveWheelConfiguration'].map({
        '4 roues motrices (4x4)': '4 x 4',
        '4 x 4': '4 x 4',
        'Roues motrices avant': 'Roues motrices avant',
        'Roues motrices arrière':'Roues motrices arrière',
        'Autre': 'Autre',
        np.nan: 'Autre'}).astype(str)
    df['fuelType'] = df['fuelType'].fillna('Autre').astype(str)

    df['brand'] = df['brand'].astype(str)
    df['model'] = df['model'].astype(str)
    df['vehicleTransmission'] = df['vehicleTransmission'].fillna('Autre').astype(str)
    df['year'] = df['year'].fillna(0).astype(int)
    return df

def printSafe( msg ):
    print(msg.encode(sys.stdout.encoding, 'replace').decode(sys.stdout.encoding))

