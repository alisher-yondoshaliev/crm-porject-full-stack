import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private _client: PrismaClient;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    this._client = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    await this._client.$connect();
  }

  async onModuleDestroy() {
    await this._client.$disconnect();
  }

  get user() {
    return this._client.user;
  }

  get teacher() {
    return this._client.teacher;
  }

  get student() {
    return this._client.student;
  }

  get course() {
    return this._client.course;
  }

  get room() {
    return this._client.room;
  }

  get group() {
    return this._client.group;
  }

  get studentGroup() {
    return this._client.studentGroup;
  }

  get lesson() {
    return this._client.lesson;
  }

  get attendance() {
    return this._client.attendance;
  }

  get homework() {
    return this._client.homework;
  }

  get lessonVideo() {
    return this._client.lessonVideo;
  }

  get homeworkResponse() {
    return this._client.homeworkResponse;
  }

  get homeworkResult() {
    return this._client.homeworkResult;
  }

  get rating() {
    return this._client.rating;
  }
}
