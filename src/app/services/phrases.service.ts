import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhrasesService {


  public phrases = [
    {
      text: 'De pocas partidas he aprendido tanto como de la mayoría de mis derrotas.',
      author: 'J. R. Capablanca'
    },
    {
      text: 'Hay que eliminar la hojarasca del tablero.',
      author: 'J. R. Capablanca'
    },
    {
      text: 'El buen jugador siempre tiene suerte.',
      author: 'J. R.Capablanca'
    },
    {
      text: 'En el Ajedrez, como en la vida, la mejor jugada es siempre la que se realiza.',
      author: 'Dr. S.Tarrasch'
    },
    {
      text: 'Desconfianza es la característica más necesaria de un jugador de Ajedrez.',
      author: 'Dr. S.Tarrasch'
    },
    {
      text: 'No es suficiente ser un buen jugador, se debe también jugar muy bien.',
      author: 'Dr. S.Tarrasch'
    },
    {
      text: 'El mejor entrenador del ajedrecista es uno mismo.',
      author: 'T. Petrosian'
    },
    {
      text: 'Yo no creo en la Psicología. Yo creo en las buenas jugadas.',
      author: 'Robert –Bobby- Fischer'
    },
    {
      text: 'La táctica fluye a partir de una posición superior.',
      author: 'Robert –Bobby- Fischer'
    },
    {
      text: 'La acumulación de pequeñas ventajas lleva a una supremacía considerable.',
      author: 'W. Steinitz'
    },
    {
      text: 'El peón es la causa más frecuente de la derrota.',
      author: 'W. Steinitz'
    },
    {
      text: 'Solo el jugador con la iniciativa tiene el derecho a atacar.',
      author: 'W. Steinitz'
    }
  ];

  constructor() { }

  getOnePhrase() {
    return this.phrases[Math.floor(Math.random() * this.phrases.length)];
  }


}
