sap.ui.define([
    'com/tennantco/vhitest/controller/BaseController',
    'sap/ui/core/routing/History'
], function(baseController,History) {
    'use strict';
    return baseController.extend("com.tennantco.vhitest.conroller.pageView3",{
        onInit: function () {
            this.router = this.getOwnerComponent().getRouter();
            this.router.getRoute("vendorDetail").attachMatched(this.vendorRouterHandler, this);
        },

        vendorRouterHandler: function (vendorEvent) {
            var vendor = vendorEvent.getParameter('arguments').vendorSelected;
            var path = 'fruit>/vendors/'+vendor;
            this.getView().bindElement(path);            
        },

        onNavigate: function () {
            var history, previousHash;

            history = History.getInstance();
            previousHash = history.getPreviousHash();

            if(history !== undefined){
                window.history.go(-1);                
            }else{
                this.getRouter().navTo("fruitsDetail",{}, true /* No history */);
            }

        }

    });
    
});