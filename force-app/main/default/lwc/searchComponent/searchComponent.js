import { LightningElement, track } from 'lwc';
import search from '@salesforce/apex/SearchClass.searchRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SearchComponent extends LightningElement {
  @track searchTerm;
  @track hasResults = false;
  @track resultWrapperList;
  @track noResults = false;
  @track selectedRows = []; // new property to track the selected records


  /**
   * Call the handleSearchChange function when the user presses the 'Enter' key in the search box
   * @param {*} event 
   */
  handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        // Get the input value from the event target
        this.searchTerm = event.target.value;
        console.log('searchTerm = ' + this.searchTerm);

        this.handleSearchChange();
    }
  }

  /**
 * Performs a SOSL search and updates the search results.
 *
 * @param {string} search.searchTerm - The search term.
 * @param {string[]} search.objectApiNames - The names of the objects to search.
 * @param {string[]} search.searchFields - The fields to search.
 */
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

  /**
   * Handles the addition or removal of records (rows) to the array 'selectedRows'.
   * This in turn hides or shows the lightning-button to show record information
   * 
   * @param {*} event 
   */
  handleRowSelection( event ) {
    const selRows = event.detail.selectedRows;
    //console.log( 'Selected Rows are ' + JSON.stringify ( selRows ) );
    if ( this.selectedRows.length < selRows.length ) {
        //console.log( 'Selected' );
    } else {
        //console.log( 'Deselected' );
        let deselectedRecs = this.selectedRows
             .filter(x => !selRows.includes(x))
             .concat(selRows.filter(x => !this.selectedRows.includes(x)));
        //console.log( 'Deselected Rows are ' + JSON.stringify( deselectedRecs ) );
    }
    this.selectedRows = selRows;

  }


  /**
   * Dispatch error variant toast
   * @param {*} errorMessage 
   */
  showErrorToast(errorMessage) {
    const event = new ShowToastEvent({
        title: 'Error',
        message: errorMessage,
        variant: 'error'
    });
    this.dispatchEvent(event);
  }

  /**
   * Dispatch success variant toast
   * @param {*} successMessage 
   */
  showSuccessToast(successMessage) {
    const event = new ShowToastEvent({
        title: 'Success!',
        message: successMessage,
        variant: 'success'
    });
    this.dispatchEvent(event);
  }

}
