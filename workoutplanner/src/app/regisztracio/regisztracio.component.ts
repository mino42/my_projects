import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, Validators } from '@angular/forms';
import {AdatbMuveletekService} from '../szervizek/adatb-muveletek.service';
import { Router, Route } from '@angular/router';
import {Felhasznalo,nap,rutin} from '../app.component';

@Component({
  selector: 'app-regisztracio',
  templateUrl: './regisztracio.component.html',
  styleUrls: ['./regisztracio.component.css']
})
export class RegisztracioComponent implements OnInit{
  constructor(private adatb_szerviz:AdatbMuveletekService,private router: Router){}
  email=new FormControl('',[Validators.required,Validators.email]);
  jelszo=new FormControl('',[Validators.required]);
  jelszo_ujra= new FormControl('',[Validators.required]);
  regi(){
	return;
    if(this.email.valid && this.jelszo.valid && this.jelszo.value==this.jelszo_ujra.value){
      this.adatb_szerviz.regi(this.email.value+'',this.jelszo.value+'').then(async (asd)=>{
        let felh:Felhasznalo={
          id: asd.user?.uid as string,
          email: this.email.value as string,
          kezdeti_datum:new Date().toISOString().slice(0, 10),
          rutinok: Array<rutin>(),
          napok:[new nap([])]
        };
        this.adatb_szerviz.ujFelh(felh).then(async ()=>{
          let adatok = await this.adatb_szerviz.felhAdatokLekerdez(felh.id) as Felhasznalo;
          localStorage.setItem('user',JSON.stringify(adatok));
          window.location.reload();
          this.router.navigateByUrl("/edzes");
        }).catch((err)=>console.log(err));;
        
      }).catch(err=>{
        //console.log('rossz jelszó');
        alert('Nem elég hosszú jelszó, vagy foglalt email cím');
        return;
      });
    }
  }
  ngOnInit(){
    let asd = localStorage.getItem('user');
    if(asd) this.router.navigateByUrl("/edzes");
  }
}
