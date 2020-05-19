/**
 * Copyright @ 2020 Esri.
 * All rights reserved under the copyright laws of the United States and applicable international laws, treaties, and conventions.
 */
define(["dojo/_base/lang","dojo/_base/array","esri/core/declare","esri/core/scheduling","esri/core/watchUtils","../webgl-engine-extensions/ShaderSnippets","esri/views/3d/support/earthUtils","esri/core/libs/gl-matrix-2/vec3f64","esri/core/libs/gl-matrix-2/mat4f64","esri/core/libs/gl-matrix-2/vec3","esri/core/libs/gl-matrix-2/mat4","esri/views/3d/externalRenderers/RenderContext","esri/layers/GraphicsLayer","./Effect","../support/fx3dUtils","dojo/text!./CommonShaders.xml"],function(e,t,i,s,n,a,r,o,c,l,_,h,d,f,x,w){var u=c.mat4f64,_=_.mat4,g=o.vec3f64,l=l.vec3,p=null,m=i(null,{declaredClass:"esri.views.3d.effects.FxEffectRenderer",canRender:!0,constructor:function(){this._sceneView=null,this._internallyReady=!1,this._effects=[],this._fx3dFrameTask=null,this._shaderSnippets=null,this._normalMatrix=u.create(),this._viewDirection=g.create()},_init:function(t){!this._internallyReady&&e.isObject(t)&&(this._sceneView=t,n.whenTrue(this._sceneView,"ready",this._viewReadyHandler.bind(this)))},_viewReadyHandler:function(){if(this._sceneView._stage){var e=[6,8];this.context=new h(this._sceneView),this._sceneView._stage.addRenderPlugin(e,this),this._labelsLayer=new d({id:"-labelinfo-layer",listMode:"hide"}),this._sceneView.map.add(this._labelsLayer)}},_enableExtensions:function(e){var t=null;return window.WebGLRenderingContext&&this._gl instanceof window.WebGLRenderingContext?t=this._gl.getExtension("OES_texture_float")||this._gl.getExtension("OES_texture_float_linear")||this._gl.getExtension("OES_texture_half_float")||this._gl.getExtension("OES_texture_half_float_linear"):window.WebGL2RenderingContext&&this._gl instanceof window.WebGL2RenderingContext&&(t={}),null==t?console.error("Float texture extension is not supported in this browser."):this._vaoExt=e.vao,!!t},initializeRenderContext:function(e){if(this.context.gl=e.rctx.gl,this.context.rctx=e.rctx,this.needsRender=!1,this._gl=e.rctx.gl,this._internallyReady!==!0){var t=e.rctx.extensions||e.rctx.capabilities;this._enableExtensions(t)?(this._shaderSnippets||(this._shaderSnippets=new a,this._shaderSnippets._parse(w)),this._internallyReady=!0,this.needsRender=!0,this._webglStateReset()):(this._sceneView._stage&&this._sceneView._stage.removeRenderPlugin(this),x.extensionsMessage())}},uninitializeRenderContext:function(e){},_updateContext:function(e){this.context.camera.copyFrom(e.camera);var t={};t.direction=e.scenelightingData.old.direction,t.ambient=e.scenelightingData.old.ambient.color,t.diffuse=e.scenelightingData.old.diffuse.color,t.specular=[.2,.2,.2,.2],t.ambient[3]=e.scenelightingData.old.ambient.intensity,t.diffuse[3]=e.scenelightingData.old.diffuse.intensity,this.context.lightingData=t,this.context._renderTargetHelper=e.offscreenRenderingHelper,_.copy(this._normalMatrix,e.camera.viewInverseTransposeMatrix),this._normalMatrix[3]=this._normalMatrix[7]=this._normalMatrix[11]=0},_webglStateReset:function(){this.context.rctx.resetState(),this.context._renderTargetHelper&&this.context._renderTargetHelper.bindFramebuffer()},intersect:function(){},prepareRender:function(e){},render:function(e){1!=e.pass&&(this._updateContext(e),this._webglStateReset(),p=e.rctx||this._sceneView._stage.view._rctx,this._effects.forEach(function(e){e.effect.preRender(),e.effect.render({zoom:this._sceneView.zoom,proj:this.context.camera.projectionMatrix,view:this.context.camera.viewMatrix,viewInvTransp:this.context.camera.viewInverseTransposeMatrix,normalMat:this._normalMatrix,camPos:this.context.camera._eye,lightingData:this.context.lightingData,viewport:this.context.camera.viewport},p),e.effect.update()}.bind(this)),this._sceneView._stage.renderView.setNeedsRender())},renderTransparent:function(e){},dispose:function(){},_add:function(i,s){if(e.isObject(i)&&"esri.layers.FxLayer"===i.declaredClass&&s instanceof f){var n=t.filter(this._effects,function(e){return e.id===i.id&&e.effect.effectName==s.effectName});if(n.length>0)return console.warn("Layer "+i.id+" in "+s.effectName+" effect has already existed."),!1;if(e.isObject(s))return i.emit("hide-feature-label"),this._labelsLayer.id=i.id+this._labelsLayer.id,i._labelsLayer=this._labelsLayer,this._labelsLayer.visible=i.visible,i.watch("visible",function(e,t,s){this._labelsLayer&&(i.emit("hide-feature-label"),this._labelsLayer.set("visible",!!e))}.bind(this)),this._effects.push({id:i.id,effect:s}),"function"==typeof s.setContext&&s.setContext({gl:this._gl,vaoExt:this._vaoExt,shaderSnippets:this._shaderSnippets}),!0}return!1},_remove:function(e,i){if(e&&i){var s=-1,n=t.filter(this._effects,function(t,n){return t.id===i&&e==t.effect.effectName&&(s=n,!0)});n.length>0&&s>-1&&(n[0].effect.destroy(),this._effects.splice(s,1)),0===this._effects.length&&(this._fx3dFrameTask&&(this._fx3dFrameTask.remove(),this._fx3dFrameTask=null),this._internallyReady=!1,this._sceneView._stage&&this._sceneView._stage.removeRenderPlugin(this),this._labelsLayer&&(this._labelsLayer.removeAll(),this._sceneView.map.remove(this._labelsLayer)))}},_initializeFrameTask:function(){var e=this;this._frameTask={preRender:function(){e._update(),e._effects.forEach(function(e){e.effect.preRender()})},render:function(){e._effects.forEach(function(t){t.effect.render({proj:e._projMatrix,view:e._viewMatrix,normalMat:e._normalMatrix,camPos:e._cameraPos,lightingData:e._lightingData,viewport:e._viewport,viewInvTransp:e._sceneView.state.camera.viewInverseTransposeMatrix},e._sceneView._stage.renderView._rctx)})},update:function(){e._effects.forEach(function(e){e.effect.update()}),e._sceneView._stage.renderView.setNeedsRender()}},this._fx3dFrameTask=s.addFrameTask(this._frameTask)},_showGround:function(e){if("boolean"==typeof e&&this._sceneView.map&&this._sceneView.map.ground){var t=this._sceneView.map.ground.layers;t.forEach(function(t){t&&t.set("visible",e)})}},_viewReadyHandler_bak:function(){this._gl=this._sceneView._stage&&this._sceneView._stage.view&&this._sceneView._stage.view._gl,this._gl instanceof window.WebGLRenderingContext&&(this._internallyReady!==!0&&(this._enableExtensions()?(this._shaderSnippets||(this._shaderSnippets=new a,this._shaderSnippets._parse(w)),this._internallyReady=!0):x.extensionsMessage()),this._internallyReady&&(this._fx3dFrameTask||this._initializeFrameTask()))},_update:function(){this.context=new h(this._sceneView),this._camera=this._sceneView._stage&&this._sceneView._stage.getCamera(),this._cameraPos=this._camera._eye,this._viewMatrix=this._camera.viewMatrix,this._projMatrix=this._camera.projectionMatrix,this._viewInverseTransposeMatrix=this._camera.viewInverseTransposeMatrix,this._viewport=this._camera.viewport,_.copy(this._normalMatrix,this._viewInverseTransposeMatrix),this._normalMatrix[3]=this._normalMatrix[7]=this._normalMatrix[11]=0,l.set(this._viewDirection,this._viewMatrix[12],this._viewMatrix[13],this._viewMatrix[14])}}),v=null;return m.init=function(e){v||(v=new m),v._init(e)},m.add=function(e,t){return!!v&&v._add(e,t)},m.destroy=function(e,t){v&&v._remove(e,t)},m.pause=function(){v&&(v._fx3dFrameTask&&v._fx3dFrameTask.pause(),v.needsRender=!1)},m});