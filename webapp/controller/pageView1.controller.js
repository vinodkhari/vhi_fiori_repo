sap.ui.define([
    'com/tennantco/vhitest/controller/BaseController',
    'sap/ui/model/Filter',    
    'sap/ui/model/FilterOperator'
], function(baseController,Filter,FilterOperator) {
    return baseController.extend("com.tennantco.vhitest.controller.pageView1",{
        onInit: function () {
            this.router = this.getOwnerComponent().getRouter();    
            this.router.getRoute("fruitsDetail").attachMatched(this.setSelectedItemRouteHandler, this);
            
        },     
        
        // Route Match Handler Function
        setSelectedItemRouteHandler: function (selectedItemEvent) {
            var selectedItem = selectedItemEvent.getParameter("arguments").itemSelectedIndex;
            var path = '/fruits/'+ selectedItem;
            var list = this.getView().byId("listId");
            // Get All items which are inside our list
            var listItems = list.getItems();
            // Loop at items
            for (let index = 0; index < listItems.length; index++) {
                const element = listItems[index];
                if(element.getBindingContextPath() === path){
                    //Compare the path - if found break the loop
                    var itemSelected = element;
                    break;
                }                
            }
            // set the List item with Item Selected
            list.setSelectedItem(itemSelected);
        },

        onAdd: function(){
            this.router.navTo("addProduct");
        },

        nextPage: function (fruitIndex) {
            // Get the App container control object 
            // var currentView = this.getView();
            // var appCon = currentView.getParent();

            // Use "to" function to navigate
            // appCon.to("idPageView2");

            // Commented above using Router object to navigate to next page
            this.router.navTo("fruitsDetail",{
                itemSelectedIndex:fruitIndex
            });

        },
        onSearch: function (search) {
            //Step 1: What was the value user is trying to search on screen
             var searchValue = search.getParameter("query");
            // if(!searchValue){
            //     var searchValue = search.getParameter("newValue");
            // }
            
            //Step 2: Create a filter object
            // Method 1
            // var nameFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains,searchValue);
            // var typeFilter = new sap.ui.model.Filter("type",sap.ui.model.FilterOperator.Contains,searchValue);
            // var filter = new sap.ui.model.Filter({
            //     filters: filterList,
            //     and: false
            // });

            // Method 2
            // var nameFilter = new Filter("name",FilterOperator.Contains,searchValue);
            // var typeFilter = new Filter("type",FilterOperator.Contains,searchValue);                      

            // var filterList = [nameFilter, typeFilter];
            // var filter = new Filter({
            //     filters: filterList,
            //     and:false
            // });            
           
            //Step 3: Get Items of the list control and filter all items
            // this.getView().byId("listId").getBinding("items").filter(filter);    
            
            // Filter on ODATA Model CATEGORY
             var categoryFilter = new Filter("CATEGORY",FilterOperator.Contains,searchValue);
            //  Get Items of the list control and filter all items
             this.getView().byId("listId").getBinding("items").filter(categoryFilter);
        },

        onItemDelete: function(deleteEvent) {
            // Get the Object of Item to be deleted
            var itemDelete = deleteEvent.getParameter("listItem");

            // Get Object of List Control
            // Method# 1
            //var listControl = this.getView().byId("listId");
            // Method# 2
            var listControl = deleteEvent.getSource();

            //Delete the Item from List
            listControl.removeItem(itemDelete);

        },

        itemSelected: function (itemSelectedEvent) {
            //debugger;
            // get the Path of Selected Item
            var itemPath = itemSelectedEvent.getParameter("listItem").getBindingContextPath();

            // Get the View Object - App Container Control
            // var appCon = this.getView().getParent();
            // var view2 = appCon.getPages()[1];

            // Get the View Object - SplitApp Container Control
            // has both master and detail Pages
            //var view2 = this.getView().getParent().getParent().getDetailPage("idPageView2");


            // Element Binding to View2
            //view2.bindElement(itemPath);

            // path - /fruits/3
            var fruitIndex = itemPath.split("/")[itemPath.split("/").length - 1];

            // Navigate to Next View
            this.nextPage(fruitIndex);

            
        },
        itemsDelete: function () {
            // Object of List Id
            var listId = this.getView().byId("listId");
            var selectedItems = listId.getSelectedItems();
            selectedItems.forEach(item => {
                listId.removeItem(item)
            });            
        }
    });
    
});