import { Module, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'https://f11e-106-215-93-159.ngrok-free.app/',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'contactDB',
      autoLoadEntities: true,
      synchronize: true, // false in prod
    }),
    ContactModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('✅ Database is already connected!');
    } else {
      console.error('❌ Database is NOT connected.');
    }
  }
}
