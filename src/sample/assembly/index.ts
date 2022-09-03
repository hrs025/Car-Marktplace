import { Car } from "./model";
import { Money } from "./utils";


export function create(age:u8, carModel: string, kilometer:u8, forSale:string, price:Money): Car {
  return Car.addCar(age, carModel, kilometer, forSale, price);
}

export function getAll(): Car[] {
  return Car.getcars();
}

export function getOffset(offset:u32, limit:u32): Car[] { 
  return Car.getcarsOffset(offset,limit);
}

export function getForSale(): Car[] {
  return Car.getcarsForSale();
}

export function getById(id:u32): Car {
  return Car.getCarById(id);
}

export function updateById(id:u32, update:Car): Car {
  return Car.updateCarByid(id, update);
}

export function deleteById (id:u32): void {
  Car.deleteCarById(id);
}

export function deleteOwnerAll (): void {
   Car.deleteOwnerAllcars();
}

export function deleteAll (): void {
  Car.deleteAllcars();
}

export function buy (id:u32, buyingPrice:Money) : Car {
  return Car.buyCar(id, buyingPrice);
} 