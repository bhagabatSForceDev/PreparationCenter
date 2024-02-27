import { LightningElement } from 'lwc';
import {testFn} from './extJs.js';
export default class TestLWCExtJS extends LightningElement {

    handleClick(){
        testFn();
    }
}