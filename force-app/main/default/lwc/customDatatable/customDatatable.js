import LightningDatatable from 'lightning/datatable';
import formattedText from './formattedText.html';
import formattedTextEdit from './formattedTextEdit.html';

export default class CustomDatatable extends LightningDatatable {

    static customTypes={
        formattedText: {
            template: formattedText,
            editTemplate: formattedTextEdit,
            standardCellLayout: true,
        }
    }
}