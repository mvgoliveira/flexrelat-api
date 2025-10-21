import { Controller, Get, Post, Body, Param, UseGuards, Delete } from "@nestjs/common";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { SessionCookieAuthGuard } from "../auth/guards/session-cookie-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { SessionUser } from "../auth/interfaces/session-user.interface";

@Controller("messages")
@UseGuards(SessionCookieAuthGuard)
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Post()
    @UseGuards(SessionCookieAuthGuard)
    sendMessage(@CurrentUser() user: SessionUser, @Body() createMessageDto: CreateMessageDto) {
        return this.messagesService.sendMessage(user.id, createMessageDto);
    }

    @Get(":relatedType/:relatedId")
    findByRelated(
        @Param("relatedId") relatedId: string,
        @Param("relatedType") relatedType: string
    ) {
        return this.messagesService.findByRelated(relatedId, relatedType);
    }

    @Delete(":relatedType/:relatedId")
    clearAllMessages(
        @Param("relatedId") relatedId: string,
        @Param("relatedType") relatedType: string
    ) {
        return this.messagesService.clearAllMessages(relatedId, relatedType);
    }
}
