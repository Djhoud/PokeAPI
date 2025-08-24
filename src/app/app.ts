import { NgIf, TitleCasePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, NgIf, TitleCasePipe],
  template: `
    <div class="container" *ngIf="pokemon">
      <h1>{{ pokemon.name | titlecase }}</h1>
      <img [src]="pokemon.sprite" [alt]="pokemon.name">

      <p><strong>Peso:</strong> {{ pokemon.weight }}</p>
      <p><strong>Altura:</strong> {{ pokemon.height }}</p>
      <p><strong>Tipos:</strong> {{ pokemon.types.join(', ') }}</p>
      <p><strong>Habilidades:</strong> {{ pokemon.abilities.join(', ') }}</p>

      <div class="buttons">
        <button (click)="prevPokemon()">Anterior</button>
        <button (click)="nextPokemon()">Próximo</button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 320px;
      margin: 40px auto;
      padding: 20px;
      border-radius: 12px;
      background: #f4f4f4;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      text-align: center;
      font-family: Arial, sans-serif;
    }
    img {
      width: 120px;
      height: 120px;
      margin-bottom: 12px;
    }
    h1 {
      margin-bottom: 12px;
    }
    .buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
    }
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      background: #3A8FFF;
      color: white;
      cursor: pointer;
      font-weight: bold;
    }
    button:hover {
      background: #2E72CC;
    }
  `]
})
export class AppComponent implements OnInit {
  pokemon: any;
  currentId: number = 25; // Inicia com Pikachu

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getPokemon(this.currentId);
  }

  getPokemon(id: number) {
    this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`).subscribe((data: any) => {
      this.pokemon = {
        name: data.name,
        sprite: data.sprites.front_default,
        height: data.height,
        weight: data.weight,
        types: data.types.map((t: any) => t.type.name),
        abilities: data.abilities.map((a: any) => a.ability.name)
      };
      this.currentId = data.id;
    });
  }

  nextPokemon() {
    this.getPokemon(this.currentId + 1);
  }

  prevPokemon() {
    if (this.currentId > 1) this.getPokemon(this.currentId - 1);
  }
}
