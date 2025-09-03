import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PokemonService } from '../pokemon';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './pokemon-list.html',
  styleUrls: ['./pokemon-list.css']
})
export class PokemonListComponent implements OnInit {
  pokemonList: any[] = [];
  filteredPokemonList: any[] = [];
  searchTerm: string = '';

  constructor(
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.pokemonService.getPokemonList().subscribe((response: any) => {
      response.results.forEach((pokemon: any) => {
        this.pokemonService.getPokemon(pokemon.name).subscribe((details: any) => {
          this.pokemonList.push(details);
          this.filteredPokemonList = [...this.pokemonList];
          this.cdr.markForCheck();
        });
      });
    });
  }

  filterPokemon(): void {
    if (!this.searchTerm) {
      this.filteredPokemonList = [...this.pokemonList];
      this.cdr.markForCheck();
      return;
    }

    this.filteredPokemonList = this.pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.cdr.markForCheck(); // 4. E aqui
  }
}
