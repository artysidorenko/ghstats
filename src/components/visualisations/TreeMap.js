import React, { Component } from 'react';
import * as d3 from "d3";

class TreeMap extends Component {

  render() {
    return <div className="TreeMap__container" style={{ position: 'relative' }}></div>
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
    d3.selectAll(".TreeMap__container > *").remove();
  }

  drawGraph(dataObject) {

    // Get data
    const dataArray = Object.entries(dataObject).slice(2)
                            .map(elem => {
                              return {
                                name: elem[0],
                                value: elem[1].repositoryCount
                              }
                            })
    
    // Append entry for 'all other' (backing into the result)                            
    const totalCount = dataObject.ALL.repositoryCount
    const languageCount = Object.entries(dataObject).reduce((total, elem) => {
      if (elem[0] !== 'ALL' && elem[0] !== 'rateLimit') return total + elem[1].repositoryCount
      return total
    }, 0)

    dataArray.push({
      name: 'All Other',
      value: totalCount - languageCount
    })

    const dataHierarchy = {
      name: 'Repositories',
      children: dataArray
    }

    // Set visual dimensions and margin
    const margin = window.innerWidth > 736 ? { top: 0, right: 0, bottom: 0, left: 0 } : { top: 10, right: 10, bottom: 10, left: 10 }
    const height = window.innerWidth > 736 ? 500 - margin.top - margin.bottom : 500 - margin.top - margin.bottom
    const width = window.innerWidth > 736 ? 736 - margin.left - margin.right : 350 - margin.left - margin.right

    // Set root data for treemap (needs to be ordered) in case of multiple levels
    const root = d3.hierarchy(dataHierarchy)
    console.log(root)
    root.sum((function (d) { return d.value }))
       .sort(function (a, b) { return b.height - a.height || b.value - a.value; })
    
    const treemapLayout = d3.treemap()
      .size([width, height])
      .paddingOuter(10)
      .paddingInner(5);

    treemapLayout(root);

    // Colour Legend
    const color = d3.scaleOrdinal()
      .domain(root.leaves().map(function (e) { return e.data.name }))
      .range(d3.schemePaired);

    // Render SVG container
    console.log(root.leaves())
    const svg = d3.select(".TreeMap__container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      // no border for now .style("border", "solid 1px black")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class", "TreeMap__canvas")

    // add node  
    const node = svg.selectAll('g')
      .data(root.leaves())
      .enter().append('g')
      .attr('transform', function (d) {
        return 'translate(' + [d.x0, d.y0] + ')'
      })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)

    // add tile shape to node
    const tile = node.append('rect')
      .attr('class', 'tile')
      .attr("width", function (d) { return d.x1 - d.x0; })
      .attr("height", function (d) { return d.y1 - d.y0; })
      .attr('fill', function (d) {
        return color(d.data.name)
      })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)

    // add text label
    const label = node.append('text')
      .attr('dy', '1em')
      .attr('class', 'label')
      .text(function (d) { return d.data.name })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)

    // generate tooltip
    const tootip = d3.select('.TreeMap__container').append('div')
      .style('position', 'absolute')
      .style('border', '1px solid grey')
      .style('background-color', 'white')
      .style('opacity', 0)
      .attr('class', 'TreeMap__tooltip')


    function handleMouseOver(d, i) {
      d3.select(this).style('cursor', 'pointer')
      d3.select('.TreeMap__tooltip')
        .style("left", (d3.event.pageX + 10 + shiftToolTipLeft(d3.event.pageX + 10, width)) + "px")
        .style("top", (d3.event.pageY - 800 + shiftToolTipTop(d3.event.pageY - 800, height)) + "px")
        .html(`
          <p>Language: ${d.data.name}</p>
          <p>New Repos: ${d.data.value}</p>
          <p>Proportion: ${d3.format(".0%")(d.data.value/totalCount)}</p>
        `)
        .style('padding', '0 10px')
        .transition()
        .duration(750)
        .style('opacity', 1)
        .style('z-index', 100)
        
    }

    function handleMouseOut(d, i) {
      d3.select('.TreeMap__tooltip')
        .transition()
        .duration(750)
        .style('opacity', 0)
        .style('z-index', -100)
    }

    // Mobile-friendly tooltip offsets to prevent going off-screen
    function shiftToolTipTop(top, height) {
      if (2 * top > height) return -0.5 * height
      return 0
    }
    function shiftToolTipLeft(left, width) {
      if (2 * left > width) return -0.5 * width
      return 0
    }
  }
}

export default TreeMap;

