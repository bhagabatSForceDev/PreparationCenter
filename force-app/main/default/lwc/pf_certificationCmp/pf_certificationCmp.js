import { LightningElement, wire } from 'lwc';
import getCertifications from '@salesforce/apex/PortfolioController.getCertifications';
import Icons from '@salesforce/resourceUrl/Icons';
export default class Pf_certificationCmp extends LightningElement {


    activeSections=['SFCert','OtherCert'];
    sfCerts=[];
    otherCerts=[];



    @wire(getCertifications) gettingCerts(result){
        if(result.data){
            this.sfCerts=[];
            this.otherCerts=[];
            console.table(result.data);
            for(let obj of result.data){
                if(obj.Is_SF__c)
                    this.sfCerts.push({...obj,iconUrl: `${Icons}/Icons/sfIcon.png`});
                else
                    this.otherCerts.push({...obj,iconUrl: `${Icons}/Icons/otherCertIcon.png`});
            }
        console.log('this.sfCerts.push(obj): '+this.sfCerts);
        console.log('this.otherCerts.push(obj): '+this.otherCerts);
        }
        if(result.error){
            console.error('result.error:'+JSON.stringify(result.error));
        }
    }
}