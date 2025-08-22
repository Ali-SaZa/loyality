import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ScratchCard, ScratchCardDocument } from '../schemas/scratch-card.schema';
import { CreateScratchCardDto, UpdateScratchCardDto, ScratchCardResponseDto } from '../dto';
import { 
  ScratchCardNotFoundException,
  ScratchCardAlreadyUsedException,
  ScratchCardExpiredException
} from '../common/errors';

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

  private async validateScratchCardAccess(scratchCard: ScratchCardDocument, user: any): Promise<void> {
    // Admin can access everything
    if (user.role === 'admin') {
      return;
    }

    // Store users can access scratch cards from their store
    if (user.role === 'store' && user.storeId === scratchCard.storeId.toString()) {
      return;
    }

    // Users can only access scratch cards they own
    if (user.role === 'customer' && scratchCard.userId?.toString() === user.userId) {
      return;
    }

    throw new ForbiddenException('دسترسی ممنوع. شما مجوز دسترسی به این کارت تخفیف را ندارید.'); // translated to Persian
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

  async findOne(id: string, user: any): Promise<ScratchCardResponseDto> {
    const scratchCard = await this.scratchCardModel.findById(id).exec();
    if (!scratchCard) {
      throw new ScratchCardNotFoundException();
    }

    // Validate access permissions
    await this.validateScratchCardAccess(scratchCard, user);

    return this.transformScratchCardToResponse(scratchCard);
  }

  async findByCode(code: string): Promise<ScratchCardResponseDto | null> {
    const scratchCard = await this.scratchCardModel.findOne({ code }).exec();
    return scratchCard ? this.transformScratchCardToResponse(scratchCard) : null;
  }

  async update(id: string, updateScratchCardDto: UpdateScratchCardDto, user: any): Promise<ScratchCardResponseDto> {
    const scratchCard = await this.scratchCardModel.findById(id).exec();
    if (!scratchCard) {
      throw new ScratchCardNotFoundException();
    }

    // Validate access permissions
    await this.validateScratchCardAccess(scratchCard, user);

    const updatedScratchCard = await this.scratchCardModel
      .findByIdAndUpdate(id, updateScratchCardDto, { new: true })
      .exec();
    
    if (!updatedScratchCard) {
      throw new ScratchCardNotFoundException();
    }
    
    return this.transformScratchCardToResponse(updatedScratchCard);
  }

  async updateStatus(id: string, status: 'unused' | 'used' | 'expired', user: any): Promise<ScratchCardResponseDto> {
    const scratchCard = await this.scratchCardModel.findById(id).exec();
    if (!scratchCard) {
      throw new ScratchCardNotFoundException();
    }

    // Validate access permissions
    await this.validateScratchCardAccess(scratchCard, user);

    const updateData: any = { status };
    
    if (status === 'used') {
      updateData.usedAt = new Date();
    }
    
    const updatedScratchCard = await this.scratchCardModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (!updatedScratchCard) {
      throw new ScratchCardNotFoundException();
    }
    
    return this.transformScratchCardToResponse(updatedScratchCard);
  }

  async useCard(id: string, userId: string): Promise<ScratchCardResponseDto> {
    const scratchCard = await this.scratchCardModel.findById(id).exec();
    
    if (!scratchCard) {
      throw new ScratchCardNotFoundException();
    }
    
    if (scratchCard.status !== 'unused') {
      throw new ScratchCardAlreadyUsedException();
    }
    
    if (scratchCard.expiresAt < new Date()) {
      throw new ScratchCardExpiredException();
    }
    
    scratchCard.status = 'used';
    scratchCard.userId = new Types.ObjectId(userId);
    scratchCard.usedAt = new Date();
    
    const savedCard = await scratchCard.save();
    return this.transformScratchCardToResponse(savedCard);
  }

  async registerCard(code: string, user: any): Promise<ScratchCardResponseDto> {
    // Only customers can register scratch cards
    if (user.role !== 'customer') {
      throw new ForbiddenException('فقط مشتریان می‌توانند کارت تخفیف ثبت کنند'); // translated to Persian
    }

    const scratchCard = await this.scratchCardModel.findOne({ code }).exec();
    
    if (!scratchCard) {
      throw new ScratchCardNotFoundException();
    }
    
    if (scratchCard.status !== 'unused') {
      throw new ScratchCardAlreadyUsedException();
    }
    
    if (scratchCard.expiresAt < new Date()) {
      throw new ScratchCardExpiredException();
    }
    
    // Check if the card is already registered by another user
    if (scratchCard.userId) {
      throw new ForbiddenException('این کارت تخفیف قبلاً توسط کاربر دیگری ثبت شده است'); // translated to Persian
    }
    
    // Register the card for the customer
    scratchCard.userId = new Types.ObjectId(user.userId);
    scratchCard.entryMethod = 'qr';
    
    const savedCard = await scratchCard.save();
    return this.transformScratchCardToResponse(savedCard);
  }
  async remove(id: string, user: any): Promise<void> {
    const scratchCard = await this.scratchCardModel.findById(id).exec();
    if (!scratchCard) {
      throw new ScratchCardNotFoundException();
    }

    // Validate access permissions
    await this.validateScratchCardAccess(scratchCard, user);

    const result = await this.scratchCardModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new ScratchCardNotFoundException();
    }
  }

  async findByStore(storeId: string, user: any): Promise<ScratchCardResponseDto[]> {
    // Validate store access
    if (user.role === 'admin') {
      // Admin can see all stores
    } else if (user.role === 'store' && user.storeId === storeId) {
      // Store owner can see their own store
    } else {
      throw new ForbiddenException('دسترسی ممنوع. شما مجوز دسترسی به کارت‌های تخفیف این فروشگاه را ندارید.'); // translated to Persian
    }

    const scratchCards = await this.scratchCardModel.find({ storeId }).exec();
    return scratchCards.map(card => this.transformScratchCardToResponse(card));
  }

  async findByUser(userId: string, user: any): Promise<ScratchCardResponseDto[]> {
    // Validate user access
    if (user.role === 'admin') {
      // Admin can see all users
    } else if (user.role === 'customer' && user.userId === userId) {
      // User can see their own data
    } else if (user.role === 'store') {
      // Store users can see customer data related to their store
      // This will be validated by checking if transactions exist for this user in their store
    } else {
      throw new ForbiddenException('دسترسی ممنوع. شما مجوز دسترسی به کارت‌های تخفیف این کاربر را ندارید.'); // translated to Persian
    }

    const scratchCards = await this.scratchCardModel.find({ userId }).exec();
    return scratchCards.map(card => this.transformScratchCardToResponse(card));
  }

  async findMyCards(user: any): Promise<ScratchCardResponseDto[]> {
    // Only customers can view their own cards
    if (user.role !== 'customer') {
      throw new ForbiddenException('فقط مشتریان می‌توانند کارت‌های تخفیف خود را مشاهده کنند'); // translated to Persian
    }

    const scratchCards = await this.scratchCardModel.find({ userId: user.userId }).exec();
    return scratchCards.map(card => this.transformScratchCardToResponse(card));
  }
}
