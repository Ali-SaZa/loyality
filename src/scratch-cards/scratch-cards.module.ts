import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScratchCardsController } from './scratch-cards.controller';
import { ScratchCardsService } from './scratch-cards.service';
import { ScratchCard, ScratchCardSchema } from '../schemas/scratch-card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ScratchCard.name, schema: ScratchCardSchema }]),
  ],
  controllers: [ScratchCardsController],
  providers: [ScratchCardsService],
  exports: [ScratchCardsService],
})
export class ScratchCardsModule {}
