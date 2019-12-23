import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-text-text',
  templateUrl: './text-text.component.html',
  styleUrls: ['./text-text.component.css']
})
export class TextTextComponent implements OnInit {

  @ViewChild('chart', {static: true}) private chartContainer: ElementRef;

  private svg: any;
  private margin: any = {top: 20, right: 30, bottom: 40, left: 30};
  private width = 560 - this.margin.left - this.margin.right;
  private height = 500 - this.margin.top - this.margin.bottom;
  private circles: any;
  private element: any;
  private circleAttributes: any;
  private circleData: Array<any> =  [
    { "cx": 20, "cy": 20, "radius": 20, "color" : "green" },
    { "cx": 70, "cy": 70, "radius": 20, "color" : "purple" }
  ];


  constructor() { }

  ngOnInit() {
    this.initChart();
  }

  public initChart() {
    this.element = this.chartContainer.nativeElement

    this.svg = d3.select(".svg").append("svg")
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.bottom)
    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")") // сдвиг оси "вниз и вправо"

    //Add circles to the svgContainer
    this.circles = this.svg.selectAll("circle")
      .data(this.circleData)
      .enter()
      .append("circle")
    //Add the circle attributes
    this.circleAttributes = this.circles
      .attr("cx", function (d) { return d.cx; })
      .attr("cy", function (d) { return d.cy; })
      .attr("r", function (d) { return d.radius; })
      .style("fill", function (d) { return d.color; })
  }
}
