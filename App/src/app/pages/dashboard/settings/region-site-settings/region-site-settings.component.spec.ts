import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionSiteSettingsComponent } from './region-site-settings.component';

describe('RegionSiteSettingsComponent', () => {
  let component: RegionSiteSettingsComponent;
  let fixture: ComponentFixture<RegionSiteSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegionSiteSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegionSiteSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
