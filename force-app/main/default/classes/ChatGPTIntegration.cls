public class ChatGPTIntegration {

    public static List<String> generateImage(String prompt,String size,Integer noOfImg){
        system.debug('prompt='+prompt+' size='+size+' noOfImg='+noOfImg);
        List<String> strList= new List<String>();
        Http http= new Http();
        HttpRequest request= new HttpRequest();
        request.setMethod('POST');
        request.setEndpoint('https://api.openai.com/v1/images/generations');
        request.setHeader('content-type', 'application/json');
        request.setHeader('Authorization','Bearer '+System.Label.ChatGPTApiKey);
        String reqBody='{"prompt": "'+prompt+'","n": '+String.valueOf(noOfImg)+',"size": "'+size+'"}';
        system.debug('reqBody: '+reqBody);
        request.setBody(reqBody);
        
        HttpResponse response= http.send(request);
        if(response.getStatusCode()==200){
        system.debug('response.getStatusCode()==200');
        system.debug('response.getBody()->'+response.getBody());
        imageResponseWrapper imgWrp=(imageResponseWrapper)JSON.deserialize(response.getBody(), imageResponseWrapper.class);
        for(urlWrp wrp: imgWrp.data){
            strList.add(wrp.url);
        }
        }else{
            system.debug('ERROR->'+response.getStatus());
        }
        return strList;
    }
    
    
    public static String getAnswer(String question){
        Http http= new Http();
        HttpRequest request= new HttpRequest();
        request.setMethod('POST');
        request.setEndpoint('https://api.openai.com/v1/completions');
        request.setHeader('content-type', 'application/json');
        request.setHeader('Authorization','Bearer '+System.Label.ChatGPTApiKey);
        String reqBody='{"model": "text-davinci-003","prompt": "'+question+'","temperature": 0.6,"max_tokens": 150,"top_p": 1,"frequency_penalty": 1,"presence_penalty": 1}';
        system.debug('reqBody: '+reqBody);
        request.setBody(reqBody);
        
        HttpResponse response= http.send(request);
        if(response.getStatusCode()==200){
        system.debug('response.getStatusCode()==200');
        system.debug('response.getBody()->'+response.getBody());
        questionWrp qwrp= (questionWrp)JSON.deserialize(response.getBody(), questionWrp.class);
        system.debug('qwrp.choices->'+qwrp.choices);
        String retStr=qwrp.choices[0].text;    
        return retStr;    
        }else{
            system.debug('ERROR->'+response.getStatus());
         return 'No Answer returned';
        }
    }
    
    
    @InvocableMethod(label='Ask ChatGPT')
    public static List<chatOut> getGPTAnswer(List<chatIn> chatinp){
        List<chatOut> coutlist= new List<chatOut>();
        for(chatIn cin: chatinp){
        String query=cin.chatInput;
        String response=ChatGPTIntegration.getAnswer(query);
        chatOut cout= new chatOut();
        cout.chatOutput=response;
        coutlist.add(cout);
        }
        
        return coutlist;
    }
    
    public class chatIn{
        @InvocableVariable(label='chat input')
        public String chatInput;
    }
    
    public class chatOut{
        @InvocableVariable(label='chat output')
        public String chatOutput;
    }
    
    
    public class imageResponseWrapper{
        public String created;
        public List<urlWrp> data;
    }
    
    public class urlWrp{
        public string url;
    }
    
    public class questionWrp{
	public String id;	//cmpl-6ZzBGan7eZSxHLnO07pFaAKbyvZKS
	public String objectx;	//text_completion
	public Integer created;	//1674034678
	public String model;	//text-davinci-003
	public choices[] choices;
	public usage usage;
    }
    
    public class choices {
		public String text;
		public Integer index;	//0
		public String logprobs;
		public String finish_reason;	//stop
	}
	public class usage {
		public Integer prompt_tokens;	//9
		public Integer completion_tokens;	//72
		public Integer total_tokens;	//81
	}
}