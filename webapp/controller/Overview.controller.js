sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/syncStyleClass",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, syncStyleClass, JSONModel, Filter, FilterOperator, MessageToast) {
        "use strict";

        return Controller.extend("sap.training.exc.controller.Overview", {
            onInit: function () { //Initialize the JSON model and set it to the view with the name "customer"
                var oModel = new JSONModel();
                this.getView().setModel(oModel, "customer")
            },
            onSave: function () { //Open Dialog box when Save Button is clicked
                var oModelData = this.getView().getModel("customer").getData();
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                if (oModelData.Discount === undefined) { oModelData.Discount = 0; }

                this.byId("customerTable").getBinding("items").create({
                "Form": oModelData.Form,
                "CustomerName": oModelData.CustomerName,
                "Discount": oModelData.Discount + "",
                "Street": oModelData.Street,
                "PostCode": oModelData.PostCode,
                "City": oModelData.City,
                "Country": oModelData.Country,
                "Email": oModelData.Email,
                "Telephone": oModelData.Telephone
                }).created().then(function () {
                MessageToast.show(oResourceBundle.getText("customerCreatedMessage"));
                });
            },
            onCloseDialog: function () { //Close Dialog box when OK Button is clicked
                this.byId("dialog").close();
            },
            onCustomerChange: function (oEvent) { //Change the binding context of the booking table (item table) to the selected customer
                var oBindingContext = oEvent.getParameter("listItem").getBindingContext();
                this.byId("bookingTable").setBindingContext(oBindingContext);
            },
            onFilterCustomers: function (oEvent) { //Retrive customers that match the search query
                var aFilter = [];
                var sQuery = oEvent.getParameter("query");
                if (sQuery && sQuery.length > 0) {
                    aFilter.push(new Filter("CustomerName", FilterOperator.Contains, sQuery));
                }

                var oTable = this.byId("customerTable");
                var oBinding = oTable.getBinding("items");
                oBinding.filter(aFilter);
            },
            onNavToDetails: function (oEvent) {
                var oItem = oEvent.getSource();
                var oRouter = this.getOwnerComponent().getRouter();


                oRouter.navTo("detail", {
                    customerId: oItem.getBindingContext().getPath().substring("/UX_Customer".length)
                });
            }
        });
    });
