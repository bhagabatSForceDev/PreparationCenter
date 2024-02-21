import { wire,LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class Table_FlowParent extends NavigationMixin( LightningElement ) {

    handleStatusChange(event){
        console.log('Status Changed: '+event.detail.status);
        if(event.detail.status == 'FINISHED'){
            alert('Fin..');
            //Finish Behavior -- Should redirect to view table page with Id.
            const outputVariables = event.detail.outputVariables;
            for(let obj of outputVariables){
                if(obj.name='createdTableId'){
                    console.log('Navigating to ',`${'/viewtablepage?tableid='+obj.value}`);
                    let redirectUrl='/viewtablepage?tableid='+obj.value;
                    alert(redirectUrl);
                    this[NavigationMixin.Navigate]({
                        type: 'standard__webPage',
                        attributes: {
                            url: redirectUrl
                        }},true);
                      
                    }
                    //window.location.href='/viewtablepage?tableid='+obj.value;
                    //alert('Table Id: '+obj.value);
                }
            }
        }
    }