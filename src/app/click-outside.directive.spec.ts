import { ClickOutsideDirective } from './click-outside.directive';
let elRefMock = {
  nativeElement: document.createElement('div')
};
describe('ClickOutsideDirective', () => {
  it('should create an instance', () => {
    const directive = new ClickOutsideDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});
