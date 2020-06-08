(
  function() {
    'use strict';
    var app = angular.module('NarrowItDownApp', []);
    app.controller('NarrowItDownController', narrowItDownController);
    app.service('MenuSearchService', menuSearchService);
    app.directive('foundItems',foundItems);
    function foundItems(){
      var ddo = {
        templateUrl:'foundItems.html',
        scope:{
          found:'<',
          remove:'&'
        }
      };
      return ddo;
    }
    narrowItDownController.$inject = ['MenuSearchService'];

    function narrowItDownController(menuSearchService) {
      var narrow = this;

      narrow.getItem = function() {
        narrow.items = menuSearchService.removeList();
        narrow.items = menuSearchService.getList();
        return menuSearchService.showItem(narrow.itemName);
      };
      narrow.removeItem = function(index){
        return  menuSearchService.remItem(index);
      };
    }

    menuSearchService.$inject = ['$http'];

    function menuSearchService($http) {
      var s = this;
      var items = [];
      s.getMenu = function() {

        var response = $http({
          method: "GET",
          url: "https://davids-restaurant.herokuapp.com/menu_items.json"
        });
        return response;
      };

      s.showItem = function(snm){
        var promise = s.getMenu();
        promise.then(function(response) {
          var i = 0;
          var count = 0;
          for (i = 0; i < response.data.menu_items.length; i++) {
            if ((response.data.menu_items[i].name.toUpperCase().indexOf(snm.toUpperCase()) !== -1)&&(snm !== "")) {
              var item = {
                name: response.data.menu_items[i].name,
                shortName: response.data.menu_items[i].short_name,
                desc: response.data.menu_items[i].description
              };
              items.push(item);
            }
          }
          if(items.length === 0){
            var item = {
              name:"Nothing Found"
            };
            items.push(item);
          }
        }).catch(function(error){
          alert(error);
        });
      };
      s.getList = function(){
        console.log(items.length);
        return items;
      };
      s.removeList = function(){
        items = [];
        return items;
      };
      s.remItem = function(index){
        items.splice(index,1);
      };
    }
  }
)();
