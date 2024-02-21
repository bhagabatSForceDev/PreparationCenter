import {LightningElement} from 'lwc';
const SERVER_URL='http://localhost:3004';
export default class Home extends LightningElement{

    expenseRecords=[];
    async connectedCallback(){
        
        const expenses=await this.getExpenses();
        console.log('EXPENSES: '+JSON.stringify(expenses));
        this.expenseRecords=expenses.totalSize>0?expenses.records:[];
    }

    //Method to get Expenses.
    async getExpenses(){
        const url=SERVER_URL+'/expenses';
        return await this.makeApiRequest(url);
    }

    //Generic API method
    async makeApiRequest(url,method='GET',data=null){
        try{
            console.log('url:'+url);
            const requestOptions={method,
            headers:{
                'content-type': 'application/json'
            },
            body:data?JSON.stringify(data):null};
            const response=await fetch(url,requestOptions);
            if(!response.ok){
                throw new Error(response.statusText);
            }else{
                return response.json()
            }

        }catch(error){
            console.error(JSON.stringify(error));
        }
    }
}