import React, { Component } from 'react'
import * as d3 from "d3"
import { generateScales, generateAxes, generateLine, parseMonth, generateContainer, generateText, generateRect } from "../../utils/d3helpers"
import { monthsWord as monthArray } from '../../utils/queryHelpers'

class LineGraph extends Component {

  render() {
    return <div className="LineGraph__container" style={{position: 'relative'}}></div>
  }
  componentDidMount() {
    console.log('mounted')
    if (this.props.data) this.drawGraph(this.props.data)
  }
  componentDidUpdate(prevProps) {
    console.log('updating')
    if (this.props.data !== prevProps.data) {
      this.removeGraph()
      this.drawGraph(this.props.data)
    }
  }

  removeGraph() {
    console.log('removing old graph')
    d3.selectAll(".LineGraph__container > *").remove();
  }

  // in case of mobile, replace full month text with 3 letter abbreviation
  formatMobile(d) {
    if (window.innerWidth < 736) {
      const month = d.toString().slice(4, 7)
      if (month === 'Jan') {
        return d.toString().slice(11, 15)
      }
      return d.toString().slice(4, 7)
    }
    return d
  }

  drawGraph(dataObject) {

    // Get data
    const dataArray = Object.entries(dataObject).slice(1)

    // Set visual dimensions and margin

    const margin = window.innerWidth > 736 ? { top: 50, right: 50, bottom: 50, left: 75 } : { top: 25, right: 25, bottom: 25, left: 50 }
    const height = window.innerWidth > 736 ? 400 - margin.top - margin.bottom : 400 - margin.top - margin.bottom
    const width = window.innerWidth > 736 ? 736 - margin.left - margin.right : 350 - margin.left - margin.right

    // D3 - Generate scale and axes
    const { xScale, yScale } = generateScales(dataArray, 'repositoryCount', height, width)
    const { xAxis, yAxis } = generateAxes(xScale, yScale)

    // Render SVG container
    const svg = d3.select(".LineGraph__container")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  // no border for now .style("border", "solid 1px black")
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                  .attr("class", "LineGraph__canvas")

    // Append X and Y axes
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "LineGraph__xAxis")
      .call(xAxis.tickFormat(d => this.formatMobile(d)))
    // Rotate x-axis labels so months are all visible
    .selectAll("text")
      .attr("dy", ".5em")
      .attr("transform", "rotate(315)")
      .style("text-anchor", "end");

    svg.append("g")
      .attr("transform", "translate(0,0)")
      .attr("class", "LineGraph__yAxis")
      .call(yAxis)

    // Append Line graph
    svg.append("path")
      .datum(dataArray)
      .attr("class", "LineGraph__line")
      .attr("d", generateLine('repositoryCount', xScale, yScale, monthArray))
      .style("fill", "none")
      .style("stroke", "black")

    // Add scatter points (for tooltip)
    svg.selectAll('circle')
      .data(dataArray)
      .enter()
      .append('circle')
      .attr('cy', d => yScale(d[1].repositoryCount))
      .attr('cx', d => xScale(parseMonth(monthArray, d[0])))
      .attr('r', 4)
      .attr('fill', 'black')
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    // Add y-axis label
    svg.append('text')
      .attr('x', -margin.left * 0.5)
      .attr('y', -margin.top * 0.5)
      .text('# of new repositories')
      .style('font-size', 'small')

    // generate tooltip
    const tootip = d3.select('.LineGraph__container').append('div')
      .style('position', 'absolute')
      .style('top', `${0.5 * height}px`)
      .style('left', `${0.5 * width}px`)
      .style('border', '1px solid grey')
      .style('background-color', 'white')
      .style('opacity', 0)
      .attr('class', 'LineGraph__tooltip')


    function handleMouseOver (d, i) {
      d3.select(this).style('cursor', 'pointer')
      d3.select('.LineGraph__tooltip')
        .style('opacity', 1)
        .style('top', `${
          yScale(d[1].repositoryCount) + margin.top +
            shiftToolTipTop(yScale(d[1].repositoryCount) + margin.top, height)
          }px`)
        .style('left', `${xScale(parseMonth(monthArray, d[0])) + 2 * margin.left + 
            shiftToolTipLeft(xScale(parseMonth(monthArray, d[0])) + 2 * margin.left, width)
          }px`)
        .style('padding', '0 10px')
        .html(`
          <p>Period: ${d[0][0].toUpperCase() + d[0].slice(1, 3)}-${d[0].slice(3, 5)}</p>
          <p>New Repos: ${d3.format(",")(d[1].repositoryCount)}</p>
        `)
    }

    function handleMouseOut (d, i) {
      d3.select('.LineGraph__tooltip')
        .style('opacity', 0)
    }

    // Mobile-friendly tooltip offsets to prevent going off-screen
    function shiftToolTipTop (top, height) {
      if (2 * top > height) return -0.5 * height
      return 0
    }
    function shiftToolTipLeft (left, width) {
      if (2 * left > width) return -0.5 * width
      return 0
    }
  }  
}

export default LineGraph;

