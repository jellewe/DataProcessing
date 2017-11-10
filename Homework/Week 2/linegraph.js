/**
 * Jelle Witsen Elias
 * 10/11/2017
 *
 * Draws a line graph with weather data in an HTML canvas
 */

 // constant for size (in pixels) of graph 'tick marks'
 var TICKSIZE = 10

 // constant for amount of 'tick marks' on axes
 var TICKAMOUNT = 10

 // amount of pixels to the left of and below the x- and y axes, respectively
 var AXISSPACE = 50

 // amount of pixels between x axis and values to show next to tick marks
 var TEXTSPACEHOR = 50

 // amount of pixels between y axis and values to show below tick marks
 var TEXTSPACEVER = 20

 // horizontal and vertical size of canvas, extracted from DOM
 var horSize = document.getElementById("linegraph").getAttribute("width")
 var verSize = document.getElementById("linegraph").getAttribute("height")

// get raw data form HTML document
rawdata = document.getElementById("rawdata").innerHTML

// get array of lines in data
var lines = rawdata.split('\n')

// array for temp and date data
dateTempInfo = []

// iterate over lines in data
for (var i = 1, arrayLength = lines.length; i < arrayLength - 1; i++) {

  // split lines on comma
  var datetemp = lines[i].split(",")

  // trim spaces from date information, and store separate values
  datetemp[0] = datetemp[0].trim()
  dateYear = datetemp[0].slice(0, 4)
  dateMonth = datetemp[0].slice(4, 6)
  dateDay = datetemp[0].slice(6, 8)

  // build dateString to convert to js date format
  dateString = dateYear.concat("-", dateMonth, "-", dateDay)

  // convert to js date format
  date = new Date(dateString)

  // store temperature values
  temperatures = Number(datetemp[1].trim())

  // append information to dateTempArray
  dateTempInfo.push([date, temperatures])
}

var canvas = document.getElementById("linegraph")
var ctx = canvas.getContext('2d')

// set minimum and maximum temperatures to first entry in temperatures list
tempMin = dateTempInfo[0][1]
tempMax = dateTempInfo[0][1]

// determine minimum and maximum of temperature and date
for (var i = 1, arrayLength = dateTempInfo.length; i < arrayLength; i++) {
  if (dateTempInfo[i][1] < tempMin) {
    tempMin = dateTempInfo[i][1]
  }
  if (dateTempInfo[i][1] > tempMax) {
    tempMax = dateTempInfo[i][1]
  }
}
dateMin = dateTempInfo[0][0]
dateMax = dateTempInfo[dateTempInfo.length - 1][0]

// store domain of temperature data in array
var tempDomain = [tempMin, tempMax]
var dateDomain = [dateMin, dateMax]

// draw graph elements on canvas
drawGraphElements(tempDomain, dateDomain, ctx)

// begin path for graph line
ctx.beginPath()

// iterate over elements in dateTempInfo array
for (var i = 0, arrayLength = dateTempInfo.length; i < arrayLength; i++) {

  // represent temperature as floating point between 0 (tempMin) and 1 (tempMax)
  tempFloat = (dateTempInfo[i][1] - tempMin) / (tempMax - tempMin)

  // represent date as value between 0 and 1
  dateFloat = (dateTempInfo[i][0].getTime() - dateMin.getTime()) /
              (dateMax.getTime() - dateMin.getTime())

  // draw line in canvas
  ctx.lineTo((dateFloat * (horSize - AXISSPACE)) + AXISSPACE, tempFloat *
              (verSize - AXISSPACE))
  ctx.stroke()
}

/**
 * Draws graph elements, without drawing the actual information in it.
 */
function drawGraphElements(tempDomain, dateDomain, ctx) {

  // variables for amount of pixels between ticks
  var horTickInterval = ((horSize - AXISSPACE) / TICKAMOUNT) +
                        ((horSize - AXISSPACE) / TICKAMOUNT / (TICKAMOUNT - 1))
  var verTickInterval = ((verSize - AXISSPACE) / TICKAMOUNT) +
                        ((verSize - AXISSPACE) / TICKAMOUNT / (TICKAMOUNT - 1))

  // determine range of temperature values (temp_max - temp_min)
  tempRange = tempDomain[1] - tempDomain[0]

  // determine intervals between temperature values next to tick mark
  tickTempInterval = (tempRange / (TICKAMOUNT) + tempRange / (TICKAMOUNT) /
                      (TICKAMOUNT - 1))

  // determine range of date values
  dateRange = dateDomain[1].getTime() - dateDomain[0].getTime()

  // determine intervals between date values next to tick mark
  tickDateInterval = (dateRange / (TICKAMOUNT) + dateRange / (TICKAMOUNT) /
                      (TICKAMOUNT - 1))

  // draw y axis
  ctx.moveTo(AXISSPACE, 0)
  ctx.lineTo(AXISSPACE, verSize - AXISSPACE)
  ctx.stroke()
  ctx.lineTo(horSize, verSize - AXISSPACE)

  // iterate over tick marks to draw
  for (var i = 0; i < TICKAMOUNT; i++) {

    // draw tick mark on vertical axis
    ctx.moveTo(AXISSPACE - TICKSIZE, i * verTickInterval)
    ctx.lineTo(AXISSPACE, i * verTickInterval)
    ctx.stroke()

    // draw temperature value (as text) next to tick mark
    ctx.fillText(((Math.round(tempDomain[0] + (TICKAMOUNT - i - 1) *
                  tickTempInterval)) / 10).toString() + " C", AXISSPACE -
                  TEXTSPACEHOR, i * verTickInterval)

    // draw tick mark on horizontal axis
    ctx.moveTo(i * horTickInterval + AXISSPACE, verSize - AXISSPACE)
    ctx.lineTo(i * horTickInterval + AXISSPACE, verSize - AXISSPACE + TICKSIZE)
    ctx.stroke()

    // draw date value (as text) next to tick mark
    ctx.fillText((((new Date(dateDomain[0].getTime() + i *
                  tickDateInterval)).toString()).slice(0, -24)).substr(4),
                  i * horTickInterval, verSize - TEXTSPACEVER)
  }
}
