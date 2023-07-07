export class Constants {
  static readonly guidNull = '00000000-0000-0000-0000-000000000000';

  static getEnumValues(enumObject: any): string[] {
    return Object.keys(enumObject)
      .filter(key => isNaN(Number(enumObject[key])))
      .map(key => enumObject[key]);
  }
}


export class Result<T> {
  isSuccess: boolean;
  status: number;
  value: T;
  error: string;
}
