import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidatorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const valueConvert = parseInt(value);
    if (isNaN(valueConvert)) throw new Error('Value must be a number');
    return value;
  }
}
