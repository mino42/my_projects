import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  @Input() oldal:any = 'bejelentkezes';
  @Input() felhasznalo:any = null;
  @Output() valasztott_oldal: EventEmitter<any> = new EventEmitter();
  constructor(){
    console.log('menu: '+this.oldal);;
  }
  valaszt(asd:any){
    console.log(asd);
    this.valasztott_oldal.emit(asd);
    console.log('menu: '+this.oldal);
  }
  
}
