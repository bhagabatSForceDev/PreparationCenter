public without sharing class PortfolioController {
    @AuraEnabled(cacheable=true)
    public static List<scWrapper> getSocialMedia(){
        try {
            List<Social_Media__c> scList = [SELECt Id,Active__c,Icon_URL__c,Type__c,URL__c FROM Social_Media__c WHERE Contact__c=: System.Label.contactId AND Active__c=true];
        
            Set<string> sRNameSet=new Set<String>();
            for(Social_Media__c sc: scList){
                sRNameSet.add(sc.Icon_URL__c);
            }
            // List<StaticResource> srList= [SELECT Id,Name FROM StaticResource WHERE Name IN: sRNameSet];
            // Map<String,Id> srNameToIdMap= new Map<String,Id>();
            // for(StaticResource sr: srList){
            //     srNameToIdMap.put(sr.Name,sr.Id);
            // }

            List<scWrapper> retList= new List<scWrapper>();
            for(Social_Media__c sc: scList){
                scWrapper scw= new scWrapper();
                scw.url=sc.URL__c;
                scw.ssid=sc.Id;
                scw.iconUrl=sc.Icon_URL__c;
                retList.add(scw);
            }

            return retList;
        
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static Contact getContactDetails(){
        try {
            return [SELECT Id,Description,Summary__c,Work_Summary__c FROM Contact WHERE Id=: System.Label.contactId LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Work_Experience__c> getWorkExperiences(){
        try {
           return [SELECT Id,Title__c,Company__c,To_Date__c,From_Date__c,Description__c FROM Work_Experience__c WHERE Contact__c =: System.Label.contactId]; 
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Skill__c> getSkills(){
        try {
            List<Skill__c> arList=[SELECT Id,Name,Contact__c,Proficiency__c,Section__c,Skill_Value__c FROM Skill__c WHERE Contact__c =: System.Label.contactId
            ORDER BY Section__c ASC,Skill_Value__c DESC];

            return arList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Education__c> getEducation(){
        try {
            List<Education__c> eduList=[SELECT Id,Name,Contact__c,Institution__c,Passing_Date__c FROm Education__c where Contact__c=: System.Label.contactId
             ORDER BY Passing_Date__c DESC];

             return eduList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled(cacheable=true)
    public static List<Certification__c> getCertifications(){
        try {
           List<Certification__c> certList=[SELECT Id,Is_SF__c,Name FROM Certification__c WHERE Contact__c =: System.Label.contactId ORDER BY CreatedDate DESC]; 
        return certList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled(cacheable=true)
    public static List<Project__c> getProjects(){
        try {
            List<Project__c> projList=[SELECT Id,Name FROM Project__c WHERE Contact__c =: System.Label.contactId ORDER BY CreatedDate DESC]; 
         return projList;
         } catch (Exception e) {
             throw new AuraHandledException(e.getMessage());
         }
    }


    @AuraEnabled(cacheable=true)
    public static Project__c getProjectDetails(String projectId){
        try {
            List<Project__c> projList=[SELECT Id,Name,Demo_URL__c,Project_Description__c,YT_Url__c FROM Project__c WHERE Id=:projectId];
            if(!projList.isEmpty()){
                return projList[0];
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return null;
    }

    public class scWrapper{
        @AuraEnabled 
        public String url{get;set;}
        @AuraEnabled 
        public String ssid{get;set;}
        @AuraEnabled
        public String iconUrl{get;set;}
    }
}