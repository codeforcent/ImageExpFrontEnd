import { Component, OnInit, ViewChild } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
  @ViewChild('tabMenu') menu;
  items: MenuItem[];

  constructor() {
    console.warn("menu", this.menu);
   }

  ngOnInit(): void {
    this.items = [
      {
          label: 'Edit profile',
          icon: 'pi pi-pw pi-user-edit',
          routerLink: ['/settings/user-profile']
      },
      {
          label: 'Change password',
          icon: 'pi pi-pw pi-lock',
          routerLink: ['/settings/change-password']
      }
    ]


  }

}
