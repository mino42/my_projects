import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {AdatbMuveletekService} from '../szervizek/adatb-muveletek.service';
import { Router } from '@angular/router';
import { Felhasznalo } from '../app.component';

@Component({
  selector: 'app-bejelentkezes',
  templateUrl: './bejelentkezes.component.html',
  styleUrls: ['./bejelentkezes.component.css']
})
export class BejelentkezesComponent {
  constructor(private adatb_szerviz:AdatbMuveletekService,private router:Router){};

  email=new FormControl('',[Validators.required,Validators.email]);
  jelszo=new FormControl('',[Validators.required]);
  bejelent(){
    if(this.email.valid && this.jelszo.valid){
      this.adatb_szerviz.login(this.email.value+'',this.jelszo.value+'').then(async (cred)=>{        
        let asd = cred.user?cred.user:{'uid':''};
        
        let adatok = await this.adatb_szerviz.felhAdatokLekerdez(asd.uid) as Felhasznalo;
        localStorage.setItem('user',JSON.stringify(adatok));
        //this.router.navigateByUrl("/edzes");
        //location.reload();
      }).catch(()=>{
        return;
      });
    }
  }
}
