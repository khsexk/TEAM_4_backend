import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateFriendsRoomDto } from './dto/friends-create.dto';
import { FriendsService } from './friends.service';

@ApiTags('Multi - Friends')
@Controller('mode/friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  // @Get()
  // getFriendsRoomList(){

  // }

  @ApiHeader({
    name: 'Authorization',
    description: 'eyJhGcioJ와 같은 accessToken',
  })
  @ApiBody({
    description: '비로그인 유저는 닉네임, 로그인 유저는 null',
    schema: {
      example: { nick: 'example' },
    },
  })
  @ApiResponse({
    description: 'unauthorized error',
    status: 401,
    schema: {
      example: { success: false, code: 401, data: 'unauthorized error' },
    },
  })
  @ApiResponse({
    description: '친구방 만들기 성공',
    status: 200,
    schema: {
      example: {
        room: 'new room = { roomid(uuid v4), host(SnsId), headCount(0), status(FRIENDS) }',
      },
    },
  })
  @ApiOperation({ summary: '친구방 만들기' })
  @Post('')
  async createFriendsRoom(
    @Headers('Authorization') token: any,
    @Body('nick') nick: string,
  ) {
    return await this.friendsService.createFriendsRoom(nick, token);
  }
  @ApiParam({
    name: 'roomid',
    description: '입장하려는 방 코드',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'eyJhGcioJ와 같은 accessToken',
  })
  @ApiBody({
    description: '비로그인 유저는 닉네임, 로그인 유저는 null',
    schema: {
      example: { nick: 'example' },
    },
  })
  @ApiResponse({
    description: 'not exist room',
    status: 404,
    schema: {
      example: { success: false, code: 404, data: 'unknown error' },
    },
  })
  @ApiResponse({
    description: '로그인 유저 - 친구방 입장 성공',
    status: 200,
    schema: {
      example: {
        room: 'new room = { roomid, host, headCount(++), status(FRIENDS) }',
        memberList: '방에 입장 member들을 Array로 반환',
        userList: '방에 입장 user들을 Array로 반환',
      },
    },
  })
  @ApiOperation({ summary: '친구방 입장하기' })
  @Post(':roomid')
  async getFriendsRoom(
    @Param('roomid') roomid: string,
    @Headers('Authorization') token: any,
    @Body('nick') nick: string,
    @Body('imgCode') imgCode: string,
  ) {
    return await this.friendsService.getFriendsRoom(roomid, token, nick, imgCode);
  }

  @ApiParam({
    name: 'roomid',
    description: '방 코드',
  })
  @ApiQuery({
    name: 'perPage',
    description: '몇 개의 메세지를 가져올 것인지',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    description: '얼마나 건너뛸 것인지',
    example: 1,
  })
  @ApiResponse({
    description: '친구방 채팅 가져오기 성공',
    status: 200,
    schema: {
      example: {
        roomChats: '생성 역순으로 채팅 여러 개를 가져옴',
      },
    },
  })
  @ApiOperation({ summary: '친구방 채팅 가져오기' })
  @Get(':roomid/chats')
  async getFriendsRoomChats(
    @Param('roomid') roomid: string,
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return await this.friendsService.getFriendsRoomChats(roomid, perPage, page);
  }

  @ApiHeader({
    name: 'Authorization',
    description: 'eyJhGcioJ와 같은 accessToken',
  })
  @ApiParam({
    name: 'roomid',
    description: '입장하려는 방 코드',
  })
  @ApiBody({
    description: '비로그인 유저는 memberId, 로그인 유저는 0',
    schema: {
      example: {
        content: 'hello',
        memberId: 3,
      },
    },
  })
  @ApiResponse({
    description: 'not exist room / no member',
    status: 404,
    schema: {
      example: { success: false, code: 404, data: 'unknown error' },
    },
  })
  @ApiResponse({
    description: '친구방 채팅 생성 성공',
    status: 200,
    schema: {
      example: {
        response: '/room-friends-roomid room으로 메세지 전송',
      },
    },
  })
  @ApiOperation({ summary: '친구방 채팅 생성하기' })
  @Post(':roomid/chats')
  async createFriendsRoomChats(
    @Headers('Authorization') token: any,
    @Param('roomid') roomid: string,
    @Body('content') content: string,
    @Body('memberId') memberId: number,
  ) {
    return await this.friendsService.creatFriendsRoomChats(
      token,
      roomid,
      content,
      memberId,
    );
  }

  @ApiParam({
    name: 'roomid',
    description: '삭제하려는 방 코드',
  })
  @ApiResponse({
    description: '친구방 삭제 생성 성공',
    status: 200,
    schema: {
      example: {
        result: 'success',
      },
    },
  })
  @ApiResponse({
    description: '친구방 삭제 생성 실패 (roomid 오류)',
    status: 404,
    schema: {
      example: {
        result: 'fail',
      },
    },
  })
  @ApiOperation({ summary: '친구방 삭제하기' })
  @Delete(':roomid')
  async removeFriendsRoomChats(
    @Param('roomid') roomid: string,
  ) {
    return await this.friendsService.removeFriendsRoom(roomid);
  }
}