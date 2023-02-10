sap.ui.define([
    'com/tennantco/vhitest/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox',
    'sap/m/MessageToast'
], function(baseController,JSONModel,MessageBox,MessageToast) {
    'use strict';
    return baseController.extend("com.tennantco.vhitest.controller.pageView4",{
        onInit: function () {
            debugger;
            this.router = this.getOwnerComponent().getRouter();
            this.router.getRoute("addProduct").attachMatched(this.addNewProduct, this);

            this.localModel = new JSONModel();
            this.localModel.setData({
                "productData":{
                    "PRODUCT_ID" : "T380AMR",
                    "TYPE_CODE" : "PR",
                    "CATEGORY" : "Others",
                    "NAME" : "T380 AMR",
                    "DESCRIPTION" : "Tennant Robotic Floor Scrubber",
                    "SUPPLIER_ID" : "0100000017",
                    "SUPPLIER_NAME" : "Meliva",
                    "TAX_TARIF_CODE" : "1",
                    "MEASURE_UNIT" : "EA",
                    "PRICE" : "50000.00",
                    "CURRENCY_CODE" : "USD",
                    "DIM_UNIT" : "",
                    "PRODUCT_PIC_URL" : "/sap/public/bc/NWDEMO_MODEL/IMAGES/T380 AMR.jpg"
                }
            });
            this.getView().setModel(this.localModel, "product");    
            
            //  this.productModel = new JSONModel;
            //  var productModel = this.localModel.getData();
            //  var productId = productModel.productData.PRODUCT_ID;
            //  this.getProductImage(productId,localModel);
          
        },

        addNewProduct: function (newProductEvent){
            this.setMode("Create");
        },
        mode: "Create",
        setMode: function (sMode) {
            this.mode = sMode;
            if (this.mode === "Create"){
                this.getView().byId("idSave").setText("Save");
                this.getView().byId("idDelete").setEnabled(false);    
                this.getView().byId('prodId').setEnabled(true);
            }else {
                this.getView().byId("idSave").setText("Update");
                this.getView().byId("idDelete").setEnabled(true);
                this.getView().byId("prodId").setEnabled(false);
            }
        },
        productId:"",
        getProductImage: function(productId,localModel) {
            this.getView().byId("productImage").setSrc("/sap/opu/odata/sap/ZODATA_PROJECT_VHI_TEST_SRV/ProductImageSet('" + productId + "')/$value")
        },
        onEnter: function (oEvent) {

            // Read the Product Id from Screen
            this.productId = oEvent.getParameter("value");
            // Get OData Model Object
            var oDataModel = this.getView().getModel();
            // Read the oData Model object for Single Product record
            var that = this;
            // Trigger GET request - single Entity - Passing Key Field Product Id
            oDataModel.read("/ProductEntitySet('" + this.productId + "')",{
                success: function(data) {
                    that.localModel.setProperty("/productData", data);
                    that.setMode("Update");
                },
                error: function (error) {
                    MessageToast.show("Product Id Not Found, Create New Product");
                    that.setMode("Create");                    
                }
            });
            this.getProductImage(this.productId,oDataModel);
        },
        onSave: function () {
            // Retreive Data from screen and prepare payload for oData Model
            var payload = this.localModel.getProperty("/productData");
            // Validate the payload with Key fields of oDataModel
            if (payload.PRODUCT_ID===""){
                MessageBox.error("Enter Product ID");
                return;
            }
            // get oData Model object
            var oDataModel = this.getView().getModel();
            // POST the data onto backend via oData Entityset and payload 
            // Create Mode
            if(this.mode === "Create"){
                // POST Method
                oDataModel.create("/ProductEntitySet", payload,{
                    // raise/catch the response 
                    success: function (data) {
                        MessageToast.show("Product is saved onto backend...");
                    },
                    error: function (error) {
                        MessageBox.error("Product failed to save onto backend");
                        debugger;                    
                    }
                })
            }else{
                // PUT Method
                oDataModel.update("/ProductEntitySet('" + this.productId + "')",payload,{
                    // raise/Catch the response
                    success: function (data) {
                        MessageToast.show("Product Created...");
                    },
                    error: function (error) {
                        MessageBox.error(JSON.parse(error.responseText).error.innererror.errordetails[0].message);
                    }
                })
            }           
        },   
        onDelete: function () {
            // Get the Product Id Value from Screen 
            // var productId = this.localModel.getProperty("/productData/PRODUCT_ID");
            // Make Sure Product Id is not empty
            if(this.productId === ""){
                MessageBox.error("Product Id is Mandatory to delete a Product Record");
            }
            // Get oData Model object
            var oDataModel = this.getView().getModel();
            // Confirmation
            var that = this;
            MessageBox.confirm("Do you want to Delete?",{
                onClose: function(status) {
                    if(status === "OK"){
                        debugger;
                        var that2 = that;
                        oDataModel.remove("/ProductEntitySet('" + that.productId + "')",{
                            success: function() {
                                MessageBox.show("Product Id Deleted");
                                that2.onClear();
                            }
                        });
                    }                    
                }
            });            
        },     
        highestPrice: function() {
            // read the category from UI
            var category = this.getView().byId("category").getSelectedKey();
            // get Odata model Object
            var oDataModel = this.getView().getModel();
            // Call backend Function Import
            var that = this;
            oDataModel.callFunction("/GetHighestPriceProduct",{
                urlParameters: {
                    "I_CATEGORY": category
                },
                success: function (data) {
                    that.localModel.setProperty("/productData", data);
                    that.productId = data.PRODUCT_ID;
                    that.setMode("Update");
                }
            });
            
        },
        onClear: function () {
            // Set the mode to Create
            this.setMode("Create");
            this.localModel.setProperty("/productData",{
                "PRODUCT_ID": "",
                "TYPE_CODE": "PR",
                "CATEGORY": "Notebooks",
                "NAME": "",
                "DESCRIPTION": "",
                "SUPPLIER_ID": "0100000017",
                "SUPPLIER_NAME": "Meliva",
                "TAX_TARIF_CODE": "1",
                "MEASURE_UNIT": "EA",
                "PRICE": "0.00",
                "CURRENCY_CODE": "USD",
                "DIM_UNIT": "",
                "PRODUCT_PIC_URL": "/sap/public/bc/NWDEMO_MODEL/IMAGES/NV-2022.jpg"
            });            
        }
    })    
});