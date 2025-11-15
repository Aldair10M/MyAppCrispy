import { TestBed } from '@angular/core/testing';
import { RegisterChefPage } from './registerChef.page';

describe('RegisterChefPage', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterChefPage]
    }).compileComponents();

    const fixture = TestBed.createComponent(RegisterChefPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
