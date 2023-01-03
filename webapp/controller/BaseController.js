sap.ui.define([
    'sap/ui/core/mvc/Controller',   
    'com/tennantco/vhitest/util/utilities'
], function(objController, utilities) {
    return objController.extend("com.tennantco.vhitest.controller.BaseController",{
            formatter: utilities
    });
    
});