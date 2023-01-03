sap.ui.define([
    
], function() {
    'use strict';
    return{
getStatus: function (status) {
        switch (status) {
            case "Out of Stock":
                return "Warning";                
                break;
            case "Discontinued":
                return "Error";
                break;            
            default:
                return "Success";
                break;
        }    
}
    }
    
});