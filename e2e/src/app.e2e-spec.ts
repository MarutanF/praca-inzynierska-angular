import { AppPage } from './app.po';
import { browser, logging, element, by } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  // it('example test', () => {
  //   page.navigateTo();
  //   expect(page.getTitleText()).toEqual('PracaInzynierskaAngular');
  // });

  it('should display title element in login page', () => {
    browser.get('http://localhost:4200/login');
    let title = element(by.xpath('//h3[text()="Logowanie"]'));
    expect(title.isPresent()).toBe(true);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
