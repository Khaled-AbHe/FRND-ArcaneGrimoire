import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreateSpellDto } from '../dtos/create-spell.dto';
import { UpdateSpellDto } from '../dtos/update-spell.dto';
import { ReplaceAllSpellsDto } from '../dtos/replace-all-spells.dto';
import { SpellTemplateDto } from '../dtos/spell-template.dto';
import { SpellsService } from '../service/spells.service';
import { AuthGuard } from '../../currentUser/guards/auth.guard';
import { AdminGuard } from '../../currentUser/guards/admin.guard';
import { CurrentUser } from '../../currentUser/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users/users.service';

@Controller('spells')
@UseGuards(AuthGuard)
export class SpellsController {
  constructor(
    private readonly spellsService: SpellsService,
    private readonly usersService: UsersService,
  ) {}

  // ── Current user routes ────────────────────────────────────────────────────

  // GET /spells — get current user's spells
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.spellsService.findAllForUser(user.userId);
  }

  // GET /spells/:id
  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.spellsService.findSpellByIdForUser(id, user.userId);
  }

  // POST /spells/create
  @Post('/create')
  create(@Body() dto: CreateSpellDto, @CurrentUser() user: User) {
    return this.spellsService.createForUser(dto, user);
  }

  // PUT /spells/update/:id
  @Put('/update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSpellDto,
    @CurrentUser() user: User,
  ) {
    return this.spellsService.updateForUser(id, dto, user.userId);
  }

  // DELETE /spells/delete/:id
  @Delete('/delete/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.spellsService.removeForUser(id, user.userId);
  }

  // POST /spells/replaceAll
  @Post('/replaceAll')
  replaceAll(@Body() dto: ReplaceAllSpellsDto, @CurrentUser() user: User) {
    return this.spellsService.replaceAllForUser(dto, user);
  }

  // POST /spells/template — no ownership needed, pure calculation
  @Post('/template')
  getTemplate(@Body() dto: SpellTemplateDto) {
    return this.spellsService.getTemplate(dto);
  }

  // ── Admin routes ───────────────────────────────────────────────────────────

  // GET /spells/admin/:userId — view any user's spells
  @UseGuards(AdminGuard)
  @Get('/admin/:userId')
  findAllForUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.spellsService.findAllForTargetUser(userId);
  }

  // POST /spells/admin/:userId/create — add a spell to any user's collection
  @UseGuards(AdminGuard)
  @Post('/admin/:userId/create')
  async createForUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: CreateSpellDto,
  ) {
    const targetUser = await this.usersService.findUserById(userId);
    return this.spellsService.createForTargetUser(dto, targetUser);
  }
}
