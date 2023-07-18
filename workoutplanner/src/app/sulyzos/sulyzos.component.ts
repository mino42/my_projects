import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {nap, Felhasznalo, rutin} from '../app.component';
import {AdatbMuveletekService} from '../szervizek/adatb-muveletek.service';

@Component({
  selector: 'app-sulyzos',
  templateUrl: './sulyzos.component.html',
  styleUrls: ['./sulyzos.component.css']
})
export class SulyzosComponent implements OnInit, AfterViewInit{
	@ViewChild('rutinjaim_dv') rutinjaim_dv: ElementRef | undefined;
	
	constructor(private adatb_szerviz:AdatbMuveletekService){
	}
	cucc='';
	felhasznalo:Felhasznalo=new Felhasznalo();
	rutinjaim=Array<rutin>();
	napjaim=Array<nap>();
	/*rutinjaim:any=[
		
	];
	napjaim:any=[
		{rutinok:[]}
	]*/
	ngOnInit(): void {
		this.felhasznalo=JSON.parse(localStorage.getItem('user')+'');
		this.rutinjaim=this.felhasznalo.rutinok;
		this.napjaim=this.felhasznalo.napok;
		if(this.napjaim.length>9) this.nap_hozzaadas_gomb=false;
	}
	ngAfterViewInit(){
		// let felhasznalo2:Felhasznalo={
		// 	id:this.felhasznalo.id,
		// 	email:this.felhasznalo.email,
		// 	napok:[...napjaim],
		// 	rutinok:[...rutinjaim]
		// }
		// this.adatb_szerviz.update(felhasznalo2);
		// console.log('kész');
	}
	
	rutinjaim_div_megjelenitve:boolean=false;
	kivalasztott_rutin={sorszam:-1, nev:'',gyakorlatok:Array()};
	
	melyik_nap:any=-1;
	rutinjaim_megnyit(napindex:any){
		this.melyik_nap=napindex;
		this.rutinjaim_div_megjelenitve=true;
		this.rutin_nyitva=false;
	}

	lenyitott_nap=-1;
	lenyitott_nap_rutinjai=new Array<Rutin>();
	lenyit(nap:any){
		if(this.lenyitott_nap==nap) {this.lenyitott_nap=-1;return;}
		this.lenyitott_nap=nap;
		this.lenyitott_nap_rutinjai=new Array<Rutin>();
		//[{rutin_nev:'',gyakorlatok:Array()}]
		
			
		if(this.napjaim[nap].rutinok.length==0){
			this.lenyitott_nap_rutinjai.push(new Rutin());
			this.lenyitott_nap_rutinjai[this.lenyitott_nap_rutinjai.length-1].nev='rest day';
			this.lenyitott_nap_rutinjai[this.lenyitott_nap_rutinjai.length-1].gyakorlatok.push('resting :)');
			return;
		}

		for(let napi_rutin_neve of this.napjaim[nap].rutinok){
			this.lenyitott_nap_rutinjai.push(new Rutin());
			this.lenyitott_nap_rutinjai[this.lenyitott_nap_rutinjai.length-1].nev=napi_rutin_neve;

			for(let rutin of this.rutinjaim){
				if(napi_rutin_neve==rutin.nev){//az adott nap egyik rutinja
					for(let gyakorlat of rutin.gyakorlatok)//ad adott nap egyik rutinja gyakorlatai
					{
						this.lenyitott_nap_rutinjai[this.lenyitott_nap_rutinjai.length-1].gyakorlatok.push(gyakorlat+'');
					}
				}
			}					
		}
			
		
	}

	uj_gyakorlat_input:any='';
	gyakorlat_hozaadasa(){
		if(this.uj_gyakorlat_input=='') return;
		console.log('gyak adva');
		this.rutinjaim[this.kivalasztott_rutin.sorszam].gyakorlatok.push(this.uj_gyakorlat_input);
		this.kivalasztott_rutin.gyakorlatok.push(this.uj_gyakorlat_input);
		this.rutin_nyitva=false;
		this.rutin_nyitva=true;
		this.adatb_szerviz.update(this.felhasznalo);
	}

