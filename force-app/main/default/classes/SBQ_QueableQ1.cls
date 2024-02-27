public class SBQ_QueableQ1 implements Queueable{
    /*
	 Script:
	 ------------------------------------------------------
	 SBQ_QueableQ1 scb= new SBQ_QueableQ1(1,new Set<Id>());
	 System.enqueueJob(scb);
	*/
    public Integer jobNo;
    public Set<Id> idsProcessed;
    
    public SBQ_QueableQ1(Integer jobNo, Set<Id> idsProcessed){
      this.jobNo=jobNo+1;
      this.idsProcessed=idsProcessed;
    }
    
    public void execute(QueueableContext qc){
        List<Account> accsToProcess=[SELECT Id FROM Account WHERE Id NOT IN: idsProcessed LIMIT 10];
        Set<Id> accIdsProcessed=new Set<Id>();
        for(Account acc: accsToProcess){
            accIdsProcessed.add(acc.Id);
        }
        system.debug('JOB NO:'+this.jobNo+' IDS PROCESSED: '+accIdsProcessed);
        this.idsProcessed.addAll(accIdsProcessed);
        if(jobNo<5){
            SBQ_QueableQ1 scb= new SBQ_QueableQ1(jobNo,idsProcessed);
            System.enqueueJob(scb);
        }
    }
}