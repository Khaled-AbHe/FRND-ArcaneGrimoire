import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../currentUser/decorators/current-user.decorator';
import { AuthGuard } from '../../currentUser/guards/auth.guard';
import { User } from '../../users/entities/user.entity';
import { CreateCharacterDto } from '../dtos/create-character.dto';
import { DuplicateCharacterDto } from '../dtos/duplicate-character.dto';
import { UpdateCharacterDto } from '../dtos/update-character.dto';
import { CharactersService } from '../service/characters.service';

@Controller('characters')
@UseGuards(AuthGuard)
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  // GET /api/characters — list current user's characters
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.charactersService.findAll(user.userId);
  }

  // GET /api/characters/:id
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.charactersService.findCharacterById(id, user.userId);
  }

  // GET /api/characters/:id/computed
  @Get('/:id/computed')
  getComputedStats(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.charactersService.getComputedStats(id, user.userId);
  }

  // POST /api/characters/create
  @Post('/create')
  create(@Body() dto: CreateCharacterDto, @CurrentUser() user: User) {
    return this.charactersService.create(dto, user);
  }

  // PUT /api/characters/update/:id
  @Put('/update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCharacterDto,
    @CurrentUser() user: User,
  ) {
    return this.charactersService.update(id, dto, user.userId);
  }

  // DELETE /api/characters/delete/:id
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.charactersService.remove(id, user.userId);
  }

  // POST /api/characters/:id/duplicate
  @Post('/:id/duplicate')
  duplicate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DuplicateCharacterDto,
    @CurrentUser() user: User,
  ) {
    return this.charactersService.duplicate(id, dto.name, user.userId, user);
  }

  // POST /api/characters/:id/rest/short
  @Post('/:id/rest/short')
  shortRest(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.charactersService.shortRest(id, user.userId);
  }

  // POST /api/characters/:id/rest/long
  @Post('/:id/rest/long')
  longRest(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.charactersService.longRest(id, user.userId);
  }
}
