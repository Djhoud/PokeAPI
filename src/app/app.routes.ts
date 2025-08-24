import { Routes } from '@angular/router';
import { PokemonInfoComponent } from './pokemon-info/pokemon-info';
import { PokemonListComponent } from './pokemon-list/pokemon-list';

export const routes: Routes = [
  { path: '', component: PokemonListComponent },
  { path: 'pokemon/:name', component: PokemonInfoComponent },
];
