"""
Jelle Witsen Elias
University of Amsterdam
studentno. 10753532
17-11-2017

converts data from a KNMI data csv file to a json
"""

import csv
import json

# open csv and json file
data_csv = open('KNMI_data.csv', 'r')
data_json = open('KNMI_data_new.json', 'w')

columns = ["date", "rainfall"]
reader = csv.DictReader(data_csv, columns)
for row in reader:
    json.dump(row, data_json)
    data_json.write("\n")
