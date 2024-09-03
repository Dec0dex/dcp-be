import { Exclude, Expose } from 'class-transformer';
import { StringField } from '../../../decorators/field.decorators';

@Exclude()
export class PhoneNumberResDto {
  @StringField()
  @Expose()
  number: string;

  @StringField()
  @Expose()
  type;
}
