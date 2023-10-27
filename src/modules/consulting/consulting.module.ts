import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsultingController } from './consulting.controller';
import {
  Clients,
  ClientsSchema,
  Consultings,
  ConsultingsSchema,
  Secuences,
  SecuencesSchema,
} from 'src/common/schemas';
import { CryptoModule } from 'src/common/crypto/crypto.module';
import { KEYS } from 'src/const/keys.const';
import { FnCreateConsultingService, FnFindConsultingService } from './services';
import { FnUpdateStatusConsultingService } from './services/fn-update-status-consulting.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Clients.name,
        schema: ClientsSchema,
      },
      {
        name: Consultings.name,
        schema: ConsultingsSchema,
      },
      {
        name: Secuences.name,
        schema: SecuencesSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: KEYS.jwt_secret,
      signOptions: { expiresIn: '365d' },
    }),
    CryptoModule,
  ],
  controllers: [ConsultingController],
  providers: [
    FnCreateConsultingService,
    FnFindConsultingService,
    FnUpdateStatusConsultingService,
  ],
})
export class ConsultingModule {}
