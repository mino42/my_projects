import { Component, OnInit } from '@angular/core';
import {AdatbMuveletekService} from '../szervizek/adatb-muveletek.service';
import { Felhasznalo } from '../app.component';
import {MatCardModule} from '@angular/material/card'; 

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  constructor(private adatb_szerviz:AdatbMuveletekService){
  }
  felhasznalok:Array<Felhasznalo>=new Array<Felhasznalo>();
  no_lab:Array<Felhasznalo>=new Array<Felhasznalo>();
  ngOnInit(){
    this.adatb_szerviz.minden_felh().subscribe((adat: any)=>{
      this.felhasznalok=adat;
    });
    this.adatb_szerviz.minden_felh_no_lab().subscribe((adat: any)=>{
      this.no_lab=adat;
      //console.log('nolab');
      //console.log(adat);
    });
  }
}
