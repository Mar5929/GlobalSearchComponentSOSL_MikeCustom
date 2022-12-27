/**
 * https://developer.salesforce.com/docs/component-library/bundle/lightning-modal/documentation
 */

import { LightningElement, api, track } from 'lwc';
import LightningModal from 'lightning/modal';

export default class modalComponent extends LightningModal {
  // Data is passed to apis via .open({ records: [], modalHeader: '', modalBody: '', modalBody: '', })
  @api records = [];
  @api columnsForRecords;
  @api trackedFields;
  @api modalHeader = '';
  @api modalBody = '';
  @api modalFooter = '';

  @track isSearching = false;
  selectedFields = [];
  showDatatable = false;

  connectedCallback() {
    
    this.template.addEventListener('trackedfields', evt => {
      this.trackedFields = evt.detail.value;
      console.log('this.trackedField = ' + JSON.stringify(this.trackedFields));
    });
  }

  handleEvent( event ) {
    this.trackedFields = event.detail.value;
  }

  handleSelectedChange(e) {
    this.selectedFields = e.detail.value;
  }

  getRecordHistory() {
    this.isSearching = true;
    this.showDatatable = true;
  }

  /**
   * Gets the selected fields to show field history for records selected
   */
  get selected() {
    return this.selectedFields.length ? this.selectedFields : 'none';
    }


  handleClose() {
    this.close();
  }
}