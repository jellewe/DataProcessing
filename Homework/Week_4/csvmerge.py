# Jelle Witsen Elias
# University of Amsterdam
# studentno. 10753532
#
# Merges two csv files into one

import csv
readfile1 = open("Merged data.csv", 'r')
readfile2 = open("countries_continents.csv", 'r')
writefile = open("Merged data2.csv", 'w')

writer = csv.writer(writefile)
reader1 = csv.reader(readfile1)
reader2 = csv.reader(readfile2)
for row in reader1:
    reader2row = next(reader2)
    print(row[1])
    writer.writerow([reader2row[0], reader2row[1], row[1], row[2]])

writefile.close()
readfile1.close()
readfile2.close()
