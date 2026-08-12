

Las clases en [[TypeScript]] tienen una ventaja sobre las interfaces y es su capacidad de implementar funcionalidad, una interfz de tss solo maneja una estrutura como un esqueleto , una clase en su lugar funciona como un cuerpo completo al que podemos integrarle un esquelo ("interfaz") para potenciar su manejo :

```js 
import { Process } from "./db";

export interface Process extends Client {

  folder: number;

  process_price: number;

  process_code: string;

  state: boolean;

  completion_date?: Date;

  process_type: ProcessTypes;

}

export class ProcessModel {

  folder: number;

  client_name: string;

  process_price: number;

  process_code: string;

  telefono?: number;

  id: number;

  home_adress?: string;

  neighborhood?: string;

  email?: string;

  

  constructor(data: Process) {

    this.id = 1023466;

    this.client_name = data.client_name;

    this.telefono = data.telefono;

    this.home_adress = data.home_adress;

    this.process_price = data.process_price;

    this.neighborhood = data.neighborhood;

    this.email = data.email;

  

    // CODES

    this.process_code = "2026-01";

    this.folder = 2;

  }

}
```