import { Injectable } from '@angular/core';
import { UserResponseI } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  setUser(user: UserResponseI | null): void {
    localStorage.setItem("USER", JSON.stringify(user));
  }

  getUser(): UserResponseI | null {
    return JSON.parse(localStorage.getItem("USER")!);
  }

}
