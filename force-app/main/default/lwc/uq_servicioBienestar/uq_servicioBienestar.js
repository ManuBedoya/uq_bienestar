/**
* ─────────────────────────────────────────────────────────────────────────────────────────────────┐
** Lightning Web Component que muestra el card de accedo a uno de los servicios de DMU.
* ──────────────────────────────────────────────────────────────────────────────────────────────────
* Desarrollado por:    Heinsohn Business Technology
* Autor:               Cristian Bonilla   <ccbonillar@uqvirtual.edu.co>
* Versión:             1.0
* Creada:              03/11/2021
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
import { LightningElement,api,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
//import Community_DMU_SVG from '@salesforce/resourceUrl/CommunityDMUSVG';

export default class Uq_servicioBienestar extends NavigationMixin(LightningElement) {
    @api name;
    @api imageSVGId;
    @api apiName;
    @api maxWidth;
    @track imageSVGURL = '';
    @track imagenformula = "";

    /**/
    connectedCallback() {
        this.imagenformula = "utility:record_update";
        if(this.imageSVGId != 'utility:record_update'){
            this.imagenformula = "utility:date_time";
        }
    } 

    handleSelection(event) {
        console.log('api name', this.apiName)
        this[NavigationMixin.Navigate]({
            type: "comm__namedPage",
            attributes: {
                name: this.apiName,
            },
        });
    }
}