import { wire,LightningElement } from 'lwc';
import Icons from '@salesforce/resourceUrl/Icons';
export default class PF_UserDetailsAndStats extends LightningElement {


    rankUrl=`${Icons}/Icons/DoubleStarRanger.png`;

    isLoading=true;

    renderedCallback(){
        this.isLoading=false;
    }

    handleLoad(e){
        console.log('RECORD FORM LOADED!!');
        this.isLoading=false;
        console.log('e.detail: ',JSON.stringify(e.detail));
    }

}