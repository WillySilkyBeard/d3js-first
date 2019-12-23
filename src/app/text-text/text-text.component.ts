import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-text-text',
  templateUrl: './text-text.component.html',
  styleUrls: ['./text-text.component.css']
})
// export class TextTextComponent implements OnInit {

//   @ViewChild('chart', {static: true}) private chartContainer: ElementRef;
export class TextTextComponent implements OnInit, OnChanges {
  @ViewChild('chart', {static: true}) private chartContainer: ElementRef;

  private dataForBarChart: Array<any>;
  private dataForGraphChart: Array<any>;

  private margin: any = { top: 20, bottom: 20, left: 50, right: 50 };
  private chart: any;

  private graph: any;

  private width: number;
  private height: number;
  private xScale: any;

  private xScaleLineGraph: any;

  private yScaleForBarChart: any;
  private yScaleForGraphChart: any;

  private colors: any;
  private xAxis: any;
  private xAxisTop: any;
  private xAxisVertical: any;
  private xAxisMiddle: any;
  private xAxisBottom: any;
  private yAxisLeft: any;
  private yAxisRight: any;

  private element: any;
  private svg: any;

  private barsLabels: any;

  private xDomain: any;
  private yDomainBars: any;
  private yDomainGraph: any;

  constructor() { }

  buildDayReport() {
    let hour: number = 6;
    this.dataForBarChart = [];
    for (let i = 0; i < 24; i++) {
      if (hour > 23) {
        hour = 0;
      }
      this.dataForBarChart.push([
        `${hour}`,
        Math.floor(Math.random() * 10000)
      ]);
      hour = hour + 1;

    }

    hour = 6;

    this.dataForGraphChart = [];
    for (let i = 0; i < 24; i++) {
      if (hour > 23) {
        hour = 0;
      }
      this.dataForGraphChart.push([
        `${hour}`,
        Math.floor(Math.random() * 100)
      ]);
      hour = hour + 1;
    }
    this.buildReport();
  }

  buildMonthReport() {
    let day: number = 1;
    this.dataForBarChart = [];
    for (let i = 0; i < 31; i++) {
      this.dataForBarChart.push([
        `${day}`,
        Math.floor(Math.random() * 10000)
      ]);
      day = day + 1;

    }

    day = 1;

    this.dataForGraphChart = [];
    for (let i = 0; i < 31; i++) {
      this.dataForGraphChart.push([
        `${day}`,
        Math.floor(Math.random() * 100)
      ]);
      day = day + 1;
    }

    this.buildReport();
  }

  setElementRefTest() {
    this.setElement(this.chartContainer.nativeElement);
  }

  setDataForBarChartTest() {
    let hour: number = 6;
    let dataForBarChart = [];
    for (let i = 0; i < 24; i++) {
      if (hour > 23) {
        hour = 0;
      }
      dataForBarChart.push([
        `${hour}`,
        Math.floor(Math.random() * 10000)
      ]);
      hour = hour + 1;

    }
    this.setDataForBarChart(dataForBarChart);
  }

  buildReport() {
    this.xDomain = this.dataForBarChart.map(d => d[0]);
    this.yDomainBars = [0, d3.max(this.dataForBarChart, d => d[1])];
    this.yDomainGraph = [0, d3.max(this.dataForGraphChart, d => d[1])];
    if (!this.element) {
      this.setElement(this.chartContainer.nativeElement);
      this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
      this.createXScale();
      this.createScaleYForBarChart();
      this.createXAxis();
      this.initBarChart();
      this.initGraphChart();
      this.createYAxisLeft();
      //this.createBarLabels();
      this.createYAxisRight();
      this.createDots();
    }

    this.updateChart();

  }

