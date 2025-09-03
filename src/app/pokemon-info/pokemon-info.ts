import { CommonModule, TitleCasePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PokemonService } from '../pokemon';

@Component({
  selector: 'app-pokemon-info',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    TitleCasePipe,
    RouterLink
  ],
  templateUrl: './pokemon-info.html',
  styleUrls: ['./pokemon-info.css']
})
export class PokemonInfoComponent implements OnInit {
  pokemon: any;
  evolutions: any[] = [];
  pokemonDescription: string = '';
  pokemonCategory: string = '';
  pokemonWeaknesses: string[] = [];

  constructor(
    private pokemonService: PokemonService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const pokemonName = params.get('name')?.toLowerCase();
      if (pokemonName) {
        this.pokemonService.getPokemon(pokemonName).subscribe((data: any) => {
          this.pokemon = data;
          this.getPokemonWeaknesses();

          this.pokemonService.getPokemonSpecies(this.pokemon.id).subscribe((speciesData: any) => {
            const flavorText = speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'en');
            this.pokemonDescription = flavorText ? flavorText.flavor_text.replace(/\f/g, ' ') : 'Descrição não disponível.';

            const category = speciesData.genera.find((gen: any) => gen.language.name === 'en');
            this.pokemonCategory = category ? category.genus.replace('Pokémon', '') : 'Não disponível.';

            this.pokemonService.getEvolutionChain(speciesData.evolution_chain.url).subscribe((evolutionData: any) => {
              this.evolutions = this.processEvolutionChain(evolutionData.chain);
              this.cdr.markForCheck();
            });
            this.cdr.markForCheck();
          });
        });
      }
    });
  }

  getStatName(statName: string): string {
    switch (statName) {
      case 'hp': return 'PS';
      case 'attack': return 'Ataque';
      case 'defense': return 'Defesa';
      case 'special-attack': return 'Ataque Especial';
      case 'special-defense': return 'Defesa Especial';
      case 'speed': return 'Velocidade';
      default: return statName;
    }
  }

  processEvolutionChain(chain: any): any[] {
    const evolutionArray: any[] = [];
    let currentStage = chain;

    while (currentStage) {
      const pokemonName = currentStage.species.name;
      const evolutionDetails = currentStage.evolution_details[0];

      const evolutionInfo = {
        name: pokemonName,
        imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentStage.species.url.split('/').slice(-2, -1)[0]}.png`,
        level: evolutionDetails?.min_level || null,
        trigger: evolutionDetails?.trigger.name || 'level-up'
      };

      evolutionArray.push(evolutionInfo);

      currentStage = currentStage.evolves_to.length > 0 ? currentStage.evolves_to[0] : null;
    }

    return evolutionArray;
  }

  getPokemonWeaknesses(): void {
    const typeRequests = this.pokemon.types.map((type: any) =>
      this.pokemonService.getPokemonType(type.type.name)
    );

    forkJoin(typeRequests).subscribe((typeData: any) => {
      const weaknessesSet = new Set<string>();
      typeData.forEach((type: any) => {
        type.damage_relations.double_damage_from.forEach((weakness: any) => {
          weaknessesSet.add(weakness.name);
        });
      });
      this.pokemonWeaknesses = Array.from(weaknessesSet);
    });
  }
}
