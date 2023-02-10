sap.ui.define([
    'com/tennantco/vhitest/controller/BaseController',
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'
], function(baseController,MessageBox,MessageToast,Fragment,Filter,FilterOperator) {
    return baseController.extend("com.tennantco.vhitest.controller.pageView2",{
        onInit: function () {
            // Get the Router Object
            this.router = this.getOwnerComponent().getRouter();   

            this.router.getRoute("fruitsDetail").attachMatched(this.routeHandlerFunction, this);         
        },

        // Route Match Handler Function for fruitsDetail Page- Provided by Router Class.Triggers whenever the Route/url Changes depends on end user selection on UI
        routeHandlerFunction:function (routeChanged) {
            var selectedId = routeChanged.getParameter("arguments").itemSelectedIndex;
            // var urlPath= '/fruits/'+selectedId;
            // this.getView().bindElement(urlPath); 

            // OData Changes--
            var urlPath = '/'+selectedId;
            //  Load Data from Dependent Entity
            this.getView().bindElement(urlPath,{
                expand: 'To_Vendor'
            }); 
                       
        },


        previousPage: function () {
            this.getView().getParent().to("idPageView1");
            
        },
        save: function () {
            var resourceModel = this.getView().getModel("i18n");
            var resourceBundle = resourceModel.getResourceBundle();
            var msgSuccess = resourceBundle.getText('msgSuccess');
            var msgError = resourceBundle.getText('msgError');

            MessageBox.confirm("Do you want to Save?",{
                title: 'Confirmation',
                onClose: function (status) {
                    if(status === 'OK'){
                        // MessageToast.show("You have selected Save Option...");
                        // Message text from i18n
                        MessageToast.show(msgSuccess);
                    }else{
                        // MessageBox.error("You have selected Cancel Option...");
                        // Message Text from i18n
                        MessageToast.show(msgError);
                    }
                }
            })
            
        },
        cancel: function () {
            
        },

        vendorPopupDisplay: null,        
        filterData: function() {
            debugger;
            var that = this;
            if (!this.vendorPopupDisplay){
                Fragment.load({
                    name:'com.tennantco.vhitest.fragments.popup',
                    id:'vendor',
                    controller: this                   
                }).then(function(objFragment){
                    debugger;
                    // this.vendorPopupDisplay = objFragment;
                    // this.vendorPopupDisplay.open();
                    // objFragment.open();
                    
                    //inside promise and call back functions, cannot access "this" pointer
                    //controller object, so need to create a local variable for controller object
                    //outside promise/callback var that = this;
                    that.vendorPopupDisplay = objFragment;
                    //Title for Pop Up
                    that.vendorPopupDisplay.setTitle("Vendors");
                    // Grant Fragment Model acces through View since Fragment donot have access to Model directly
                    that.getView().addDependent(that.vendorPopupDisplay);
                    // Bind the data to Popup
                    that.vendorPopupDisplay.bindAggregation("items",{
                        path: 'fruit>/vendors',
                        template: new sap.m.ObjectListItem({
                            title: '{fruit>name}',
                            intro: '{fruit>founded}',
                            number:'{fruit>contactNo}'                            
                        })
                    })
                    that.vendorPopupDisplay.open();
                });
            }else{
                this.vendorPopupDisplay.open();
            }
            // Fragment.load({
            //     name:'com.tennantco.vhitest.fragments.popup'
            // }).then(function(objFragment){
            //     objFragment.open();
            // });
            // MessageBox.alert("This is under construction");            
        },

        inputHelp: null,
        cityPopupDisplay: null,
        valueHelp:function (f4Event) {
            this.inputHelp = f4Event.getSource();
            var that= this;
            if (!this.cityPopupDisplay){
                Fragment.load({
                    name:'com.tennantco.vhitest.fragments.popup',
                    id:'Cities',
                    controller: this
                }).then(function(objFragment){
                    // this.cityPopupDisplay = objFragment;
                    // this.cityPopupDisplay.open();
                    // objFragment.open();

                    //inside promise and call back functions, cannot access "this" pointer
                    //controller object, so need to create a local variable for controller object
                    //outside promise/callback var that = this;
                    that.cityPopupDisplay = objFragment;
                    //Title for Pop Up
                    that.cityPopupDisplay.setTitle("Cities");
                    //For City Popup Set MultiSelect = false
                    that.cityPopupDisplay.setMultiSelect(false);
                    // Grant Fragment Model acces through View since Fragment donot have access to Model directly
                    that.getView().addDependent(that.cityPopupDisplay);
                    // Bind the data to Popup
                    that.cityPopupDisplay.bindAggregation("items",{
                        path: 'fruit>/cities',
                        template: new sap.m.ObjectListItem({
                            title:'{fruit>city}',
                            intro:'{fruit>code}',
                            number:'{fruit>state}'                            
                        })
                    })
                    that.cityPopupDisplay.open();
                });
            }else{
                this.cityPopupDisplay.open();
            }
            //MessageBox.alert("This Value Help under construction");
        },
        onSelect: function (selectedCityEvent) {
            debugger;
            var cityId = selectedCityEvent.getSource().getId();
            if(cityId.indexOf("Cities") != -1){
                //Get the selected item object from event confirm
                var selectedCity = selectedCityEvent.getParameter("selectedItem");
                //Get the City Name into a variable from List 
                var city = selectedCity.getTitle();
                //Set the Selected City at same place where f4 was selectec
                this.inputHelp.setValue(city);
            }else{
                // Code to display only selected Vendor in Popup onto UI
                var vendors=[];
                //Get all the Selected Items in PUP up
                var selectedItems = selectedCityEvent.getParameter("selectedItems");
                //Loop over all these selected items and get data of each item
                for (let index = 0; index < selectedItems.length; index++) {
                    const item = selectedItems[index];
                    // Get the Title of Vendor
                    var vendorName = item.getTitle();
                    // Construct Filter Object
                    var vendorFilter = new Filter("name", FilterOperator.EQ,vendorName);
                    // Fill the Array with all the selected items/vendors
                    vendors.push(vendorFilter);
                }
                // Create a Filter Object with  OR Condition
                var vendorFilter = new Filter({
                    filters: vendors,
                    and: false

                });
                //Inject the Filter to set Items
                this.getView().byId("tableId").getBinding("items").filter(vendorFilter);                
            }                        
        },
        onSearchEventOnPopup: function (searchEvent) {
            // get the Value entered in Search Field
            var serachValue = searchEvent.getParameter("value");
           
            var cityId = searchEvent.getSource().getId();

            if (cityId.indexOf("Cities") != -1){
                //Construct the Filter Object on Serach Value entered
                //  Below 'city' & 'name' are property names in model
                var filter = new Filter("city", FilterOperator.Contains, serachValue);
            }else{
                var filter = new Filter("name", FilterOperator.Contains, serachValue); 
            }            

            //Get the Object of SelectDialog control
            var selectDialog = searchEvent.getSource();

            // Bind Filter Object to  items
            selectDialog.getBinding("items").filter(filter);
        },
        vendorSelected: function (selectedVendor) {
            //  get Path of Selected vendor
            var getSelectedVendor = selectedVendor.getParameter("listItem").getBindingContextPath();

            var selectedItemindex = getSelectedVendor.split("/")[getSelectedVendor.split("/").length -1];
            // using Router Object to Navigate to next page
            this.router.navTo("vendorDetail",{
                vendorSelected: selectedItemindex
            });
            //MessageBox.confirm('This Functionality is Under Construction');
            
        }

    });
    
});
