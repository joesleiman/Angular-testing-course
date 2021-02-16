import {CalculatorService} from './calculator.service';
import {LoggerService} from './logger.service';
import {TestBed} from '@angular/core/testing';

describe('CalculatorService', () => {
  let calculator: CalculatorService;
  let logger: any; //spyObj doesn't have type
  beforeEach(() => {
    logger = jasmine.createSpyObj('LoggerService', ['log']);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {provide: LoggerService, useValue: logger}
      ]
    });
    calculator = TestBed.get(CalculatorService);
  });
  xit('should add two numbers', () => {
    const result = calculator.add(2, 4);
    expect(result).toBe(6);
    expect(logger.log).toHaveBeenCalledTimes(1);
  });

  xit('should subtract two numbers', () => {
    const result = calculator.subtract(2, 4);
    expect(result).toBe(-2, 'unexpected subtraction result');
  });
});
