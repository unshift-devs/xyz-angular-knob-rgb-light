angular.module('xyz', []).

/**
 * Knob RGB Light
 * RGB light knob
 */
directive('xyzKnobRgbLight', function ($timeout) {
   return {
      restrict: 'E',
      replace: true,
      scope: {
         options: '=',
         onChange: '&',
         onOffChange: '&'
      },
      templateUrl: 'template/knob-light.tpl.html',


      link: {
         post: function(scope,element,attr){

            var isOn = false;

            // Toggle on/Off
            scope.toggle = function() {
               isOn = !isOn;            
               scope.onOffChange({$status: isOn})
               scope.api.knob.enable(isOn);

            }

            

            // Back to yellow (0 degrees)
            scope.rotateTo = function() {
               scope.api.knob.rotateTo(0);
            }

            scope.onDragEnd = function(value) {
               scope.onChange({$rotation: value})
            }

            // TOFIX: Wait the next Angular digest to call toggle, or the enable method won't be available
            $timeout(function(){
               scope.toggle();
            })

         }

      }
   }
}).

/**
 * Knob Core directive
 * Enable Tweenmax Draggable to the element
 */
directive('tmaxKnobCore', function ($timeout) {

   return {
      restrict: 'A',
      scope: {
         options: '=',
         onDragEnd: '&',
         onDrag: '&',
         onThrowComplete: '&',
         api: '='
      },
    

      link: {
         pre: function(scope,element,attr){

            scope.api = {
               rotateTo: function(value){
                  TweenMax.to(element, 0.5, {rotation:value, ease:Cubic.easeInOut, onComplete: function() {
                     scope.$evalAsync(function() {
                        draggable[0].update()      
                        scope.rotationValue = convertRotationTo360(draggable[0].rotation)
                        scope.onDragEnd({rotation:  scope.rotationValue})
                     })
                  }});

               },
               enable: function(value){
                  if (value) {
                     TweenMax.to(element, 0.5, {opacity:1});
                  } else {
                     TweenMax.to(element, 0.5, {opacity:0.3});
                  }
               }
             };

            var defaultOptions = {
               type: 'rotation', 
               snap: 1,
               /*bounds:{minRotation:0, maxRotation:360},*/

               throwProps: true, 

               onDrag  : function (){
                  scope.rotationValue = convertRotationTo360(this.rotation)
                  scope.$apply(function () {
                     scope.onDrag({rotation: scope.rotationValue})
                  });
               },
               
               onDragEnd : function (){
                  scope.rotationValue = convertRotationTo360(this.rotation)
                  // Dispatch dragEnd if throwProps is not enabled
                  if (!scope.options.throwProps) {
                     scope.$apply(function () {
                        scope.onDragEnd({rotation: scope.rotationValue})
                     });
                  }
               },
                onThrowComplete : function(){
                  scope.rotationValue = convertRotationTo360(this.rotation)

                  scope.$apply(function () {
                     scope.onDragEnd({rotation: scope.rotationValue})
                     scope.onThrowComplete({rotation:  scope.rotationValue})
                  });
               },
               
            }

            

            // Extend default configuration with custom options
            angular.extend(defaultOptions, scope.options); 

            // Enable Snap event if defined
            if (defaultOptions.hasOwnProperty('snap'))
            {
               angular.extend(defaultOptions, {
                  snap:function(endValue) { 
                       return Math.round(endValue / scope.options.snap) * scope.options.snap;
                   }
               }); 
            }

            // Enable Tweenmax Draggable to the current HTML element
            var draggable = Draggable.create(element, defaultOptions);

               
            // Convert the Tweenmax rotation value to 360
            // Source: http://greensock.com/forums/topic/8956-draggable-rotation-snap-at-various-degrees/
            function convertRotationTo360 (value) {
               //return parseInt(value % 360, 10);
               return Math.round( value / scope.options.snap ) * scope.options.snap; 
            }

         }

      }

   }

})