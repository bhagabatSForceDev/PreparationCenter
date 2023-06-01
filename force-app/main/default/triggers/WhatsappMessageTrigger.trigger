trigger WhatsappMessageTrigger on WA_Message__c (before insert,before update,after insert,after update) {

    if(Trigger.isInsert && Trigger.isAfter){
        WhatsappMessageTriggerHandler.determineMessage(trigger.new);
    }
}