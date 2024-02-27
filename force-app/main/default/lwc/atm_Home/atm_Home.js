import { LightningElement } from 'lwc';
import AUDIO_CRICKETS from '@salesforce/resourceUrl/Crickets';
import AUDIO_WAVES from '@salesforce/resourceUrl/Waves';
import AUDIO_CAMPFIRE from '@salesforce/resourceUrl/Campfire';
import AUDIO_WIND from '@salesforce/resourceUrl/Wind';
import AUDIO_THUNDER from '@salesforce/resourceUrl/Thunder';
import AUDIO_RAIN from '@salesforce/resourceUrl/Rain';
import ICON_ATMOS from '@salesforce/resourceUrl/AtmosphereIcons';
import IMAGE_MOUNTAINS from '@salesforce/resourceUrl/Mountains';
export default class Atm_Home extends LightningElement {


    audioUrls=[{'key':1,'code':'Crickets','url':AUDIO_CRICKETS,'imgurl':ICON_ATMOS+'/Icons/crickets.png'},
    {'key':2,'code':'Waves','url':AUDIO_WAVES,'imgurl':ICON_ATMOS+'/Icons/waves.png'},
    {'key':3,'code':'Campfire','url':AUDIO_CAMPFIRE,'imgurl':ICON_ATMOS+'/Icons/campfire.png'},
    {'key':4,'code':'Wind','url':AUDIO_WIND,'imgurl':ICON_ATMOS+'/Icons/wind.png'},
    {'key':5,'code':'Thunder','url':AUDIO_THUNDER,'imgurl':ICON_ATMOS+'/Icons/thunder.png'},
    {'key':6,'code':'Rain','url':AUDIO_RAIN,'imgurl':ICON_ATMOS+'/Icons/rain.png'}];
    isLoaded=false;

    mountainImgUrl = IMAGE_MOUNTAINS;
    connectedCallback(){
        console.log('audioUrls->'+this.audioUrls);
        this.isLoaded=true;
    }
    
    renderedCallback(){
        let titleCls=this.template.querySelector('.title-cls');
        let bgUrl='background: url('+this.mountainImgUrl+')';
        console.log('bgUrl: '+bgUrl);
        titleCls.style=bgUrl;
    }

    handleFocusComplete(){
        console.log('Inside handleFocusComplete');
        this.template.querySelectorAll('c-atm_audio-single').forEach((ele)=>{
            ele.parentStop();
        });
    }


}