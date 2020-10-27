import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  mechanics: Array<string>;
  reviews: Array<string>;
  esthetic: Array<string>;

  constructor() {
    this.mechanics = ['Alineación y balanceo', 'Electricidad y electrónica',
      'Limpieza de inyectores', 'Cambios, reparaciones y mucho más'];
    this.reviews = ['Diagnóstico general', 'Peritaje', 'Mantenimiento por kilometraje', 'Revisión técnico-mecánica'];
    this.esthetic = ['Latonería', 'Pintura', 'Polichado', 'Blindaje'];
   }

  ngOnInit(): void {
  }

}
