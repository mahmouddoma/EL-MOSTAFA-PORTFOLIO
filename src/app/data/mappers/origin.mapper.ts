import { Origin } from '../../domain/models/origin.model';

export class OriginMapper {
  static fromJson(json: any): Origin {
    return {
      flag: json.flag,
      country: json.country,
      products: json.products as string[]
    };
  }
}
