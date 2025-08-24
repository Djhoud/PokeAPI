import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  getPokemon(pokemonName: string) {
    return this.http.get(`${this.apiUrl}/pokemon/${pokemonName}`);
  }

  getPokemonList() {
    return this.http.get(`${this.apiUrl}/pokemon?limit=151`);
  }
}
