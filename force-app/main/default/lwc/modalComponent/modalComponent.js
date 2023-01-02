/**
 * https://developer.salesforce.com/docs/component-library/bundle/lightning-modal/documentation
 */

import { LightningElement, api, track } from 'lwc';
import LightningModal from 'lightning/modal';

export default class modalComponent extends LightningModal {
  // Data is passed to apis via .open({ records: [], modalHeader: '', modalBody: '', modalBody: '', })

  //INPUT VARIABLES=================
  @api modalHeaderLabel = '';
  @api modalBodyText = '';
  @api modalFooterText = '';

  @api trackedFields = []; //holds the resulting available tracked fields for the object. Displayed in multi-select combobox  
  @api records = []; //holds the resulting records after trackedFields are selected
  @api columnsForRecords; //columns for the resulting records after trackedFields are selected
 
  @track isSearching = false; //controls the lightning-spinner component while searching
  @track showDatatable = false; //controls the visibility of the resulting records after trackedFields are selected
  

  //OUTPUT VARIABLES=================
  selectedFields = []; //holds the selected tracked fields from the combobox

  connectedCallback() {
    console.log(' in modalComponent => this.trackedFieldsForObject = ' + JSON.stringify(this.trackedFields));
    console.log(' in modalComponent => this.records = ' + JSON.stringify(this.records));
  }

  
  handleSelectedChange(event) {
    this.selectedFields = event.detail.value;
    console.log("in modalComponent.handleSelectedChange(). Selected Fields are => " + this.selectedFields);
  }

  getRecordHistory() {
    this.isSearching = true;
    this.showDatatable = true;
  }


  handleClose() {
    this.close();
  }
}