import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

const HEROS_INFO = {
    'Home': { imageName: '/sfsites/c/resource/CommunityBanners_1/Banner_Inicio.png' },
    
    'Home_uq__c': { imageName: '/sfsites/c/resource/Uq_Community.png' },
}

export default class Uq_hero extends LightningElement {

    @api imageHeight;

    @track currentHeroInfo;

    currentPageName;

    @wire(CurrentPageReference)
    getPageRef(data) {
        this.currentHeroInfo = HEROS_INFO[data.attributes.name];
    }

    renderedCallback() {
        document.documentElement.style.setProperty('--imageHeight', this.imageHeight + 'px');
    }

}