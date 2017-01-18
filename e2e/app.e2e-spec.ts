import { NrkAppPage } from './app.po';

describe('nrk-app App', function() {
  let page: NrkAppPage;

  beforeEach(() => {
    page = new NrkAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
