import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { getEventsParamsDto } from './event.dto';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
    constructor(private eventService: EventService) {}

    @Get()
    async getAll(@Res() res,@Query() queries: getEventsParamsDto) {
        this.eventService.getAll(queries).then((events) => {
            res.status(200).send(events);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }

    @Get(':id')
    async getById(@Param('id') id: string, @Res() res) {
        this.eventService.getById(id).then((event) => {
            event ? res.status(200).send(event) : res.status(404).send('Event not found');
        }).catch((err) => {
            res.status(500).send(err);
        });
}
}
