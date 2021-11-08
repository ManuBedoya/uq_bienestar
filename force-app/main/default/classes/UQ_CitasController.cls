public without sharing class UQ_CitasController {

    @AuraEnabled()
    public static List<UQ_Agenda_cita__c> obtenerCitasDisponibles(Date fechaSeleccionada){

        Date fecha = System.today();
        
        List<UQ_Agenda_cita__c> citasList = [SELECT Id, Name, UQ_Psicologo__c, 
        UQ_Inicio_evento__c, UQ_Fin_evento__c,UQ_Name_Owner__c,UQ_Fecha_Inicio__c,UQ_Hora_Inicio__c
        FROM UQ_Agenda_cita__c
        //WHERE DAY_ONLY(UQ_Inicio_evento__c) =: fecha
        ];

        return citasList; 
    }
}