import { Component, OnInit } from '@angular/core';
import {nap, Felhasznalo, rutin} from '../app.component'
import {MatDatepickerModule} from '@angular/material/datepicker';
import { AdatbMuveletekService } from '../szervizek/adatb-muveletek.service';

@Component({
  selector: 'app-naptar',
  templateUrl: './naptar.component.html',
  styleUrls: ['./naptar.component.css']
})
export class NaptarComponent implements OnInit {
  date_to_string(asd:any){return asd.toISOString().slice(0, 10);}

  ma_str:any=new Date().toISOString().slice(0, 10);
  ma=new Date();
  
  kezdeti_datum_str:any=new Date();

  kivalasztott_datum:any=new Date();
  honapok=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  ho_utso_napja(honap:any){return new Date(this.ma.getFullYear(),honap,0).getDate();}
  
  honap_left_pos=0;
  napok=Array<Datumnap>();
  

  constructor(private adatb_szerviz:AdatbMuveletekService){
    //console.log(this.date_to_string(this.ma));
    
  }

	felhasznalo:Felhasznalo=new Felhasznalo();
	rutinjaim=Array<rutin>();
	napjaim=Array<nap>();
  ngOnInit(){
    this.felhasznalo=JSON.parse(localStorage.getItem('user')+'');
    this.rutinjaim=this.felhasznalo.rutinok;
    this.napjaim=this.felhasznalo.napok;
    this.kezdeti_datum_str=new Date(this.felhasznalo.kezdeti_datum.slice(0, 10));
    this.kivalsztott_honap_napok_generalasa(this.kezdeti_datum_str.getMonth()+1);
    console.log('felh_kezdeti: '+this.felhasznalo.kezdeti_datum)
  }

  kivalsztott_honap_napok_generalasa(honap:any){
    //console.log('general erre: '+honap);
    this.napok=Array<Datumnap>();
    
    let kezdeti_datum:any=this.kezdeti_datum_str;
    //console.log('kezdefi: '+kezdeti_datum);
    let kijelolt_ho_eslo_napja_minusz_kezdeti:any = new Date(this.kivalasztott_datum.getFullYear(),this.kivalasztott_datum.getMonth(),1);
    kijelolt_ho_eslo_napja_minusz_kezdeti=kijelolt_ho_eslo_napja_minusz_kezdeti-kezdeti_datum;
    let napok =kijelolt_ho_eslo_napja_minusz_kezdeti/ (1000 * 60 * 60 * 24);//hány nap telt el az első edzés és a kiválasztott jónap első napja között
    
    let nap_index=Math.round(napok%this.napjaim.length);//melyik edzős nappal kezdődne a hónapom
    console.log(napok+' % '+this.napjaim.length);
    if(nap_index<0) nap_index=0;
    console.log('napi: '+nap_index);
    //console.log('nap_index: '+nap_index);
    //console.log(napjaim);
    for(let i = 1; i<=this.ho_utso_napja(honap);i++){
      this.napok.push(new Datumnap());
      this.napok[this.napok.length-1].nap=i;//(i+'').length<2?'0'+i:i;
      if(kezdeti_datum>new Date(this.kivalasztott_datum.getFullYear(),this.kivalasztott_datum.getMonth(),i)) continue;
      
      console.log('napindex: '+nap_index);
      console.log('leng: '+this.napjaim.length);

      for(let rutin of this.napjaim[nap_index].rutinok)
        this.napok[this.napok.length-1].rutinok.push(rutin)
      nap_index++;
      if(nap_index==this.napjaim.length) nap_index=0;

      //console.log(napok);
    }
  }


  ev_lep(merre:any){
    if(merre=='+') this.kivalasztott_datum=new Date(this.kivalasztott_datum.getFullYear()+1,this.kivalasztott_datum.getMonth(),this.kivalasztott_datum.getDate());
    else this.kivalasztott_datum=new Date(this.kivalasztott_datum.getFullYear()-1,this.kivalasztott_datum.getMonth(),this.kivalasztott_datum.getDate());
    this.kivalsztott_honap_napok_generalasa(this.kivalasztott_datum.getMonth()+1);
  }

  honap_allit(honap:any){
    console.log("allit: "+honap);
    this.kivalasztott_datum=new Date(this.kivalasztott_datum.getFullYear(),honap,this.kivalasztott_datum.getDate());
    this.kivalsztott_honap_napok_generalasa(this.kivalasztott_datum.getMonth()+1);
  }
  nyitott_nap=-1;
  nap_katt(nap:any){
    //console.log(this.napok[nap-1].rutinok);
    this.nyitott_nap=nap-1;
    this.kivalasztott_datum.setDate(nap);
  }

  katt_dv_katt(){
    this.nyitott_nap=-1;
  }
  ujratolt(){/*azért a nem materialos pickerrel jobb volt, ott nem kellett settimeout*/
    setTimeout(() => {
      this.honap_allit(this.kivalasztott_datum.getMonth());
      this.felhasznalo.kezdeti_datum=this.date_to_string(this.kezdeti_datum_str);
      this.adatb_szerviz.update(this.felhasznalo);
    }, 50);
    console.log(this.kezdeti_datum_str)

    

    //console.log(this.kivalasztott_datum.getMonth());
  }
}

class Datumnap{
  nap:any=0;
  rutinok=Array<any>();
}
