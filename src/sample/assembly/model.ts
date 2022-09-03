import { PersistentUnorderedMap, math, u128, context, PersistentSet, RNG, storage, logging, ContractPromiseBatch} from "near-sdk-as";
import { AccountId, Balance, Money } from "./utils";


const random =new RNG<u32>(100,1000);


export const cars = new PersistentUnorderedMap<u32, Car>("car");

export const carID = new PersistentSet<u32>("carID");


storage.set<AccountId>("accountId", context.sender);


@nearBindgen
export class Car {
  id: u32;
  age:u8;
  carModel:string;
  kilometer: u8;
  forSale:string;
  price: Money;
  owner: string;  
  

  constructor(age:u8, carModel: string, kilometer:u8, forSale:string, price:Money ) {   
    this.id = math.hash32<string>(((random.next()).toString())+carModel);
    this.age=age;
    this.carModel=carModel;
    this.kilometer = kilometer;
    this.forSale = forSale;
    this.price=price;
    this.owner= context.sender;

  }

  static addCar(age:u8, carModel: string, kilometer:u8, forSale:string, price:Money): Car {
    
    assert(price>u128.Zero , 'Car price must be bigger than zero.');
    
    const car = new Car(age, carModel, kilometer, forSale, price);

    carID.add(car.id);
    cars.set(car.id, car);

    logging.log(carModel + `Create Success. Created Owner is ${storage.getSome<AccountId>("accountId")}`);
    return car;
  }

  static getcars(): Car[] {
    let offset= 0;
    let limit=cars.length;
  
    return cars.values(offset, offset + limit);
  }


  static getcarsOffset(offset:u32, limit:u32): Car[] {     
      return cars.values(offset, offset + limit);  
  }

  static getCarById(id:u32): Car{
    return cars.getSome(id);
  }

  static getcarsForSale(): Car[]{
    const listForSale: Car[]=new Array<Car>();
    const Ids: u32[] = carID.values(); 

    for(let i=0; i<Ids.length; i++){
      if(this.getCarById(Ids[i]).forSale=='true') {  
       listForSale.push(this.getCarById(Ids[i]));
      }
    }

    return listForSale;
  }

  static updateCarByid(id:u32, update:Car):Car{
    
    const Car= this.getCarById(id);
   
    assert(Car.owner==context.sender,`You are not owner of this Car.You can not update Car details.Created Owner is not ${storage.getSome<AccountId>("accountId")}`);
    
    
    Car.age=update.age ? update.age : Car.age;
    Car.kilometer=update.kilometer ? update.kilometer : Car.kilometer;
    Car.price=update.price && update.price > u128.Zero ? update.price : Car.price;
    Car.forSale=update.forSale ? update.forSale : Car.forSale;
    
    cars.set(id,Car);

    return Car;
  }

static deleteCarById(id:u32):void{

const Car= this.getCarById(id);

assert(Car.owner==context.sender,'You are not owner of this Car.You can not delete it.');

cars.delete(id);
carID.delete(id);
}



static deleteOwnerAllcars(): void {
  const Ids: u32[] = carID.values(); 
  for(let i=0; i<Ids.length; i++){
    if(this.getCarById(Ids[i]).owner==context.sender) {
      
     
      cars.delete(Ids[i]);
      carID.delete(Ids[i]);

    }
  }
  }
  

static deleteAllcars():void{
  cars.clear();
  carID.clear();
  }

 static buyCar(id:u32, buyingPrice:Money) : Car {

    const buyer=context.sender;
    const buyerAccountBalance: Balance= context.accountBalance;
    const Car=this.getCarById(id);
    const CarOwner= Car.owner;

    assert(buyerAccountBalance >= Car.price,`Your account balance is not enought to buy this Car. Check your account and add more money to ${storage.getSome<AccountId>("accountId")}`);
      
    assert(buyingPrice >= Car.price, 'You should offer equal to sale price or more to buy this Car');

    assert(buyer != CarOwner, 'You are already owner of Car you can not buy your Car higher price');
    
    assert(Car.forSale == 'true','Car is not for sale');
    
    ContractPromiseBatch.create(CarOwner).transfer(buyingPrice);

    Car.owner=buyer;
    Car.forSale='false';
    Car.price=buyingPrice;
    cars.set(id,Car);

    return Car;
  }
  
}