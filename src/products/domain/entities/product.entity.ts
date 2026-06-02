export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly isActive: boolean,
    public readonly description?: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  // 💡 Opcional: Podés agregar métodos con lógica de negocio pura aquí
  // Ejemplo: public hasStock(): boolean { return this.stock > 0; }
}
