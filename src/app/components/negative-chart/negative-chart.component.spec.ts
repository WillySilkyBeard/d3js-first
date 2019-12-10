import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NegativeChartComponent } from './negative-chart.component';

describe('NegativeChartComponent', () => {
  let component: NegativeChartComponent;
  let fixture: ComponentFixture<NegativeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NegativeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NegativeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
