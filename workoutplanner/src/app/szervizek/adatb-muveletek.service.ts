import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import { Felhasznalo,felhasznalo,AdatbFelhasznalo } from '../app.component';
import { getFirestore, doc, getDoc, collection } from '@angular/fire/firestore';
import { ObserversModule } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root'
})
export class AdatbMuveletekService {
  db=getFirestore();
  constructor(private auth:AngularFireAuth, private afs: AngularFirestore) { }

  login(email:string, jelszo:string) {
    return this.auth.signInWithEmailAndPassword(email,jelszo);
  }
  regi(email:string,jelszo:string){ 
    return this.auth.createUserWithEmailAndPassword(email, jelszo);
  }
  kijelentkezes(){
    localStorage.removeItem('user');
    return this.auth.signOut();
  }
  bejelentkezve(){
    return this.auth.user;
  }

  ujFelh(felh:Felhasznalo){
    let felh2:AdatbFelhasznalo={
      id: felh.id as string,
      email: felh.email as string,
      kezdeti_datum:felh.kezdeti_datum,
      rutinok: JSON.stringify(felh.rutinok),
      napok:JSON.stringify(felh.napok)
    };
    return this.afs.collection<AdatbFelhasznalo>('Users3').doc(felh.id).set(felh2);
  }
  async felhAdatokLekerdez(felh_id:string){
    //this.afs.collection<Felhasznalo>('Users2').get(); 
    let asd =doc(this.db,'Users3',felh_id);
    //console.log(felh_id);
    let asdasd= (await getDoc(asd)).data() as AdatbFelhasznalo;
    if(!asdasd) return '';
    let felh:Felhasznalo={
      id:asdasd.id,
      email:asdasd.email,
      kezdeti_datum:asdasd.kezdeti_datum,
      napok:JSON.parse(asdasd.napok),
      rutinok:JSON.parse(asdasd.rutinok)
    }
    localStorage.setItem('user',JSON.stringify(felh));
    return felh;
  }
  /*felhAdatokLekerdez(felh_id:string){
    //this.afs.collection<Felhasznalo>('Users2').get(); 
    return this.afs.collection<Felhasznalo>('User2').doc(felh_id).valueChanges();
  }*/
  update(felh:Felhasznalo){
    return;
    let felh2:AdatbFelhasznalo={
      id: felh.id as string,
      email: felh.email as string,
      kezdeti_datum:felh.kezdeti_datum,
      rutinok: JSON.stringify(felh.rutinok),
      napok:JSON.stringify(felh.napok)
    };
    //console.log('regi: '+JSON.stringify(felh.napok));
    //console.log('uj: '+felh2.napok);
    //console.log('updated: ');
    //console.log(felh);
    this.afs.collection<AdatbFelhasznalo>('Users3').doc(felh.id).set(felh2).then(()=>{
      localStorage.setItem('user',JSON.stringify(felh));
    }).catch((err)=>console.log(err));
  }
  minden_felh(){
    let felh = JSON.parse(localStorage.getItem('user')+'');
    return this.afs.collection<Felhasznalo>('Users3',ref=>ref.where('email','!=',felh.email).orderBy('email')).valueChanges();
  }
  minden_felh_no_lab(){
    //return this.afs.collection<Felhasznalo>('Users3',ref=>ref.where('napok', '>=','láb').where('napok', '<=','láb~')).valueChanges();
    return this.afs.collection<Felhasznalo>('Users3', ref=>ref.where('napok','==','[{"rutinok":[]}]')).valueChanges();
  }
}

