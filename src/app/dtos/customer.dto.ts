import { ContactDto } from './contact.dto';

export interface CustomerDto {
  id: string;
  fullname: string;
  emails: string[];
  phones: string[];
  registerDate: Date;
  contacts: ContactDto[];
}
