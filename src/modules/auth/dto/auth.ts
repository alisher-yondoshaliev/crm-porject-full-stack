import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterAdminDto {
  @ApiProperty({ example: 'John Doe', description: 'Foydalanuvchi Full name' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'kimdir@gmail.com',
    description: 'Email kerak',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678', description: 'Parol kerak' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginUserDto {
  @ApiProperty({ example: 'alisher@gmail.com', description: 'Email kerak' })
  @IsNotEmpty()
  @IsEmail()
  login: string;

  @ApiProperty({ example: '12345678', description: 'Parol kerak' })
  @IsNotEmpty()
  @IsString()
  password: string;
}