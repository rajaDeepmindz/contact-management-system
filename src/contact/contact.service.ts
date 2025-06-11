import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepo: Repository<Contact>,
  ) {}

  create(contact: Partial<Contact>) {
    return this.contactRepo.save(contact);
  }

  findAll() {
    return this.contactRepo.find();
  }

  findOne(id: number) {
    return this.contactRepo.findOneBy({ id });
  }

  update(id: number, contact: Partial<Contact>) {
    return this.contactRepo.update(id, contact);
  }

  delete(id: number) {
    return this.contactRepo.delete(id);
  }
}
