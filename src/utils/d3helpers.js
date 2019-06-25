import * as d3 from "d3";

const monthArray = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

export function parseMonth (monthArray, datapoint) {
  return new Date(parseInt(`20${datapoint.slice(3)}`), monthArray.indexOf(datapoint.slice(0, 3)), 1)
}

export function generateScales (dataArray, dataField, height, width) {
  const xScale = d3.scaleTime()
    .domain([
      parseMonth(monthArray, dataArray[0][0]),
      parseMonth(monthArray, dataArray[dataArray.length-1][0])
    ])
    .range([0, width])
  const yScale = d3.scaleLinear()
    .domain([
      d3.min(dataArray, (d) => d[1][dataField]) * 0.95,
      d3.max(dataArray, (d) => d[1][dataField]) * 1.05
    ])
    .range([height, 0]);
  return { xScale, yScale }
}

export function generateAxes (xScale, yScale) {
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)
  return { xAxis, yAxis }
}

export function generateLine (dataField, xScale, yScale, monthArray) {
  const line = d3.line()
    .x((d) => xScale(parseMonth(monthArray, d[0])))
    .y((d) => yScale(d[1][dataField]))
  return line
}

// note: target cannot be a variable/object in node/React where there is no window.document context
export function generateContainer (target, position, className) {
  d3.select(target)
    .append('g')
    .attr('x', position.left)
    .attr('y', position.top)
    .attr('class', className)
}

export function generateText (target, position, text, className) {
  d3.select(target)
    .append('text')
    .attr('x', position.left)
    .attr('y', position.top)
    .text(text)
    .attr('class', className)
}

export function generateRect (target, position, dimensions, color, className) {
  d3.select(target)
    .append('rect')
    .attr('x', position.left)
    .attr('y', position.top)
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)
    .attr('fill', color.fill)
    .attr('stroke', color.border)
    .attr('class', className)
}