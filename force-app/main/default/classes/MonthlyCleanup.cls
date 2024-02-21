global class MonthlyCleanup implements System.schedulable{

    global void execute(System.schedulableContext sc){
        List<To_Do_List__c> tdiList=[SELECT Id FROM To_Do_List__c WHERE CreatedDate< LAST_N_DAYS:30 AND Home__c=true];
        delete tdiList;
    }
}