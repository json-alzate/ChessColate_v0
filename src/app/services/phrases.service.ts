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
    },
    {
      text: 'El jugador que lleva ventaja debe atacar o perderá dicha ventaja.',
      author: 'W. Steinitz'
    },
    {
      text: 'El Rey es una pieza de pelea. ¡Úselo!',
      author: 'W. Steinitz'
    },
    {
      text: 'El peón es el más importante instrumento de la victoria.',
      author: 'W. Steinitz'
    },
    {
      text: 'Peones: ellos son el alma del Ajedrez; solos, forman el ataque y la defensa.',
      author: 'A. D. Philidor'
    },
    {
      text: 'Quien desee llegar a ser un gran jugador deberá perfeccionarse en el campo del análisis.',
      author: 'M. Botvinnik'
    },
    {
      text: 'El Ajedrez es arte y cálculo',
      author: 'M. Botvinnik'
    },
    {
      text: 'Cuando veas una buena jugada, trata de encontrar otra mejor.',
      author: 'Em. Lasker'
    },
    {
      text: 'La amenaza de la derrota es más terrible que la derrota misma.',
      author: 'A. Karpov'
    },
    {
      text: 'Quien no asume un riesgo nunca ganará una partida.',
      author: 'P. Keres'
    },
    {
      text: 'Jugar una partida de Ajedrez es pensar, elaborar planes y también tener una pizca de fantasía.',
      author: 'D. Bronstein'
    },
    {
      text: 'Primero debe hacerse la jugada forzada y luego entregarse a la meditación.',
      author: 'Benjamín M.'
    },
    {
      text: 'Por medio del razonamiento se llega a descubrir las combinaciones.',
      author: 'R. Grau'
    },
    {
      text: 'El misterio del sacrificio está encerrado en la sabia transformación de material en tiempo.',
      author: 'R. Grau'
    },
    {
      text: 'La técnica del juego posicional puede ser adquirida.',
      author: 'A. Ninzowitch'
    },
    {
      text: 'La capacidad defensiva de una pieza clavada es solo imaginaria.',
      author: 'A. Nimzovitch'
    },
    {
      text: 'Una posición aplastante en el centro da derecho a atacar en un ala.',
      author: 'A. Nimzovitch'
    },
    {
      text: 'Un mal plan es mejor que no tener ningún plan.',
      author: 'Frank Marshall'
    },
    {
      text: 'Una clavada es más poderosa que una espada.',
      author: 'Fred Reinfeld'
    },
    {
      text: 'Juega la Apertura como un libro, el Juego Medio como un mago y los Finales como una máquina',
      author: 'R. Spielmann'
    },
    {
      text: 'La estrategia es cosa de reflexión, la táctica es cosa de percepción.',
      author: 'Max. Euwe'
    },
    {
      text: 'En cada jugada que haces, muestras un fragmento de tu personalidad.',
      author: 'Juan P. Miracca'
    },
    {
      text: 'El estudio y conocimiento de los finales es un pasaporte a la Maestría ajedrecística.',
      author: 'Nelson Pinal'
    },
    {
      text: 'El Ajedrez sirve, como pocas cosas en este mundo, para distraer y olvidar momentáneamente las preocupaciones de la vida diaria.',
      author: 'J. R.Capablanca'
    },
    {
      text: 'Alguna vez los hombres tuvieron que ser semi-dioses; si no, no hubieran inventado el Ajedrez.',
      author: 'A. Alekhine'
    },
    {
      text: 'En el Ajedrez, como en la vida, el adversario más peligroso es uno mismo.',
      author: 'V. Smislov'
    },
    {
      text: 'Gracias al Ajedrez muchos hemos conocido la alegría de la creación.',
      author: 'T. Petrosian'
    },
    {
      text: 'El Ajedrez es el alimento natural de las neuronas.',
      author: 'Nelson Pinal'
    },
    {
      text: 'El Ajedrez es el único deporte, en el cual un veterano de 90 años puede ganarle a un joven de 20 años.',
      author: 'Frank Mayer'
    },
    {
      text: 'El Ajedrez prolonga la vida.',
      author: 'Roberto Pagura'
    },
    {
      text: 'Cuando estés solo, cuando te sientas un extraño en el mundo, juega al Ajedrez. Esto levantará tu espíritu y será tu consejero de guerra.',
      author: 'Aristóteles'
    },
    {
      text: 'Me gusta el Ajedrez porque es un buen descanso; hace trabajar la mente, pero de una forma muy especial.',
      author: 'León Tolstoi'
    },
    {
      text: 'Cuando tengas dudas, ¡juega Ajedrez!.',
      author: 'Walter Tevis'
    },
    {
      text: 'Juegue Ajedrez y dígale Jaque Mate al Alzheimer.',
      author: 'Diego Gallotti'
    },
    {
      text: 'Una vez terminado el juego, el Rey y el Peón vuelven a la misma caja.',
      author: 'Proverbio'
    },
    {
      text: 'El Ajedrez es un juego. Juega para no dejar de ser niño.',
      author: 'J. L. García Gil'
    },
    {
      text: 'El Ajedrez, sin humillarte, te induce a la humildad.',
      author: 'J. L. García Gil'
    },
    {
      text: '¡Mate! - No gracias, prefiero Té.',
      author: 'Andrea Lambrecht'
    },
    {
      text: 'El Ajedrez es como la amistad, une las diferencias.',
      author: 'Antonio Urciuoli'
    }
  ];

  constructor() { }

  getOnePhrase() {
    return this.phrases[Math.floor(Math.random() * this.phrases.length)];
  }


}
