import { AppPage } from './app.po';
import { browser, logging, element, by } from 'protractor';

describe('e2e test for praca-inzynierska-angular', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  // it('example test', () => {
  //   page.navigateTo();
  //   expect(page.getTitleText()).toEqual('PracaInzynierskaAngular');
  // });

  it('when navigated to URL address, should load corresponding page', () => {
    let pageTitle;

    browser.get('http://localhost:4200/rates');
    pageTitle = element(by.xpath('//h3[text()="Kursy walut"]'));
    expect(pageTitle.isPresent()).toBe(true);

    browser.get('http://localhost:4200/calculator');
    pageTitle = element(by.xpath('//h3[text()="Kalkulator"]'));
    expect(pageTitle.isPresent()).toBe(true);

    browser.get('http://localhost:4200/login');
    pageTitle = element(by.xpath('//h3[text()="Logowanie"]'));
    expect(pageTitle.isPresent()).toBe(true);

  });

  it('rates page should have dropdown, chart and buttons', () => {
    browser.get('http://localhost:4200/rates');
    let dropdown = element(by.css('.ng-select'));
    expect(dropdown.isPresent()).toBe(true);
    let chart = element(by.css('#ratesChart'));
    expect(chart.isPresent()).toBe(true);
    let buttons = element(by.css('#periodList'));
    expect(buttons.isPresent()).toBe(true);
  });

  it('when given right credensials, should be able to log in', async () => {
    browser.get('http://localhost:4200/login');
    let email = element(by.id('email'));
    email.sendKeys('test@test.pl');
    let password = element(by.id('password'));
    password.sendKeys('123456');
    element(by.buttonText('Zaloguj się')).click();
    await browser.sleep(2000);
    expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/user');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    // const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    // expect(logs).not.toContain(jasmine.objectContaining({
    //   level: logging.Level.SEVERE,
    // } as logging.Entry));
  });
});
