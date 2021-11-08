/**
* ─────────────────────────────────────────────────────────────────────────────────────────────────┐
** Lightning Web Component que muestra los servicios de la aplicacion
* ──────────────────────────────────────────────────────────────────────────────────────────────────
* Autor:               Cristian Bonilla 
* Versión:             1.0
* Creada:              31/10/2021
* ──────────────────────────────────────────────────────────────────────────────────────────────────
* Cambios
*
*
** vX.X            Vivek_Chawla@Intuit.com
* 00/00/0000      Each change to this file should be documented by incrementing the version number,
*                 and adding a new entry to this changes list. Note that there is a single blank
*                 line between each changes entry.
* ─────────────────────────────────────────────────────────────────────────────────────────────────┘
*/
import { LightningElement, api, track, wire } from "lwc";
//import obtenerCantidadOfertas from "@salesforce/apex/HBT_ConsultarOfertasDMU_Controller.obtenerCantidadOfertas";
//import obtenerOfertas from "@salesforce/apex/HBT_ConsultarOfertasDMU_Controller.obtenerOfertas";

import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
/**
 * Estados del componente. No son aditivos (no pueden exixtir al tiempo)
 */
const ESTADOS_COMPONENTE = Object.freeze({
    Cargando: 0,
    SinOfertas: 1,
    ConOfertas: 2,
    Error: 3,
})

export default class Uq_componentesLayout extends LightningElement {

    /**
     * Nombre del primer componente
     */
    @api nombrePrimerComponente;

    /**
     * Nombre del segundo componente
     */
     @api nombreSegundoComponente;

    /**
     * Imagen del primer componente
     */
    @api imagenPrimerSVG_api;

    /**
    * Imagen del segundo componente
    */
    @api imagenSegundoSVG_api;

    /**
    * Imagen del segundo componente
    */
    @api redirectPrimerComponente_api;

    /**
    * Imagen del segundo componente
    */
    @api redirectSegundoComponente_api;

    /**
    * Información del error sobre el componente
    */
    @track servicioCitas = [];
    
    /**
     * Información del error sobre el componente
     */
    @track informacionError;

    /**
     * Campo para almacenar el nombre del icono del header
     */
    @track imageFullURL = "";

    /**
     * Cantidad total de ofertas
     */
    @track totalOfertas;

    /**
     * Campo para controlar la consulta paginada de ofertas
     */
    @track rangoOffset;

    /**
     * Número de la página actual
     */
    @track numeroPaginaActual;

    /**
     * Lista de ofertas a mostrar
     */
    @track ofertasDMU;

    /**
     * Controla si el botón anterior se deshabilita
     */
    @track disabledBtnAnterior;

    /**
     * Controla si el botón siguiente se deshabilita
     */
    @track disabledBtnSiguiente;

    cantidadPaginas = 0;

    /**
     * Campo para asignar el valor por defecto del combobox de tipo de actividad
     */
    @api valorTipoActividad;

    /**
     * Estado actual del componente
     */
    @track estadoActualComponente = ESTADOS_COMPONENTE.ConOfertas;

    /**
     * Hace posible el refreshApex de servicios wire
    */
    wiredActivities;

    subscription = null;
    //-------------------------------------------------------------------------------------------------------------//
    //                                         Getters and Setters                                                 //
    //-------------------------------------------------------------------------------------------------------------//

    get cargando() {
        return this.estadoActualComponente === ESTADOS_COMPONENTE.Cargando;
    }

    get sinOfertas() {
        return this.estadoActualComponente === ESTADOS_COMPONENTE.SinOfertas;
    }

    get conOfertas() {
        return this.estadoActualComponente === ESTADOS_COMPONENTE.ConOfertas;
    }

    get error() {
        return this.estadoActualComponente === ESTADOS_COMPONENTE.Error;
    }

    get selectorActividades() {
        return this.estadoActualComponente === ESTADOS_COMPONENTE.ConOfertas || this.estadoActualComponente === ESTADOS_COMPONENTE.SinOfertas;
    }

    get esDocente() {
        return propertyName === "/docentesadministrativos/s"
    }

