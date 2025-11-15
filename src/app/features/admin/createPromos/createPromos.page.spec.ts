import { TestBed } from '@angular/core/testing';
import { CreatePromosPage } from './createPromos.page';

describe('CreatePromosPage', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePromosPage]
    }).compileComponents();

    const fixture = TestBed.createComponent(CreatePromosPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
