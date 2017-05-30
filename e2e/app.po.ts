import { browser, by, element } from 'protractor';

export class AnandayPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('and-root h1')).getText();
  }
}
