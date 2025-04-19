export class BusinessOperationException<T extends unknown> extends Error {
  public readonly httpCode: number;
  public readonly message: string;
  public readonly input: T;
  constructor(
    httpCode: number,
    publicMessage: string,
    input: T,
    privateMessageToLog?: string,
    options?: ConstructorParameters<typeof Error>[1]
  ) {
    super(privateMessageToLog || publicMessage, options);
    this.httpCode = httpCode;
    this.message = publicMessage;
    this.input = input;
  }
}