    /**
     * Propiedad usada en la lista de selección del tipo de actividad
    
    get opcionesTipoActividad() {
        //* Opciones para usuarios públicos
        if (esUsuarioInvitado) {
            switch (this.nombreArea) {
                case "Cultura":
                    return [
                        { label: "Eventos Culturarte", value: "Culturarte" },
                    ];
                case "Psicologia":
                    return [
                        { label: "Todos", value: "Todos" },
                    ];
                    break;
                case "Medicina":
                    return [
                        { label: "Todos", value: "Todos" },
                    ];
                    break;
                case "Deporte":
                    return [
                        { label: "Actividades Deportivas", value: "" }
                    ];
                default:
                    return [
                        { label: "Grupo cultural", value: "Grupo cultural" },
                        { label: "Evento", value: "evento" }
                    ];
            }
        }
        else if (this.esDocente) {
            switch (this.nombreArea) {
                case "Cultura":
                    return [
                        { label: "Todos", value: "Todos" },
                        { label: "Grupo cultural", value: "Grupo cultural" },
                        { label: "Eventos Culturarte", value: "Culturarte" },
                    ];
                    break;
                case "Psicologia":
                    return [
                        { label: "Todos", value: "Todos" },
                    ];
                    break;
                case "Medicina":
                    return [
                        { label: "Todos", value: "Todos" },
                    ];
                    break;
                case "Deporte":
                    return [
                        { label: "Actividades Deportivas", value: "" }
                    ];
                    break;
                default:
                    return [
                        { label: "Grupo cultural", value: "Grupo cultural" },
                        { label: "Evento", value: "evento" }
                    ];
            }
        }
        //* Opciones para usuarios internos
        else {
            switch (this.nombreArea) {
                case "Cultura":
                    return [
                        { label: "Todos", value: "Todos" },
                        { label: "Grupo cultural", value: "Grupo cultural" },
                        { label: "Incentivo", value: "Incentivos" },
                        { label: "Insignia", value: "Insignia" },
                        { label: "Eventos Culturarte", value: "Culturarte" },
                    ];
                    break;
                case "Psicologia":
                    return [
                        { label: "Todos", value: "Todos" },
                    ];
                    break;
                case "Medicina":
                    return [
                        { label: "Todos", value: "Todos" },
                    ];
                    break;
                case "Deporte":
                    return [
                        { label: "Actividades Deportivas", value: "" }
                    ];
                    break;
                default:
                    return [
                        { label: "Grupo cultural", value: "Grupo cultural" },
                        { label: "Evento", value: "evento" }
                    ];
            }
        }
    }  */

    get incluirFiltros() {
        return this.opcionesTipoActividad.map(e => e.value);
    }

    //-------------------------------------------------------------------------------------------------------------//
    //                                              Servicios Wire                                                 //
    //-------------------------------------------------------------------------------------------------------------//

    /**
     * Método para obtener la cantidad de ofertas del área ingresada como parámetro para un periodo acádemico
     
    @wire(obtenerCantidadOfertas, { nombreArea: "$nombreArea", tipoActividad: "$valorTipoActividad", incluirFiltros: "$incluirFiltros" })
    wiredOfertas(value) {
        this.wiredActivities = value;
        const { data, error } = value;
        console.log("Obtener ofertas y total por WIRE " + data);
        this.totalOfertas = data;
        this.rangoOffset = 0;
        this.disabledBtnAnterior = true;
        this.disabledBtnSiguiente = true;
        if (data) {
            this.cantidadPaginas = Math.ceil(this.totalOfertas / this.cantidadRegistroPorPagina);
            this.consultarOfertas("consultaInicial");
        }
        else if (!data) {
            this.estadoActualComponente = ESTADOS_COMPONENTE.SinOfertas;
        }
        else if (error) {
            console.log(error);
            this.mostrarError(error);
        }
    }*/

    //-------------------------------------------------------------------------------------------------------------//
    //                                             Lifecycle Hooks                                                 //
    //-------------------------------------------------------------------------------------------------------------//

    /**
     * Called when the element is inserted into a document. This hook flows from parent to child. You can’t access 
     * child elements because they don’t exist yet.
     */
    connectedCallback() {

    }

    /**
     * Called after every render of the component. This lifecycle hook is specific to Lightning Web Components, 
     * it isn’t from the HTML custom elements specification. This hook flows from child to parent.
     */
    renderedCallback() {
        //this.imageFullURL = `${Community_DMU_SVG}#Trazado5279`;

        //Revisar parametros para mostrar mensaje de cuando Twitter permita el acceso para compartir una oferta
        
    }

    //-------------------------------------------------------------------------------------------------------------//
    //                               Métodos Imperativos del Controlador APEX                                      //
    //-------------------------------------------------------------------------------------------------------------//

    manejoSeleccionTipoActividad(event) {
        this.estadoActualComponente = ESTADOS_COMPONENTE.Cargando;
        this.valorTipoActividad = event.detail.value;
    }

    //-------------------------------------------------------------------------------------------------------------//
    //                                         Métodos generales                                                   //
    //-------------------------------------------------------------------------------------------------------------//

    mostrarError(error) {
        this.informacionError = error;
        this.estadoActualComponente = ESTADOS_COMPONENTE.Error;
    }

    getUrlParamValue(url, key) {
        return new URL(url).searchParams.get(key);
    }

    //-------------------------------------------------------------------------------------------------------------//
    //                                            Eventos                                                          //
    //-------------------------------------------------------------------------------------------------------------//

}