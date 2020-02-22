import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-negative-chart',
  templateUrl: './negative-chart.component.html',
  styleUrls: ['./negative-chart.component.css']
})
export class NegativeChartComponent implements OnInit {

  @ViewChild('chart', {static: true}) private chartContainer: ElementRef;

  private element: any;
  private margin: any = {top: 20, right: 30, bottom: 40, left: 30};
  private width = 560 - this.margin.left - this.margin.right;
  private height = 500 - this.margin.top - this.margin.bottom;
  private x: any;
  private y: any;
  private svg: any;
  private bars: any;
  private barsLabels: any;
  private textLabels: any;
  private text: any;

  private data: Array<any> = [
    {name: 'A', value: -15},
    {name: 'B', value: 20},
    {name: 'C', value: 60},
    {name: 'D', value: -108},
    {name: 'E', value: 2},
    {name: 'Toyota', value: -200},
    {name: 'Honda', value: 20},
    {name: 'CC', value: 22},
    {name: 'RangeRover', value: -80},
    {name: 'EE', value: 2},
];

  constructor() { }

  ngOnInit() {
    this.initChart();
  }

  onAction() {
    console.log(this.data[0].value);
    this.data[0].value += 10
    this.initChart();
  }

  public initChart() {
    this.element = this.chartContainer.nativeElement

    // create scales
    this.x = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d.value))
      .range([0, this.width])
    this.y = d3.scaleBand()
      .domain(this.data.map(d => d.name))
      .paddingInner(0.1)
      .range([0, this.height])

    // x & y domains
    // this.x.domain(d3.extent(this.data, d => d.value))
    // this.y.domain(this.data.map(d => d.name))

    // console.log(this.data.map(d => this.x(Math.min(0, d.value))))
    
    // svg
    this.svg = d3.select(this.element).append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")") // сдвиг оси "вниз и вправо"
    // add bars
    this.svg.selectAll(".bar")
      .data(this.data)
      .enter().append("rect") 
      .attr("class", d => "bar bar--" + (d.value < 0 ? "negative" : "positive"))
      .attr("x", d => this.x(Math.min(0, d.value)))
      .attr("y", d => this.y(d.name))
      .attr("width", d => Math.abs(this.x(d.value) - this.x(0)))
      .attr("height", this.y.bandwidth())
      
    // xAxis
    this.svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${this.height})`)
      .transition()
      .call(d3.axisBottom(this.x))
    // yAxis
    this.svg.append('g')
      .attr('class', 'axis axis-y')
      .attr("transform", "translate(" + this.x(0) + ",0)") //.attr("transform", "translate(" + x(0) + ",0)")
      .transition()
      .call(d3.axisLeft(this.y))
  }
}
