import { LightningElement, wire, track, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
//para redirrecionar
import { NavigationMixin } from 'lightning/navigation';
import { FlowNavigationFinishEvent } from 'lightning/flowSupport';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import obtenerCitasDisponibles from '@salesforce/apex/UQ_CitasController.obtenerCitasDisponibles';

//import obtenerCitasDisponibles from '@salesforce/apex/HBT_GestionarCitaController.obtenerCitasDisponibles';
const estadosComponente = Object.freeze({
    "cargando": 1,
    "conContenido": 2,
    "error": 3
})

 // campos para enviar notificacion en caso de atención en crisis


 export default class Uq_citasDisponiblesPsicologia extends NavigationMixin(LightningElement) {
     
     //─────────────────────────────────────────────────────────────────────────────────────────────────//
    //                                      ATRIBUTOS NORMALES                                         //
    //─────────────────────────────────────────────────────────────────────────────────────────────────//
    
    @api nombreArea;

    siteSelecionado;
    lugarOptiones = [];
    urlIdSede;
    @track totalRegistros;
    @track listaCitas;
    @track tableVisible = false;

    connectedCallback() {
        //options.push({ label: data[key].Name, value: data[key].Id  });
        this.lugarOptiones.push({ label: 'Bienestar Institucional', value: 1  });
        this.handledObtenerCitasDisponibles();
    }

    //selecciona lugar
    hanledChangeLugar(event){
        //se inicializa la especialidad
        this.siteSelecionado = event.detail.value;
        console.log('lugar seleccionada '+this.siteSelecionado);
    }
 
    handledObtenerCitasDisponibles(){

       //this.cambiarEstado(estadosComponente.cargando);

       obtenerCitasDisponibles({ })
       .then((data)=>{

            if(data){
                this.cambiarEstado(estadosComponente.conContenido);
                //se accede al map enviado por el controler y se extrae la info de citas  
                //this.lista = data;
                console.log('tamaño consultas ' + data.length);
                console.log('datos consultas ' + JSON.stringify(data));
                this.listaCitas = data;
                this.tableVisible = true;
                this.urlIdSede = true;
                //let json = JSON.stringify(data);
                //let head = `<thead><tr class="slds-line-height_reset"><th aria-label="Name" aria-sort="none" class="slds-is-resizable slds-is-sortable" scope="col"><span class="slds-truncate" title="Name">Name</span></th></tr></thead>`
                //let table = document.getElementById('table_pscology');
                //console.log(table);
                //se accede al map enviado por el controler y se extrae la info de citas totales
                this.totalRegistros = this.listaCitas.length;
            } else{
                //this.cambiarEstado(estadosComponente.conContenido);
                //this.alertVisible = true;
            }
            
       }).catch(error=>{
           //alert('Error 69 citas',  error);
           console.log('Error obtener citas',  JSON.stringify(error));
       })
    }
    
    hanledAgendarCita(event){
        let idReserva = event.currentTarget.dataset.key;
        console.log('handle agendar '+idReserva);
    }

    //gettter to return items which is mapped with options attribute
    get sedeOptiones() {
        return this.itemsSedes;
    }
 
    //getter to return items which is mapped with options attribute
    get especialidadOptiones() {
        return this.itemsEspecialidades;
    }

    //gettter to return items which is mapped with options attribute
    get profesionalOptiones() {
        return this.itemsProfesionales;
    }

     manejoCerrarModal() {
		this.modalCuestionarioVisible =false;
	}
 
    //selecciona profesional
    hanledChangeFecha(event){
        this.fechaSelecionada = event.detail.value;
        console.log('fecha seleccionada '+ this.fechaSelecionada);
    }

    //metodo para redireccionar a la page de citas disponibles
    handleIrAtras(event){
        this[NavigationMixin.Navigate]({
            type: "comm__namedPage",
            attributes: {
                name: "Home",
            },
        });
    }

    /* Paginador */
    hanledInicio(){
        this.paginaActual = 1;
        this.botonAtrasVisible = true;
        this.botonInicioVisible = true;
        this.botonFinVisible = false;
        this.botonSiguienteVisible = false;
        this.handledObtenerCitasDisponiblesPaginador(this.idEspecialidad);
    }

    hanledAtras(){
        this.paginaActual = this.paginaActual - 1;
        if(this.paginaActual == 1){
            this.botonAtrasVisible = true;
            this.botonInicioVisible = true;
        }
        this.botonFinVisible = false;
        this.botonSiguienteVisible = false;
        this.handledObtenerCitasDisponiblesPaginador(this.idEspecialidad);
    }

    hanledSiguiente(){
        if(this.paginaActual == 1){
            this.botonAtrasVisible = false;
            this.botonInicioVisible = false;
        }
        this.paginaActual = this.paginaActual + 1;
        if(this.paginaActual == this.paginasTotal){
            this.botonSiguienteVisible = true;
            this.botonFinVisible = true;
        }
        this.handledObtenerCitasDisponiblesPaginador(this.idEspecialidad);
    }

    hanledFin(){
        this.paginaActual = this.paginasTotal;
        this.botonSiguienteVisible = true;
        this.botonFinVisible = true;
        this.botonInicioVisible = false;
        this.botonAtrasVisible = false;
        this.handledObtenerCitasDisponiblesPaginador(this.idEspecialidad);
    }
 
     //metodo para redireccionar a la page de citas Agendadas
    handleCitasAgendadas(event){
        var sede = event.currentTarget.dataset.key;
                this[NavigationMixin.Navigate]({
                type: "comm__namedPage",
                attributes: {
                    name: "Citas_Agendadas_Psicologia__c",
                },
                state: {
                    Sede: sede,
                },
            });
    }
 
     /* Paginador */
 
    cambiarEstado(estado) {
       switch (estado) {
           case estadosComponente.cargando:
               this.SedeVisible = false;
               this.cargandoVisible = true;
               this.tableVisible = false;
               this.errorVisible = false;
               this.alertVisible = false;
               break;
           case estadosComponente.conContenido:
               this.SedeVisible = true;
               this.cargandoVisible = false;
               this.tableVisible = true;
               this.errorVisible = false;
               break;
           case estadosComponente.error:
               this.cargandoVisible = false;
               this.tableVisible = false;
               this.errorVisible = true;
               break;
           case estadosComponente.reprogramar:
               this.SedeVisible = true;
               this.cargandoVisible = false;
               this.errorVisible = false;
               this.alertVisible = false;
               break;
           default:
               this.cargandoVisible = false;
               this.tableVisible = false;
               break;
       }
    }
 
    cerrarmodalValidacionEncuesta(){

        console.log("Cerro modal Validacion Encuestas Pendientes");

        this.validarEncuestasP = false;

    }

    mostrarNotificacionToast(title, message, variant,modo) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
                mode : modo
            })
        );
    }
 }