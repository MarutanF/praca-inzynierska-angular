import { TestBed } from '@angular/core/testing';

import { NBPPeriodService } from './nbp-period.service';

describe('NBPPeriodService', () => {
  let periodSerivce: NBPPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NBPPeriodService]
    });
    periodSerivce = TestBed.get(NBPPeriodService);
  });

  it('should be created', () => {
    expect(periodSerivce).toBeTruthy();
  });

  it('func getEndDate should return today day', () => {
    expect(periodSerivce.getEndDate()).toBe('2019-12-29');
  });

  it('func getDatesBetween should return array of dates', () => {
    expect(periodSerivce.getDatesBetween('2019-01-01', '2019-01-03')).toEqual(['2019-01-01', '2019-01-02', '2019-01-03']);
    expect(periodSerivce.getDatesBetween('2019-01-31', '2019-02-02')).toEqual(['2019-01-31', '2019-02-01', '2019-02-02']);
  });

  it('func plusOneDay should add one day to given date', () => {
    expect(periodSerivce.plusOneDay('2019-12-29')).toBe('2019-12-30');
    expect(periodSerivce.plusOneDay('2019-12-31')).toBe('2020-01-01');
    expect(periodSerivce.plusOneDay('2019-04-30')).toBe('2019-05-01');
    expect(periodSerivce.plusOneDay('2019-04-30')).not.toBe('2019-04-31');
  });

  it('func getStartDate should return diffrent result for diffrent periods', () => {
    let periodList = periodSerivce.getPeriodsList();
    expect(periodSerivce.getStartDate(periodList[0])).toEqual('2019-12-22');
    expect(periodSerivce.getStartDate(periodList[1])).toEqual('2019-11-29');
    expect(periodSerivce.getStartDate(periodList[2])).toEqual('2019-06-29');
    expect(periodSerivce.getStartDate(periodList[3])).toEqual('2018-12-29');
    expect(periodSerivce.getStartDate(periodList[4])).toEqual('2014-12-29');
    expect(periodSerivce.getStartDate(periodList[5])).toEqual('2001-01-02');
  });

});
