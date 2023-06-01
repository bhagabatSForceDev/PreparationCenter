@RestResource(urlMapping='/whatsapp/webhook/v1/*')
global class WhatsappWebHook {

    @HttpGet
    global static void doGet(){
        RestResponse response= RestContext.response;
        RestRequest request=RestContext.request;
        if(request.params.get('hub.verify_token')=='WHATSAPPTOKEN'){
            response.responseBody=Blob.valueOf(request.params.get('hub.challenge'));
        }
    }
    
    @HttpPost
    global static void doPost(){
        //Getting request and creating Response
        RestRequest request=RestContext.request;
        RestResponse response=RestContext.response;
        
        //Adding header to response
        response.addHeader('Content-type', 'application/json');
        System.debug('Headers from Whatsapp:'+request.headers.toString());
        System.debug('Request body from Whatsapp:'+request.requestBody.toString());
        if(isValidPayload(request)){
            response.statusCode=200;
            response.responseBody=Blob.valueOf('{success:true, event:"success"}');
            String reqString=request.requestBody.toString();
            reqString=reqString.replaceAll('type":', 'typeVal":');
            reqString=reqString.replaceAll('from":','fromId":');
            system.debug('reqString:'+reqString);
            WhatsappMessage parentMessage= WhatsappMessage.parse(reqString);
            WhatsappMessage.createMessageRecord(parentMessage);
            //System.debug('parentMessage.entry[0].id->'+parentMessage.entry[0].id);
            //System.debug('parentMessage.entry[0].changes[0].value.contacts[0].profile.name->'+parentMessage.entry[0].changes[0].value.contacts[0].profile);
        }else{
            response.statusCode=401;
            response.responseBody=Blob.valueOf('{success:false,event:"Unknown",message:"Failed in Webhook"}');
        }
    }
    
    private static Boolean isValidPayload(RestRequest request){
        //Getting a map of all header parameters (including one containing sha256)
        Map<String,String> headerMap=request.headers;
        
        //Getting Whatsapp signature from the header map. 
        //NOTE: the whatsapp signature is in form of "sha256=..." in X-Hub-Signature-256 header
        String whatsappSignature=headerMap.get('X-Hub-Signature-256');
        
        //Getting Whatsapp input payload.
        String whatsappPayload=request.requestBody.toString();
        
        //Getting Whatsapp app secret stored in Custom label
        String whatsappSecret=System.Label.FBAppSecret;
        
        //Creating our own signed payload
        //https://developer.salesforce.com/docs/atlas.en-us.apexref.meta/apexref/apex_classes_restful_crypto.htm#apex_System_Crypto_generateMac
        Blob signedPayload=Crypto.generateMac('hmacSHA256', Blob.valueOf(whatsappPayload), Blob.valueOf(whatsappSecret));
        
        //Creating encodedPayload: Encoding it to Hexadecimal
        String encodedPayload=EncodingUtil.convertToHex(signedPayload);
        
        //Created signature for validation
        String validSignature='sha256='+encodedPayload;
        
        system.debug('validSignature: '+validSignature);
        system.debug('whatsappSignature: '+whatsappSignature);
        
        if(validSignature==whatsappSignature)
            return true;
        else
            return false;
        
    }
}