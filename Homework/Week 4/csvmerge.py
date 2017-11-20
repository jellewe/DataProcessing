import csv
readfile1 = open("GDP data.csv", 'r')
readfile2 = open("Mobile phone data.csv", 'r')
writefile = open("GDP data new.csv", 'w')

writer = csv.writer(writefile)
reader1 = csv.reader(readfile1)
reader2 = csv.reader(readfile2)
for row in reader1:
    reader2row = next(reader2)
    print(row[1])
    writer.writerow([reader2row[0], reader2row[1], row[1]])

writefile.close()
readfile1.close()
readfile2.close()
