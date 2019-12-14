import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegativeVerticalChartComponent } from './negative-vertical-chart.component';

describe('NegativeVerticalChartComponent', () => {
  let component: NegativeVerticalChartComponent;
  let fixture: ComponentFixture<NegativeVerticalChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegativeVerticalChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegativeVerticalChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
