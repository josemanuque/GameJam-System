import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-password-settings',
  standalone: true,
  imports: [FormsModule, RouterModule, MatFormFieldModule],
  templateUrl: './password-settings.component.html',
  styleUrl: './password-settings.component.scss'
})
export class PasswordSettingsComponent {
  ngOnInit(): void {
    console.log("Prueba");
  }
}
