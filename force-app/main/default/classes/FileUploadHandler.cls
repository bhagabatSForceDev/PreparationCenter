public without sharing class FileUploadHandler {
    
    @AuraEnabled
    public static String readFileData(String filedata){
        Object obj= JSON.deserializeUntyped(filedata);
        System.debug('obj:'+obj);
    }

}
