import { LightningElement, api, wire, track } from "lwc";
import isGuest from "@salesforce/user/isGuest";
//import propertyName from "@salesforce/community/basePath";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
//import postTweet from "@salesforce/apex/HBT_TwitterAPI_WS.postTweet";
//import getIdOfertaGym from "@salesforce/apex/HBT_ConsultarOfertasDMU_Controller.getIdOfertaGym";

import { NavigationMixin } from "lightning/navigation";

const ESTADOS_MODAL = Object.freeze({
  NoModal: 1,
  ModalAbierto: 2
});

const ESTADOS_COMPONENTE = Object.freeze({
  Cargando: 1,
  ConContenido: 2,
  Interno: 3,
  Invitado: 4,
  Error: 5
});
export default class Hbt_panel_inscripcionGYM extends NavigationMixin(
  LightningElement
) {
  @api labelGimnasio; //= "Inscripción Gimnasio";
  @api navigateTo;

  isGym = true;
  @track
  redSocial;
  idOferta;
  /**
   * Estado actual de los modales
   */
  estadoActualModal = ESTADOS_MODAL.NoModal;

  /**
   * Estado actual del componente
   */
  estadoActualComponente = ESTADOS_COMPONENTE.Cargando;

  //-------------------------------------------------------------------------------------------------------------//
  //                                         Getters and Setters                                                 //
  //-------------------------------------------------------------------------------------------------------------//

  get modalAbierto() {
    return this.estadoActualModal === ESTADOS_MODAL.ModalAbierto;
  }

  get noModal() {
    return this.estadoActualModal === ESTADOS_MODAL.NoModal;
  }

  get interno() {
    return this.estadoActualComponente === ESTADOS_COMPONENTE.Interno;
  }

  get externo() {
    return this.estadoActualComponente === ESTADOS_COMPONENTE.Externo;
  }

  //-------------------------------------------------------------------------------------------------------------//
  //                                             Lifecycle Hooks                                                 //
  //-------------------------------------------------------------------------------------------------------------//

  connectedCallback() {
    if (isGuest) {
      this.estadoActualComponente = ESTADOS_COMPONENTE.Externo;
    } else {
      this.estadoActualComponente = ESTADOS_COMPONENTE.Interno;
    }
  }

  //-------------------------------------------------------------------------------------------------------------//
  //                                                    Eventos                                                  //
  //-------------------------------------------------------------------------------------------------------------//

  handleMostrar() {
    this.mostrar = !this.mostrar;
  }

  manejoCerrarModal() {
    this.estadoActualModal = ESTADOS_MODAL.NoModal;
  }

  manejoRedSocial = (redSocial) => {
    this.redSocial = redSocial;
    this.estadoActualModal = ESTADOS_MODAL.ModalAbierto;
  };

  manejoCompartir() {
    //if (this.redSocial === "Twitter") {
    //  let oauth_token = this.getUrlParamValue(
    //    window.location.href,
    //    "oauth_token"
    //  );
    //  let oauth_verifier = this.getUrlParamValue(
    //    window.location.href,
    //    "oauth_verifier"
    //  );
    //
    //  if (oauth_token != null && oauth_verifier != null) {
    //    postTweet({
    //      oauth_token: oauth_token,
    //      oauth_verifier: oauth_verifier,
    //      idOferta: this.idOferta,
    //      community: propertyName,
    //      isGym: this.isGym
    //    })
    //      .then((res) => {
    //        res = JSON.parse(res);
    //        if (!res.errors) {
    //          this.dispatchEvent(
    //            new ShowToastEvent({
    //              title: "Confirmacion",
    //              message:
    //                "Se ha compartido la oferta en su Twitter! Revíselo {0}",
    //              variant: "success",
    //              messageData: [
    //                {
    //                  url: "https://twitter.com/w/status/" + res.id_str,
    //                  label: "aquí"
    //                }
    //              ]
    //            })
    //          );
    //          setTimeout(() => {
    //            window.location = window.location.href.split("?")[0];
    //          }, 7000);
    //        } else {
    //          if (res.errors[0].code === 187) {
    //            this.mostrarNotificacionToast(
    //              "ERROR",
    //              "No es posible compartir un tweet con el mismo contenido",
    //              "error"
    //            );
    //          } else {
    //            this.mostrarNotificacionToast(
    //              "ERROR",
    //              "Se produjo un error intentelo nuevamente",
    //              "error"
    //            );
    //          }
    //          setTimeout(() => {
    //            window.location = window.location.href.split("?")[0];
    //          }, 7000);
    //        }
    //      })
    //      .catch((err) => {
    //        this.mostrarNotificacionToast(
    //          "ERROR",
    //          "Se produjo un error intentelo nuevamente",
    //          "error"
    //        );
    //
    //        console.log(err);
    //      });
    //  } else {
    //    this.mostrarNotificacionToast(
    //      "ERROR",
    //      "Se produjo un error intentelo nuevamente",
    //      "error"
    //    );
    //  }
    //}
    //this.estadoActualModal = ESTADOS_MODAL.NoModal;
  }

  handleFormularioGym() {
    this[NavigationMixin.Navigate]({
      type: "comm__namedPage",
      attributes: {
        name: this.navigateTo //"custom_inscripcion_gimnasio__c"
      }
    });
  }

  mostrarNotificacionToast(title, message, variant) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: title,
        message: message,
        variant: variant
      })
    );
  }

  getUrlParamValue(url, key) {
    return new URL(url).searchParams.get(key);
  }
}