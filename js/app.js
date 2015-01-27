'use strict';

//var app = angular.module('DemoApp', ['FBAngular']);
var app = angular.module("KnobDemo", ["xyz"])

/**
 * Knob Demo
 */
.controller('Demo1Ctrl', function(){
  
  // RGB Light 1 - options
  this.knobOptions = {
    throwProps: true,
    snap: 45
  }

  /**
   * RGB light Toggle Light 
   */
  this.onToggleLight = function(value) {
      this.onOffStatus = value;
  }
  
  /**
   * RGB Light Drag End event handler
   */
  this.onDragEnd = function(value) {
      this.currentRotation = value;
      this.perc = parseInt((value*100)/360);
      console.log ("onDragEnd - Perc: ", this.perc)
  }

})

/**
 * Knob Demo #2
 */
.controller('Demo2Ctrl', function(){

  // RGB Light 1 - options
  this.knobOptions = {
    throwProps: false,
    snap: 1
  }

  /**
   * RGB light Toggle Light 
   */
  this.onToggleLight = function(value) {
      this.onOffStatus = value;
  }
  
  /**
   * RGB Light Drag End event handler
   */
  this.onDragEnd = function(value) {
      this.currentRotation = value;
      this.perc = parseInt((value*100)/360);
      console.log ("onDragEnd - Perc: ", this.perc)
  }

});