	rutin_nyitva=false;
	rutin_megnyitas(rutin_neve:any, nap:any){
		this.melyik_nap=nap;
		let index=-1;
		for(let i=0;i<this.rutinjaim.length;i++) {
			if(this.rutinjaim[i].nev==rutin_neve) {index=i; break;} 
		}
		//console.log('rutinnyitas');
		this.rutinjaim_div_megjelenitve=false;
		this.rutin_nyitva=true;
		this.kivalasztott_rutin.nev=this.rutinjaim[index].nev;
		this.kivalasztott_rutin.gyakorlatok=[...this.rutinjaim[index].gyakorlatok];
		this.kivalasztott_rutin.sorszam=index;
	}
	uj_rutin_input:any='';
	rutin_hozzaadasa(){
		//alert(this.uj_rutin_input);
		if(this.uj_rutin_input=='') return;
		this.rutinjaim.push({nev:this.uj_rutin_input,gyakorlatok:[]});
		this.adatb_szerviz.update(this.felhasznalo);
	}

	katt_dv_katt(){
		this.rutin_nyitva=false;
		this.rutinjaim_div_megjelenitve=false;
	}
	naphoz_ad(rutin_index:any){
		if(this.napjaim[this.melyik_nap].rutinok.length>9) {this.rutinjaim_div_megjelenitve=false; return;}
		this.napjaim[this.melyik_nap].rutinok.push(this.rutinjaim[rutin_index].nev);
		this.rutinjaim_div_megjelenitve=false;
		this.adatb_szerviz.update(this.felhasznalo);
	}
	rutin_eltavolit(){
		console.log(this.melyik_nap+'-ból, ezt: '+this.rutinjaim[this.kivalasztott_rutin.sorszam].nev);
		for(let i=0; i<this.napjaim[this.melyik_nap].rutinok.length; i++)
		{
			console.log('nézem: '+this.napjaim[this.melyik_nap].rutinok[i]);
			if(this.napjaim[this.melyik_nap].rutinok[i] == this.rutinjaim[this.kivalasztott_rutin.sorszam].nev)
			{
				this.napjaim[this.melyik_nap].rutinok.splice(i,1);
				this.rutin_nyitva=false;
			}
		}
		this.adatb_szerviz.update(this.felhasznalo);
	}
	nap_hozzaadas_gomb=true;
	nap_hozzaad(){
		if(this.napjaim.length>9) return;
		console.log(this.felhasznalo.napok);
		this.napjaim.push(new nap([]));
		console.log(this.felhasznalo.napok);
		this.adatb_szerviz.update(this.felhasznalo);
		if(this.napjaim.length>9) {
			this.nap_hozzaadas_gomb=false;
		}
	}
	nap_torlese(nap:number){
		this.napjaim.splice(nap,1);
		this.lenyitott_nap=-1;
		this.adatb_szerviz.update(this.felhasznalo);
		if(this.napjaim.length<10) {
			this.nap_hozzaadas_gomb=true;
		}
	}
	gyakorlat_torlese(gyakorlat_i:number){
		this.rutinjaim[this.kivalasztott_rutin.sorszam].gyakorlatok.splice(gyakorlat_i,1);
		this.kivalasztott_rutin.gyakorlatok.splice(gyakorlat_i,1);
		this.adatb_szerviz.update(this.felhasznalo);
	}
	rutin_torlese(){
		this.rutinjaim.splice(this.kivalasztott_rutin.sorszam,1);
		for(let nap of this.napjaim){
			while(nap.rutinok.indexOf(this.kivalasztott_rutin.nev)!=-1)
				nap.rutinok.splice(nap.rutinok.indexOf(this.kivalasztott_rutin.nev),1);
		}
		this.rutin_nyitva=false;
		this.adatb_szerviz.update(this.felhasznalo);
	}
}
class Rutin{
  nev='';
  gyakorlatok=new Array<any>();
}
