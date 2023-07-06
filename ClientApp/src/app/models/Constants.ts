export class Constants {
  static readonly guidNull = '00000000-0000-0000-0000-000000000000';
}


export class Result<T> {
  isSuccess: boolean;
  status: number;
  value: T;
  error: string;
}
