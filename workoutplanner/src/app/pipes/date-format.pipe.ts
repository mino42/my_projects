import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'email_name'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    return value.split('@')[0];
  }

}
