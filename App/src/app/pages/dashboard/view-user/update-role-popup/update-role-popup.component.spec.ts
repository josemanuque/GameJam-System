import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRolePopupComponent } from './update-role-popup.component';

describe('UpdateRolePopupComponent', () => {
  let component: UpdateRolePopupComponent;
  let fixture: ComponentFixture<UpdateRolePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRolePopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateRolePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
