import { TestBed } from '@angular/core/testing';
import { PanelPage } from './panel.page';

describe('PanelPage', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [PanelPage]
    }).compileComponents();

    const fixture = TestBed.createComponent(PanelPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
