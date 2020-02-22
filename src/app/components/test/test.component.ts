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
  private margin: any = {top: 50, right: 10, bottom: 50, left: 10};
  private padding: number = 5;
  private CHART_WIDTH: number = 1110;
  private CHART_HEIGHT : number = 300;
  private width = this.CHART_WIDTH - 2*(this.margin.left + this.margin.right);
  private height = this.CHART_HEIGHT  - 2*(this.margin.top - this.margin.bottom);
  private x: any;
  private xTop: any;
  private xBottom: any;
  private zerroX: any;
  private y: any;
  private svg: any;
  private chart:any;
  private text: any;
  private textLabels: any;

  private bars: any;

  private maxValue: any;
  private minValue: any;

  private newArr: Array<any> = []
  private dFor:any
  private iFor:any

  private interval:any = 365;
  private data: Array<any> = [
];

  
  constructor() { }

  ngOnInit() {
    this.pushToArray(this.interval) // наполняем наш array данными
    this.initVertChart() // инициализация графика
  }

  // тестирую, обновляем данные
  onUpdate() {
    this.redraw() // наполняем наш array данными

    console.log('updated');
    console.log(this.data);
    
    
  }

  // наполняем массив рандомными данными
  public pushToArray(numb) {
    
    for (this.iFor = 1; this.iFor < numb; this.iFor++) {
      this.data.push({name: this.iFor, value: this.getRandomIntInclusive(-20,50)})
    }
    return this.data
  }

  // функция получения рандомных значений
  public getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
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
      .nice() // ??? Функция nice() позволяет расширить начало и конец входного домена до ближайших округленных значений.
      
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
      .attr('height', this.height + this.margin.top + this.margin.bottom + this.padding)
    .append('g')
      .attr('class', 'bars')
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")") // сдвиг оси "вниз и вправо"
    // add bars
    
    this.bars  = this.svg.selectAll(".bar")
      .data(this.data)
      .enter().append("rect")
      .attr("class", d => "bar bar--" + (d.value < 0 ? "negative" : "positive"))
      .attr("y", d => this.y(Math.max(0, d.value)))
      .attr("x", d => this.x(d.name))
      .attr('fill', function(d, i) { return 'hsl(240,50%,'+(75-d.value/2)+'%)'; }) // не работает когда прописаны стили
      .attr("width", this.x.bandwidth()) // .attr("width", this.x.bandwidth())
      .attr("height", d => Math.abs(this.y(d.value) - this.y(0)))

    // обработка событий
    // mouseenter
    this.bars
    .on('mouseenter', function(d) {
      d3.select(this)  // Выберем элемент, на который наведена мышь
        .transition()  // Начинаем анимацию
        .duration(300) // Длительность анимации
        .attr('transform', function(d:any) { // изменяем свойство

          if(d.value > 0) {
            return `translate(${0}, ${-10})`;
          } else {
            return `translate(${0}, ${10})`;
          }
        })
      ;
    })
    // mouseleave
    this.bars
    .on('mouseleave', function(d) {
      d3.select(this)  // Выберем элемент, на который наведена мышь
        .transition()  // Начинаем анимацию
        .duration(300) // Длительность анимации
        .attr('transform', function(d) { // изменяем свойство
          
          return `translate(${0}, ${0})`;
        })
      ;
    }) 

    this.bars.on('click', function(d, i) { alert(d.value) })

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
      .call(d3.axisTop(this.x).tickValues(this.x.domain().filter(function(d,i){ return !(i%7)})))
    // BottomAxis
    this.svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0, ${this.y(this.getMinValue(this.data))})`) // двигаем ось х до у(0)
      .transition()
      .call(d3.axisBottom(this.x).tickValues(this.x.domain().filter(function(d,i){ return !(i%7)}))) // фильтр тиков оси Х .tickValues(this.x.domain().filter(function(d,i){ return !(i%30)}))
    
    this.svg.selectAll('rect')
      .data(this.data)
      .enter()
      .append("text")
  }

  // функция обновления данных
  public redraw() {
    this.data = []
    this.pushToArray(this.interval)
    // Update…
    this.bars
      .data(this.data)
      .transition()
      .duration(1000)
      .attr("class", d => "bar bar--" + (d.value < 0 ? "negative" : "positive"))
      .attr("y", d => this.y(Math.max(0, d.value)))
      .attr("height", d => Math.abs(this.y(d.value) - this.y(0)))

      console.log('redrawed');
  }
}