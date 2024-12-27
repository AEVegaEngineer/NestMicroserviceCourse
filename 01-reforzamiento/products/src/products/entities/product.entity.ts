export class Product {
  // public id: string;
  // public name: string;
  // public description?: string;
  // public price: number;

  constructor(
    public id: string,
    public name: string,
    public price: number,
    public description?: string,
  ) {}
  updateWith({ name, description, price }: Partial<Product>) {
    this.name = name ?? this.name;
    this.description = description ?? this.description;
    this.price = price ?? this.price;
  }
}
