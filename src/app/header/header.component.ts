import { Component, OnInit } from '@angular/core';
import { ClickOutsideDirective } from '../click-outside.directive';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  clicked = false;
  constructor() { }

  ngOnInit(): void {
  }

}
