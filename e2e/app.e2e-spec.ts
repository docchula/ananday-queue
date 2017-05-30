import { AnandayPage } from './app.po';

describe('ananday App', () => {
  let page: AnandayPage;

  beforeEach(() => {
    page = new AnandayPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('and works!');
  });
});
