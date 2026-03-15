import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) { }

  private selectRoomFields() {
    return {
      id: true,
      name: true,
      capacity: true,
      status: true,
      created_at: true,
      updated_at: true,
    };
  }

  async create(createRoomDto: CreateRoomDto) {
    try {
      return await this.prisma.room.create({
        data: {
          name: createRoomDto.name,
          capacity: createRoomDto.capacity,
          status: createRoomDto.status,
        },
        select: this.selectRoomFields(),
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Room with this name already exists');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.room.findMany({
      orderBy: { id: 'desc' },
      select: this.selectRoomFields(),
    });
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      select: this.selectRoomFields(),
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    const exists = await this.prisma.room.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException('Room not found');
    }

    try {
      return await this.prisma.room.update({
        where: { id },
        data: {
          name: updateRoomDto.name,
          capacity: updateRoomDto.capacity,
          status: updateRoomDto.status,
        },
        select: this.selectRoomFields(),
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Room with this name already exists');
      }
      throw error;
    }
  }

  async remove(id: number) {
    const exists = await this.prisma.room.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException('Room not found');
    }

    await this.prisma.room.delete({ where: { id } });
    return { message: 'Room deleted successfully' };
  }
}
