/**
 * https://developer.salesforce.com/docs/component-library/bundle/lightning-modal/documentation
 */

import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class modalComponent extends LightningModal {
  // Data is passed to apis via .open({ records: [], modalHeader: '', modalBody: '', modalBody: '', })
  @api records = [];
  @api columns;
  @api modalHeader = '';
  @api modalBody = '';
  @api modalFooter = '';

  handleClose() {
    this.close();
  }
}