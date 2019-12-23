import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  @ViewChild('chart', {static: true}) private chartContainer: ElementRef;

  private element: any;
  private margin: any = {top: 40, right: 30, bottom: 40, left: 30};
  private width = 550 - this.margin.left - this.margin.right;
  private height = 300 - this.margin.top - this.margin.bottom;
  private x: any;
  private xTop: any;
  private xBottom: any;
  private zerroX: any;
  private y: any;
  private svg: any;
  private chart:any;
  private text: any;
  private textLabels: any;

  private maxValue: any;
  private minValue: any;

  private newArr: Array<any> = []
  private dFor:any

  private data: Array<any> = [
    {name: '1', value: -15},
    {name: '2', value: -20},
    {name: '3', value: 66},
    {name: '4', value: -108},
    {name: '5', value: 2},
    {name: '6', value: -50},
    {name: '7', value: 20},
    {name: '8', value: 22},
    {name: '9', value: -80},
    {name: '10', value: 2},
];

  constructor() { }

  ngOnInit() {
    this.initVertChart();
    console.log(this.getMaxValue(this.data));
    console.log(this.getMinValue(this.data));
    // console.log(this.data[1].value)
    
    
  }
  // getMAX
  public getMaxValue(data) {
    for(this.dFor of data) {
      this.newArr.push(this.dFor.value)
    }
    return Math.max(...this.newArr)
  }
  // getMIN
  public getMinValue(data) {
    for(this.dFor of data) {
      this.newArr.push(this.dFor.value)
    }
    return Math.min(...this.newArr)
  }

  // initChart
  public initVertChart() {
    this.element = this.chartContainer.nativeElement

    // create scales
    this.y = d3.scaleLinear() //d3.scale.linear() потому что по этой оси распологаются числа
      .domain(d3.extent(this.data, d => (d.value < 0) ? d.value+5 : d.value-5).sort((a: number, b: number) => b - a)) // domain - это диапазон. extent - Returns the minimum and maximum value in the given iterable
      .range([0, this.height]) // данные накладываются на ось
      
    this.x = d3.scaleBand() // Так как по Y располагаются не какие-то количественные показатели, а названия команд, выполняющие роль подписей к столбикам, то надо применить функцию d3.scale.ordinal(): 
      .domain(this.data.map(d => d.name)) // отметки по оси Х
      .paddingInner(0.02) // отступ между столбцами
      .range([0, this.width]) // Функция rangeRoundBands() принимает отрезок, на котором будут располагаться названия команд ([0, height]), а также коэффициент масштабирования столбиков - 0.1.

    this.zerroX = d3.scaleBand() // Так как по Y располагаются не какие-то количественные показатели, а названия команд, выполняющие роль подписей к столбикам, то надо применить функцию d3.scale.ordinal(): 
      .paddingInner(0.02) // отступ между столбцами
      .range([0, this.width]) // Функция rangeRoundBands() принимает отрезок, на котором будут располагаться названия команд ([0, height]), а также коэффициент масштабирования столбиков - 0.1.

      this.xTop = d3.scaleBand() // Так как по Y располагаются не какие-то количественные показатели, а названия команд, выполняющие роль подписей к столбикам, то надо применить функцию d3.scale.ordinal(): 
      .domain(this.data.map(d => d.name)) // отметки по оси Х
      .paddingOuter(1) // отступ между столбцами
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
      .attr('class', 'axis axis-zerro-x')
      .attr('transform', `translate(0, ${this.y(0)})`) // двигаем ось х до у(0)
      .transition()
      .call(d3.axisBottom(this.zerroX).tickSizeOuter(0)) // tickSizeOuter(0) убираем закорючку на оси
    // yAxis ось у
    // this.svg.append('g')
    //   .attr('class', 'axis axis-y')
    //   .attr("transform", "translate(0,0)") //.attr("transform", "translate(" + x(0) + ",0)")
    //   .transition()
    //   .call(d3.axisLeft(this.y))
    // TopAxis
    this.svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${this.y(this.getMaxValue(this.data))})`) // двигаем ось х до у(0)
      .transition()
      .call(d3.axisTop(this.x))
    // BottomAxis
    this.svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${this.y(this.getMinValue(this.data))})`) // двигаем ось х до у(0)
      .transition()
      .call(d3.axisBottom(this.x))
    
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
