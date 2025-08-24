import { CommonModule, TitleCasePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Importe ActivatedRoute
import { PokemonService } from '../pokemon';

@Component({
  selector: 'app-pokemon-info',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    TitleCasePipe
  ],
  templateUrl: './pokemon-info.html',
  styleUrls: ['./pokemon-info.css']
})
export class PokemonInfoComponent implements OnInit {
  pokemon: any;

  // Injeta o PokemonService e o ActivatedRoute
  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute // Adicione isso
  ) { }

  ngOnInit(): void {
    // Pega o nome do Pokémon da URL
    this.route.paramMap.subscribe(params => {
      const pokemonName = params.get('name')?.toLowerCase();
      if (pokemonName) {
        this.pokemonService.getPokemon(pokemonName).subscribe(data => {
          this.pokemon = data;
        });
      }
    });
  }
}
