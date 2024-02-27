import { track,LightningElement, wire } from 'lwc';

export default class TESTLWC extends LightningElement {

/*1. Reactive properties
2. Template rerendering when properties change
3. Order of execution constructor, connected, rendered and wire
4. Wire lds and fetch Data.
5. Record view form, record edit form and lightning layout.
6. Dynamic picklist on xml from Apex.
7. Lazy Loading in LWC.
8. Event Propagation Child and parent and grand parent (composed vs bubbles)
9. Pub sub
10. LMS with Aura and VF pages.
11. New LWC Tags - lwc:spread, lwc:elseif, lwc:ref
12. GraphQL Wire adapter
*/

@track prop={label: 'Test1',child:{label: 'Test2',child: {label: 'Test 3'}}};

renderedCallback(){
    console.log('RENDERED');
}

textChange(){
    this.prop.child.child.label='Check changed';
}


}