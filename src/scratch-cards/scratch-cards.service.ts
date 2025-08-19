import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ScratchCard, ScratchCardDocument } from '../schemas/scratch-card.schema';
import { CreateScratchCardDto, UpdateScratchCardDto, ScratchCardResponseDto } from '../dto';

@Injectable()
export class ScratchCardsService {
  constructor(
    @InjectModel(ScratchCard.name) private scratchCardModel: Model<ScratchCardDocument>,
  ) {}

  private transformScratchCardToResponse(scratchCard: ScratchCardDocument): ScratchCardResponseDto {
    return {
      id: scratchCard._id.toString(),
      code: scratchCard.code,
      storeId: scratchCard.storeId.toString(),
      status: scratchCard.status,
      userId: scratchCard.userId?.toString(),
      reward: scratchCard.reward,
      entryMethod: scratchCard.entryMethod,
      qrUrl: scratchCard.qrUrl,
      usedAt: scratchCard.usedAt,
      expiresAt: scratchCard.expiresAt,
      createdAt: scratchCard.createdAt,
      updatedAt: scratchCard.updatedAt,
    };
  }

  async create(createScratchCardDto: CreateScratchCardDto): Promise<ScratchCardResponseDto> {
    const scratchCard = new this.scratchCardModel(createScratchCardDto);
    const savedScratchCard = await scratchCard.save();
    return this.transformScratchCardToResponse(savedScratchCard);
  }

  async findAll(): Promise<ScratchCardResponseDto[]> {
    const scratchCards = await this.scratchCardModel.find().exec();
    return scratchCards.map(card => this.transformScratchCardToResponse(card));
  }

  async findOne(id: string): Promise<ScratchCardResponseDto> {
    const scratchCard = await this.scratchCardModel.findById(id).exec();
    if (!scratchCard) {
      throw new NotFoundException('Scratch card not found');
    }
    return this.transformScratchCardToResponse(scratchCard);
  }

  async findByCode(code: string): Promise<ScratchCardResponseDto | null> {
    const scratchCard = await this.scratchCardModel.findOne({ code }).exec();
    return scratchCard ? this.transformScratchCardToResponse(scratchCard) : null;
  }

  async update(id: string, updateScratchCardDto: UpdateScratchCardDto): Promise<ScratchCardResponseDto> {
    const scratchCard = await this.scratchCardModel
      .findByIdAndUpdate(id, updateScratchCardDto, { new: true })
      .exec();
    
    if (!scratchCard) {
      throw new NotFoundException('Scratch card not found');
    }
    
    return this.transformScratchCardToResponse(scratchCard);
  }

  async updateStatus(id: string, status: 'unused' | 'used' | 'expired'): Promise<ScratchCardResponseDto> {
    const updateData: any = { status };
    
    if (status === 'used') {
      updateData.usedAt = new Date();
    }
    
    const scratchCard = await this.scratchCardModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (!scratchCard) {
      throw new NotFoundException('Scratch card not found');
    }
    
    return this.transformScratchCardToResponse(scratchCard);
  }

  async useCard(id: string, userId: string): Promise<ScratchCardResponseDto> {
    const scratchCard = await this.scratchCardModel.findById(id).exec();
    
    if (!scratchCard) {
      throw new NotFoundException('Scratch card not found');
    }
    
    if (scratchCard.status !== 'unused') {
      throw new BadRequestException('Scratch card is not available for use');
    }
    
    if (scratchCard.expiresAt < new Date()) {
      throw new BadRequestException('Scratch card has expired');
    }
    
    scratchCard.status = 'used';
    scratchCard.userId = new Types.ObjectId(userId);
    scratchCard.usedAt = new Date();
    
    const savedCard = await scratchCard.save();
    return this.transformScratchCardToResponse(savedCard);
  }

  async remove(id: string): Promise<void> {
    const result = await this.scratchCardModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Scratch card not found');
    }
  }

  async findByStore(storeId: string): Promise<ScratchCardResponseDto[]> {
    const scratchCards = await this.scratchCardModel.find({ storeId }).exec();
    return scratchCards.map(card => this.transformScratchCardToResponse(card));
  }

  async findByUser(userId: string): Promise<ScratchCardResponseDto[]> {
    const scratchCards = await this.scratchCardModel.find({ userId }).exec();
    return scratchCards.map(card => this.transformScratchCardToResponse(card));
  }
}
