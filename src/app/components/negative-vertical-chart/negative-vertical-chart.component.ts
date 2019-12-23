import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-negative-vertical-chart',
  templateUrl: './negative-vertical-chart.component.html',
  styleUrls: ['./negative-vertical-chart.component.css']
})
export class NegativeVerticalChartComponent implements OnInit {

  @ViewChild('chart', {static: true}) private chartContainer: ElementRef;

  private element: any;
  private margin: any = {top: 20, right: 30, bottom: 40, left: 30};
  private width = 560 - this.margin.left - this.margin.right;
  private height = 500 - this.margin.top - this.margin.bottom;
  private x: any;
  private y: any;
  private svg: any;
  private chart:any;
  private text: any;
  private textLabels: any;

  private data: Array<any> = [
    {name: 'A', value: -15},
    {name: 'B', value: -20},
    {name: 'C', value: 60},
    {name: 'D', value: -108},
    {name: 'E', value: 2},
    {name: 'Toyota', value: -50},
    {name: 'Honda', value: 20},
    {name: 'CC', value: 22},
    {name: 'DD', value: -80},
    {name: 'EE', value: 2},
];

  constructor() { }

  ngOnInit() {
    this.initVertChart();
  }

  public initVertChart() {
    this.element = this.chartContainer.nativeElement

    // create scales
    this.y = d3.scaleLinear() //d3.scale.linear() потому что по этой оси распологаются числа
      .domain(d3.extent(this.data, d => d.value).sort((a: number, b: number) => b - a)) // domain - это диапазон. extent - Returns the minimum and maximum value in the given iterable
      .range([0, this.height]) // данные накладываются на ось
      
    this.x = d3.scaleBand() // Так как по Y располагаются не какие-то количественные показатели, а названия команд, выполняющие роль подписей к столбикам, то надо применить функцию d3.scale.ordinal(): 
      .domain(this.data.map(d => d.name))
      .paddingInner(0.1)
      .range([0, this.width]) // Функция rangeRoundBands() принимает отрезок, на котором будут располагаться названия команд ([0, height]), а также коэффициент масштабирования столбиков - 0.1.

      // console.log(d3.extent(this.data, d => d.value).sort(function(a: number, b: number) {return b - a})); // сортирует ось У по убыванию
    
    // svg
    this.svg = d3.select(this.element).append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
    .append('g')
      .attr('class', 'bars')
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")") // сдвиг оси "вниз и вправо"
    // add bars
    this.svg.selectAll(".bar")
      .data(this.data)
      .enter().append("rect") 
      .attr("class", d => "bar bar--" + (d.value < 0 ? "negative" : "positive"))
      .attr("y", d => this.y(Math.max(0, d.value)))
      .attr("x", d => this.x(d.name))
      .attr("width", this.x.bandwidth()) // .attr("width", this.x.bandwidth())
      .attr("height", d => Math.abs(this.y(d.value) - this.y(0)))
      
    // xAxis ось х
    this.svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${this.y(0)})`) // двигаем ось х до у(0)
      .transition()
      .call(d3.axisBottom(this.x))
    // yAxis ось у
    this.svg.append('g')
      .attr('class', 'axis axis-y')
      .attr("transform", "translate(0,0)") //.attr("transform", "translate(" + x(0) + ",0)")
      .transition()
      .call(d3.axisLeft(this.y))

    // A label for the bar.
    console.log();
    
    this.svg.selectAll('rect')
      .data(this.data)
      .enter()
      .append("text")
    // Add the text attributes
    // this.textLabels = this.text
    //   .attr("x", function(d) { return d.value; })
    //   .attr("y", function(d) { return d.value; })
    //   .text( function (d) { return d.name })
    //   .attr("font-family", "sans-serif")
    //   .attr("font-size", "20px")
    //   .attr("fill", "red");

  }
}
