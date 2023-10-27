import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Consultings, ConsultingsSchema } from 'src/common/schemas';
import { CryptoModule } from 'src/common/crypto/crypto.module';
import { SessionController } from './session.controller';
import { FnCreateSessionService } from './services/fn-create-sessions.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Consultings.name,
        schema: ConsultingsSchema,
      },
    ]),
    CryptoModule,
  ],
  controllers: [SessionController],
  providers: [FnCreateSessionService],
})
export class SessionModule {}
