import { LightningElement, track } from 'lwc';
import search from '@salesforce/apex/SearchClass.searchRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SearchComponent extends LightningElement {
  @track searchTerm;
  @track hasResults = false;
  @track resultWrapperList;
  @track noResults = false;
  @track selectedRows = []; // new property to track the selected records


  handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        // Get the input value from the event target
        this.searchTerm = event.target.value;
        console.log('searchTerm = ' + this.searchTerm);

        this.handleSearchChange();
    }
  }

  handleSearchChange() {
    // Perform SOSL search if the search term is not empty
    if (this.searchTerm) {
      search({
        searchTerm: this.searchTerm,
        objectApiNames: ['Account', 'Opportunity'],
        searchFields: ['Name', 'Tax_Id__c', 'Website', 'StageName']
      })
        .then(results => {
          this.resultWrapperList = results;
          console.log('resultWrapperList = ' + JSON.stringify(this.resultWrapperList));
          this.hasResults = this.resultWrapperList.length >= 1;
          this.noResults = Object.keys(this.resultWrapperList).length === 0;
          if (!this.noResults) {
            this.showSuccessToast('Found Records');
          }
          
        })
        .catch(error => {
          this.showErrorToast('Something went wrong while searching for fields');
        });
    } else {
      this.hasResults = false;
    }
  }

  handleRowSelection( event ) {

    const selRows = event.detail.selectedRows;
    console.log( 'Selected Rows are ' + JSON.stringify ( selRows ) );
    if ( this.selectedRows.length < selRows.length ) {

        console.log( 'Selected' );

    } else {

        console.log( 'Deselected' );
        let deselectedRecs = this.selectedRows
             .filter(x => !selRows.includes(x))
             .concat(selRows.filter(x => !this.selectedRows.includes(x)));

        console.log( 'Deselected Rows are ' + JSON.stringify( deselectedRecs ) );

    }
    this.selectedRows = selRows;

  }


  showErrorToast(errorMessage) {
    const event = new ShowToastEvent({
        title: 'Error',
        message: errorMessage,
        variant: 'error'
    });
    this.dispatchEvent(event);
  }

  showSuccessToast(successMessage) {
    const event = new ShowToastEvent({
        title: 'Success!',
        message: successMessage,
        variant: 'success'
    });
    this.dispatchEvent(event);
  }

}
