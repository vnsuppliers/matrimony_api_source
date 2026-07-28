import {
  IsString,
  IsInt,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

/**
 * Base configuration layout shared across all operations
 */
export class MotherTongueMasterDto {
  @IsString()
  @IsNotEmpty({ message: 'Language name field cannot be empty' })
  @MaxLength(255, { message: 'Language name must be less than 255 characters' })
  name!: string;

  @IsInt({ message: 'Status parameter value must be a valid integer' })
  @Min(0, { message: 'Status flag baseline lower limit boundary value is 0' })
  @Max(1, { message: 'Status flag boundary upper value threshold limit is 1' })
  @IsOptional()
  status?: number = 1;
}

/**
 * Explicit contract mapping for incoming registration request bodies
 */
export class CreateMotherTongueDto extends MotherTongueMasterDto {}
