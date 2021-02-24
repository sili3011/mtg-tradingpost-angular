import { Injectable, OnInit } from '@angular/core';
import { observable } from 'mobx';

@Injectable({
  providedIn: 'root',
})
export class UserStore implements OnInit {
  @observable owner: string = '';

  ngOnInit(): void {}
}
