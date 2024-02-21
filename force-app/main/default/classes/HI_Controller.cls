public without sharing class HI_Controller {
    
    @AuraEnabled(cacheable=true)
    public static List<Item__c> getAllItems(){
        List<Item__c> allItems=[SELECT Id,Name,Container__c,Container_Name__c FROM Item__c ORDER BY Container__r.Name];
        return allItems;
    }
}