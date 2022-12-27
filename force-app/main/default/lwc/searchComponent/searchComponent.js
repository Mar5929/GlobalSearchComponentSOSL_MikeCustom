import { LightningElement, track, api } from 'lwc';
import search from '@salesforce/apex/SearchClass.searchRecords';
import getTrackedFields from '@salesforce/apex/getTrackedFields.findTrackedFields';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Modal from "c/modalComponent";

export default class SearchComponent extends LightningElement {
  @api objectApiNames = ''; //passed from js-meta.xml file
  @api searchFields = ''; //passed from js-meta.xml file

  @track listObjectApiNames = []; //string from js-meta.xml file converted to array of strings
  @track listSearchFields = []; //string from js-meta.xml file converted to array of strings

  @track trackedFieldsForObject; //stores the list of tracked fields for object from selectedRows
  @api selectedRowIds = [];

  @track searchTerm;
  @track hasResults = false;
  @track resultWrapperList;
  @track noResults = false;
  @track selectedRows = [];
  @track isSearching = false;

  /**
   * Converts user entered strings to arrays of strings
   * Removes leading and trailing white space in the listObjectApiNames and listSearchFields arrays when the page loads.
   */
  connectedCallback() {
    //Set myVariable when the page loads
    this.listObjectApiNames = this.objectApiNames.split(",");
    //remove white space in array of strings
    for (let i = 0; i < this.listObjectApiNames.length; i++) {
      this.listObjectApiNames[i] = this.listObjectApiNames[i].trim();
    }
    this.listSearchFields = this.searchFields.split(",");
    //remove white space in array of strings
    for (let i = 0; i < this.listSearchFields.length; i++) {
      this.listSearchFields[i] = this.listSearchFields[i].trim();
    }
  }

  /**
   * Call the handleSearchChange function when the user presses the 'Enter' key in the search box
   * @param {*} event 
   */
  handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
        // Get the input value from the event target
        this.searchTerm = event.target.value;
        console.log('searchTerm = ' + this.searchTerm);
        this.isSearching = true;
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
        objectApiNames: this.listObjectApiNames,
        searchFields: this.listSearchFields
      })
        .then(results => {
          this.resultWrapperList = results;
          console.log('resultWrapperList = ' + JSON.stringify(this.resultWrapperList));
          this.hasResults = this.resultWrapperList.length >= 1;
          this.noResults = Object.keys(this.resultWrapperList).length === 0;
          this.isSearching = false;
          if (!this.noResults) {
            this.showSuccessToast('Found Records');
          }
          
        })
        .catch(error => {
          this.isSearching = false;
          this.showErrorToast('Something went wrong while searching for records: ' + error.message);
          console.log(error.message);
        });
    } else {
      this.hasResults = false;
      this.isSearching = false;
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
   * Opens modal component from c/modalComponent
   */
  showModal() {
    //this.selectedRows is not an SObject but rather it is a custom-defined wrapper object. Therefore, we need to extract the record Id's and populate an ID array.
    for (let i = 0; i < this.selectedRows.length; i++) {
      this.selectedRowIds.push(this.selectedRows[i].Id);
    }
    console.log('selectedRowIds = ' + this.selectedRowIds);
    getTrackedFields({
      recordIdList: this.selectedRowIds
    })
      .then(results => {
        this.trackedFieldsForObject = results;
        console.log('this.trackedFieldsForObject = ' + JSON.stringify(this.trackedFieldsForObject));
      })
      .catch(error => {
        this.showErrorToast('Something went wrong while searching for fields: ' + error.message);
        console.log(error.message);
      });

    Modal.open({
      // maps to developer-created `@api properties`
      size: 'large',
      records: this.selectedRows,
      columnsForRecords: [
        {fieldName: 'Id', label:'Id'},
        {fieldName: 'Name', label:'Name'}
      ],
      modalHeader: 'Record Field History',
      modalBody: 'Please select which fields you would like to see the history for your selected records.',
      modalFooter: '',
    })

    const trackedFieldsEvent = new CustomEvent("trackedfields", {
      detail: this.trackedFieldsForObject
    });

    // Dispatches the event.
    this.dispatchEvent(trackedFieldsEvent);
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
