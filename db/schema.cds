namespace seidor.tabla;

using {
  cuid,
  managed
} from '@sap/cds/common';

type Priority : String enum {
  Critico = '4';
  Alta    = '3';
  Media   = '2';
  Baja    = '1';
}

entity Cliente : managed {
  key ID            : UUID @(Core.Computed);
      Nombre        : String  @mandatory;
      Division      : String;
      Gestor        : String  @mandatory;
      Prioridad     : String;
      Frecuencia    : String;
      Integracion   : String;
      BTP           : String;
      to_ClienteLider      : Association to many LiderCliente
                          on to_ClienteLider.to_Cliente = $self;
      
}

entity LiderCliente : managed {
    key to_Cliente : Association to Cliente;
    key to_Lider: Association to Lider;
}

entity Lider : managed {
  key ID         : UUID @(Core.Computed);
      Nombre     : String  @mandatory;
      Plataforma : String;
      to_Ticket  : Association to many Ticket
                     on to_Ticket.to_Lider = $self;
      to_LiderCliente : Association to many LiderCliente
                     on to_LiderCliente.to_Lider = $self;

}

entity Consultor : managed {
  key ID        : UUID @(Core.Computed);
      Nombre    : String @mandatory;
      Puesto    : String @mandatory;
      to_Ticket : Association to many Ticket
                    on to_Ticket.to_Consultor = $self;
}


entity Ticket : managed {

  key ID              : UUID @(Core.Computed);
      FechaRegistro   : Timestamp;
      Periodo         : Date;
      NumTicket       : String(20);
      PrioridadTicket : String;
      to_Cliente      : Association to Cliente;
      Descripcion     : String;
      Tipo            : String;
      Estado          : String;
      DescEstado      : String;
      IdEstado        : Integer;
      to_Consultor    : Association to Consultor;
      to_Lider        : Association to Lider;
      HoraEstimada    : Decimal(16, 2);
      FechaEnvioEst   : Date;

}
