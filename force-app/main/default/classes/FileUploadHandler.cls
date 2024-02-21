public without sharing class FileUploadHandler {
    
    @AuraEnabled
    public static String readFileData(String filedata){
        Map<String,Object> obj= (Map<String,Object>)JSON.deserializeUntyped(filedata);
        System.debug('obj:'+obj);
        String contentVersionId=(String)obj.get('contentVersionId');
        System.debug('contentVersionId: '+contentVersionId);
        System.debug('contentBodyId:'+obj.get('contentBodyId'));
        ContentVersion cv=[SELECT Id,VersionData FROM ContentVersion WHERE Id=: contentVersionId];
        return EncodingUtil.base64Encode(cv.VersionData);
    }

}