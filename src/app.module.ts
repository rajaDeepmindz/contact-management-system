// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: "postgresql://postgres:Hello%4012345@db.hrpruhykvsedycsfnsrg.supabase.co:5432/postgres",
      autoLoadEntities: true,
      synchronize: true, // Turn off in production
    }),
    ContactModule,
  ],
})
export class AppModule {}