  ngOnInit() {


  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }
  }

  public setElement(element: ElementRef) {
    this.element = element;
    this.initChart();
    this.createSvg();
  }

  public createSvg() {
    this.svg = d3.select(this.element).append('svg')
      .attr('width', this.element.offsetWidth)
      .attr('height', this.element.offsetHeight);
  }

  public initChart() {
    this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.element.offsetHeight - this.margin.top - this.margin.bottom;
  }

  public initColors() {
    // bar colors
    this.colors = d3.scaleLinear().domain([0, this.dataForBarChart.length]).range(<any[]>['red', 'green']);
  }

  public initBarChart() {
    this.chart = this.svg.append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  }

  public createScaleYForBarChart() {
    this.yScaleForBarChart = d3.scaleLinear().domain(this.yDomainBars).range([this.height, 0]);
  }

  public initGraphChart() {
    this.xScaleLineGraph = d3.scalePoint().domain(this.xDomain).range([0 + this.margin.left / 2 + this.xScale.bandwidth() / 2, this.width - this.margin.right / 2]);
    this.yScaleForGraphChart = d3.scaleLinear().domain(this.yDomainGraph).range([this.height, 0]);
    this.graph = this.svg.append("path")
      .attr('class', 'graph')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  }

  public createScaleForGraphChart() {
    this.yScaleForGraphChart.domain([0, d3.max(this.dataForGraphChart, d => d[1]) + (d3.max(this.dataForGraphChart, d => d[1]) / 100 * 15)]);
  }

  createXAxis() {
    this.xAxis = this.svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));

  }

  createXAxisTop() {
    this.xAxisTop = this.svg.append('g')
    .attr('class', 'axis axis-x')
    .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    .call(d3.axisTop(this.xScale));
  }

  createXAxisVertical() {
    this.xAxisVertical = this.svg.append('g')
    .attr('class', 'axis axis-x top')
    .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    .call(d3.axisBottom(this.xScale).tickSize(this.height).tickFormat(d => ''));
  }

  createXAxisMiddle() {
    this.xAxisMiddle = this.svg.append('g')
      .attr('class', 'axis axis-x middle')
      .attr('transform', `translate(${this.margin.left}, ${(this.margin.top + this.height) / 2})`)
      .call(d3.axisBottom(this.xScale));
  }

  createXAxisBottom() {
    this.xAxisBottom = this.svg.append('g')
      .attr('class', 'axis axis-x bottom')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));
  }

  createXScale() {
    this.xScale = d3.scaleBand().padding(0.1).domain(this.xDomain).rangeRound([0, this.width]);
  }

  createYAxisLeft() {
    this.yAxisLeft = this.svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScaleForBarChart));
  }

  createBarLabels() {
    this.barsLabels = this.chart.selectAll('.bar').data(this.dataForBarChart).enter().append("text")
      .text(d => d3.format(",")(0))
      .attr("x", d => this.xScale(d[0]) + this.xScale.bandwidth() / 2)
      .attr("y", d => this.yScaleForBarChart(0) - 5)
      .attr("text-anchor", "middle");
  }

  createYAxisRight() {
    this.yAxisRight = this.svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.width + this.margin.right}, ${this.margin.top})`)
      .call(d3.axisRight(this.yScaleForGraphChart));
  }

  createDots() {
    this.svg.selectAll('.dot').data(this.dataForGraphChart)
      .enter().append("circle")
      .style("stroke", "black")
      .style("fill", "white")
      .attr("r", 3.5)
      .attr("cx", d => this.xScale(d[0]) + this.xScale.bandwidth() / 2)
      .attr("cy", this.yScaleForGraphChart(0))
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  }

  updateChart() {
    this.updateBarChart();
    this.updateGraphChart();
  }

  public updateBarChart() {
    this.xScale.domain(this.xDomain);
    this.yScaleForBarChart.domain([0, d3.max(this.dataForBarChart, d => d[1]) + (d3.max(this.dataForBarChart, d => d[1]) / 100 * 15)]);
    
    if(this.xAxisBottom) {
      this.xAxisTop.transition().duration(500).call(d3.axisTop(this.xScale));
      this.xAxisVertical.transition().duration(500).call(d3.axisBottom(this.xScale).tickSize(this.height).tickFormat(d => ''));
      //this.xAxisMiddle.transition().duration(500).call(d3.axisBottom(this.xScale));
      this.xAxisBottom.transition().duration(500).call(d3.axisBottom(this.xScale));
    } else {
      this.xAxis.transition().duration(500).call(d3.axisBottom(this.xScale));
    }
    this.yAxisLeft.transition().duration(500).call(d3.axisLeft(this.yScaleForBarChart));

    const updateChart = this.chart.selectAll('.bar')
      .data(this.dataForBarChart);

    const updateBarLabels = this.chart.selectAll('text')
      .data(this.dataForBarChart);

    // remove exiting bars
    updateChart.exit().remove();

    // update existing bars
    this.chart.selectAll('.bar').transition().duration(500)
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScaleForBarChart(d[1]))
      .attr('width', d => this.xScale.bandwidth())
      .attr('height', d => this.height - this.yScaleForBarChart(d[1]))
      .style('fill', "steelblue");

    updateBarLabels.exit().remove();

    // add new bars
    updateChart
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScaleForBarChart(0))
      .attr('width', this.xScale.bandwidth())
      .attr('height', 0)
      .style('fill', "steelblue")
      .transition()
      .duration(500)
      .delay((d, i) => i * 10)
      .attr('y', d => this.yScaleForBarChart(d[1]))
      .attr('height', d => this.height - this.yScaleForBarChart(d[1]));

    // add new bars label 
    updateChart.data(this.dataForBarChart).enter().append("text")
      .text(d => d3.format(",")(0))
      .attr("x", d => this.xScale(d[0]) + this.xScale.bandwidth() / 2)
      .attr("y", d => this.yScaleForBarChart(0) - 5)
      .attr("text-anchor", "middle");

    this.chart.selectAll('text').data(this.dataForBarChart)
      .transition().duration(500)
      .text(d => d3.format(",")(d[1]))
      .attr("x", d => this.xScale(d[0]) + this.xScale.bandwidth() / 2)
      .attr("y", d => this.yScaleForBarChart(d[1]) - 5);

  }

  public updateGraphChart() {
    this.yScaleForGraphChart.domain([0, d3.max(this.dataForGraphChart, d => d[1]) + (d3.max(this.dataForGraphChart, d => d[1]) / 100 * 15)]);
    this.yAxisRight.transition().call(d3.axisRight(this.yScaleForGraphChart));
    var path = this.svg.selectAll('.graph').datum(this.dataForGraphChart)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", d3.line()
        .x(d => this.xScale(d[0]) + this.xScale.bandwidth() / 2)//this.xScaleLineGraph(d[0]))
        .y(d => this.yScaleForGraphChart(d[1])));

    var dots = this.svg.selectAll('circle').data(this.dataForGraphChart)
      //.enter().append("circle")
      .style("stroke", "purple")
      .style("fill", "white")
      //.attr("class", "dot " + label)
      .attr("r", 3.5)
      .attr("cx", d => this.xScale(d[0]) + this.xScale.bandwidth() / 2)//this.xScaleLineGraph(d[0]))
      .attr("cy", d => this.yScaleForGraphChart(d[1]));

    path.exit().remove();
    dots.exit().remove()

  }

  public getChartContainer() {
    return this.chartContainer;
  }

  public setChartContainer(chartContainer: ElementRef) {
    this.chartContainer = chartContainer;
  }

  public setDataForBarChart(data: Array<any>) {
    this.dataForBarChart = data;
    this.xDomain = this.dataForBarChart.map(d => d[0]);
    this.yDomainBars = [0, d3.max(this.dataForBarChart, d => d[1])];

    this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
    if (!this.chart) {
      this.createXScale();
      this.createScaleYForBarChart();
      this.createXAxisVertical();
      this.createXAxisTop();
      this.createXAxisBottom();
      this.initBarChart();
      this.createYAxisLeft();
    }

    this.updateBarChart();
  }

  public setDataForGraphChart(data: Array<any>) {
    this.dataForGraphChart = data;
  }

  public setReportLabel(label: String) {
    this.svg.append("text")
      .attr("x", this.width / 2)
      .attr("y", 20)
      .attr("dy", ".35em")
      .text(label);
  }

}



// import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import * as d3 from 'd3';

// @Component({
//   selector: 'app-text-text',
//   templateUrl: './text-text.component.html',
//   styleUrls: ['./text-text.component.css']
// })
// export class TextTextComponent implements OnInit {

//   @ViewChild('chart', {static: true}) private chartContainer: ElementRef;

//   private svg: any;
//   private margin: any = {top: 20, right: 30, bottom: 40, left: 30};
//   private width = 560 - this.margin.left - this.margin.right;
//   private height = 200 - this.margin.top - this.margin.bottom;
//   private circles: any;
//   private text: any;
//   private textLabels: any;
//   private element: any;
//   private circleAttributes: any;
//   private circleData: Array<any> =  [
//     { "cx": 20, "cy": 20, "radius": 20, "color" : "green" },
//     { "cx": 70, "cy": 70, "radius": 20, "color" : "purple" }
//   ];


//   constructor() { }

//   ngOnInit() {
//     this.initChart();
//   }

//   public initChart() {
//     this.element = this.chartContainer.nativeElement

//     this.svg = d3.select(this.element).append("svg")
//     .attr('width', this.width + this.margin.left + this.margin.right)
//     .attr('height', this.height + this.margin.top + this.margin.bottom)
//     .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")") // сдвиг оси "вниз и вправо"

//     //Add circles to the svgContainer
//     this.circles = this.svg.selectAll("circle")
//       .data(this.circleData)
//       .enter()
//       .append("circle")
//     //Add the circle attributes
//     this.circleAttributes = this.circles
//       .attr("cx", function (d) { return d.cx; })
//       .attr("cy", function (d) { return d.cy; })
//       .attr("r", function (d) { return d.radius; })
//       .style("fill", function (d) { return d.color; })
//     //Add the SVG Text Element to the svgContainer
//     this.text = this.svg.selectAll("text")
//       .data(this.circleData)
//       .enter()
//       .append("text")

//     //Add the text attributes
//     // this.textLabels = this.text
//     //   .attr("x", function(d) { return d.cx; })
//     //   .attr("y", function(d) { return d.cy; })
//     //   .text( function (d) { return "( " + d.cx + ", " + d.cy +" )"; })
//     //   .attr("font-family", "sans-serif")
//     //   .attr("font-size", "20px")
//     //   .attr("fill", "red");
//   }
// }



