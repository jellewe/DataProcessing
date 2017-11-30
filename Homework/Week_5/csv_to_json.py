import csv
import json

# open csv and json file
data_csv = open('KNMI_data.csv', 'r')
data_json = open('KNMI_data.json', 'w')

columns = ["weatherStation", "date", "averageTemp", "minTemp", "maxTemp"]
reader = csv.DictReader(data_csv, columns)
for row in reader:
    json.dump(row, data_json)
    data_json.write("\n")
