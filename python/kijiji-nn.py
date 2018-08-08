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
from train import train_model

df = readJsonFile()

# fuelTypeEncoder = preprocessing.LabelEncoder()
# driveWheelConfigurationEncoder = preprocessing.LabelEncoder()
# vehicleTransmissionEncoder = preprocessing.LabelEncoder()


#print(df.head())

# df['fuelType'] = fuelTypeEncoder.fit_transform(df['fuelType'])
# df['driveWheelConfiguration'] = driveWheelConfigurationEncoder.fit_transform(df['driveWheelConfiguration'])
# df['vehicleTransmission'] = vehicleTransmissionEncoder.fit_transform(df['vehicleTransmission'])

df = df[(df['year'] < 2014) & (df['year'] >= 1970) & (df['price'] <= 200000)]

print(df)

df = pd.concat([df, pd.get_dummies(df['model'],prefix='model',dummy_na=True)],axis=1).drop(['model'],axis=1)
df = pd.concat([df, pd.get_dummies(df['fuelType'],prefix='fuelType',dummy_na=True)],axis=1).drop(['fuelType'],axis=1)
df = pd.concat([df, pd.get_dummies(df['driveWheelConfiguration'],prefix='driveWheelConfiguration',dummy_na=True)],axis=1).drop(['driveWheelConfiguration'],axis=1)
df = pd.concat([df, pd.get_dummies(df['vehicleTransmission'],prefix='vehicleTransmission',dummy_na=True)],axis=1).drop(['vehicleTransmission'],axis=1)

#print(df.head())
#print(pd.get_dummies(df['model'],prefix=['model']).head())



train_model(df)



#df[['model']] = pd.get_dummies(df['model'],prefix=['model'])

#print(le)
#print(df.head())






# print(preprocessing.scale(df['price']))

print('END NN')