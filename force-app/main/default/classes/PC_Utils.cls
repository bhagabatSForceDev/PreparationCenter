public without sharing class PC_Utils {
    
    @AuraEnabled(cacheable=true)
    public static List<Question__c> getAllQuestions(){
        return [SELECT Id, Name, Question_Text__c, Question_Type__c, Subject__c,Answer_Text__c, Summary__c FROM Question__c ORDER BY Name DESC];
    }
    
    
    //Gets question details based on question number from url
    @AuraEnabled
    public static Question__c getQuestionDetails(String questionNum){
        try {
            Question__c q=[SELECT Id, Name, Question_Text__c, Question_Type__c, Subject__c,Answer_Text__c, Summary__c FROM Question__c WHERE Name=: questionNum LIMIT 1];
            return q;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //Gets updates the question details
    @AuraEnabled
    public static void updateQuestion(String q){
        system.debug('q:'+q);
        Question__c q1=(Question__c)JSON.deserialize(q,Question__c.class);
        try {
            Database.update(q1);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //Deletes the question
    @AuraEnabled
    public static void deleteQuestion(String q){
        system.debug('q:'+q);
        Question__c q1=(Question__c)JSON.deserialize(q,Question__c.class);
        try {
            delete q1;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}