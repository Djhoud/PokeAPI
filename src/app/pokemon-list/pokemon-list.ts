import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../pokemon';

@Component({
  selector: 'app-pokemon-list',
  standalone: true, // <-- Esta linha é crucial
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './pokemon-list.html',
  styleUrls: ['./pokemon-list.css']
})
export class PokemonListComponent implements OnInit {
  pokemonList: any[] = [];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.pokemonService.getPokemonList().subscribe((response: any) => {
      this.pokemonList = response.results;
    });
  }
}
