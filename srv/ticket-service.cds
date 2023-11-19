using seidor.tabla as tabla from '../db/schema';

@protocol: ['rest','odata-v4' ]
service TicketService @(path: 'ticketService') {
    
    entity Ticket as projection on tabla.Ticket;
}
