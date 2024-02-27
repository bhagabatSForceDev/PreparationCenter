public with sharing class TestPF {
    @AuraEnabled(cacheable=true)
    public static Contact getContactDetails(){
        Contact con= new Contact();
        try {
            con=[SELECT Id,MobilePhone,Email,OtherAddress,Superbadges__c,Points__c,Title FROM Contact ORDER BY CREATEDDATE DESC LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }

        return con;
    }
}