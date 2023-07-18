import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {AdatbMuveletekService} from './szervizek/adatb-muveletek.service';
import { ReCaptchaEnterpriseProvider } from '@angular/fire/app-check/firebase';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit,OnInit {
  constructor(private router: Router,private adatb_szerviz:AdatbMuveletekService){}
  felhasznalo:any;

  melyik_menu(){
    setTimeout(() => {
      if(this.router.url=='') setTimeout(() => {this.melyik_menu();return;}, 10);
      if(this.router.url=='/') {
        if(!this.felhasznalo)
          this.oldal_valt("bejelentkezes");
        else this.oldal_valt("edzes");
          return;
      }
      if(this.felhasznalo && this.router.url.substr(1)!='edzes')
        this.oldal_valt("edzes");
      else this.oldal=this.router.url.substr(1);
    }, 10);
  }

  ngOnInit():void{
    this.adatb_szerviz.bejelentkezve().subscribe(async (user: any)=>{
      if(!user) {this.melyik_menu();return;}
      console.log(user);
      let adatok = await this.adatb_szerviz.felhAdatokLekerdez(user.uid) as Felhasznalo;
      felhasznalo=adatok;
      this.felhasznalo=felhasznalo;//a html miatt 
      console.log(felhasznalo);
      this.melyik_menu();
    });
  }

  title = 'edzes_koveto';
  oldal='';//==''?'bejelentkezes':this.router.url
  oldal_valt(ujoldal: any) {
    // this.page = selectedPage;
    //oldalak=
    this.router.navigateByUrl(ujoldal);
    this.oldal=ujoldal;
  }

  ngAfterViewInit() :void{
    //this.oldal=this.router.url.substr(1);
    //console.log(this.router.url.substr(1));
  }
  kijelentkezes(){
      this.adatb_szerviz.kijelentkezes().then(()=>{
        //this.router.navigateByUrl("/bejelentkezes");
        window.location.reload();
        this.router.navigateByUrl("/bejelentkezes");
      });
  }
}

export class Felhasznalo{
  id:string='';
  email:string='';
  kezdeti_datum:string=''
  rutinok:Array<rutin>=[];
  napok:Array<nap>=[];
}

export class AdatbFelhasznalo{
  id:string='';
  email:string='';
  kezdeti_datum:string=''
  rutinok:string='';
  napok:string='';
}

export var felhasznalo:Felhasznalo=new Felhasznalo();

export class nap{
  rutinok:Array<string>=[];
  constructor(asd:Array<string>){
    this.rutinok=asd;
  }
}

export class rutin{
  nev:string='';
  gyakorlatok:Array<string>=[];
  constructor(nev:string, gyakorlatok:Array<string>){
      this.nev=nev;
      this.gyakorlatok=gyakorlatok;
  }
}




