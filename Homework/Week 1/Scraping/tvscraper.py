#!/usr/bin/env python
# Name:
# Student number:
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    # get dom of webpage
    url = URL(TARGET_URL)
    dom = DOM(url.download(cached=True))

    # list for information of tvseries
    tvseries_info = []

    # get specific part from dom to get information from
    title_doms = dom.by_class("lister-item-content")

    # iterate over titles
    for title_dom in title_doms:

        # temporary list for storing current title information
        temp = []

        # get title and rating from DOM (and encode utf-8), and append to temp
        title = title_dom.by_tag("a")[0].content.encode("utf-8")
        temp.append(title)
        rating = title_dom.by_tag("strong")[0].content.encode("utf-8")
        temp.append(rating)

        # get genres from DOM and encode utf-8
        genres = title_dom.by_class("genre")[0].content.encode("utf-8")

        # remove spaces and newline characters from genres string
        genres = genres.replace(" ", "")
        genres = genres.replace("\n", "")

        # append genres to temp list
        temp.append(genres)

        # get actors & actresses from DOM
        starslist = title_dom.children[9].by_tag("a")

        # string for stars
        stars = ""

        # iterate over stars, and append to stars string, and separate by commas
        for star in starslist:
            stars += (star.content.encode("utf-8"))
            stars += (",")

        # remove last comma from stars string
        stars = stars[:-1]
        
        # append stars to temp list
        temp.append(stars)

        # get runtime from DOM
        runtime = title_dom.by_class("runtime")[0].content.encode("utf-8")

        # remove last 4 characters (" min") from runtime string
        runtime = runtime[:-4]

        # append runtime info to temp list
        temp.append(runtime)

        # append temp list to tvseries list
        tvseries_info.append(temp)

    # return list with information about tvseries
    return tvseries_info


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # iterate over tvseries in list, and write to CSV
    for i in range(len(tvseries)):
        writer.writerow(tvseries[i])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE TV-SERIES TO DISK

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)
