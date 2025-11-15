import { TestBed } from '@angular/core/testing';
import { ChefPage } from './chef.page';

describe('ChefPage', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [ChefPage]
    }).compileComponents();

    const fixture = TestBed.createComponent(ChefPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
