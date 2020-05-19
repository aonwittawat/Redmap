///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'jimu/BaseWidget',
    'esri/widgets/Compass',
    'esri/widgets/Compass/CompassViewModel'
  ], function(declare, BaseWidget, Compass, CompassViewModel) {
    var clazz = declare([BaseWidget], {

      name: 'Compass',
      baseClass: 'jimu-widget-compass',
      templateString: "<div><div data-dojo-attach-point='compassDiv'></div></div>",

      postCreate: function(){
        this.inherited(arguments);
        this.compass = new Compass({
          container:this.compassDiv,
          //Setting properties in the VM is subject to change
          viewModel: new CompassViewModel({
            view: this.sceneView
          })
        });
      },

      destroy: function(){
        if(!!this.compass){
          this.compass.destroy();
        }
        this.inherited(arguments);
      }
    });

    return clazz;
  });