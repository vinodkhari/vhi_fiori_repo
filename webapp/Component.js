sap.ui.define([
    'sap/ui/core/UIComponent'   
], function(UIComponent) {
    return UIComponent.extend("com.tennantco.vhitest.Component",{
        metadata: {
            manifest: "json"
        },
        init: function() {
            // UIComponent is Base Class, call Base Class Constructor here
            UIComponent.prototype.init.apply(this);

            // Get the Router Object from Base class
            var router = this.getRouter();
            // Initialize
            router.initialize();
        },
        // Commented due to Router Implemntation, Router Implementation is done on manifest.json file
        // createContent: function() {

        //     // Root View
        //     var oView = new sap.ui.view({
        //         viewName: "com.tennantco.vhitest.view.App",
        //         type: "XML",
        //         id: "idRootView"                
        //     });
            

        //     //Create View Objects for pageView1 & pageView2
        //     //pageView1
        //     var oPageView1 = new sap.ui.view({
        //         viewName:"com.tennantco.vhitest.view.pageView1",
        //         type:"XML",
        //         id:"idPageView1"
        //     });
           
        //     //pageView2
        //     var oPageView2 = new sap.ui.view({
        //         viewName:"com.tennantco.vhitest.view.pageView2",
        //         type:"XML",
        //         id:"idPageView2"
        //     });
                        
        //     // Get App Container Control Object
        //     var oAppCon = oView.byId("idAppcon");

        //     // Add the newly created views in App Container Control
        //     // oAppCon.addPage(oPageView1).addPage(oPageView2);    
             
        //     // Add the views(existing) to Split App Container Conrol as masterPage and detailPage
        //     oAppCon.addMasterPage(oPageView1).addDetailPage(oPageView2);
            
        //     return oView;
        // },
        destroy: function() {
            
        }
    });
    
});