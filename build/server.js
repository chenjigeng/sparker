/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch(e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/ 	
/******/ 	function hotDisposeChunk(chunkId) { //eslint-disable-line no-unused-vars
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "40e2b277d709e56ec82a"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:3001/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./build/assets.json":
/***/ (function(module, exports) {

module.exports = {"client":{"js":"http://localhost:3001/static/js/bundle.js"}}

/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/razzle/node_modules/webpack/hot/log-apply-result.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__("./node_modules/razzle/node_modules/webpack/hot/log.js");

	if(unacceptedModules.length > 0) {
		log("warning", "[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if(!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if(typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if(numberIds)
			log("info", "[HMR] Consider using the NamedModulesPlugin for module names.");
	}
};


/***/ }),

/***/ "./node_modules/razzle/node_modules/webpack/hot/log.js":
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog = (logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if(shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if(shouldLog(level)) {
		if(level === "info") {
			console.log(msg);
		} else if(level === "warning") {
			console.warn(msg);
		} else if(level === "error") {
			console.error(msg);
		}
	}
};

var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};


/***/ }),

/***/ "./node_modules/razzle/node_modules/webpack/hot/poll.js?300":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if(true) {
	var hotPollInterval = +(__resourceQuery.substr(1)) || (10 * 60 * 1000);
	var log = __webpack_require__("./node_modules/razzle/node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if(module.hot.status() === "idle") {
			module.hot.check(true).then(function(updatedModules) {
				if(!updatedModules) {
					if(fromUpdate) log("info", "[HMR] Update applied.");
					return;
				}
				__webpack_require__("./node_modules/razzle/node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
				checkForUpdate(true);
			}).catch(function(err) {
				var status = module.hot.status();
				if(["abort", "fail"].indexOf(status) >= 0) {
					log("warning", "[HMR] Cannot apply update.");
					log("warning", "[HMR] " + err.stack || err.message);
					log("warning", "[HMR] You need to restart the application!");
				} else {
					log("warning", "[HMR] Update failed: " + err.stack || err.message);
				}
			});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {
	throw new Error("[HMR] Hot Module Replacement is disabled.");
}

/* WEBPACK VAR INJECTION */}.call(exports, "?300"))

/***/ }),

/***/ "./src/Apis/doc.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createDoc;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__("./src/utils/index.js");


function createDoc() {
  return Object(__WEBPACK_IMPORTED_MODULE_0__utils__["c" /* myFetch */])('/api/doc', {
    method: 'POST'
  });
}

/***/ }),

/***/ "./src/Apis/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__doc__ = __webpack_require__("./src/Apis/doc.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_0__doc__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__user__ = __webpack_require__("./src/Apis/user.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__user__["a"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__user__["b"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1__user__["c"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_1__user__["d"]; });



/***/ }),

/***/ "./src/Apis/user.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = Login;
/* harmony export (immutable) */ __webpack_exports__["d"] = Regist;
/* harmony export (immutable) */ __webpack_exports__["c"] = Logout;
/* harmony export (immutable) */ __webpack_exports__["a"] = CheckAndFetch;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__("babel-runtime/core-js/json/stringify");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__("./src/utils/index.js");



function Login(username, password) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* myFetch */])('/api/login', {
    method: 'POST',
    body: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({ username: username, password: password })
  });
}

function Regist(username, password) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* myFetch */])('/api/regist', {
    method: 'POST',
    body: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({ username: username, password: password })
  });
}

function Logout() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* myFetch */])('/api/logout', {
    method: 'POST'
  });
}

function CheckAndFetch() {
  return Object(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* myFetch */])('/api/check', {
    method: 'POST'
  });
}

/***/ }),

/***/ "./src/App.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__router__ = __webpack_require__("./src/router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__App_less__ = __webpack_require__("./src/App.less");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__App_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__App_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Common_fontawesome_less__ = __webpack_require__("./src/Common/fontawesome.less");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Common_fontawesome_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__Common_fontawesome_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_whatwg_fetch__ = __webpack_require__("whatwg-fetch");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_whatwg_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_whatwg_fetch__);
var _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/App.js';






if (false) {
  require('./index.less');
  require('./Common/common.less');
  require('./prism.less');
}

var App = function App() {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1__router__["a" /* Router */], {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 15
    }
  });
};

/* harmony default export */ __webpack_exports__["a"] = (App);

/***/ }),

/***/ "./src/App.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "body {\n  margin: 0;\n  padding: 0;\n  font-family: sans-serif;\n}", ""]);

// exports


/***/ }),

/***/ "./src/Common/fontawesome.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "/*!\n * Font Awesome Free 5.0.8 by @fontawesome - https://fontawesome.com\n * License - https://fontawesome.com/license (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)\n */\n\n.fa, .fab, .fal, .far, .fas {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: inline-block;\n  font-style: normal;\n  font-variant: normal;\n  text-rendering: auto;\n  line-height: 1\n}\n\n.fa-lg {\n  font-size: 1.33333em;\n  line-height: .75em;\n  vertical-align: -.0667em\n}\n\n.fa-xs {\n  font-size: .75em\n}\n\n.fa-sm {\n  font-size: .875em\n}\n\n.fa-1x {\n  font-size: 1em\n}\n\n.fa-2x {\n  font-size: 2em\n}\n\n.fa-3x {\n  font-size: 3em\n}\n\n.fa-4x {\n  font-size: 4em\n}\n\n.fa-5x {\n  font-size: 5em\n}\n\n.fa-6x {\n  font-size: 6em\n}\n\n.fa-7x {\n  font-size: 7em\n}\n\n.fa-8x {\n  font-size: 8em\n}\n\n.fa-9x {\n  font-size: 9em\n}\n\n.fa-10x {\n  font-size: 10em\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: 2.5em;\n  padding-left: 0\n}\n\n.fa-ul>li {\n  position: relative\n}\n\n.fa-li {\n  left: -2em;\n  position: absolute;\n  text-align: center;\n  width: 2em;\n  line-height: inherit\n}\n\n.fa-border {\n  border: .08em solid #eee;\n  border-radius: .1em;\n  padding: .2em .25em .15em\n}\n\n.fa-pull-left {\n  float: left\n}\n\n.fa-pull-right {\n  float: right\n}\n\n.fa.fa-pull-left, .fab.fa-pull-left, .fal.fa-pull-left, .far.fa-pull-left, .fas.fa-pull-left {\n  margin-right: .3em\n}\n\n.fa.fa-pull-right, .fab.fa-pull-right, .fal.fa-pull-right, .far.fa-pull-right, .fas.fa-pull-right {\n  margin-left: .3em\n}\n\n.fa-spin {\n  -webkit-animation: a 2s infinite linear;\n  animation: a 2s infinite linear\n}\n\n.fa-pulse {\n  -webkit-animation: a 1s infinite steps(8);\n  animation: a 1s infinite steps(8)\n}\n\n@-webkit-keyframes a {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg)\n  }\n  to {\n    -webkit-transform: rotate(1turn);\n    transform: rotate(1turn)\n  }\n}\n\n@keyframes a {\n  0% {\n    -webkit-transform: rotate(0deg);\n    transform: rotate(0deg)\n  }\n  to {\n    -webkit-transform: rotate(1turn);\n    transform: rotate(1turn)\n  }\n}\n\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n  transform: rotate(90deg)\n}\n\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n  transform: rotate(180deg)\n}\n\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n  transform: rotate(270deg)\n}\n\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scaleX(-1);\n  transform: scaleX(-1)\n}\n\n.fa-flip-vertical {\n  -webkit-transform: scaleY(-1);\n  transform: scaleY(-1)\n}\n\n.fa-flip-horizontal.fa-flip-vertical, .fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\"\n}\n\n.fa-flip-horizontal.fa-flip-vertical {\n  -webkit-transform: scale(-1);\n  transform: scale(-1)\n}\n\n:root .fa-flip-horizontal, :root .fa-flip-vertical, :root .fa-rotate-90, :root .fa-rotate-180, :root .fa-rotate-270 {\n  -webkit-filter: none;\n  filter: none\n}\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  line-height: 2em;\n  position: relative;\n  vertical-align: middle;\n  width: 2em\n}\n\n.fa-stack-1x, .fa-stack-2x {\n  left: 0;\n  position: absolute;\n  text-align: center;\n  width: 100%\n}\n\n.fa-stack-1x {\n  line-height: inherit\n}\n\n.fa-stack-2x {\n  font-size: 2em\n}\n\n.fa-inverse {\n  color: #fff\n}\n\n.fa-500px:before {\n  content: \"\\F26E\"\n}\n\n.fa-accessible-icon:before {\n  content: \"\\F368\"\n}\n\n.fa-accusoft:before {\n  content: \"\\F369\"\n}\n\n.fa-address-book:before {\n  content: \"\\F2B9\"\n}\n\n.fa-address-card:before {\n  content: \"\\F2BB\"\n}\n\n.fa-adjust:before {\n  content: \"\\F042\"\n}\n\n.fa-adn:before {\n  content: \"\\F170\"\n}\n\n.fa-adversal:before {\n  content: \"\\F36A\"\n}\n\n.fa-affiliatetheme:before {\n  content: \"\\F36B\"\n}\n\n.fa-algolia:before {\n  content: \"\\F36C\"\n}\n\n.fa-align-center:before {\n  content: \"\\F037\"\n}\n\n.fa-align-justify:before {\n  content: \"\\F039\"\n}\n\n.fa-align-left:before {\n  content: \"\\F036\"\n}\n\n.fa-align-right:before {\n  content: \"\\F038\"\n}\n\n.fa-amazon:before {\n  content: \"\\F270\"\n}\n\n.fa-amazon-pay:before {\n  content: \"\\F42C\"\n}\n\n.fa-ambulance:before {\n  content: \"\\F0F9\"\n}\n\n.fa-american-sign-language-interpreting:before {\n  content: \"\\F2A3\"\n}\n\n.fa-amilia:before {\n  content: \"\\F36D\"\n}\n\n.fa-anchor:before {\n  content: \"\\F13D\"\n}\n\n.fa-android:before {\n  content: \"\\F17B\"\n}\n\n.fa-angellist:before {\n  content: \"\\F209\"\n}\n\n.fa-angle-double-down:before {\n  content: \"\\F103\"\n}\n\n.fa-angle-double-left:before {\n  content: \"\\F100\"\n}\n\n.fa-angle-double-right:before {\n  content: \"\\F101\"\n}\n\n.fa-angle-double-up:before {\n  content: \"\\F102\"\n}\n\n.fa-angle-down:before {\n  content: \"\\F107\"\n}\n\n.fa-angle-left:before {\n  content: \"\\F104\"\n}\n\n.fa-angle-right:before {\n  content: \"\\F105\"\n}\n\n.fa-angle-up:before {\n  content: \"\\F106\"\n}\n\n.fa-angrycreative:before {\n  content: \"\\F36E\"\n}\n\n.fa-angular:before {\n  content: \"\\F420\"\n}\n\n.fa-app-store:before {\n  content: \"\\F36F\"\n}\n\n.fa-app-store-ios:before {\n  content: \"\\F370\"\n}\n\n.fa-apper:before {\n  content: \"\\F371\"\n}\n\n.fa-apple:before {\n  content: \"\\F179\"\n}\n\n.fa-apple-pay:before {\n  content: \"\\F415\"\n}\n\n.fa-archive:before {\n  content: \"\\F187\"\n}\n\n.fa-arrow-alt-circle-down:before {\n  content: \"\\F358\"\n}\n\n.fa-arrow-alt-circle-left:before {\n  content: \"\\F359\"\n}\n\n.fa-arrow-alt-circle-right:before {\n  content: \"\\F35A\"\n}\n\n.fa-arrow-alt-circle-up:before {\n  content: \"\\F35B\"\n}\n\n.fa-arrow-circle-down:before {\n  content: \"\\F0AB\"\n}\n\n.fa-arrow-circle-left:before {\n  content: \"\\F0A8\"\n}\n\n.fa-arrow-circle-right:before {\n  content: \"\\F0A9\"\n}\n\n.fa-arrow-circle-up:before {\n  content: \"\\F0AA\"\n}\n\n.fa-arrow-down:before {\n  content: \"\\F063\"\n}\n\n.fa-arrow-left:before {\n  content: \"\\F060\"\n}\n\n.fa-arrow-right:before {\n  content: \"\\F061\"\n}\n\n.fa-arrow-up:before {\n  content: \"\\F062\"\n}\n\n.fa-arrows-alt:before {\n  content: \"\\F0B2\"\n}\n\n.fa-arrows-alt-h:before {\n  content: \"\\F337\"\n}\n\n.fa-arrows-alt-v:before {\n  content: \"\\F338\"\n}\n\n.fa-assistive-listening-systems:before {\n  content: \"\\F2A2\"\n}\n\n.fa-asterisk:before {\n  content: \"\\F069\"\n}\n\n.fa-asymmetrik:before {\n  content: \"\\F372\"\n}\n\n.fa-at:before {\n  content: \"\\F1FA\"\n}\n\n.fa-audible:before {\n  content: \"\\F373\"\n}\n\n.fa-audio-description:before {\n  content: \"\\F29E\"\n}\n\n.fa-autoprefixer:before {\n  content: \"\\F41C\"\n}\n\n.fa-avianex:before {\n  content: \"\\F374\"\n}\n\n.fa-aviato:before {\n  content: \"\\F421\"\n}\n\n.fa-aws:before {\n  content: \"\\F375\"\n}\n\n.fa-backward:before {\n  content: \"\\F04A\"\n}\n\n.fa-balance-scale:before {\n  content: \"\\F24E\"\n}\n\n.fa-ban:before {\n  content: \"\\F05E\"\n}\n\n.fa-band-aid:before {\n  content: \"\\F462\"\n}\n\n.fa-bandcamp:before {\n  content: \"\\F2D5\"\n}\n\n.fa-barcode:before {\n  content: \"\\F02A\"\n}\n\n.fa-bars:before {\n  content: \"\\F0C9\"\n}\n\n.fa-baseball-ball:before {\n  content: \"\\F433\"\n}\n\n.fa-basketball-ball:before {\n  content: \"\\F434\"\n}\n\n.fa-bath:before {\n  content: \"\\F2CD\"\n}\n\n.fa-battery-empty:before {\n  content: \"\\F244\"\n}\n\n.fa-battery-full:before {\n  content: \"\\F240\"\n}\n\n.fa-battery-half:before {\n  content: \"\\F242\"\n}\n\n.fa-battery-quarter:before {\n  content: \"\\F243\"\n}\n\n.fa-battery-three-quarters:before {\n  content: \"\\F241\"\n}\n\n.fa-bed:before {\n  content: \"\\F236\"\n}\n\n.fa-beer:before {\n  content: \"\\F0FC\"\n}\n\n.fa-behance:before {\n  content: \"\\F1B4\"\n}\n\n.fa-behance-square:before {\n  content: \"\\F1B5\"\n}\n\n.fa-bell:before {\n  content: \"\\F0F3\"\n}\n\n.fa-bell-slash:before {\n  content: \"\\F1F6\"\n}\n\n.fa-bicycle:before {\n  content: \"\\F206\"\n}\n\n.fa-bimobject:before {\n  content: \"\\F378\"\n}\n\n.fa-binoculars:before {\n  content: \"\\F1E5\"\n}\n\n.fa-birthday-cake:before {\n  content: \"\\F1FD\"\n}\n\n.fa-bitbucket:before {\n  content: \"\\F171\"\n}\n\n.fa-bitcoin:before {\n  content: \"\\F379\"\n}\n\n.fa-bity:before {\n  content: \"\\F37A\"\n}\n\n.fa-black-tie:before {\n  content: \"\\F27E\"\n}\n\n.fa-blackberry:before {\n  content: \"\\F37B\"\n}\n\n.fa-blind:before {\n  content: \"\\F29D\"\n}\n\n.fa-blogger:before {\n  content: \"\\F37C\"\n}\n\n.fa-blogger-b:before {\n  content: \"\\F37D\"\n}\n\n.fa-bluetooth:before {\n  content: \"\\F293\"\n}\n\n.fa-bluetooth-b:before {\n  content: \"\\F294\"\n}\n\n.fa-bold:before {\n  content: \"\\F032\"\n}\n\n.fa-bolt:before {\n  content: \"\\F0E7\"\n}\n\n.fa-bomb:before {\n  content: \"\\F1E2\"\n}\n\n.fa-book:before {\n  content: \"\\F02D\"\n}\n\n.fa-bookmark:before {\n  content: \"\\F02E\"\n}\n\n.fa-bowling-ball:before {\n  content: \"\\F436\"\n}\n\n.fa-box:before {\n  content: \"\\F466\"\n}\n\n.fa-boxes:before {\n  content: \"\\F468\"\n}\n\n.fa-braille:before {\n  content: \"\\F2A1\"\n}\n\n.fa-briefcase:before {\n  content: \"\\F0B1\"\n}\n\n.fa-btc:before {\n  content: \"\\F15A\"\n}\n\n.fa-bug:before {\n  content: \"\\F188\"\n}\n\n.fa-building:before {\n  content: \"\\F1AD\"\n}\n\n.fa-bullhorn:before {\n  content: \"\\F0A1\"\n}\n\n.fa-bullseye:before {\n  content: \"\\F140\"\n}\n\n.fa-buromobelexperte:before {\n  content: \"\\F37F\"\n}\n\n.fa-bus:before {\n  content: \"\\F207\"\n}\n\n.fa-buysellads:before {\n  content: \"\\F20D\"\n}\n\n.fa-calculator:before {\n  content: \"\\F1EC\"\n}\n\n.fa-calendar:before {\n  content: \"\\F133\"\n}\n\n.fa-calendar-alt:before {\n  content: \"\\F073\"\n}\n\n.fa-calendar-check:before {\n  content: \"\\F274\"\n}\n\n.fa-calendar-minus:before {\n  content: \"\\F272\"\n}\n\n.fa-calendar-plus:before {\n  content: \"\\F271\"\n}\n\n.fa-calendar-times:before {\n  content: \"\\F273\"\n}\n\n.fa-camera:before {\n  content: \"\\F030\"\n}\n\n.fa-camera-retro:before {\n  content: \"\\F083\"\n}\n\n.fa-car:before {\n  content: \"\\F1B9\"\n}\n\n.fa-caret-down:before {\n  content: \"\\F0D7\"\n}\n\n.fa-caret-left:before {\n  content: \"\\F0D9\"\n}\n\n.fa-caret-right:before {\n  content: \"\\F0DA\"\n}\n\n.fa-caret-square-down:before {\n  content: \"\\F150\"\n}\n\n.fa-caret-square-left:before {\n  content: \"\\F191\"\n}\n\n.fa-caret-square-right:before {\n  content: \"\\F152\"\n}\n\n.fa-caret-square-up:before {\n  content: \"\\F151\"\n}\n\n.fa-caret-up:before {\n  content: \"\\F0D8\"\n}\n\n.fa-cart-arrow-down:before {\n  content: \"\\F218\"\n}\n\n.fa-cart-plus:before {\n  content: \"\\F217\"\n}\n\n.fa-cc-amazon-pay:before {\n  content: \"\\F42D\"\n}\n\n.fa-cc-amex:before {\n  content: \"\\F1F3\"\n}\n\n.fa-cc-apple-pay:before {\n  content: \"\\F416\"\n}\n\n.fa-cc-diners-club:before {\n  content: \"\\F24C\"\n}\n\n.fa-cc-discover:before {\n  content: \"\\F1F2\"\n}\n\n.fa-cc-jcb:before {\n  content: \"\\F24B\"\n}\n\n.fa-cc-mastercard:before {\n  content: \"\\F1F1\"\n}\n\n.fa-cc-paypal:before {\n  content: \"\\F1F4\"\n}\n\n.fa-cc-stripe:before {\n  content: \"\\F1F5\"\n}\n\n.fa-cc-visa:before {\n  content: \"\\F1F0\"\n}\n\n.fa-centercode:before {\n  content: \"\\F380\"\n}\n\n.fa-certificate:before {\n  content: \"\\F0A3\"\n}\n\n.fa-chart-area:before {\n  content: \"\\F1FE\"\n}\n\n.fa-chart-bar:before {\n  content: \"\\F080\"\n}\n\n.fa-chart-line:before {\n  content: \"\\F201\"\n}\n\n.fa-chart-pie:before {\n  content: \"\\F200\"\n}\n\n.fa-check:before {\n  content: \"\\F00C\"\n}\n\n.fa-check-circle:before {\n  content: \"\\F058\"\n}\n\n.fa-check-square:before {\n  content: \"\\F14A\"\n}\n\n.fa-chess:before {\n  content: \"\\F439\"\n}\n\n.fa-chess-bishop:before {\n  content: \"\\F43A\"\n}\n\n.fa-chess-board:before {\n  content: \"\\F43C\"\n}\n\n.fa-chess-king:before {\n  content: \"\\F43F\"\n}\n\n.fa-chess-knight:before {\n  content: \"\\F441\"\n}\n\n.fa-chess-pawn:before {\n  content: \"\\F443\"\n}\n\n.fa-chess-queen:before {\n  content: \"\\F445\"\n}\n\n.fa-chess-rook:before {\n  content: \"\\F447\"\n}\n\n.fa-chevron-circle-down:before {\n  content: \"\\F13A\"\n}\n\n.fa-chevron-circle-left:before {\n  content: \"\\F137\"\n}\n\n.fa-chevron-circle-right:before {\n  content: \"\\F138\"\n}\n\n.fa-chevron-circle-up:before {\n  content: \"\\F139\"\n}\n\n.fa-chevron-down:before {\n  content: \"\\F078\"\n}\n\n.fa-chevron-left:before {\n  content: \"\\F053\"\n}\n\n.fa-chevron-right:before {\n  content: \"\\F054\"\n}\n\n.fa-chevron-up:before {\n  content: \"\\F077\"\n}\n\n.fa-child:before {\n  content: \"\\F1AE\"\n}\n\n.fa-chrome:before {\n  content: \"\\F268\"\n}\n\n.fa-circle:before {\n  content: \"\\F111\"\n}\n\n.fa-circle-notch:before {\n  content: \"\\F1CE\"\n}\n\n.fa-clipboard:before {\n  content: \"\\F328\"\n}\n\n.fa-clipboard-check:before {\n  content: \"\\F46C\"\n}\n\n.fa-clipboard-list:before {\n  content: \"\\F46D\"\n}\n\n.fa-clock:before {\n  content: \"\\F017\"\n}\n\n.fa-clone:before {\n  content: \"\\F24D\"\n}\n\n.fa-closed-captioning:before {\n  content: \"\\F20A\"\n}\n\n.fa-cloud:before {\n  content: \"\\F0C2\"\n}\n\n.fa-cloud-download-alt:before {\n  content: \"\\F381\"\n}\n\n.fa-cloud-upload-alt:before {\n  content: \"\\F382\"\n}\n\n.fa-cloudscale:before {\n  content: \"\\F383\"\n}\n\n.fa-cloudsmith:before {\n  content: \"\\F384\"\n}\n\n.fa-cloudversify:before {\n  content: \"\\F385\"\n}\n\n.fa-code:before {\n  content: \"\\F121\"\n}\n\n.fa-code-branch:before {\n  content: \"\\F126\"\n}\n\n.fa-codepen:before {\n  content: \"\\F1CB\"\n}\n\n.fa-codiepie:before {\n  content: \"\\F284\"\n}\n\n.fa-coffee:before {\n  content: \"\\F0F4\"\n}\n\n.fa-cog:before {\n  content: \"\\F013\"\n}\n\n.fa-cogs:before {\n  content: \"\\F085\"\n}\n\n.fa-columns:before {\n  content: \"\\F0DB\"\n}\n\n.fa-comment:before {\n  content: \"\\F075\"\n}\n\n.fa-comment-alt:before {\n  content: \"\\F27A\"\n}\n\n.fa-comments:before {\n  content: \"\\F086\"\n}\n\n.fa-compass:before {\n  content: \"\\F14E\"\n}\n\n.fa-compress:before {\n  content: \"\\F066\"\n}\n\n.fa-connectdevelop:before {\n  content: \"\\F20E\"\n}\n\n.fa-contao:before {\n  content: \"\\F26D\"\n}\n\n.fa-copy:before {\n  content: \"\\F0C5\"\n}\n\n.fa-copyright:before {\n  content: \"\\F1F9\"\n}\n\n.fa-cpanel:before {\n  content: \"\\F388\"\n}\n\n.fa-creative-commons:before {\n  content: \"\\F25E\"\n}\n\n.fa-credit-card:before {\n  content: \"\\F09D\"\n}\n\n.fa-crop:before {\n  content: \"\\F125\"\n}\n\n.fa-crosshairs:before {\n  content: \"\\F05B\"\n}\n\n.fa-css3:before {\n  content: \"\\F13C\"\n}\n\n.fa-css3-alt:before {\n  content: \"\\F38B\"\n}\n\n.fa-cube:before {\n  content: \"\\F1B2\"\n}\n\n.fa-cubes:before {\n  content: \"\\F1B3\"\n}\n\n.fa-cut:before {\n  content: \"\\F0C4\"\n}\n\n.fa-cuttlefish:before {\n  content: \"\\F38C\"\n}\n\n.fa-d-and-d:before {\n  content: \"\\F38D\"\n}\n\n.fa-dashcube:before {\n  content: \"\\F210\"\n}\n\n.fa-database:before {\n  content: \"\\F1C0\"\n}\n\n.fa-deaf:before {\n  content: \"\\F2A4\"\n}\n\n.fa-delicious:before {\n  content: \"\\F1A5\"\n}\n\n.fa-deploydog:before {\n  content: \"\\F38E\"\n}\n\n.fa-deskpro:before {\n  content: \"\\F38F\"\n}\n\n.fa-desktop:before {\n  content: \"\\F108\"\n}\n\n.fa-deviantart:before {\n  content: \"\\F1BD\"\n}\n\n.fa-digg:before {\n  content: \"\\F1A6\"\n}\n\n.fa-digital-ocean:before {\n  content: \"\\F391\"\n}\n\n.fa-discord:before {\n  content: \"\\F392\"\n}\n\n.fa-discourse:before {\n  content: \"\\F393\"\n}\n\n.fa-dna:before {\n  content: \"\\F471\"\n}\n\n.fa-dochub:before {\n  content: \"\\F394\"\n}\n\n.fa-docker:before {\n  content: \"\\F395\"\n}\n\n.fa-dollar-sign:before {\n  content: \"\\F155\"\n}\n\n.fa-dolly:before {\n  content: \"\\F472\"\n}\n\n.fa-dolly-flatbed:before {\n  content: \"\\F474\"\n}\n\n.fa-dot-circle:before {\n  content: \"\\F192\"\n}\n\n.fa-download:before {\n  content: \"\\F019\"\n}\n\n.fa-draft2digital:before {\n  content: \"\\F396\"\n}\n\n.fa-dribbble:before {\n  content: \"\\F17D\"\n}\n\n.fa-dribbble-square:before {\n  content: \"\\F397\"\n}\n\n.fa-dropbox:before {\n  content: \"\\F16B\"\n}\n\n.fa-drupal:before {\n  content: \"\\F1A9\"\n}\n\n.fa-dyalog:before {\n  content: \"\\F399\"\n}\n\n.fa-earlybirds:before {\n  content: \"\\F39A\"\n}\n\n.fa-edge:before {\n  content: \"\\F282\"\n}\n\n.fa-edit:before {\n  content: \"\\F044\"\n}\n\n.fa-eject:before {\n  content: \"\\F052\"\n}\n\n.fa-elementor:before {\n  content: \"\\F430\"\n}\n\n.fa-ellipsis-h:before {\n  content: \"\\F141\"\n}\n\n.fa-ellipsis-v:before {\n  content: \"\\F142\"\n}\n\n.fa-ember:before {\n  content: \"\\F423\"\n}\n\n.fa-empire:before {\n  content: \"\\F1D1\"\n}\n\n.fa-envelope:before {\n  content: \"\\F0E0\"\n}\n\n.fa-envelope-open:before {\n  content: \"\\F2B6\"\n}\n\n.fa-envelope-square:before {\n  content: \"\\F199\"\n}\n\n.fa-envira:before {\n  content: \"\\F299\"\n}\n\n.fa-eraser:before {\n  content: \"\\F12D\"\n}\n\n.fa-erlang:before {\n  content: \"\\F39D\"\n}\n\n.fa-ethereum:before {\n  content: \"\\F42E\"\n}\n\n.fa-etsy:before {\n  content: \"\\F2D7\"\n}\n\n.fa-euro-sign:before {\n  content: \"\\F153\"\n}\n\n.fa-exchange-alt:before {\n  content: \"\\F362\"\n}\n\n.fa-exclamation:before {\n  content: \"\\F12A\"\n}\n\n.fa-exclamation-circle:before {\n  content: \"\\F06A\"\n}\n\n.fa-exclamation-triangle:before {\n  content: \"\\F071\"\n}\n\n.fa-expand:before {\n  content: \"\\F065\"\n}\n\n.fa-expand-arrows-alt:before {\n  content: \"\\F31E\"\n}\n\n.fa-expeditedssl:before {\n  content: \"\\F23E\"\n}\n\n.fa-external-link-alt:before {\n  content: \"\\F35D\"\n}\n\n.fa-external-link-square-alt:before {\n  content: \"\\F360\"\n}\n\n.fa-eye:before {\n  content: \"\\F06E\"\n}\n\n.fa-eye-dropper:before {\n  content: \"\\F1FB\"\n}\n\n.fa-eye-slash:before {\n  content: \"\\F070\"\n}\n\n.fa-facebook:before {\n  content: \"\\F09A\"\n}\n\n.fa-facebook-f:before {\n  content: \"\\F39E\"\n}\n\n.fa-facebook-messenger:before {\n  content: \"\\F39F\"\n}\n\n.fa-facebook-square:before {\n  content: \"\\F082\"\n}\n\n.fa-fast-backward:before {\n  content: \"\\F049\"\n}\n\n.fa-fast-forward:before {\n  content: \"\\F050\"\n}\n\n.fa-fax:before {\n  content: \"\\F1AC\"\n}\n\n.fa-female:before {\n  content: \"\\F182\"\n}\n\n.fa-fighter-jet:before {\n  content: \"\\F0FB\"\n}\n\n.fa-file:before {\n  content: \"\\F15B\"\n}\n\n.fa-file-alt:before {\n  content: \"\\F15C\"\n}\n\n.fa-file-archive:before {\n  content: \"\\F1C6\"\n}\n\n.fa-file-audio:before {\n  content: \"\\F1C7\"\n}\n\n.fa-file-code:before {\n  content: \"\\F1C9\"\n}\n\n.fa-file-excel:before {\n  content: \"\\F1C3\"\n}\n\n.fa-file-image:before {\n  content: \"\\F1C5\"\n}\n\n.fa-file-pdf:before {\n  content: \"\\F1C1\"\n}\n\n.fa-file-powerpoint:before {\n  content: \"\\F1C4\"\n}\n\n.fa-file-video:before {\n  content: \"\\F1C8\"\n}\n\n.fa-file-word:before {\n  content: \"\\F1C2\"\n}\n\n.fa-film:before {\n  content: \"\\F008\"\n}\n\n.fa-filter:before {\n  content: \"\\F0B0\"\n}\n\n.fa-fire:before {\n  content: \"\\F06D\"\n}\n\n.fa-fire-extinguisher:before {\n  content: \"\\F134\"\n}\n\n.fa-firefox:before {\n  content: \"\\F269\"\n}\n\n.fa-first-aid:before {\n  content: \"\\F479\"\n}\n\n.fa-first-order:before {\n  content: \"\\F2B0\"\n}\n\n.fa-firstdraft:before {\n  content: \"\\F3A1\"\n}\n\n.fa-flag:before {\n  content: \"\\F024\"\n}\n\n.fa-flag-checkered:before {\n  content: \"\\F11E\"\n}\n\n.fa-flask:before {\n  content: \"\\F0C3\"\n}\n\n.fa-flickr:before {\n  content: \"\\F16E\"\n}\n\n.fa-flipboard:before {\n  content: \"\\F44D\"\n}\n\n.fa-fly:before {\n  content: \"\\F417\"\n}\n\n.fa-folder:before {\n  content: \"\\F07B\"\n}\n\n.fa-folder-open:before {\n  content: \"\\F07C\"\n}\n\n.fa-font:before {\n  content: \"\\F031\"\n}\n\n.fa-font-awesome:before {\n  content: \"\\F2B4\"\n}\n\n.fa-font-awesome-alt:before {\n  content: \"\\F35C\"\n}\n\n.fa-font-awesome-flag:before {\n  content: \"\\F425\"\n}\n\n.fa-fonticons:before {\n  content: \"\\F280\"\n}\n\n.fa-fonticons-fi:before {\n  content: \"\\F3A2\"\n}\n\n.fa-football-ball:before {\n  content: \"\\F44E\"\n}\n\n.fa-fort-awesome:before {\n  content: \"\\F286\"\n}\n\n.fa-fort-awesome-alt:before {\n  content: \"\\F3A3\"\n}\n\n.fa-forumbee:before {\n  content: \"\\F211\"\n}\n\n.fa-forward:before {\n  content: \"\\F04E\"\n}\n\n.fa-foursquare:before {\n  content: \"\\F180\"\n}\n\n.fa-free-code-camp:before {\n  content: \"\\F2C5\"\n}\n\n.fa-freebsd:before {\n  content: \"\\F3A4\"\n}\n\n.fa-frown:before {\n  content: \"\\F119\"\n}\n\n.fa-futbol:before {\n  content: \"\\F1E3\"\n}\n\n.fa-gamepad:before {\n  content: \"\\F11B\"\n}\n\n.fa-gavel:before {\n  content: \"\\F0E3\"\n}\n\n.fa-gem:before {\n  content: \"\\F3A5\"\n}\n\n.fa-genderless:before {\n  content: \"\\F22D\"\n}\n\n.fa-get-pocket:before {\n  content: \"\\F265\"\n}\n\n.fa-gg:before {\n  content: \"\\F260\"\n}\n\n.fa-gg-circle:before {\n  content: \"\\F261\"\n}\n\n.fa-gift:before {\n  content: \"\\F06B\"\n}\n\n.fa-git:before {\n  content: \"\\F1D3\"\n}\n\n.fa-git-square:before {\n  content: \"\\F1D2\"\n}\n\n.fa-github:before {\n  content: \"\\F09B\"\n}\n\n.fa-github-alt:before {\n  content: \"\\F113\"\n}\n\n.fa-github-square:before {\n  content: \"\\F092\"\n}\n\n.fa-gitkraken:before {\n  content: \"\\F3A6\"\n}\n\n.fa-gitlab:before {\n  content: \"\\F296\"\n}\n\n.fa-gitter:before {\n  content: \"\\F426\"\n}\n\n.fa-glass-martini:before {\n  content: \"\\F000\"\n}\n\n.fa-glide:before {\n  content: \"\\F2A5\"\n}\n\n.fa-glide-g:before {\n  content: \"\\F2A6\"\n}\n\n.fa-globe:before {\n  content: \"\\F0AC\"\n}\n\n.fa-gofore:before {\n  content: \"\\F3A7\"\n}\n\n.fa-golf-ball:before {\n  content: \"\\F450\"\n}\n\n.fa-goodreads:before {\n  content: \"\\F3A8\"\n}\n\n.fa-goodreads-g:before {\n  content: \"\\F3A9\"\n}\n\n.fa-google:before {\n  content: \"\\F1A0\"\n}\n\n.fa-google-drive:before {\n  content: \"\\F3AA\"\n}\n\n.fa-google-play:before {\n  content: \"\\F3AB\"\n}\n\n.fa-google-plus:before {\n  content: \"\\F2B3\"\n}\n\n.fa-google-plus-g:before {\n  content: \"\\F0D5\"\n}\n\n.fa-google-plus-square:before {\n  content: \"\\F0D4\"\n}\n\n.fa-google-wallet:before {\n  content: \"\\F1EE\"\n}\n\n.fa-graduation-cap:before {\n  content: \"\\F19D\"\n}\n\n.fa-gratipay:before {\n  content: \"\\F184\"\n}\n\n.fa-grav:before {\n  content: \"\\F2D6\"\n}\n\n.fa-gripfire:before {\n  content: \"\\F3AC\"\n}\n\n.fa-grunt:before {\n  content: \"\\F3AD\"\n}\n\n.fa-gulp:before {\n  content: \"\\F3AE\"\n}\n\n.fa-h-square:before {\n  content: \"\\F0FD\"\n}\n\n.fa-hacker-news:before {\n  content: \"\\F1D4\"\n}\n\n.fa-hacker-news-square:before {\n  content: \"\\F3AF\"\n}\n\n.fa-hand-lizard:before {\n  content: \"\\F258\"\n}\n\n.fa-hand-paper:before {\n  content: \"\\F256\"\n}\n\n.fa-hand-peace:before {\n  content: \"\\F25B\"\n}\n\n.fa-hand-point-down:before {\n  content: \"\\F0A7\"\n}\n\n.fa-hand-point-left:before {\n  content: \"\\F0A5\"\n}\n\n.fa-hand-point-right:before {\n  content: \"\\F0A4\"\n}\n\n.fa-hand-point-up:before {\n  content: \"\\F0A6\"\n}\n\n.fa-hand-pointer:before {\n  content: \"\\F25A\"\n}\n\n.fa-hand-rock:before {\n  content: \"\\F255\"\n}\n\n.fa-hand-scissors:before {\n  content: \"\\F257\"\n}\n\n.fa-hand-spock:before {\n  content: \"\\F259\"\n}\n\n.fa-handshake:before {\n  content: \"\\F2B5\"\n}\n\n.fa-hashtag:before {\n  content: \"\\F292\"\n}\n\n.fa-hdd:before {\n  content: \"\\F0A0\"\n}\n\n.fa-heading:before {\n  content: \"\\F1DC\"\n}\n\n.fa-headphones:before {\n  content: \"\\F025\"\n}\n\n.fa-heart:before {\n  content: \"\\F004\"\n}\n\n.fa-heartbeat:before {\n  content: \"\\F21E\"\n}\n\n.fa-hips:before {\n  content: \"\\F452\"\n}\n\n.fa-hire-a-helper:before {\n  content: \"\\F3B0\"\n}\n\n.fa-history:before {\n  content: \"\\F1DA\"\n}\n\n.fa-hockey-puck:before {\n  content: \"\\F453\"\n}\n\n.fa-home:before {\n  content: \"\\F015\"\n}\n\n.fa-hooli:before {\n  content: \"\\F427\"\n}\n\n.fa-hospital:before {\n  content: \"\\F0F8\"\n}\n\n.fa-hospital-symbol:before {\n  content: \"\\F47E\"\n}\n\n.fa-hotjar:before {\n  content: \"\\F3B1\"\n}\n\n.fa-hourglass:before {\n  content: \"\\F254\"\n}\n\n.fa-hourglass-end:before {\n  content: \"\\F253\"\n}\n\n.fa-hourglass-half:before {\n  content: \"\\F252\"\n}\n\n.fa-hourglass-start:before {\n  content: \"\\F251\"\n}\n\n.fa-houzz:before {\n  content: \"\\F27C\"\n}\n\n.fa-html5:before {\n  content: \"\\F13B\"\n}\n\n.fa-hubspot:before {\n  content: \"\\F3B2\"\n}\n\n.fa-i-cursor:before {\n  content: \"\\F246\"\n}\n\n.fa-id-badge:before {\n  content: \"\\F2C1\"\n}\n\n.fa-id-card:before {\n  content: \"\\F2C2\"\n}\n\n.fa-image:before {\n  content: \"\\F03E\"\n}\n\n.fa-images:before {\n  content: \"\\F302\"\n}\n\n.fa-imdb:before {\n  content: \"\\F2D8\"\n}\n\n.fa-inbox:before {\n  content: \"\\F01C\"\n}\n\n.fa-indent:before {\n  content: \"\\F03C\"\n}\n\n.fa-industry:before {\n  content: \"\\F275\"\n}\n\n.fa-info:before {\n  content: \"\\F129\"\n}\n\n.fa-info-circle:before {\n  content: \"\\F05A\"\n}\n\n.fa-instagram:before {\n  content: \"\\F16D\"\n}\n\n.fa-internet-explorer:before {\n  content: \"\\F26B\"\n}\n\n.fa-ioxhost:before {\n  content: \"\\F208\"\n}\n\n.fa-italic:before {\n  content: \"\\F033\"\n}\n\n.fa-itunes:before {\n  content: \"\\F3B4\"\n}\n\n.fa-itunes-note:before {\n  content: \"\\F3B5\"\n}\n\n.fa-jenkins:before {\n  content: \"\\F3B6\"\n}\n\n.fa-joget:before {\n  content: \"\\F3B7\"\n}\n\n.fa-joomla:before {\n  content: \"\\F1AA\"\n}\n\n.fa-js:before {\n  content: \"\\F3B8\"\n}\n\n.fa-js-square:before {\n  content: \"\\F3B9\"\n}\n\n.fa-jsfiddle:before {\n  content: \"\\F1CC\"\n}\n\n.fa-key:before {\n  content: \"\\F084\"\n}\n\n.fa-keyboard:before {\n  content: \"\\F11C\"\n}\n\n.fa-keycdn:before {\n  content: \"\\F3BA\"\n}\n\n.fa-kickstarter:before {\n  content: \"\\F3BB\"\n}\n\n.fa-kickstarter-k:before {\n  content: \"\\F3BC\"\n}\n\n.fa-korvue:before {\n  content: \"\\F42F\"\n}\n\n.fa-language:before {\n  content: \"\\F1AB\"\n}\n\n.fa-laptop:before {\n  content: \"\\F109\"\n}\n\n.fa-laravel:before {\n  content: \"\\F3BD\"\n}\n\n.fa-lastfm:before {\n  content: \"\\F202\"\n}\n\n.fa-lastfm-square:before {\n  content: \"\\F203\"\n}\n\n.fa-leaf:before {\n  content: \"\\F06C\"\n}\n\n.fa-leanpub:before {\n  content: \"\\F212\"\n}\n\n.fa-lemon:before {\n  content: \"\\F094\"\n}\n\n.fa-less:before {\n  content: \"\\F41D\"\n}\n\n.fa-level-down-alt:before {\n  content: \"\\F3BE\"\n}\n\n.fa-level-up-alt:before {\n  content: \"\\F3BF\"\n}\n\n.fa-life-ring:before {\n  content: \"\\F1CD\"\n}\n\n.fa-lightbulb:before {\n  content: \"\\F0EB\"\n}\n\n.fa-line:before {\n  content: \"\\F3C0\"\n}\n\n.fa-link:before {\n  content: \"\\F0C1\"\n}\n\n.fa-linkedin:before {\n  content: \"\\F08C\"\n}\n\n.fa-linkedin-in:before {\n  content: \"\\F0E1\"\n}\n\n.fa-linode:before {\n  content: \"\\F2B8\"\n}\n\n.fa-linux:before {\n  content: \"\\F17C\"\n}\n\n.fa-lira-sign:before {\n  content: \"\\F195\"\n}\n\n.fa-list:before {\n  content: \"\\F03A\"\n}\n\n.fa-list-alt:before {\n  content: \"\\F022\"\n}\n\n.fa-list-ol:before {\n  content: \"\\F0CB\"\n}\n\n.fa-list-ul:before {\n  content: \"\\F0CA\"\n}\n\n.fa-location-arrow:before {\n  content: \"\\F124\"\n}\n\n.fa-lock:before {\n  content: \"\\F023\"\n}\n\n.fa-lock-open:before {\n  content: \"\\F3C1\"\n}\n\n.fa-long-arrow-alt-down:before {\n  content: \"\\F309\"\n}\n\n.fa-long-arrow-alt-left:before {\n  content: \"\\F30A\"\n}\n\n.fa-long-arrow-alt-right:before {\n  content: \"\\F30B\"\n}\n\n.fa-long-arrow-alt-up:before {\n  content: \"\\F30C\"\n}\n\n.fa-low-vision:before {\n  content: \"\\F2A8\"\n}\n\n.fa-lyft:before {\n  content: \"\\F3C3\"\n}\n\n.fa-magento:before {\n  content: \"\\F3C4\"\n}\n\n.fa-magic:before {\n  content: \"\\F0D0\"\n}\n\n.fa-magnet:before {\n  content: \"\\F076\"\n}\n\n.fa-male:before {\n  content: \"\\F183\"\n}\n\n.fa-map:before {\n  content: \"\\F279\"\n}\n\n.fa-map-marker:before {\n  content: \"\\F041\"\n}\n\n.fa-map-marker-alt:before {\n  content: \"\\F3C5\"\n}\n\n.fa-map-pin:before {\n  content: \"\\F276\"\n}\n\n.fa-map-signs:before {\n  content: \"\\F277\"\n}\n\n.fa-mars:before {\n  content: \"\\F222\"\n}\n\n.fa-mars-double:before {\n  content: \"\\F227\"\n}\n\n.fa-mars-stroke:before {\n  content: \"\\F229\"\n}\n\n.fa-mars-stroke-h:before {\n  content: \"\\F22B\"\n}\n\n.fa-mars-stroke-v:before {\n  content: \"\\F22A\"\n}\n\n.fa-maxcdn:before {\n  content: \"\\F136\"\n}\n\n.fa-medapps:before {\n  content: \"\\F3C6\"\n}\n\n.fa-medium:before {\n  content: \"\\F23A\"\n}\n\n.fa-medium-m:before {\n  content: \"\\F3C7\"\n}\n\n.fa-medkit:before {\n  content: \"\\F0FA\"\n}\n\n.fa-medrt:before {\n  content: \"\\F3C8\"\n}\n\n.fa-meetup:before {\n  content: \"\\F2E0\"\n}\n\n.fa-meh:before {\n  content: \"\\F11A\"\n}\n\n.fa-mercury:before {\n  content: \"\\F223\"\n}\n\n.fa-microchip:before {\n  content: \"\\F2DB\"\n}\n\n.fa-microphone:before {\n  content: \"\\F130\"\n}\n\n.fa-microphone-slash:before {\n  content: \"\\F131\"\n}\n\n.fa-microsoft:before {\n  content: \"\\F3CA\"\n}\n\n.fa-minus:before {\n  content: \"\\F068\"\n}\n\n.fa-minus-circle:before {\n  content: \"\\F056\"\n}\n\n.fa-minus-square:before {\n  content: \"\\F146\"\n}\n\n.fa-mix:before {\n  content: \"\\F3CB\"\n}\n\n.fa-mixcloud:before {\n  content: \"\\F289\"\n}\n\n.fa-mizuni:before {\n  content: \"\\F3CC\"\n}\n\n.fa-mobile:before {\n  content: \"\\F10B\"\n}\n\n.fa-mobile-alt:before {\n  content: \"\\F3CD\"\n}\n\n.fa-modx:before {\n  content: \"\\F285\"\n}\n\n.fa-monero:before {\n  content: \"\\F3D0\"\n}\n\n.fa-money-bill-alt:before {\n  content: \"\\F3D1\"\n}\n\n.fa-moon:before {\n  content: \"\\F186\"\n}\n\n.fa-motorcycle:before {\n  content: \"\\F21C\"\n}\n\n.fa-mouse-pointer:before {\n  content: \"\\F245\"\n}\n\n.fa-music:before {\n  content: \"\\F001\"\n}\n\n.fa-napster:before {\n  content: \"\\F3D2\"\n}\n\n.fa-neuter:before {\n  content: \"\\F22C\"\n}\n\n.fa-newspaper:before {\n  content: \"\\F1EA\"\n}\n\n.fa-nintendo-switch:before {\n  content: \"\\F418\"\n}\n\n.fa-node:before {\n  content: \"\\F419\"\n}\n\n.fa-node-js:before {\n  content: \"\\F3D3\"\n}\n\n.fa-npm:before {\n  content: \"\\F3D4\"\n}\n\n.fa-ns8:before {\n  content: \"\\F3D5\"\n}\n\n.fa-nutritionix:before {\n  content: \"\\F3D6\"\n}\n\n.fa-object-group:before {\n  content: \"\\F247\"\n}\n\n.fa-object-ungroup:before {\n  content: \"\\F248\"\n}\n\n.fa-odnoklassniki:before {\n  content: \"\\F263\"\n}\n\n.fa-odnoklassniki-square:before {\n  content: \"\\F264\"\n}\n\n.fa-opencart:before {\n  content: \"\\F23D\"\n}\n\n.fa-openid:before {\n  content: \"\\F19B\"\n}\n\n.fa-opera:before {\n  content: \"\\F26A\"\n}\n\n.fa-optin-monster:before {\n  content: \"\\F23C\"\n}\n\n.fa-osi:before {\n  content: \"\\F41A\"\n}\n\n.fa-outdent:before {\n  content: \"\\F03B\"\n}\n\n.fa-page4:before {\n  content: \"\\F3D7\"\n}\n\n.fa-pagelines:before {\n  content: \"\\F18C\"\n}\n\n.fa-paint-brush:before {\n  content: \"\\F1FC\"\n}\n\n.fa-palfed:before {\n  content: \"\\F3D8\"\n}\n\n.fa-pallet:before {\n  content: \"\\F482\"\n}\n\n.fa-paper-plane:before {\n  content: \"\\F1D8\"\n}\n\n.fa-paperclip:before {\n  content: \"\\F0C6\"\n}\n\n.fa-paragraph:before {\n  content: \"\\F1DD\"\n}\n\n.fa-paste:before {\n  content: \"\\F0EA\"\n}\n\n.fa-patreon:before {\n  content: \"\\F3D9\"\n}\n\n.fa-pause:before {\n  content: \"\\F04C\"\n}\n\n.fa-pause-circle:before {\n  content: \"\\F28B\"\n}\n\n.fa-paw:before {\n  content: \"\\F1B0\"\n}\n\n.fa-paypal:before {\n  content: \"\\F1ED\"\n}\n\n.fa-pen-square:before {\n  content: \"\\F14B\"\n}\n\n.fa-pencil-alt:before {\n  content: \"\\F303\"\n}\n\n.fa-percent:before {\n  content: \"\\F295\"\n}\n\n.fa-periscope:before {\n  content: \"\\F3DA\"\n}\n\n.fa-phabricator:before {\n  content: \"\\F3DB\"\n}\n\n.fa-phoenix-framework:before {\n  content: \"\\F3DC\"\n}\n\n.fa-phone:before {\n  content: \"\\F095\"\n}\n\n.fa-phone-square:before {\n  content: \"\\F098\"\n}\n\n.fa-phone-volume:before {\n  content: \"\\F2A0\"\n}\n\n.fa-php:before {\n  content: \"\\F457\"\n}\n\n.fa-pied-piper:before {\n  content: \"\\F2AE\"\n}\n\n.fa-pied-piper-alt:before {\n  content: \"\\F1A8\"\n}\n\n.fa-pied-piper-pp:before {\n  content: \"\\F1A7\"\n}\n\n.fa-pills:before {\n  content: \"\\F484\"\n}\n\n.fa-pinterest:before {\n  content: \"\\F0D2\"\n}\n\n.fa-pinterest-p:before {\n  content: \"\\F231\"\n}\n\n.fa-pinterest-square:before {\n  content: \"\\F0D3\"\n}\n\n.fa-plane:before {\n  content: \"\\F072\"\n}\n\n.fa-play:before {\n  content: \"\\F04B\"\n}\n\n.fa-play-circle:before {\n  content: \"\\F144\"\n}\n\n.fa-playstation:before {\n  content: \"\\F3DF\"\n}\n\n.fa-plug:before {\n  content: \"\\F1E6\"\n}\n\n.fa-plus:before {\n  content: \"\\F067\"\n}\n\n.fa-plus-circle:before {\n  content: \"\\F055\"\n}\n\n.fa-plus-square:before {\n  content: \"\\F0FE\"\n}\n\n.fa-podcast:before {\n  content: \"\\F2CE\"\n}\n\n.fa-pound-sign:before {\n  content: \"\\F154\"\n}\n\n.fa-power-off:before {\n  content: \"\\F011\"\n}\n\n.fa-print:before {\n  content: \"\\F02F\"\n}\n\n.fa-product-hunt:before {\n  content: \"\\F288\"\n}\n\n.fa-pushed:before {\n  content: \"\\F3E1\"\n}\n\n.fa-puzzle-piece:before {\n  content: \"\\F12E\"\n}\n\n.fa-python:before {\n  content: \"\\F3E2\"\n}\n\n.fa-qq:before {\n  content: \"\\F1D6\"\n}\n\n.fa-qrcode:before {\n  content: \"\\F029\"\n}\n\n.fa-question:before {\n  content: \"\\F128\"\n}\n\n.fa-question-circle:before {\n  content: \"\\F059\"\n}\n\n.fa-quidditch:before {\n  content: \"\\F458\"\n}\n\n.fa-quinscape:before {\n  content: \"\\F459\"\n}\n\n.fa-quora:before {\n  content: \"\\F2C4\"\n}\n\n.fa-quote-left:before {\n  content: \"\\F10D\"\n}\n\n.fa-quote-right:before {\n  content: \"\\F10E\"\n}\n\n.fa-random:before {\n  content: \"\\F074\"\n}\n\n.fa-ravelry:before {\n  content: \"\\F2D9\"\n}\n\n.fa-react:before {\n  content: \"\\F41B\"\n}\n\n.fa-rebel:before {\n  content: \"\\F1D0\"\n}\n\n.fa-recycle:before {\n  content: \"\\F1B8\"\n}\n\n.fa-red-river:before {\n  content: \"\\F3E3\"\n}\n\n.fa-reddit:before {\n  content: \"\\F1A1\"\n}\n\n.fa-reddit-alien:before {\n  content: \"\\F281\"\n}\n\n.fa-reddit-square:before {\n  content: \"\\F1A2\"\n}\n\n.fa-redo:before {\n  content: \"\\F01E\"\n}\n\n.fa-redo-alt:before {\n  content: \"\\F2F9\"\n}\n\n.fa-registered:before {\n  content: \"\\F25D\"\n}\n\n.fa-rendact:before {\n  content: \"\\F3E4\"\n}\n\n.fa-renren:before {\n  content: \"\\F18B\"\n}\n\n.fa-reply:before {\n  content: \"\\F3E5\"\n}\n\n.fa-reply-all:before {\n  content: \"\\F122\"\n}\n\n.fa-replyd:before {\n  content: \"\\F3E6\"\n}\n\n.fa-resolving:before {\n  content: \"\\F3E7\"\n}\n\n.fa-retweet:before {\n  content: \"\\F079\"\n}\n\n.fa-road:before {\n  content: \"\\F018\"\n}\n\n.fa-rocket:before {\n  content: \"\\F135\"\n}\n\n.fa-rocketchat:before {\n  content: \"\\F3E8\"\n}\n\n.fa-rockrms:before {\n  content: \"\\F3E9\"\n}\n\n.fa-rss:before {\n  content: \"\\F09E\"\n}\n\n.fa-rss-square:before {\n  content: \"\\F143\"\n}\n\n.fa-ruble-sign:before {\n  content: \"\\F158\"\n}\n\n.fa-rupee-sign:before {\n  content: \"\\F156\"\n}\n\n.fa-safari:before {\n  content: \"\\F267\"\n}\n\n.fa-sass:before {\n  content: \"\\F41E\"\n}\n\n.fa-save:before {\n  content: \"\\F0C7\"\n}\n\n.fa-schlix:before {\n  content: \"\\F3EA\"\n}\n\n.fa-scribd:before {\n  content: \"\\F28A\"\n}\n\n.fa-search:before {\n  content: \"\\F002\"\n}\n\n.fa-search-minus:before {\n  content: \"\\F010\"\n}\n\n.fa-search-plus:before {\n  content: \"\\F00E\"\n}\n\n.fa-searchengin:before {\n  content: \"\\F3EB\"\n}\n\n.fa-sellcast:before {\n  content: \"\\F2DA\"\n}\n\n.fa-sellsy:before {\n  content: \"\\F213\"\n}\n\n.fa-server:before {\n  content: \"\\F233\"\n}\n\n.fa-servicestack:before {\n  content: \"\\F3EC\"\n}\n\n.fa-share:before {\n  content: \"\\F064\"\n}\n\n.fa-share-alt:before {\n  content: \"\\F1E0\"\n}\n\n.fa-share-alt-square:before {\n  content: \"\\F1E1\"\n}\n\n.fa-share-square:before {\n  content: \"\\F14D\"\n}\n\n.fa-shekel-sign:before {\n  content: \"\\F20B\"\n}\n\n.fa-shield-alt:before {\n  content: \"\\F3ED\"\n}\n\n.fa-ship:before {\n  content: \"\\F21A\"\n}\n\n.fa-shipping-fast:before {\n  content: \"\\F48B\"\n}\n\n.fa-shirtsinbulk:before {\n  content: \"\\F214\"\n}\n\n.fa-shopping-bag:before {\n  content: \"\\F290\"\n}\n\n.fa-shopping-basket:before {\n  content: \"\\F291\"\n}\n\n.fa-shopping-cart:before {\n  content: \"\\F07A\"\n}\n\n.fa-shower:before {\n  content: \"\\F2CC\"\n}\n\n.fa-sign-in-alt:before {\n  content: \"\\F2F6\"\n}\n\n.fa-sign-language:before {\n  content: \"\\F2A7\"\n}\n\n.fa-sign-out-alt:before {\n  content: \"\\F2F5\"\n}\n\n.fa-signal:before {\n  content: \"\\F012\"\n}\n\n.fa-simplybuilt:before {\n  content: \"\\F215\"\n}\n\n.fa-sistrix:before {\n  content: \"\\F3EE\"\n}\n\n.fa-sitemap:before {\n  content: \"\\F0E8\"\n}\n\n.fa-skyatlas:before {\n  content: \"\\F216\"\n}\n\n.fa-skype:before {\n  content: \"\\F17E\"\n}\n\n.fa-slack:before {\n  content: \"\\F198\"\n}\n\n.fa-slack-hash:before {\n  content: \"\\F3EF\"\n}\n\n.fa-sliders-h:before {\n  content: \"\\F1DE\"\n}\n\n.fa-slideshare:before {\n  content: \"\\F1E7\"\n}\n\n.fa-smile:before {\n  content: \"\\F118\"\n}\n\n.fa-snapchat:before {\n  content: \"\\F2AB\"\n}\n\n.fa-snapchat-ghost:before {\n  content: \"\\F2AC\"\n}\n\n.fa-snapchat-square:before {\n  content: \"\\F2AD\"\n}\n\n.fa-snowflake:before {\n  content: \"\\F2DC\"\n}\n\n.fa-sort:before {\n  content: \"\\F0DC\"\n}\n\n.fa-sort-alpha-down:before {\n  content: \"\\F15D\"\n}\n\n.fa-sort-alpha-up:before {\n  content: \"\\F15E\"\n}\n\n.fa-sort-amount-down:before {\n  content: \"\\F160\"\n}\n\n.fa-sort-amount-up:before {\n  content: \"\\F161\"\n}\n\n.fa-sort-down:before {\n  content: \"\\F0DD\"\n}\n\n.fa-sort-numeric-down:before {\n  content: \"\\F162\"\n}\n\n.fa-sort-numeric-up:before {\n  content: \"\\F163\"\n}\n\n.fa-sort-up:before {\n  content: \"\\F0DE\"\n}\n\n.fa-soundcloud:before {\n  content: \"\\F1BE\"\n}\n\n.fa-space-shuttle:before {\n  content: \"\\F197\"\n}\n\n.fa-speakap:before {\n  content: \"\\F3F3\"\n}\n\n.fa-spinner:before {\n  content: \"\\F110\"\n}\n\n.fa-spotify:before {\n  content: \"\\F1BC\"\n}\n\n.fa-square:before {\n  content: \"\\F0C8\"\n}\n\n.fa-square-full:before {\n  content: \"\\F45C\"\n}\n\n.fa-stack-exchange:before {\n  content: \"\\F18D\"\n}\n\n.fa-stack-overflow:before {\n  content: \"\\F16C\"\n}\n\n.fa-star:before {\n  content: \"\\F005\"\n}\n\n.fa-star-half:before {\n  content: \"\\F089\"\n}\n\n.fa-staylinked:before {\n  content: \"\\F3F5\"\n}\n\n.fa-steam:before {\n  content: \"\\F1B6\"\n}\n\n.fa-steam-square:before {\n  content: \"\\F1B7\"\n}\n\n.fa-steam-symbol:before {\n  content: \"\\F3F6\"\n}\n\n.fa-step-backward:before {\n  content: \"\\F048\"\n}\n\n.fa-step-forward:before {\n  content: \"\\F051\"\n}\n\n.fa-stethoscope:before {\n  content: \"\\F0F1\"\n}\n\n.fa-sticker-mule:before {\n  content: \"\\F3F7\"\n}\n\n.fa-sticky-note:before {\n  content: \"\\F249\"\n}\n\n.fa-stop:before {\n  content: \"\\F04D\"\n}\n\n.fa-stop-circle:before {\n  content: \"\\F28D\"\n}\n\n.fa-stopwatch:before {\n  content: \"\\F2F2\"\n}\n\n.fa-strava:before {\n  content: \"\\F428\"\n}\n\n.fa-street-view:before {\n  content: \"\\F21D\"\n}\n\n.fa-strikethrough:before {\n  content: \"\\F0CC\"\n}\n\n.fa-stripe:before {\n  content: \"\\F429\"\n}\n\n.fa-stripe-s:before {\n  content: \"\\F42A\"\n}\n\n.fa-studiovinari:before {\n  content: \"\\F3F8\"\n}\n\n.fa-stumbleupon:before {\n  content: \"\\F1A4\"\n}\n\n.fa-stumbleupon-circle:before {\n  content: \"\\F1A3\"\n}\n\n.fa-subscript:before {\n  content: \"\\F12C\"\n}\n\n.fa-subway:before {\n  content: \"\\F239\"\n}\n\n.fa-suitcase:before {\n  content: \"\\F0F2\"\n}\n\n.fa-sun:before {\n  content: \"\\F185\"\n}\n\n.fa-superpowers:before {\n  content: \"\\F2DD\"\n}\n\n.fa-superscript:before {\n  content: \"\\F12B\"\n}\n\n.fa-supple:before {\n  content: \"\\F3F9\"\n}\n\n.fa-sync:before {\n  content: \"\\F021\"\n}\n\n.fa-sync-alt:before {\n  content: \"\\F2F1\"\n}\n\n.fa-syringe:before {\n  content: \"\\F48E\"\n}\n\n.fa-table:before {\n  content: \"\\F0CE\"\n}\n\n.fa-table-tennis:before {\n  content: \"\\F45D\"\n}\n\n.fa-tablet:before {\n  content: \"\\F10A\"\n}\n\n.fa-tablet-alt:before {\n  content: \"\\F3FA\"\n}\n\n.fa-tachometer-alt:before {\n  content: \"\\F3FD\"\n}\n\n.fa-tag:before {\n  content: \"\\F02B\"\n}\n\n.fa-tags:before {\n  content: \"\\F02C\"\n}\n\n.fa-tasks:before {\n  content: \"\\F0AE\"\n}\n\n.fa-taxi:before {\n  content: \"\\F1BA\"\n}\n\n.fa-telegram:before {\n  content: \"\\F2C6\"\n}\n\n.fa-telegram-plane:before {\n  content: \"\\F3FE\"\n}\n\n.fa-tencent-weibo:before {\n  content: \"\\F1D5\"\n}\n\n.fa-terminal:before {\n  content: \"\\F120\"\n}\n\n.fa-text-height:before {\n  content: \"\\F034\"\n}\n\n.fa-text-width:before {\n  content: \"\\F035\"\n}\n\n.fa-th:before {\n  content: \"\\F00A\"\n}\n\n.fa-th-large:before {\n  content: \"\\F009\"\n}\n\n.fa-th-list:before {\n  content: \"\\F00B\"\n}\n\n.fa-themeisle:before {\n  content: \"\\F2B2\"\n}\n\n.fa-thermometer:before {\n  content: \"\\F491\"\n}\n\n.fa-thermometer-empty:before {\n  content: \"\\F2CB\"\n}\n\n.fa-thermometer-full:before {\n  content: \"\\F2C7\"\n}\n\n.fa-thermometer-half:before {\n  content: \"\\F2C9\"\n}\n\n.fa-thermometer-quarter:before {\n  content: \"\\F2CA\"\n}\n\n.fa-thermometer-three-quarters:before {\n  content: \"\\F2C8\"\n}\n\n.fa-thumbs-down:before {\n  content: \"\\F165\"\n}\n\n.fa-thumbs-up:before {\n  content: \"\\F164\"\n}\n\n.fa-thumbtack:before {\n  content: \"\\F08D\"\n}\n\n.fa-ticket-alt:before {\n  content: \"\\F3FF\"\n}\n\n.fa-times:before {\n  content: \"\\F00D\"\n}\n\n.fa-times-circle:before {\n  content: \"\\F057\"\n}\n\n.fa-tint:before {\n  content: \"\\F043\"\n}\n\n.fa-toggle-off:before {\n  content: \"\\F204\"\n}\n\n.fa-toggle-on:before {\n  content: \"\\F205\"\n}\n\n.fa-trademark:before {\n  content: \"\\F25C\"\n}\n\n.fa-train:before {\n  content: \"\\F238\"\n}\n\n.fa-transgender:before {\n  content: \"\\F224\"\n}\n\n.fa-transgender-alt:before {\n  content: \"\\F225\"\n}\n\n.fa-trash:before {\n  content: \"\\F1F8\"\n}\n\n.fa-trash-alt:before {\n  content: \"\\F2ED\"\n}\n\n.fa-tree:before {\n  content: \"\\F1BB\"\n}\n\n.fa-trello:before {\n  content: \"\\F181\"\n}\n\n.fa-tripadvisor:before {\n  content: \"\\F262\"\n}\n\n.fa-trophy:before {\n  content: \"\\F091\"\n}\n\n.fa-truck:before {\n  content: \"\\F0D1\"\n}\n\n.fa-tty:before {\n  content: \"\\F1E4\"\n}\n\n.fa-tumblr:before {\n  content: \"\\F173\"\n}\n\n.fa-tumblr-square:before {\n  content: \"\\F174\"\n}\n\n.fa-tv:before {\n  content: \"\\F26C\"\n}\n\n.fa-twitch:before {\n  content: \"\\F1E8\"\n}\n\n.fa-twitter:before {\n  content: \"\\F099\"\n}\n\n.fa-twitter-square:before {\n  content: \"\\F081\"\n}\n\n.fa-typo3:before {\n  content: \"\\F42B\"\n}\n\n.fa-uber:before {\n  content: \"\\F402\"\n}\n\n.fa-uikit:before {\n  content: \"\\F403\"\n}\n\n.fa-umbrella:before {\n  content: \"\\F0E9\"\n}\n\n.fa-underline:before {\n  content: \"\\F0CD\"\n}\n\n.fa-undo:before {\n  content: \"\\F0E2\"\n}\n\n.fa-undo-alt:before {\n  content: \"\\F2EA\"\n}\n\n.fa-uniregistry:before {\n  content: \"\\F404\"\n}\n\n.fa-universal-access:before {\n  content: \"\\F29A\"\n}\n\n.fa-university:before {\n  content: \"\\F19C\"\n}\n\n.fa-unlink:before {\n  content: \"\\F127\"\n}\n\n.fa-unlock:before {\n  content: \"\\F09C\"\n}\n\n.fa-unlock-alt:before {\n  content: \"\\F13E\"\n}\n\n.fa-untappd:before {\n  content: \"\\F405\"\n}\n\n.fa-upload:before {\n  content: \"\\F093\"\n}\n\n.fa-usb:before {\n  content: \"\\F287\"\n}\n\n.fa-user:before {\n  content: \"\\F007\"\n}\n\n.fa-user-circle:before {\n  content: \"\\F2BD\"\n}\n\n.fa-user-md:before {\n  content: \"\\F0F0\"\n}\n\n.fa-user-plus:before {\n  content: \"\\F234\"\n}\n\n.fa-user-secret:before {\n  content: \"\\F21B\"\n}\n\n.fa-user-times:before {\n  content: \"\\F235\"\n}\n\n.fa-users:before {\n  content: \"\\F0C0\"\n}\n\n.fa-ussunnah:before {\n  content: \"\\F407\"\n}\n\n.fa-utensil-spoon:before {\n  content: \"\\F2E5\"\n}\n\n.fa-utensils:before {\n  content: \"\\F2E7\"\n}\n\n.fa-vaadin:before {\n  content: \"\\F408\"\n}\n\n.fa-venus:before {\n  content: \"\\F221\"\n}\n\n.fa-venus-double:before {\n  content: \"\\F226\"\n}\n\n.fa-venus-mars:before {\n  content: \"\\F228\"\n}\n\n.fa-viacoin:before {\n  content: \"\\F237\"\n}\n\n.fa-viadeo:before {\n  content: \"\\F2A9\"\n}\n\n.fa-viadeo-square:before {\n  content: \"\\F2AA\"\n}\n\n.fa-viber:before {\n  content: \"\\F409\"\n}\n\n.fa-video:before {\n  content: \"\\F03D\"\n}\n\n.fa-vimeo:before {\n  content: \"\\F40A\"\n}\n\n.fa-vimeo-square:before {\n  content: \"\\F194\"\n}\n\n.fa-vimeo-v:before {\n  content: \"\\F27D\"\n}\n\n.fa-vine:before {\n  content: \"\\F1CA\"\n}\n\n.fa-vk:before {\n  content: \"\\F189\"\n}\n\n.fa-vnv:before {\n  content: \"\\F40B\"\n}\n\n.fa-volleyball-ball:before {\n  content: \"\\F45F\"\n}\n\n.fa-volume-down:before {\n  content: \"\\F027\"\n}\n\n.fa-volume-off:before {\n  content: \"\\F026\"\n}\n\n.fa-volume-up:before {\n  content: \"\\F028\"\n}\n\n.fa-vuejs:before {\n  content: \"\\F41F\"\n}\n\n.fa-warehouse:before {\n  content: \"\\F494\"\n}\n\n.fa-weibo:before {\n  content: \"\\F18A\"\n}\n\n.fa-weight:before {\n  content: \"\\F496\"\n}\n\n.fa-weixin:before {\n  content: \"\\F1D7\"\n}\n\n.fa-whatsapp:before {\n  content: \"\\F232\"\n}\n\n.fa-whatsapp-square:before {\n  content: \"\\F40C\"\n}\n\n.fa-wheelchair:before {\n  content: \"\\F193\"\n}\n\n.fa-whmcs:before {\n  content: \"\\F40D\"\n}\n\n.fa-wifi:before {\n  content: \"\\F1EB\"\n}\n\n.fa-wikipedia-w:before {\n  content: \"\\F266\"\n}\n\n.fa-window-close:before {\n  content: \"\\F410\"\n}\n\n.fa-window-maximize:before {\n  content: \"\\F2D0\"\n}\n\n.fa-window-minimize:before {\n  content: \"\\F2D1\"\n}\n\n.fa-window-restore:before {\n  content: \"\\F2D2\"\n}\n\n.fa-windows:before {\n  content: \"\\F17A\"\n}\n\n.fa-won-sign:before {\n  content: \"\\F159\"\n}\n\n.fa-wordpress:before {\n  content: \"\\F19A\"\n}\n\n.fa-wordpress-simple:before {\n  content: \"\\F411\"\n}\n\n.fa-wpbeginner:before {\n  content: \"\\F297\"\n}\n\n.fa-wpexplorer:before {\n  content: \"\\F2DE\"\n}\n\n.fa-wpforms:before {\n  content: \"\\F298\"\n}\n\n.fa-wrench:before {\n  content: \"\\F0AD\"\n}\n\n.fa-xbox:before {\n  content: \"\\F412\"\n}\n\n.fa-xing:before {\n  content: \"\\F168\"\n}\n\n.fa-xing-square:before {\n  content: \"\\F169\"\n}\n\n.fa-y-combinator:before {\n  content: \"\\F23B\"\n}\n\n.fa-yahoo:before {\n  content: \"\\F19E\"\n}\n\n.fa-yandex:before {\n  content: \"\\F413\"\n}\n\n.fa-yandex-international:before {\n  content: \"\\F414\"\n}\n\n.fa-yelp:before {\n  content: \"\\F1E9\"\n}\n\n.fa-yen-sign:before {\n  content: \"\\F157\"\n}\n\n.fa-yoast:before {\n  content: \"\\F2B1\"\n}\n\n.fa-youtube:before {\n  content: \"\\F167\"\n}\n\n.fa-youtube-square:before {\n  content: \"\\F431\"\n}\n\n.sr-only {\n  border: 0;\n  clip: rect(0, 0, 0, 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px\n}\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  clip: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  position: static;\n  width: auto\n}\n\n/* @font-face {\n  font-family: \"Font Awesome\\ 5 Brands\";\n  font-style: normal;\n  font-weight: 400;\n  src: url(../webfonts/fa-brands-400.eot);\n  src: url(../webfonts/fa-brands-400.eot?#iefix) format(\"embedded-opentype\"), url(../webfonts/fa-brands-400.woff2) format(\"woff2\"), url(../webfonts/fa-brands-400.woff) format(\"woff\"), url(../webfonts/fa-brands-400.ttf) format(\"truetype\"), url(../webfonts/fa-brands-400.svg#fontawesome) format(\"svg\")\n} */\n\n.fab {\n  font-family: \"Font Awesome 5 Brands\";\n}\n\n/* @font-face {\n  font-family: \"Font Awesome\\ 5 Free\";\n  font-style: normal;\n  font-weight: 400;\n  src: url(../webfonts/fa-regular-400.eot);\n  src: url(../webfonts/fa-regular-400.eot?#iefix) format(\"embedded-opentype\"), url(../webfonts/fa-regular-400.woff2) format(\"woff2\"), url(../webfonts/fa-regular-400.woff) format(\"woff\"), url(../webfonts/fa-regular-400.ttf) format(\"truetype\"), url(../webfonts/fa-regular-400.svg#fontawesome) format(\"svg\")\n} */\n\n.far {\n  font-weight: 400\n}\n\n@font-face {\n  font-family: \"Font Awesome 5 Free\";\n  font-style: normal;\n  font-weight: 900;\n  src: url(" + __webpack_require__("./src/Common/fonts/fa-solid-900.woff2") + ") format(\"woff2\");\n}\n\n.fa, .far, .fas {\n  font-family: \"Font Awesome 5 Free\";\n}\n\n.fa, .fas {\n  font-weight: 900\n}", ""]);

// exports


/***/ }),

/***/ "./src/Common/fonts/fa-solid-900.woff2":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/media/fa-solid-900.0ab54153.woff2";

/***/ }),

/***/ "./src/Component/CheckListItem.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CheckListItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__SparkComponent__ = __webpack_require__("./src/SparkComponent/index.js");





var _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/Component/CheckListItem.js';



/**
 * Check list item.
 *
 * @type {Component}
 */

var CheckListItem = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(CheckListItem, _React$Component);

  function CheckListItem() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, CheckListItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = CheckListItem.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(CheckListItem)).call.apply(_ref, [this].concat(args))), _this), _this.onChange = function (event) {
      var checked = event.target.checked;
      var _this$props = _this.props,
          editor = _this$props.editor,
          node = _this$props.node;

      editor.change(function (c) {
        return c.setNodeByKey(node.key, { data: { checked: checked } });
      });
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  /**
   * On change, set the new checked value on the block.
   *
   * @param {Event} event
   */

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(CheckListItem, [{
    key: 'render',


    /**
     * Render a check list item, using `contenteditable="false"` to embed the
     * checkbox right next to the block's text.
     *
     * @return {Element}
     */

    value: function render() {
      var _props = this.props,
          attributes = _props.attributes,
          children = _props.children,
          node = _props.node;

      var checked = node.data.get('checked');
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["b" /* CheckBox */],
        {
          className: 'check-list-item',
          checked: checked,
          onChange: this.onChange,
          attributes: attributes,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 35
          }
        },
        children
      );
    }
  }]);

  return CheckListItem;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

/***/ }),

/***/ "./src/Component/CodeBlock/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CodeBlock; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CodeBlockLine; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__("babel-runtime/helpers/extends");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);

var _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/Component/CodeBlock/index.js';

// import '../../vendor/highlight/highlight.pack';
// import hljs from 'highlight.js';
// import loader from 'monaco-editor/min/vs/loader';

function CodeBlock(props) {

  // console.log(hljs);

  var editor = props.editor,
      node = props.node;

  var language = node.data.get('language');

  if (!language) {
    editor.change(function (c) {
      return c.setNodeByKey(node.key, { data: { language: 'css' } });
    });
  }

  function onChange(event) {
    editor.change(function (c) {
      return c.setNodeByKey(node.key, { data: { language: event.target.value } });
    });
  }

  return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
    'div',
    { style: { position: 'relative' }, __source: {
        fileName: _jsxFileName,
        lineNumber: 22
      }
    },
    __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
      'pre',
      {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 23
        }
      },
      __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
        'code',
        __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, props.attributes, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 24
          }
        }),
        props.children
      )
    ),
    __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
      'div',
      {
        contentEditable: false,
        style: { position: 'absolute', top: '5px', right: '5px' },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 26
        }
      },
      __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
        'select',
        { value: language, onChange: onChange, __source: {
            fileName: _jsxFileName,
            lineNumber: 30
          }
        },
        __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
          'option',
          { value: 'css', __source: {
              fileName: _jsxFileName,
              lineNumber: 31
            }
          },
          'CSS'
        ),
        __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
          'option',
          { value: 'js', __source: {
              fileName: _jsxFileName,
              lineNumber: 32
            }
          },
          'JavaScript'
        ),
        __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
          'option',
          { value: 'html', __source: {
              fileName: _jsxFileName,
              lineNumber: 33
            }
          },
          'HTML'
        )
      )
    )
  );
}

function CodeBlockLine(props) {
  return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
    'div',
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, props.attributes, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 42
      }
    }),
    props.children
  );
}



/***/ }),

/***/ "./src/Component/Dialog/LRDialog/LRDialog.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LRDialog; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__ = __webpack_require__("babel-runtime/helpers/defineProperty");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__SparkComponent__ = __webpack_require__("./src/SparkComponent/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__LoginContent__ = __webpack_require__("./src/Component/Dialog/LRDialog/LoginContent.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__RegistContent__ = __webpack_require__("./src/Component/Dialog/LRDialog/RegistContent.js");







var _class,
    _temp2,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/Component/Dialog/LRDialog/LRDialog.js';




// import './LRDialog.less';



if (false) {
  require('./LRDialog.less');
}

var LRDialog = (_temp2 = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default()(LRDialog, _React$Component);

  function LRDialog() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default()(this, LRDialog);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = LRDialog.__proto__ || __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of___default()(LRDialog)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loginUsername: '',
      loginPassword: '',
      registUsername: '',
      registPassword: '',
      confirmRegistPassword: ''
    }, _this.handleLoginOrRegist = function () {
      var _this$state = _this.state,
          loginUsername = _this$state.loginUsername,
          loginPassword = _this$state.loginPassword,
          registPassword = _this$state.registPassword,
          registUsername = _this$state.registUsername,
          confirmRegistPassword = _this$state.confirmRegistPassword;
      var activeTabKey = _this.props.activeTabKey;

      if (activeTabKey === 'login') {
        _this.props.login(loginUsername, loginPassword);
      } else {
        if (registPassword !== confirmRegistPassword) {
          __WEBPACK_IMPORTED_MODULE_8__SparkComponent__["i" /* message */].error('两次填写的密码不一致');
          return;
        }
        _this.props.regist(registUsername, registPassword);
      }
    }, _this.handleCheckoutRegist = function (e) {
      e.preventDefault();
      _this.props.changeActiveTabkey('regist');
    }, _this.handleCheckoutActiveTabType = function (type) {
      _this.props.changeActiveTabkey(type);
    }, _this.handleFormDataChange = function (key, value) {
      _this.setState(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()({}, key, value));
    }, _temp), __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default()(LRDialog, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          visible = _props.visible,
          onCancel = _props.onCancel,
          activeTabKey = _props.activeTabKey;

      var text = activeTabKey === 'login' ? '登录' : '注册';
      return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_8__SparkComponent__["c" /* Dialog */],
        {
          className: 'login-dialog',
          visible: visible,
          title: 'Sparker\u6587\u6863',
          onCancel: onCancel,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 65
          }
        },
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_8__SparkComponent__["c" /* Dialog */].Body,
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 71
            }
          },
          __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_8__SparkComponent__["g" /* Tabs */],
            {
              activeKey: activeTabKey,
              onChange: this.handleCheckoutActiveTabType,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 72
              }
            },
            __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_8__SparkComponent__["g" /* Tabs */].TabPane,
              { tab: '\u767B\u5F55', key: 'login', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 76
                }
              },
              __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9__LoginContent__["a" /* LoginContent */], {
                handleCheckoutRegist: this.handleCheckoutRegist,
                handleFormDataChange: this.handleFormDataChange,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 77
                }
              })
            ),
            __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
              __WEBPACK_IMPORTED_MODULE_8__SparkComponent__["g" /* Tabs */].TabPane,
              { tab: '\u6CE8\u518C', key: 'regist', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 82
                }
              },
              __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_10__RegistContent__["a" /* RegistContent */], {
                handleCheckoutRegist: this.handleCheckoutRegist,
                handleFormDataChange: this.handleFormDataChange,
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 83
                }
              })
            )
          )
        ),
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_8__SparkComponent__["c" /* Dialog */].Footer,
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 90
            }
          },
          __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_8__SparkComponent__["a" /* Button */],
            { type: 'primary', onClick: this.handleLoginOrRegist, __source: {
                fileName: _jsxFileName,
                lineNumber: 91
              }
            },
            text
          )
        )
      );
    }
  }]);

  return LRDialog;
}(__WEBPACK_IMPORTED_MODULE_6_react___default.a.Component), _class.propTypes = {
  visible: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool.isRequired,
  isLoading: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool.isRequired,
  onCancel: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func.isRequired,
  login: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func.isRequired,
  regist: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func.isRequired,
  activeTabKey: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.any.isRequired,
  changeActiveTabkey: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func.isRequired
}, _temp2);

/***/ }),

/***/ "./src/Component/Dialog/LRDialog/LoginContent.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginContent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__SparkComponent___ = __webpack_require__("./src/SparkComponent/index.js");






var _class,
    _temp,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/Component/Dialog/LRDialog/LoginContent.js';





var LoginContent = (_temp = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(LoginContent, _React$Component);

  function LoginContent() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, LoginContent);

    return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (LoginContent.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(LoginContent)).apply(this, arguments));
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(LoginContent, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          handleCheckoutRegist = _props.handleCheckoutRegist,
          handleFormDataChange = _props.handleFormDataChange;


      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'login-dialog-body', __source: {
            fileName: _jsxFileName,
            lineNumber: 17
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__SparkComponent___["d" /* Input */], {
          placeholder: '\u8D26\u53F7',
          onChange: function onChange(e) {
            return handleFormDataChange('loginUsername', e.target.value);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 18
          }
        }),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__SparkComponent___["d" /* Input */], {
          placeholder: '\u5BC6\u7801',
          type: 'password',
          onChange: function onChange(e) {
            return handleFormDataChange('loginPassword', e.target.value);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 22
          }
        }),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          { className: 'friendly-tips', __source: {
              fileName: _jsxFileName,
              lineNumber: 27
            }
          },
          '\u6CA1\u6709\u8D26\u53F7?',
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            'a',
            { href: '#', onClick: handleCheckoutRegist, __source: {
                fileName: _jsxFileName,
                lineNumber: 29
              }
            },
            '\u6CE8\u518C'
          )
        )
      );
    }
  }]);

  return LoginContent;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component), _class.propTypes = {
  handleCheckoutRegist: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired,
  handleFormDataChange: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired
}, _temp);

/***/ }),

/***/ "./src/Component/Dialog/LRDialog/RegistContent.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegistContent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__SparkComponent___ = __webpack_require__("./src/SparkComponent/index.js");






var _class,
    _temp,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/Component/Dialog/LRDialog/RegistContent.js';





var RegistContent = (_temp = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(RegistContent, _React$Component);

  function RegistContent() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, RegistContent);

    return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (RegistContent.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(RegistContent)).apply(this, arguments));
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(RegistContent, [{
    key: 'render',
    value: function render() {
      var handleFormDataChange = this.props.handleFormDataChange;


      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'regist-dialog-body', __source: {
            fileName: _jsxFileName,
            lineNumber: 17
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__SparkComponent___["d" /* Input */], {
          placeholder: '\u8D26\u53F7',
          onChange: function onChange(e) {
            return handleFormDataChange('registUsername', e.target.value);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 18
          }
        }),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__SparkComponent___["d" /* Input */], {
          placeholder: '\u5BC6\u7801',
          type: 'password',
          onChange: function onChange(e) {
            return handleFormDataChange('registPassword', e.target.value);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 22
          }
        }),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__SparkComponent___["d" /* Input */], {
          placeholder: '\u518D\u6B21\u586B\u5199\u5BC6\u7801',
          type: 'password',
          onChange: function onChange(e) {
            return handleFormDataChange('confirmRegistPassword', e.target.value);
          },
          __source: {
            fileName: _jsxFileName,
            lineNumber: 27
          }
        })
      );
    }
  }]);

  return RegistContent;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component), _class.propTypes = {
  handleCheckoutRegist: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired,
  handleFormDataChange: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired
}, _temp);

/***/ }),

/***/ "./src/Component/Dialog/LRDialog/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__LRDialog__ = __webpack_require__("./src/Component/Dialog/LRDialog/LRDialog.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__LRDialog__["a"]; });


/***/ }),

/***/ "./src/Component/Dialog/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__LRDialog__ = __webpack_require__("./src/Component/Dialog/LRDialog/index.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__LRDialog__["a"]; });


/***/ }),

/***/ "./src/Component/HoverMenu.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HoverMenu; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Icons__ = __webpack_require__("./src/Component/Icons/index.js");






var _class,
    _temp2,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/Component/HoverMenu.js';





var HoverMenu = (_temp2 = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(HoverMenu, _React$Component);

  function HoverMenu() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, HoverMenu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = HoverMenu.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(HoverMenu)).call.apply(_ref, [this].concat(args))), _this), _this.updateHovermenu = function () {
      var value = _this.props.value;

      var menu = _this.menu;
      if (!menu) {
        return;
      }
      if (value.isBlurred || value.isEmpty) {
        menu.removeAttribute('style');
        return;
      }
      setTimeout(function () {
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        var rect = range.getBoundingClientRect();
        menu.style.opacity = 1;
        menu.style.top = rect.top + window.scrollY - menu.offsetHeight + 'px';
        menu.style.left = rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2 + 'px';
      });
    }, _this.renderButton = function (type, Icon) {
      var isActive = _this.hasMark(type);
      var onMouseDown = function onMouseDown(event) {
        return _this.onClickMark(event, type);
      };

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'span',
        { key: type, className: 'button', onMouseDown: onMouseDown, 'data-active': isActive, __source: {
            fileName: _jsxFileName,
            lineNumber: 40
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(Icon, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 41
          }
        })
      );
    }, _this.renderButtons = function () {
      var list = [_this.renderButton('bold', __WEBPACK_IMPORTED_MODULE_7__Icons__["c" /* MdBoldIcon */], __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 49
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 50
            }
          },
          '\u7C97\u4F53'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 51
            }
          },
          '\u2318+B'
        )
      ), true), _this.renderButton('italic', __WEBPACK_IMPORTED_MODULE_7__Icons__["e" /* MdItalicIcon */], __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 55
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 56
            }
          },
          '\u659C\u4F53'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 57
            }
          },
          '\u2318+I'
        )
      ), true), _this.renderButton('strikethrough', __WEBPACK_IMPORTED_MODULE_7__Icons__["g" /* MdStrikethroughIcon */], __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 61
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 62
            }
          },
          '\u4E0B\u5212\u7EBF'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 63
            }
          },
          '\u2318+S'
        )
      ), true), _this.renderButton('underline', __WEBPACK_IMPORTED_MODULE_7__Icons__["h" /* MdUnderlineIcon */], __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 67
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 68
            }
          },
          '\u4E0B\u5212\u7EBF'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 69
            }
          },
          '\u2318+U'
        )
      ), true)];
      return list;
    }, _this.hasMark = function (type) {
      var value = _this.props.value;

      return value.activeMarks.some(function (mark) {
        return mark.type === type;
      });
    }, _this.onClickMark = function (event, type) {
      event.preventDefault();
      var value = _this.props.value;

      var change = value.change().toggleMark(type);
      _this.props.onChange(change);
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(HoverMenu, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.updateHovermenu();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'menu hover-menu', ref: function ref(menu) {
            return _this2.menu = menu;
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 90
          }
        },
        this.renderButtons()
      );
    }
  }]);

  return HoverMenu;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component), _class.propTypes = {
  onChange: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired,
  value: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object.isRequired
}, _temp2);

/***/ }),

/***/ "./src/Component/Icons/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_icons_lib_md_search__ = __webpack_require__("react-icons/lib/md/search");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react_icons_lib_md_search___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react_icons_lib_md_search__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_icons_lib_md_format_bold__ = __webpack_require__("react-icons/lib/md/format-bold");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_icons_lib_md_format_bold___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_icons_lib_md_format_bold__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_icons_lib_md_format_italic__ = __webpack_require__("react-icons/lib/md/format-italic");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_icons_lib_md_format_italic___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_icons_lib_md_format_italic__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_icons_lib_md_format_underlined__ = __webpack_require__("react-icons/lib/md/format-underlined");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_icons_lib_md_format_underlined___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_icons_lib_md_format_underlined__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_icons_lib_md_strikethrough_s__ = __webpack_require__("react-icons/lib/md/strikethrough-s");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_icons_lib_md_strikethrough_s___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react_icons_lib_md_strikethrough_s__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_icons_lib_md_playlist_add_check__ = __webpack_require__("react-icons/lib/md/playlist-add-check");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_icons_lib_md_playlist_add_check___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react_icons_lib_md_playlist_add_check__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_icons_lib_go_list_ordered__ = __webpack_require__("react-icons/lib/go/list-ordered");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_icons_lib_go_list_ordered___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_icons_lib_go_list_ordered__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_icons_lib_go_list_unordered__ = __webpack_require__("react-icons/lib/go/list-unordered");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_icons_lib_go_list_unordered___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react_icons_lib_go_list_unordered__);
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_0_react_icons_lib_md_search___default.a; });
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1_react_icons_lib_md_format_bold___default.a; });
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_2_react_icons_lib_md_format_italic___default.a; });
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "h", function() { return __WEBPACK_IMPORTED_MODULE_3_react_icons_lib_md_format_underlined___default.a; });
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "g", function() { return __WEBPACK_IMPORTED_MODULE_4_react_icons_lib_md_strikethrough_s___default.a; });
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_5_react_icons_lib_md_playlist_add_check___default.a; });
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_6_react_icons_lib_go_list_ordered___default.a; });
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_7_react_icons_lib_go_list_unordered___default.a; });











/***/ }),

/***/ "./src/Component/Image/Image.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Image; });
/* unused harmony export insertImage */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__("babel-runtime/core-js/promise");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__("babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__helpers__ = __webpack_require__("./src/helpers/index.js");








var _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/Component/Image/Image.js';


// import './Image.less';
if (false) {
  require('./Image.less');
}

var Image = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_7_babel_runtime_helpers_inherits___default()(Image, _React$Component);

  function Image() {
    __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_classCallCheck___default()(this, Image);

    return __WEBPACK_IMPORTED_MODULE_6_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Image.__proto__ || __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_object_get_prototype_of___default()(Image)).apply(this, arguments));
  }

  __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_createClass___default()(Image, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          node = _props.node,
          editor = _props.editor;

      var file = node.data.get('file');
      var srcUrl = node.data.get('url');
      if (srcUrl) {
        this.setState({
          url: srcUrl,
          loaded: true
        });
        return;
      }
      __WEBPACK_IMPORTED_MODULE_9__helpers__["a" /* cos */].sliceUploadFile({
        Bucket: 'sparker-1252588471',
        Region: 'ap-guangzhou',
        Key: file.name + Date.now(),
        Body: file
      }, function (err, data) {
        if (!data) {
          return;
        }
        editor.change(function (c) {
          return c.setNodeByKey(node.key, { data: { url: '//' + data.Location, file: null } });
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var node = this.props.node;

      var srcUrl = node.data.get('url');
      return srcUrl ? __WEBPACK_IMPORTED_MODULE_8_react___default.a.createElement('img', { src: srcUrl, alt: 'preview', __source: {
          fileName: _jsxFileName,
          lineNumber: 37
        }
      }) : __WEBPACK_IMPORTED_MODULE_8_react___default.a.createElement(
        'div',
        { className: 'img-loading', __source: {
            fileName: _jsxFileName,
            lineNumber: 37
          }
        },
        '\u56FE\u7247\u4E0A\u4F20\u4E2D...'
      );
    }
  }]);

  return Image;
}(__WEBPACK_IMPORTED_MODULE_8_react___default.a.Component);

var insertImage = function () {
  var _ref = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(transform, file) {
    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
              __WEBPACK_IMPORTED_MODULE_9__helpers__["a" /* cos */].sliceUploadFile({
                Bucket: 'sparker-1252588471',
                Region: 'ap-guangzhou',
                Key: file.name,
                Body: file
              }, function (err, data) {
                if (!data) {
                  return;
                }
                var imageUrl = '//' + data.Location;
                resolve(imageUrl);
              });
            });

          case 2:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function insertImage(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();;

/***/ }),

/***/ "./src/Component/Image/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Image__ = __webpack_require__("./src/Component/Image/Image.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__Image__["a"]; });


/***/ }),

/***/ "./src/Component/Navbar/Navbar.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Navbar; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__SparkComponent__ = __webpack_require__("./src/SparkComponent/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Dialog__ = __webpack_require__("./src/Component/Dialog/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Navbar_less__ = __webpack_require__("./src/Component/Navbar/Navbar.less");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Navbar_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__Navbar_less__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_react_redux__ = __webpack_require__("react-redux");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__redux_saga__ = __webpack_require__("./src/redux/saga.js");






var _dec,
    _class,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/Component/Navbar/Navbar.js';








var Navbar = (_dec = Object(__WEBPACK_IMPORTED_MODULE_9_react_redux__["connect"])(function (state) {
  return state.commonInfo;
}, function (dispatch) {
  return {
    login: function login(username, password) {
      return dispatch(__WEBPACK_IMPORTED_MODULE_10__redux_saga__["a" /* actions */].requestLogin(username, password));
    },
    logout: function logout() {
      return dispatch(__WEBPACK_IMPORTED_MODULE_10__redux_saga__["a" /* actions */].requestLogout());
    },
    regist: function regist(username, password) {
      return dispatch(__WEBPACK_IMPORTED_MODULE_10__redux_saga__["a" /* actions */].requestRegist(username, password));
    },
    checkLogin: function checkLogin() {
      return dispatch(__WEBPACK_IMPORTED_MODULE_10__redux_saga__["a" /* actions */].requestCheckLogin());
    }
  };
}), _dec(_class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Navbar, _React$Component);

  function Navbar() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Navbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Navbar.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Navbar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      lrVisible: true,
      registVisible: false,
      activeTabKey: 'login'
    }, _this.closeLRDialog = function () {
      _this.setState({
        lrVisible: !_this.state.lrVisible
      });
    }, _this.toggleLoginDialog = function () {
      console.log('login dialog');
      _this.setState({
        lrVisible: !_this.state.lrVisible,
        activeTabKey: 'login'
      });
    }, _this.toggleRegistDialog = function () {
      _this.setState({
        lrVisible: !_this.state.lrVisible,
        activeTabKey: 'regist'
      });
    }, _this.changeActiveTabkey = function (activeTabKey) {
      _this.setState({
        activeTabKey: activeTabKey
      });
    }, _this.renderUnloginedNavbar = function () {
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.Fragment,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 63
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'a',
          { href: '#', onClick: _this.toggleLoginDialog, __source: {
              fileName: _jsxFileName,
              lineNumber: 64
            }
          },
          '\u767B\u5F55'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'a',
          { href: '#', onClick: _this.toggleRegistDialog, __source: {
              fileName: _jsxFileName,
              lineNumber: 65
            }
          },
          '\u6CE8\u518C'
        )
      );
    }, _this.renderLoginedNavbar = function () {
      var userInfo = _this.props.userInfo;


      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.Fragment,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 74
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'a',
          { href: '#', onClick: _this.props.logout, __source: {
              fileName: _jsxFileName,
              lineNumber: 75
            }
          },
          '\u767B\u51FA'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'a',
          { href: '#', __source: {
              fileName: _jsxFileName,
              lineNumber: 76
            }
          },
          userInfo.username
        )
      );
    }, _this.handleGoToHome = function () {
      var history = _this.props.history;

      history.push('/');
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Navbar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.checkLogin();
    }
  }, {
    key: 'render',
    value: function render() {
      var _state = this.state,
          lrVisible = _state.lrVisible,
          activeTabKey = _state.activeTabKey;
      var _props = this.props,
          login = _props.login,
          regist = _props.regist,
          isLogin = _props.isLogin,
          isLoading = _props.isLoading,
          isFetching = _props.isFetching;

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 90
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["e" /* Nav */],
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 91
            }
          },
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["e" /* Nav */].title,
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 92
              }
            },
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              'span',
              { onClick: this.handleGoToHome, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 93
                }
              },
              'Sparker\u6587\u6863'
            )
          ),
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["e" /* Nav */].content,
            { className: 'spark-content', __source: {
                fileName: _jsxFileName,
                lineNumber: 95
              }
            },
            isLogin === true ? this.renderLoginedNavbar() : this.renderUnloginedNavbar()
          )
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__Dialog__["a" /* LRDialog */], {
          changeActiveTabkey: this.changeActiveTabkey,
          activeTabKey: activeTabKey,
          visible: !(isFetching || isLogin) && lrVisible,
          onCancel: this.closeLRDialog,
          login: login,
          regist: regist,
          isLoading: isLoading,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 101
          }
        })
      );
    }
  }]);

  return Navbar;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component)) || _class);

/***/ }),

/***/ "./src/Component/Navbar/Navbar.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".spark-nav__title {\n  cursor: pointer;\n}\n\n.spark-nav {\n  height: 50px;\n  box-sizing: border-box;\n}\n\n.spark-content {\n  a {\n    color: black;\n    text-decoration: none;\n    font-size: 12px;\n    &:first-child {\n      margin-right: 15px;\n\n    }\n  }\n}", ""]);

// exports


/***/ }),

/***/ "./src/Component/Navbar/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Navbar__ = __webpack_require__("./src/Component/Navbar/Navbar.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__Navbar__["a"]; });


/***/ }),

/***/ "./src/Component/SparkerEditor/SparkerEditor.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SparkerEditor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__("babel-runtime/helpers/extends");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_slate_react__ = __webpack_require__("slate-react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_slate_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_slate_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__CodeBlock__ = __webpack_require__("./src/Component/CodeBlock/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_slate__ = __webpack_require__("slate");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_slate___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_slate__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_slate_paste_linkify__ = __webpack_require__("slate-paste-linkify");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_slate_paste_linkify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10_slate_paste_linkify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_slate_drop_or_paste_images__ = __webpack_require__("slate-drop-or-paste-images");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_slate_drop_or_paste_images___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_slate_drop_or_paste_images__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_slate_prism__ = __webpack_require__("slate-prism");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_slate_prism___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_slate_prism__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14____ = __webpack_require__("./src/Component/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__utils__ = __webpack_require__("./src/utils/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__featurePlugins__ = __webpack_require__("./src/Component/SparkerEditor/featurePlugins/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__Socket__ = __webpack_require__("./src/Socket/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__Toolbar__ = __webpack_require__("./src/Component/Toolbar.js");







var _class,
    _temp,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/Component/SparkerEditor/SparkerEditor.js';







// import PluginEditCode from 'slate-edit-code'








if (false) {
  require('./markdown.less');
}
// import './markdown.less';


var plugins = [__WEBPACK_IMPORTED_MODULE_12_slate_prism___default()({
  onlyIn: function onlyIn(node) {
    return node.type === 'code';
  },
  getSyntax: function getSyntax(node) {
    return node.data.get('language');
  }
}), Object(__WEBPACK_IMPORTED_MODULE_15__utils__["a" /* BlockHotkey */])({ key: 'o', type: 'order-list' }), Object(__WEBPACK_IMPORTED_MODULE_15__utils__["a" /* BlockHotkey */])({ key: 'u', type: 'unorder-list' }), Object(__WEBPACK_IMPORTED_MODULE_15__utils__["a" /* BlockHotkey */])({ key: 'c', type: 'check-list-item' }), __WEBPACK_IMPORTED_MODULE_16__featurePlugins__["a" /* CheckListPlugins */], Object(__WEBPACK_IMPORTED_MODULE_16__featurePlugins__["b" /* MarkdownPlugins */])(), __WEBPACK_IMPORTED_MODULE_10_slate_paste_linkify___default()({ type: 'link' }), __WEBPACK_IMPORTED_MODULE_11_slate_drop_or_paste_images___default()({
  insertImage: function insertImage(transform, file) {

    return transform.insertBlock({
      type: 'image',
      isVoid: true,
      data: { file: file }
    });
  }
}), Object(__WEBPACK_IMPORTED_MODULE_15__utils__["b" /* MarkHotkey */])({ key: 'b', type: 'bold' }), Object(__WEBPACK_IMPORTED_MODULE_15__utils__["b" /* MarkHotkey */])({ key: 'i', type: 'italic' }), Object(__WEBPACK_IMPORTED_MODULE_15__utils__["b" /* MarkHotkey */])({ key: 's', type: 'strikethrough' }), Object(__WEBPACK_IMPORTED_MODULE_15__utils__["b" /* MarkHotkey */])({ key: 'u', type: 'underline' })];

var initialValue = __WEBPACK_IMPORTED_MODULE_9_slate__["Value"].fromJSON({});

var SparkerEditor = (_temp = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default()(SparkerEditor, _React$Component);

  function SparkerEditor() {
    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default()(this, SparkerEditor);

    var _this = __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default()(this, (SparkerEditor.__proto__ || __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of___default()(SparkerEditor)).call(this));

    _this.state = {
      value: initialValue
    };

    _this.initSocketEvent = function () {
      var match = _this.props.match;

      _this.socket = Object(__WEBPACK_IMPORTED_MODULE_17__Socket__["a" /* socketInit */])();
      _this.socket.emit('initSocket', {
        docId: match.params.docId
      });
      _this.socket.on('updateFromOthers', function (data) {
        _this.operationQuequ = _this.operationQuequ.concat(data.ops);
      });
      _this.socket.on('init', function (data) {
        _this.setState({
          value: __WEBPACK_IMPORTED_MODULE_9_slate__["Value"].fromJSON(data.value)
        });
      });
    };

    _this.clearQueue = function () {
      if (_this.operationQuequ.length) {
        _this.applyOperations(_this.operationQuequ);
        _this.operationQuequ = [];
      }
    };

    _this.onChange = function (change) {
      var needEmit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var match = _this.props.match;
      var value = change.value;

      var ops = change.operations.filter(function (o) {
        return o.type !== 'set_selection' && o.type !== 'set_value';
      }).toJS();
      if (ops.length && needEmit) {
        _this.socket.emit('update', {
          ops: ops,
          docId: match.params.docId
        });
      }
      _this.setState({ value: value });
    };

    _this.applyOperations = function (operations) {
      var value = _this.state.value;

      var change = value.change().applyOperations(operations);
      _this.setState({
        value: change.value
      });
    };

    _this.renderNode = function (props) {
      var attributes = props.attributes,
          children = props.children,
          node = props.node;

      switch (node.type) {
        case 'image':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_14____["c" /* Image */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 144
            }
          }));
        case 'link':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'a',
            { href: node.data.get('href'), target: '_blank', __source: {
                fileName: _jsxFileName,
                lineNumber: 145
              }
            },
            props.children
          );
        case 'block-quote':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'blockquote',
            __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, attributes, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 146
              }
            }),
            children
          );
        case 'bulleted-list':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'ul',
            __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, attributes, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 147
              }
            }),
            children
          );
        case 'numbered-list':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'ol',
            __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, attributes, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 148
              }
            }),
            children
          );
        case 'heading-one':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'h1',
            __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, attributes, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 149
              }
            }),
            children
          );
        case 'heading-two':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'h2',
            __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, attributes, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 150
              }
            }),
            children
          );
        case 'heading-three':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'h3',
            __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, attributes, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 151
              }
            }),
            children
          );
        case 'heading-four':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'h4',
            __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, attributes, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 152
              }
            }),
            children
          );
        case 'heading-five':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'h5',
            __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, attributes, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 153
              }
            }),
            children
          );
        case 'unorder-list':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'li',
            __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, attributes, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 154
              }
            }),
            children
          );
        case 'order-list':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'li',
            __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, attributes, {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 155
              }
            }),
            children
          );
        case 'code':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__CodeBlock__["a" /* CodeBlock */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 156
            }
          }));
        case 'code_line':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__CodeBlock__["b" /* CodeBlockLine */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 157
            }
          }));
        case 'check-list-item':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_14____["a" /* CheckListItem */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, props, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 158
            }
          }));
        default:
          return;
      }
    };

    _this.renderMark = function (props) {
      var children = props.children,
          mark = props.mark;

      switch (mark.type) {
        // case 'code': return <code>{props.children}</code>;       
        case 'bold':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'strong',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 167
              }
            },
            props.children
          );
        case 'italic':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'em',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 168
              }
            },
            props.children
          );
        case 'strikethrough':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'del',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 169
              }
            },
            props.children
          );
        case 'underline':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'u',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 170
              }
            },
            props.children
          );
        case 'highlight':
          return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
            'span',
            { className: 'highlight', __source: {
                fileName: _jsxFileName,
                lineNumber: 171
              }
            },
            children
          );
        default:
          return;
      }
    };

    _this.operationQuequ = [];
    return _this;
  }

  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default()(SparkerEditor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      setInterval(this.clearQueue, 200);
      this.initSocketEvent();
    }
  }, {
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
        'div',
        { className: 'editor', __source: {
            fileName: _jsxFileName,
            lineNumber: 123
          }
        },
        __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_18__Toolbar__["a" /* Toolbar */], { onChange: this.onChange, value: this.state.value, __source: {
            fileName: _jsxFileName,
            lineNumber: 124
          }
        }),
        __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_14____["b" /* HoverMenu */], { onChange: this.onChange, value: this.state.value, __source: {
            fileName: _jsxFileName,
            lineNumber: 125
          }
        }),
        __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(
          'div',
          { className: 'editor-container', __source: {
              fileName: _jsxFileName,
              lineNumber: 126
            }
          },
          __WEBPACK_IMPORTED_MODULE_13_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6_slate_react__["Editor"], {
            className: 'markdown-body',
            value: this.state.value,
            onChange: this.onChange,
            plugins: plugins,
            renderNode: this.renderNode,
            renderMark: this.renderMark,
            decorateNode: this.decorateNode,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 127
            }
          })
        )
      );
    }
  }]);

  return SparkerEditor;
}(__WEBPACK_IMPORTED_MODULE_13_react___default.a.Component), _class.propTypes = {
  match: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.object.isRequired
}, _temp);




/***/ }),

/***/ "./src/Component/SparkerEditor/featurePlugins/checklist.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CheckListPlugins; });
var CheckListPlugins = {
  onKeyDown: function onKeyDown(event, change) {
    switch (event.key) {
      case 'Backspace':
        return onBackspace(event, change);
      case 'Enter':
        return onEnter(event, change);
      case 'y':
        return onCheckList(event, change);
      default:
        return;
    }
  }
};

function onEnter(event, change) {
  var value = change.value;


  if (value.startBlock.type === 'check-list-item') {
    if (event.shiftKey || value.startBlock.isEmpty) {
      change.setBlock('paragraph');
    } else {
      change.splitBlock().setBlock({ data: { checked: false } });
    }
    return true;
  }
}

function onBackspace(event, change) {
  var value = change.value;


  if (value.isCollapsed && value.startBlock.type === 'check-list-item' && value.selection.startOffset === 0) {
    change.setBlock('paragraph');
    return true;
  }
}

function onCheckList(event, change) {
  var value = change.value;


  if (event.shiftKey && event.metaKey && event.key === 'y') {
    if (value.startBlock.type === 'check-list-item') {
      change.setBlock('paragraph');
      return true;
    } else {
      change.setBlock('check-list-item');
    }
  }
}

/***/ }),

/***/ "./src/Component/SparkerEditor/featurePlugins/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__checklist__ = __webpack_require__("./src/Component/SparkerEditor/featurePlugins/checklist.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__checklist__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__markdown__ = __webpack_require__("./src/Component/SparkerEditor/featurePlugins/markdown.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__markdown__["a"]; });



/***/ }),

/***/ "./src/Component/SparkerEditor/featurePlugins/markdown.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = MarkdownPlugins;
function MarkdownPlugins(options) {
  return {
    onKeyDown: function onKeyDown(event, change) {
      switch (event.key) {
        case 'Tab':
          return onTab(event, change);
        case ' ':
          return onSpace(event, change);
        case 'Backspace':
          return onBackspace(event, change);
        case 'Enter':
          return onEnter(event, change);
        case '*':
          return handleBold(event, change);
        default:
          return;
      }
    }
  };
}

function handleBold(event, change) {
  var value = change.value;

  if (value.isExpanded) return;
  var startBlock = value.startBlock,
      startOffset = value.startOffset;

  var chars = startBlock.text;
  if (isToggleMark('*', chars, startOffset)) {
    var _findDeleteRangeAndTa = findDeleteRangeAndTargetChars(change, chars, startOffset),
        deleteRange = _findDeleteRangeAndTa.deleteRange,
        boldChars = _findDeleteRangeAndTa.boldChars;

    event.preventDefault();
    change.deleteForward(deleteRange).insertText(boldChars).extend(-boldChars.length).addMark('bold').collapseToEnd();
  }
  return true;
}

function isToggleMark(markChar, chars, offset) {
  if (chars[offset] === markChar || chars[offset - 1] === markChar) {
    if (chars.match(/\*\*/gi) && chars.match(/\*\*/gi).length >= 1 && chars.match(/\*/gi).length >= 3) {
      return true;
    }
  }
}
function findDeleteRangeAndTargetChars(change, chars, startOffset) {
  var firstIndex = chars.indexOf('**');
  var boldChars = void 0,
      deleteRange = void 0;
  // 若是在后面插入**
  if (startOffset > firstIndex + 1) {
    change.move(-startOffset).move(firstIndex);
    // 当插入位置为前面
    if (chars[startOffset] === '*') {
      deleteRange = startOffset - firstIndex + 1;
      boldChars = chars.slice(firstIndex + 2, startOffset);
    } else {
      // 当插入位置是在后面
      deleteRange = startOffset - firstIndex;
      boldChars = chars.slice(firstIndex + 2, startOffset - 1);
    }
  } else {
    // 在后面插入**
    if (chars[startOffset] === '*') {
      deleteRange = firstIndex - startOffset + 2;
      boldChars = chars.slice(startOffset + 1, firstIndex);
    } else {
      deleteRange = firstIndex - startOffset + 3;
      change.move(-1);
      boldChars = chars.slice(startOffset, firstIndex);
    }
  }
  return {
    boldChars: boldChars,
    deleteRange: deleteRange
  };
}

// 输入tab,换成两个空格
function onTab(event, change) {
  var value = change.value;

  if (value.isExpanded) return;

  event.preventDefault();
  change.delete();
  change.insertText('  ');
  return true;
}

function onSpace(event, change) {
  var value = change.value;

  if (value.isExpanded) return;
  var startBlock = value.startBlock,
      startOffset = value.startOffset;

  var chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '');
  var type = getType(chars);

  if (!type) return;
  if (type === 'unorder-list' && startBlock.type === 'unorder-list') return;
  if (type === 'order-list' && startBlock.type === 'order-list') return;
  event.preventDefault();

  change.setBlock(type);

  if (type === 'unorder-list') {
    change.wrapBlock('bulleted-list');
  } else if (type === 'order-list') {
    change.wrapBlock('numbered-list');
  }

  change.extendToStartOf(startBlock).delete();
  return true;
}

function onBackspace(event, change) {
  var value = change.value;

  if (value.isExpanded) return;
  if (value.startOffset !== 0) return;

  var startBlock = value.startBlock;

  if (startBlock.type === 'paragraph') return;

  event.preventDefault();
  change.setBlock('paragraph');

  if (startBlock.type === 'unorder-list') {
    change.unwrapBlock('bulleted-list');
  } else if (startBlock.type === 'order-list') {
    change.unwrapBlock('numbered-list');
  }

  return true;
}

function onEnter(event, change) {
  var value = change.value;

  if (value.isExpanded) return;

  var startBlock = value.startBlock,
      startOffset = value.startOffset,
      endOffset = value.endOffset;

  if (startOffset === 0 && startBlock.text.length === 0) return onBackspace(event, change);
  if (startBlock.type === 'code' && !event.shiftKey) {
    change.delete();
    change.insertText('\n');
    return true;
  }
  if (endOffset !== startBlock.text.length) return;

  if (startBlock.type !== 'heading-one' && startBlock.type !== 'heading-two' && startBlock.type !== 'heading-three' && startBlock.type !== 'heading-four' && startBlock.type !== 'heading-five' && startBlock.type !== 'heading-six' && startBlock.type !== 'block-quote' && startBlock.type !== 'code') {
    return;
  }

  event.preventDefault();
  change.splitBlock().setBlock('paragraph');
  return true;
}

function getType(type) {
  if (/^\d+.$/gi.test(type)) {
    return 'order-list';
  }
  switch (type) {
    case '#':
      return 'heading-one';
    case '##':
      return 'heading-two';
    case '###':
      return 'heading-three';
    case '####':
      return 'heading-four';
    case '#####':
      return 'heading-five';
    case '```':
      return 'code';
    case '*':
    case '-':
    case '+':
      return 'unorder-list';
    case '>':
      return 'block-quote';
    default:
      return null;
  }
}

/***/ }),

/***/ "./src/Component/SparkerEditor/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SparkerEditor__ = __webpack_require__("./src/Component/SparkerEditor/SparkerEditor.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__SparkerEditor__["a"]; });


/***/ }),

/***/ "./src/Component/Toolbar.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Toolbar; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Icons__ = __webpack_require__("./src/Component/Icons/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__SparkComponent__ = __webpack_require__("./src/SparkComponent/index.js");






var _class,
    _temp2,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/Component/Toolbar.js';






var Toolbar = (_temp2 = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Toolbar, _React$Component);

  function Toolbar() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Toolbar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Toolbar.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Toolbar)).call.apply(_ref, [this].concat(args))), _this), _this.onInputChange = function (event) {
      var value = _this.props.value;

      var string = event.target.value;
      var texts = value.document.getTexts();
      var decorations = [];

      texts.forEach(function (node) {
        var key = node.key,
            text = node.text;

        var parts = text.split(string);
        var offset = 0;

        parts.forEach(function (part, i) {
          if (i !== 0) {
            decorations.push({
              anchorKey: key,
              anchorOffset: offset - string.length,
              focusKey: key,
              focusOffset: offset,
              marks: [{ type: 'highlight' }]
            });
          }

          offset = offset + part.length + string.length;
        });
      });

      var change = value.change().setOperationFlag('save', false).setValue({ decorations: decorations }).setOperationFlag('save', true);
      _this.props.onChange(change, false);
    }, _this.renderButton = function (type, Icon, tooltip, isMark) {
      var isActive = _this.hasMark(type) || _this.hasBlock(type);
      var onMouseDown = function onMouseDown(event) {
        if (isMark) {
          _this.onClickMark(event, type);
        } else {
          _this.onClickBlock(event, type);
        }
      };

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_8__SparkComponent__["h" /* ToolTip */],
        {
          key: type,
          content: tooltip,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 57
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'span',
          { key: type, className: 'button', onMouseDown: onMouseDown, 'data-active': isActive, __source: {
              fileName: _jsxFileName,
              lineNumber: 61
            }
          },
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(Icon, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 62
            }
          })
        )
      );
    }, _this.renderButtons = function () {
      var isMac = false;
      if (true) {
        isMac = false;
      } else {
        isMac = navigator.userAgent.match('Mac') ? true : false;
      }
      var key = isMac ? '⌘' : 'ctrl';

      var list = [_this.renderButton('bold', __WEBPACK_IMPORTED_MODULE_7__Icons__["c" /* MdBoldIcon */], __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 79
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 80
            }
          },
          '\u7C97\u4F53'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 81
            }
          },
          key,
          '+B'
        )
      ), true), _this.renderButton('italic', __WEBPACK_IMPORTED_MODULE_7__Icons__["e" /* MdItalicIcon */], __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 85
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 86
            }
          },
          '\u659C\u4F53'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 87
            }
          },
          key,
          '+I'
        )
      ), true), _this.renderButton('strikethrough', __WEBPACK_IMPORTED_MODULE_7__Icons__["g" /* MdStrikethroughIcon */], __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 91
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 92
            }
          },
          '\u4E0B\u5212\u7EBF'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 93
            }
          },
          key,
          '+S'
        )
      ), true), _this.renderButton('underline', __WEBPACK_IMPORTED_MODULE_7__Icons__["h" /* MdUnderlineIcon */], __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 97
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 98
            }
          },
          '\u4E0B\u5212\u7EBF'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 99
            }
          },
          key,
          '+U'
        )
      ), true), _this.renderButton('order-list', __WEBPACK_IMPORTED_MODULE_7__Icons__["a" /* GoListOrderIcon */], __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 103
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 104
            }
          },
          '\u6709\u5E8F\u5217\u8868'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 105
            }
          },
          key,
          '+Shift+O'
        )
      )), _this.renderButton('unorder-list', __WEBPACK_IMPORTED_MODULE_7__Icons__["b" /* GoListUnorderIcon */], __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 109
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 110
            }
          },
          '\u65E0\u5E8F\u5217\u8868'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 111
            }
          },
          key,
          '+Shift+U'
        )
      )), _this.renderButton('check-list-item', __WEBPACK_IMPORTED_MODULE_7__Icons__["d" /* MdCheckBoxIcon */], __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 115
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 116
            }
          },
          '\u4EFB\u52A1\u5217\u8868'
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 117
            }
          },
          key,
          '+Shift+C'
        )
      ))];
      return list;
    }, _this.hasBlock = function (type) {
      var value = _this.props.value;

      return value.blocks.some(function (block) {
        return block.type === type;
      });
    }, _this.hasMark = function (type) {
      var value = _this.props.value;

      return value.activeMarks.some(function (mark) {
        return mark.type === type;
      });
    }, _this.onClickMark = function (event, type) {
      event.preventDefault();
      var value = _this.props.value;

      var selection = value.selection;
      var startKey = selection.startKey,
          endKey = selection.endKey,
          startOffset = selection.startOffset,
          endOffset = selection.endOffset;

      var change = void 0;
      if (startKey === endKey && startOffset === endOffset) {
        change = value.change().select({
          anchorKey: value.startBlock.getFirstText().key,
          anchorOffset: 0,
          focusKey: value.startBlock.getFirstText().key,
          focusOffset: value.startBlock.text.length
        }).toggleMark(type).deselect().select(selection);
      } else {
        change = value.change().toggleMark(type);
      }
      _this.props.onChange(change);
    }, _this.onClickBlock = function (event, type) {
      event.preventDefault();
      var value = _this.props.value;

      var parentType = value.document.getParent(value.startBlock.key) && value.document.getParent(value.startBlock.key).type;
      var change = void 0;
      if (value.startBlock.type === type) {
        change = value.change().setBlock('paragrahp');
      } else if (type === 'order-list') {
        // 该元素不在有序列表里        
        if (!parentType || parentType !== 'numbered-list') {
          change = value.change().wrapBlock('numbered-list').setBlock(type);
        } else {
          change = value.change().setBlock(type);
        }
      } else if (type === 'unorder-list') {
        // 该元素不在无序列表里
        if (!parentType || parentType !== 'bulleted-list') {
          change = value.change().wrapBlock('bulleted-list').setBlock(type);
        } else {
          change = value.change().setBlock(type);
        }
      } else if (type === 'check-list-item') {
        change = value.change().setBlock(type);
      }
      _this.props.onChange(change);
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Toolbar, [{
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'menu toolbar-menu', __source: {
            fileName: _jsxFileName,
            lineNumber: 182
          }
        },
        this.renderButtons(),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          { className: 'search', __source: {
              fileName: _jsxFileName,
              lineNumber: 184
            }
          },
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__Icons__["f" /* MdSearchIcon */], { className: 'search-icon', __source: {
              fileName: _jsxFileName,
              lineNumber: 185
            }
          }),
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('input', {
            className: 'search-box',
            type: 'search',
            placeholder: 'Search the text...',
            onChange: this.onInputChange,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 186
            }
          })
        )
      );
    }
  }]);

  return Toolbar;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component), _class.propTypes = {
  onChange: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired
}, _temp2);

/***/ }),

/***/ "./src/Component/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Navbar__ = __webpack_require__("./src/Component/Navbar/index.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_0__Navbar__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CheckListItem__ = __webpack_require__("./src/Component/CheckListItem.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_1__CheckListItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HoverMenu__ = __webpack_require__("./src/Component/HoverMenu.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_2__HoverMenu__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Image_index__ = __webpack_require__("./src/Component/Image/index.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_3__Image_index__["a"]; });





/***/ }),

/***/ "./src/Socket/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return socketInit; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io_client__ = __webpack_require__("socket.io-client");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_socket_io_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_socket_io_client__);


var sockerServer =  true ? 'localhost:3000' : '';

var socketInit = function socketInit() {
  return __WEBPACK_IMPORTED_MODULE_0_socket_io_client___default()(sockerServer);
};



/***/ }),

/***/ "./src/SparkComponent/Button/Button.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Button; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);






var _class,
    _temp,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/SparkComponent/Button/Button.js';



if (false) {
  require('./Button.less');
  // import './Button.less';
}

var Button = (_temp = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Button, _React$Component);

  function Button() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Button);

    return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Button.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Button)).apply(this, arguments));
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Button, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          type = _props.type,
          onClick = _props.onClick;


      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'button',
        { className: 'spark-button', type: type, onClick: onClick, __source: {
            fileName: _jsxFileName,
            lineNumber: 20
          }
        },
        children
      );
    }
  }]);

  return Button;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component), _class.propTypes = {
  type: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  onClick: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func
}, _temp);

/***/ }),

/***/ "./src/SparkComponent/Button/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Button__ = __webpack_require__("./src/SparkComponent/Button/Button.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__Button__["a"]; });


/***/ }),

/***/ "./src/SparkComponent/CheckBox/CheckBox.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CheckBox; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__("babel-runtime/helpers/extends");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_prop_types__);







var _class,
    _temp,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/SparkComponent/CheckBox/CheckBox.js';



// import './checkBox.less';
if (false) {
  require('./checkBox.less');
}

var CheckBox = (_temp = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default()(CheckBox, _React$Component);

  function CheckBox() {
    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default()(this, CheckBox);

    return __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default()(this, (CheckBox.__proto__ || __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of___default()(CheckBox)).apply(this, arguments));
  }

  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default()(CheckBox, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          className = _props.className,
          attributes = _props.attributes,
          checked = _props.checked,
          onChange = _props.onChange,
          children = _props.children;


      return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
        'div',
        __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({
          className: 'spark-checkbox-wrapper ' + (className ? className : '') + ' ' + (checked ? 'checked' : '')
        }, attributes, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 21
          }
        }),
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
          'span',
          { className: 'spark-checkbox', __source: {
              fileName: _jsxFileName,
              lineNumber: 25
            }
          },
          __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement('input', {
            className: 'checkbox',
            type: 'checkbox',
            checked: checked,
            onChange: onChange,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 26
            }
          }),
          __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
            'span',
            { className: 'spark-checkbox-inner', __source: {
                fileName: _jsxFileName,
                lineNumber: 32
              }
            },
            checked && __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement('i', { className: 'fa fa-check', 'aria-hidden': 'true', __source: {
                fileName: _jsxFileName,
                lineNumber: 33
              }
            })
          )
        ),
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
          'span',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 36
            }
          },
          children
        )
      );
    }
  }]);

  return CheckBox;
}(__WEBPACK_IMPORTED_MODULE_6_react___default.a.Component), _class.propTypes = {
  className: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.string,
  attributes: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.any,
  checked: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.bool,
  onChange: __WEBPACK_IMPORTED_MODULE_7_prop_types___default.a.func
}, _temp);

/***/ }),

/***/ "./src/SparkComponent/CheckBox/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CheckBox__ = __webpack_require__("./src/SparkComponent/CheckBox/CheckBox.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__CheckBox__["a"]; });


/***/ }),

/***/ "./src/SparkComponent/Dialog/Dialog.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Dialog; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);






var _class,
    _temp2,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/SparkComponent/Dialog/Dialog.js';



// import './dialog.less';
if (false) {
  require('./dialog.less');
}

var Dialog = (_temp2 = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Dialog, _React$Component);

  function Dialog() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Dialog);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Dialog.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Dialog)).call.apply(_ref, [this].concat(args))), _this), _this.renderHeader = function () {
      var _this$props = _this.props,
          title = _this$props.title,
          onCancel = _this$props.onCancel;

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'spark-dialog-header', __source: {
            fileName: _jsxFileName,
            lineNumber: 47
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'span',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 48
            }
          },
          title
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('i', { className: 'spark-icon-close', onClick: onCancel, __source: {
            fileName: _jsxFileName,
            lineNumber: 49
          }
        })
      );
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  // componentDidMount() {
  //   document.addEventListener('click', e => {
  //     this.mousePosition = {
  //       x: e.pageX,
  //       y: e.pageY,
  //       rect: e.target.getBoundingClientRect(),
  //     };
  //   });
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   const { visible } = this.props;
  //   if (visible) {
  //     if (!prevProps.visible) {
  //       setTimeout(() => {
  //         const { x, y, rect } = this.mousePosition;
  //         const dialopRect = this.dialogContent.getBoundingClientRect();
  //         this.dialogContent.style.left = `${x - rect.width - dialopRect.width / 2}px`;
  //         this.dialogContent.style.top = `${y - rect.height - dialopRect.height / 2}px`;
  //         this.dialogContent.classList.add('visible');
  //       }, 100);       
  //     }
  //   } else {
  //     this.dialogContent.classList.remove('visible');
  //   }
  // }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Dialog, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          visible = _props.visible,
          title = _props.title,
          onCancel = _props.onCancel,
          className = _props.className;


      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'spark-dialog ' + className, __source: {
            fileName: _jsxFileName,
            lineNumber: 58
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('div', { className: 'spark-dialog-wrapper', onClick: onCancel, style: { display: visible ? 'block' : 'none' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 59
          }
        }),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            className: 'spark-dialog-content',
            style: { display: visible ? 'block' : 'none' },
            ref: function ref(dialogContent) {
              return _this2.dialogContent = dialogContent;
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 60
            }
          },
          title && this.renderHeader(),
          this.props.children
        )
      );
    }
  }]);

  return Dialog;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component), _class.propTypes = {
  visible: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool.isRequired,
  title: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  onCancel: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired,
  className: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string }, _temp2);

Dialog.Header = function (props) {
  return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
    'div',
    { className: 'spark-dialog-header', __source: {
        fileName: _jsxFileName,
        lineNumber: 74
      }
    },
    props.children
  );
};

Dialog.Body = function (props) {
  return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
    'div',
    { className: 'spark-dialog-body', __source: {
        fileName: _jsxFileName,
        lineNumber: 80
      }
    },
    props.children
  );
};

Dialog.Footer = function (props) {
  return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
    'div',
    { className: 'spark-dialog-footer', __source: {
        fileName: _jsxFileName,
        lineNumber: 86
      }
    },
    props.children
  );
};

/***/ }),

/***/ "./src/SparkComponent/Dialog/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Dialog__ = __webpack_require__("./src/SparkComponent/Dialog/Dialog.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__Dialog__["a"]; });


/***/ }),

/***/ "./src/SparkComponent/Input/Input.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Input; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);






var _class,
    _temp,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/SparkComponent/Input/Input.js';



// import './Input.less';

if (false) {
  require('./Input.less');
}

var Input = (_temp = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Input, _React$Component);

  function Input() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Input);

    return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Input.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Input)).apply(this, arguments));
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Input, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          placeholder = _props.placeholder,
          disabled = _props.disabled,
          onChange = _props.onChange,
          type = _props.type;


      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('input', {
        className: 'spark-input',
        placeholder: placeholder,
        disabled: disabled,
        onChange: onChange,
        type: type,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 24
        }
      });
    }
  }]);

  return Input;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component), _class.propTypes = {
  placeholder: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string.isRequired,
  disabled: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.bool,
  defaultValue: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  type: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  onChange: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func,
  onPressEnter: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func
}, _temp);

/***/ }),

/***/ "./src/SparkComponent/Input/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Input__ = __webpack_require__("./src/SparkComponent/Input/Input.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__Input__["a"]; });


/***/ }),

/***/ "./src/SparkComponent/Loading/Loading.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Loading; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);





var _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/SparkComponent/Loading/Loading.js';
// import './Loading.less';

if (false) {
  require('./Loading.less');
}

var Loading = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Loading, _React$Component);

  function Loading() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Loading);

    return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Loading.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Loading)).apply(this, arguments));
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Loading, [{
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 10
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          { className: 'spark-loading', __source: {
              fileName: _jsxFileName,
              lineNumber: 11
            }
          },
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('span', {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 12
            }
          }),
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('span', {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 13
            }
          }),
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('span', {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 14
            }
          }),
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('span', {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 15
            }
          }),
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('span', {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 16
            }
          })
        )
      );
    }
  }]);

  return Loading;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

/***/ }),

/***/ "./src/SparkComponent/Loading/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SparkLoading; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Loading__ = __webpack_require__("./src/SparkComponent/Loading/Loading.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom__ = __webpack_require__("react-dom");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_dom__);
var _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/SparkComponent/Loading/index.js';




var body = {};
var el = null;

if (false) {
  body = document.body;
}

var SparkLoading = {
  show: function show() {
    if (!el) {
      el = document.createElement('div');
      __WEBPACK_IMPORTED_MODULE_2_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_0__Loading__["a" /* Loading */], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 18
        }
      }), el);
      body.appendChild(el);
    }
    el.style.display = 'block';
  },
  hide: function hide() {
    if (el) {
      el.style.display = 'none';
    }
  }
};

/***/ }),

/***/ "./src/SparkComponent/Message/Message.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Message; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Notify__ = __webpack_require__("./src/SparkComponent/Message/Notify.js");





var _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/SparkComponent/Message/Message.js';

// import './Message.less';

if (false) {
  require('./Message.less');
}

var seed = 0;

function genUid() {
  return 'msgID-' + +new Date() + '-' + seed++;
}

var Message = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Message, _React$Component);

  function Message() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Message);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Message.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Message)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      messages: []
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Message, [{
    key: 'add',
    value: function add(message) {
      var messages = this.state.messages;

      var newMessage = message;
      newMessage.mid = genUid();
      this.state.messages = messages.concat(newMessage);
      this.setState({
        messages: messages.concat(newMessage)
      });
    }
  }, {
    key: 'remove',
    value: function remove(mid) {
      var messages = this.state.messages;

      var newMessages = messages.filter(function (item) {
        return item.mid !== mid;
      });
      this.setState({
        messages: newMessages
      });
    }
  }, {
    key: 'renderMessages',
    value: function renderMessages() {
      var _this2 = this;

      var messageNodes = this.state.messages.map(function (message) {
        var onClose = function onClose() {
          _this2.remove(message.mid);
          message.onClose && message.onClose();
        };
        return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_6__Notify__["a" /* Notify */], {
          key: message.mid,
          onClose: onClose,
          content: message.content,
          duration: message.duration || 3,
          type: message.type,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 45
          }
        });
      });
      return messageNodes;
    }
  }, {
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'spark-message', __source: {
            fileName: _jsxFileName,
            lineNumber: 59
          }
        },
        this.renderMessages()
      );
    }
  }]);

  return Message;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

/***/ }),

/***/ "./src/SparkComponent/Message/Notify.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Notify; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);






var _class,
    _temp2,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/SparkComponent/Message/Notify.js';




var Notify = (_temp2 = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Notify, _React$Component);

  function Notify() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Notify);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = Notify.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Notify)).call.apply(_ref, [this].concat(args))), _this), _this.handleClose = function () {
      clearTimeout(_this.tid);
      _this.props.onClose();
    }, _this.handleMouseEnter = function () {
      clearTimeout(_this.tid);
    }, _this.handleMouseLeave = function () {
      var _this$props = _this.props,
          duration = _this$props.duration,
          onClose = _this$props.onClose;

      _this.tid = setTimeout(function () {
        onClose();
      }, duration * 1000);
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Notify, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          duration = _props.duration,
          onClose = _props.onClose;

      this.tid = setTimeout(function () {
        onClose();
      }, duration * 1000);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          content = _props2.content,
          type = _props2.type;


      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          className: 'spark-message-notify',
          __source: {
            fileName: _jsxFileName,
            lineNumber: 41
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            className: 'spark-message-notify-content',
            onMouseEnter: this.handleMouseEnter,
            onMouseLeave: this.handleMouseLeave,
            __source: {
              fileName: _jsxFileName,
              lineNumber: 44
            }
          },
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('i', { type: type, __source: {
              fileName: _jsxFileName,
              lineNumber: 49
            }
          }),
          content
        )
      );
    }
  }]);

  return Notify;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component), _class.propTypes = {
  duration: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.number,
  onClose: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func.isRequired,
  type: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string.isRequired,
  content: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.any.isRequired
}, _temp2);

/***/ }),

/***/ "./src/SparkComponent/Message/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return message; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Message__ = __webpack_require__("./src/SparkComponent/Message/Message.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__("react-dom");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
var _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/SparkComponent/Message/index.js';




var MessageManager = {
  messageInstance: null,
  container: null,
  getInstance: function getInstance() {
    if (!this.messageInstance) {
      this.container = document.createElement('div');
      document.body.appendChild(this.container);
      this.messageInstance = __WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.render(__WEBPACK_IMPORTED_MODULE_2_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_0__Message__["a" /* Message */], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 12
        }
      }), this.container);
    }
    return this.messageInstance;
  },
  show: function show(type, content, duration, onClose) {
    if (!duration) {
      duration = 3;
    } else if (typeof duration === 'function') {
      onClose = duration;
      duration = 3;
    }
    var messageInstance = this.getInstance();
    messageInstance.add({
      type: type,
      content: content,
      duration: duration,
      onClose: onClose
    });
  },
  destroy: function destroy() {
    __WEBPACK_IMPORTED_MODULE_1_react_dom___default.a.unmountComponentAtNode(this.container);
    document.body.removeChild(this.container);
  }
};

var message = {
  info: function info(content, duration, onClose) {
    MessageManager.show('info', content, duration, onClose);
  },
  warning: function warning(content, duration, onClose) {
    MessageManager.show('warning', content, duration, onClose);
  },
  error: function error(content, duration, onClose) {
    MessageManager.show('error', content, duration, onClose);
  },
  success: function success(content, duration, onClose) {
    MessageManager.show('success', content, duration, onClose);
  }
};

/***/ }),

/***/ "./src/SparkComponent/Nav/Nav.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Nav; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);





var _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/SparkComponent/Nav/Nav.js';

// import './Nav.less';
if (false) {
  require('./Nav.less');
}

var Nav = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Nav, _React$Component);

  function Nav() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Nav);

    return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Nav.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Nav)).apply(this, arguments));
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Nav, [{
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'spark-nav', __source: {
            fileName: _jsxFileName,
            lineNumber: 11
          }
        },
        this.props.children
      );
    }
  }]);

  return Nav;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

Nav.title = function (props) {
  return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
    'div',
    { className: 'spark-nav__title', __source: {
        fileName: _jsxFileName,
        lineNumber: 19
      }
    },
    props.children
  );
};

Nav.content = function (props) {
  return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
    'div',
    { className: 'spark-nav__content ' + props.className, __source: {
        fileName: _jsxFileName,
        lineNumber: 25
      }
    },
    props.children
  );
};

/***/ }),

/***/ "./src/SparkComponent/Nav/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Nav__ = __webpack_require__("./src/SparkComponent/Nav/Nav.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__Nav__["a"]; });


/***/ }),

/***/ "./src/SparkComponent/Tabs/TabPane.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabPane; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);





var _jsxFileName = "/Users/chenjigeng/Project/web/tttt/src/SparkComponent/Tabs/TabPane.js";


var TabPane = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(TabPane, _React$Component);

  function TabPane() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, TabPane);

    return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (TabPane.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(TabPane)).apply(this, arguments));
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(TabPane, [{
    key: "render",
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        "div",
        { className: "spark-tabpane", __source: {
            fileName: _jsxFileName,
            lineNumber: 7
          }
        },
        this.props.children
      );
    }
  }]);

  return TabPane;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

/***/ }),

/***/ "./src/SparkComponent/Tabs/Tabs.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Tabs; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__TabPane__ = __webpack_require__("./src/SparkComponent/Tabs/TabPane.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Tabs_less__ = __webpack_require__("./src/SparkComponent/Tabs/Tabs.less");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Tabs_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__Tabs_less__);






var _class,
    _temp,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/SparkComponent/Tabs/Tabs.js';



// import ReactDom from 'react-dom';


// if (process.env.BUILD_TARGET !== 'server') {
//   require('./Tabs.less');
// }

var Tabs = (_temp = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Tabs, _React$Component);

  function Tabs(props) {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Tabs);

    var _this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Tabs.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Tabs)).call(this, props));

    _this.state = {
      activeKey: ''
    };

    _this.updateInkStyle = function () {
      var activeKey = _this.state.activeKey;


      var inkWidth = void 0,
          inkOffset = void 0;
      var activeTab = _this.tabChildren[activeKey];
      inkWidth = activeTab.clientWidth;
      inkOffset = activeTab.offsetLeft;
      _this.inkBar.style.width = inkWidth + 'px';
      _this.inkBar.style.transform = 'translate3d(' + inkOffset + 'px, 0px, 0px)';
    };

    _this.updateContentStyle = function () {
      var activeKey = _this.state.activeKey;
      var children = _this.props.children;

      var activeIndex = void 0;
      children.map(function (child, index) {
        if (child.key === activeKey) {
          activeIndex = index;
        }
        return null;
      });
      for (var i = 0; i < _this.tabsContent.children.length; i++) {
        _this.tabsContent.children[i].style.opacity = '0';
      }
      _this.tabsContent.style.marginLeft = '-' + activeIndex * 100 + '%';
      var activeContent = _this.tabsContent.children[activeIndex];
      activeContent.style.opacity = '1';
    };

    _this.handleClickTabBar = function (activeKey) {
      var onChange = _this.props.onChange;


      onChange && onChange(activeKey);
      _this.setState({
        activeKey: activeKey
      });
    };

    _this.renderTabBar = function () {
      var tabBar = _this.props.children.map(function (child) {
        return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            key: child.key,
            role: 'tab',
            className: 'spark-tabs-tab',
            ref: function ref(tabChild) {
              return _this.tabChildren[child.key] = tabChild;
            },
            onClick: function onClick() {
              return _this.handleClickTabBar(child.key);
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 81
            }
          },
          child.props.tab
        );
      });

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'spark-tabs-tabbar', __source: {
            fileName: _jsxFileName,
            lineNumber: 94
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('div', { className: 'spark-tabs-ink-bar', ref: function ref(inkBar) {
            return _this.inkBar = inkBar;
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 95
          }
        }),
        tabBar
      );
    };

    _this.renderTabContent = function () {
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'spark-tabs-content', ref: function ref(tabsContent) {
            return _this.tabsContent = tabsContent;
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 103
          }
        },
        _this.props.children
      );
    };

    _this.tabChildren = {};
    _this.state.activeKey = _this.props.activeKey || _this.props.children[1].key;
    return _this;
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Tabs, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      this.updateInkStyle();
      this.updateContentStyle();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.activeKey !== this.props.activeKey) {
        this.setState({
          activeKey: nextProps.activeKey
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'spark-tabs', __source: {
            fileName: _jsxFileName,
            lineNumber: 111
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          { className: 'spark-tabs-scroll', __source: {
              fileName: _jsxFileName,
              lineNumber: 112
            }
          },
          this.renderTabBar()
        ),
        this.renderTabContent()
      );
    }
  }]);

  return Tabs;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component), _class.propTypes = {
  activeKey: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.string,
  onChange: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.func
}, _temp);

Tabs.TabPane = __WEBPACK_IMPORTED_MODULE_7__TabPane__["a" /* TabPane */];

/***/ }),

/***/ "./src/SparkComponent/Tabs/Tabs.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".spark-tabs {\n\n  overflow: hidden;\n\n  .spark-tabs-scroll {\n    border-bottom: 1px solid rgb(232, 232, 232);\n    overflow: hidden;\n\n    .spark-tabs-tab, .spark-tabs-tabbar {\n      display: inline-block;\n      position: relative;\n    }\n    \n    .spark-tabs-tab {\n      padding: 12px 16px;\n      box-sizing: border-box;\n      transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);\n    }\n\n    .spark-tabs-ink-bar {\n      bottom: 0;\n      position: absolute;\n      display: block;\n      background: #1890ff;\n      height: 2px;\n      transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), -webkit-transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);\n    }\n\n  }\n\n  .spark-tabs-content {\n    transition: margin-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);\n    display: flex;\n    width: 100%;\n    flex-direction: row;\n    will-change: margin-left;\n    margin-left: 0%;\n    \n    .spark-tabpane {\n      opacity: 0;\n      width: 100%;\n      flex-shrink: 0;\n      transition: opacity .15s;\n\n      &:active {\n        opacity: 1;\n      }\n    }\n  }\n}", ""]);

// exports


/***/ }),

/***/ "./src/SparkComponent/Tabs/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Tabs__ = __webpack_require__("./src/SparkComponent/Tabs/Tabs.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__Tabs__["a"]; });


/***/ }),

/***/ "./src/SparkComponent/ToolTip/ToolTip.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ToolTip; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ToolTip_less__ = __webpack_require__("./src/SparkComponent/ToolTip/ToolTip.less");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ToolTip_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__ToolTip_less__);





var _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/SparkComponent/ToolTip/ToolTip.js';


// if (process.env.BUILD_TARGET !== 'server') {
//   require('./ToolTip.less');
// }
var ToolTip = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(ToolTip, _React$Component);

  function ToolTip() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, ToolTip);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = ToolTip.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(ToolTip)).call.apply(_ref, [this].concat(args))), _this), _this.updateToolTip = function () {
      var clientRect = _this.content.getClientRects()[0];
      var popupLeft = clientRect.x - _this.popup.clientWidth / 2 + clientRect.width / 2;
      var popupTop = clientRect.y + clientRect.height + 10;
      _this.popup.style.left = popupLeft + 'px';
      _this.popup.style.top = popupTop + 'px';
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(ToolTip, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          children = _props.children,
          content = _props.content;

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'spark-tooltip', onMouseOver: this.updateToolTip, __source: {
            fileName: _jsxFileName,
            lineNumber: 20
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            className: 'spark-tooltip__content',
            ref: function ref(content) {
              return _this2.content = content;
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 21
            }
          },
          children
        ),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          {
            className: 'spark-tooltip__popup',
            ref: function ref(popup) {
              return _this2.popup = popup;
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 27
            }
          },
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            'div',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 31
              }
            },
            content
          )
        )
      );
    }
  }]);

  return ToolTip;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component);

/***/ }),

/***/ "./src/SparkComponent/ToolTip/ToolTip.less":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".spark-tooltip {\n  .spark-tooltip__popup {\n    position: absolute;\n    background: #1f2d3d;\n    color: white;\n    padding: 10px;\n    border-radius: 4px;\n    z-index: 2000;\n    font-size: 12px;\n    line-height: 1.2;\n    text-align: center;\n    visibility: hidden;\n  }\n\n  .spark-tooltip__popup:after {\n    content: \"\";\n    position: absolute;\n    width: 0;\n    height: 0;\n    background: 0;\n    border-style: solid;\n    border-width: 0 6px 6px;\n    border-color: transparent transparent #41464b;\n    bottom: 100%;\n    left: 50%;\n    margin-left: -6px;\n    visibility: hidden;\n  }\n\n  &:hover {\n    .spark-tooltip__popup, .spark-tooltip__popup:after {\n      visibility: visible;\n    }\n  }\n}\n", ""]);

// exports


/***/ }),

/***/ "./src/SparkComponent/ToolTip/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ToolTip_js__ = __webpack_require__("./src/SparkComponent/ToolTip/ToolTip.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__ToolTip_js__["a"]; });


/***/ }),

/***/ "./src/SparkComponent/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Button___ = __webpack_require__("./src/SparkComponent/Button/index.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__Button___["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CheckBox___ = __webpack_require__("./src/SparkComponent/CheckBox/index.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__CheckBox___["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Dialog___ = __webpack_require__("./src/SparkComponent/Dialog/index.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__Dialog___["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Input__ = __webpack_require__("./src/SparkComponent/Input/index.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_3__Input__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Loading__ = __webpack_require__("./src/SparkComponent/Loading/index.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_4__Loading__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Message__ = __webpack_require__("./src/SparkComponent/Message/index.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "i", function() { return __WEBPACK_IMPORTED_MODULE_5__Message__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Nav__ = __webpack_require__("./src/SparkComponent/Nav/index.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_6__Nav__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Tabs__ = __webpack_require__("./src/SparkComponent/Tabs/index.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "g", function() { return __WEBPACK_IMPORTED_MODULE_7__Tabs__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ToolTip__ = __webpack_require__("./src/SparkComponent/ToolTip/index.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "h", function() { return __WEBPACK_IMPORTED_MODULE_8__ToolTip__["a"]; });










/***/ }),

/***/ "./src/helpers/cos.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return cos; });
// import COS from 'cos-js-sdk-v5';

var cos = {};

if (false) {
  var COS = require('cos-js-sdk-v5');
  cos = new COS({
    getAuthorization: function getAuthorization(options, callback) {
      var authorization = COS.getAuthorization({
        SecretId: 'AKIDwqUs1t91C7l8E7N6C2bte9QUIrADpVkj',
        SecretKey: 'tWt0tWyA6mFSP6XorfVDi6F9nBJBoCNI',
        Method: options.Method,
        Key: options.Key
      });
      callback(authorization);
    }
  });
}



/***/ }),

/***/ "./src/helpers/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cos__ = __webpack_require__("./src/helpers/cos.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__cos__["a"]; });


/***/ }),

/***/ "./src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__server__ = __webpack_require__("./src/server.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_http__ = __webpack_require__("http");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_http___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_http__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__server_socket__ = __webpack_require__("./src/server/socket/index.js");



var server = __WEBPACK_IMPORTED_MODULE_1_http___default.a.createServer(__WEBPACK_IMPORTED_MODULE_0__server__["default"]);

var io = Object(__WEBPACK_IMPORTED_MODULE_2__server_socket__["default"])(server);

/* eslint-disable */
var currentApp = __WEBPACK_IMPORTED_MODULE_0__server__["default"];

server.listen("3000" || 3000, function (error) {
  if (error) {
    console.log(error);
  }

  console.log('🚀 started');
});

if (true) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept("./src/server.js", function () {
    console.log('🔁  HMR Reloading `./server`...');
    server.close(function () {
      console.log('关闭这个');
    });
    io.close();
    // server.removeAllListeners();
    var newApp = __webpack_require__("./src/server.js").default;
    var newServer = __WEBPACK_IMPORTED_MODULE_1_http___default.a.createServer(newApp);
    io = Object(__WEBPACK_IMPORTED_MODULE_2__server_socket__["default"])(newServer);
    newServer.listen(3000, function (err) {
      console.log('重连');
    });
    currentApp = newApp;
    console.log('5555');
  });

  module.hot.accept("./src/server/socket/index.js", function () {
    console.log('server socket reload');
    server.close();
    __webpack_require__("./src/server/socket/index.js").default(server);
    server.listen(3000, function (error) {
      console.log('更新了socket');
    });
  });
}

/* harmony default export */ __webpack_exports__["default"] = (server);

/***/ }),

/***/ "./src/redux/actionTypes.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__("babel-runtime/helpers/extends");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__views_Home_HomeReducer__ = __webpack_require__("./src/views/Home/HomeReducer.js");



/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({
  LOGIN: 'LOGIN',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',

  REGIST: 'REGIST',
  REGIST_REQUEST: 'REGIST_REQUEST',
  REGIST_SUCCESS: 'REGIST_SUCCESS',
  REGIST_FAILURE: 'REGIST_FAILURE',

  CHECK_LOGIN: 'CHECK_LOGIN',

  LOGOUT: 'LOGOUT'

}, __WEBPACK_IMPORTED_MODULE_1__views_Home_HomeReducer__["b" /* actionTypes */]));

/***/ }),

/***/ "./src/redux/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__("redux");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_saga__ = __webpack_require__("redux-saga");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_saga___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux_saga__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__reducer__ = __webpack_require__("./src/redux/reducer.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__saga__ = __webpack_require__("./src/redux/saga.js");





var sagaMiddleware = __WEBPACK_IMPORTED_MODULE_1_redux_saga___default()();
var store = Object(__WEBPACK_IMPORTED_MODULE_0_redux__["createStore"])(__WEBPACK_IMPORTED_MODULE_2__reducer__["a" /* default */], Object(__WEBPACK_IMPORTED_MODULE_0_redux__["applyMiddleware"])(sagaMiddleware));

sagaMiddleware.run(__WEBPACK_IMPORTED_MODULE_3__saga__["b" /* mainSaga */]);

/* harmony default export */ __webpack_exports__["a"] = (store);

/***/ }),

/***/ "./src/redux/reducer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__("babel-runtime/helpers/extends");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux__ = __webpack_require__("redux");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actionTypes__ = __webpack_require__("./src/redux/actionTypes.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__views_Home_HomeReducer__ = __webpack_require__("./src/views/Home/HomeReducer.js");





function commonInfoReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    isLogin: false,
    isLoading: false,
    userInfo: {},
    isFetching: true
  };
  var action = arguments[1];

  switch (action.type) {
    case __WEBPACK_IMPORTED_MODULE_2__actionTypes__["a" /* default */].LOGIN_REQUEST:
      {
        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, state, {
          isLoading: true
        });
      }
    case __WEBPACK_IMPORTED_MODULE_2__actionTypes__["a" /* default */].LOGIN_SUCCESS:
      {
        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, state, {
          isLoading: false
        }, action.payload, {
          isFetching: false
        });
      }
    case __WEBPACK_IMPORTED_MODULE_2__actionTypes__["a" /* default */].LOGIN_FAILURE:
      {
        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, state, {
          isLoading: false
        }, action.payload);
      }
    case __WEBPACK_IMPORTED_MODULE_2__actionTypes__["a" /* default */].LOGOUT_SUCCESS:
      {
        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, state, {
          isLogin: false,
          userInfo: null,
          isFetching: false
        });
      }
    case __WEBPACK_IMPORTED_MODULE_2__actionTypes__["a" /* default */].REGIST_REQUEST:
      {
        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, state, {
          isLoading: true
        });
      }
    case __WEBPACK_IMPORTED_MODULE_2__actionTypes__["a" /* default */].REGIST_SUCCESS:
      {
        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, state, {
          isLoading: false
        }, action.payload, {
          isFetching: false
        });
      }
    case __WEBPACK_IMPORTED_MODULE_2__actionTypes__["a" /* default */].REGIST_FAILURE:
      {
        return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, state, {
          isLoading: false
        }, action.payload, {
          isFetching: false
        });
      }
    default:
      {
        return state;
      }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_1_redux__["combineReducers"])({
  commonInfo: commonInfoReducer,
  homeInfo: __WEBPACK_IMPORTED_MODULE_3__views_Home_HomeReducer__["a" /* HomeReducer */]
}));

/***/ }),

/***/ "./src/redux/saga.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = mainSaga;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return actions; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__ = __webpack_require__("redux-saga/effects");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_saga_effects___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__views_Doc__ = __webpack_require__("./src/views/Doc/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__views_Home__ = __webpack_require__("./src/views/Home/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Apis__ = __webpack_require__("./src/Apis/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actionTypes__ = __webpack_require__("./src/redux/actionTypes.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__SparkComponent__ = __webpack_require__("./src/SparkComponent/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils__ = __webpack_require__("./src/utils/index.js");


var _marked = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(mainSaga),
    _marked2 = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(loginSaga),
    _marked3 = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(registSaga),
    _marked4 = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(checkLoginAndFetch),
    _marked5 = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(Logout);









function mainSaga() {
  return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function mainSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["takeEvery"])(__WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].LOGIN, loginSaga);

        case 2:
          _context.next = 4;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["takeEvery"])(__WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].REGIST, registSaga);

        case 4:
          _context.next = 6;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["takeEvery"])(__WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].CHECK_LOGIN, checkLoginAndFetch);

        case 6:
          _context.next = 8;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["takeEvery"])(__WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].LOGOUT, Logout);

        case 8:
          _context.next = 10;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["all"])([Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["call"])(__WEBPACK_IMPORTED_MODULE_2__views_Doc__["b" /* DocSaga */]), Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["call"])(__WEBPACK_IMPORTED_MODULE_3__views_Home__["b" /* HomeSaga */])]);

        case 10:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

var actions = {
  requestLogin: function requestLogin(username, password) {
    return {
      type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].LOGIN,
      payload: { username: username, password: password }
    };
  },
  requestLogout: function requestLogout() {
    return {
      type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].LOGOUT
    };
  },
  requestRegist: function requestRegist(username, password) {
    return {
      type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].REGIST,
      payload: { username: username, password: password }
    };
  },
  requestCheckLogin: function requestCheckLogin() {
    return {
      type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].CHECK_LOGIN
    };
  }
};

function loginSaga(action) {
  var _action$payload, username, password, result;

  return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function loginSaga$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({ type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].LOGIN_REQUEST });

        case 3:
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["f" /* SparkLoading */].show();
          _action$payload = action.payload, username = _action$payload.username, password = _action$payload.password;
          _context2.t0 = __WEBPACK_IMPORTED_MODULE_7__utils__["d" /* objToCamcelCase */];
          _context2.next = 8;
          return __WEBPACK_IMPORTED_MODULE_4__Apis__["b" /* Login */](username, password).then(function (res) {
            return res.json();
          });

        case 8:
          _context2.t1 = _context2.sent;
          result = (0, _context2.t0)(_context2.t1);

          if (!(result.code === 200)) {
            _context2.next = 18;
            break;
          }

          _context2.next = 13;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({
            type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].LOGIN_SUCCESS,
            payload: {
              isLogin: true,
              userInfo: {
                username: username
              }
            }
          });

        case 13:
          _context2.next = 15;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({
            type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].UPDATE_DOC_LIST,
            payload: {
              docs: result.docs
            }
          });

        case 15:
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["i" /* message */].success('登录成功');
          _context2.next = 21;
          break;

        case 18:
          _context2.next = 20;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({
            type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].LOGIN_FAILURE,
            payload: {
              isLogin: false
            }
          });

        case 20:
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["i" /* message */].error(result.msg);

        case 21:
          _context2.next = 28;
          break;

        case 23:
          _context2.prev = 23;
          _context2.t2 = _context2['catch'](0);
          _context2.next = 27;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({
            type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].LOGIN_FAILURE,
            payload: {
              isLogin: false
            }
          });

        case 27:
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["i" /* message */].error(_context2.t2.msg || _context2.t2.message || _context2.t2);

        case 28:
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["f" /* SparkLoading */].hide();

        case 29:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked2, this, [[0, 23]]);
}

function registSaga(action) {
  var _action$payload2, username, password, result;

  return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function registSaga$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({ type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].REGIST_REQUEST });

        case 3:
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["f" /* SparkLoading */].show();
          _action$payload2 = action.payload, username = _action$payload2.username, password = _action$payload2.password;
          _context3.t0 = __WEBPACK_IMPORTED_MODULE_7__utils__["d" /* objToCamcelCase */];
          _context3.next = 8;
          return __WEBPACK_IMPORTED_MODULE_4__Apis__["d" /* Regist */](username, password).then(function (res) {
            return res.json();
          });

        case 8:
          _context3.t1 = _context3.sent;
          result = (0, _context3.t0)(_context3.t1);

          if (!(result.code === 200)) {
            _context3.next = 16;
            break;
          }

          _context3.next = 13;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({
            type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].REGIST_SUCCESS,
            payload: {
              isLogin: true,
              userInfo: {
                username: username
              }
            }
          });

        case 13:
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["i" /* message */].success('注册成功');
          _context3.next = 19;
          break;

        case 16:
          _context3.next = 18;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({
            type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].REGIST_FAILURE,
            payload: {
              isLogin: false
            }
          });

        case 18:
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["i" /* message */].error(result.msg);

        case 19:
          _context3.next = 26;
          break;

        case 21:
          _context3.prev = 21;
          _context3.t2 = _context3['catch'](0);
          _context3.next = 25;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({
            type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].REGIST_FAILURE,
            payload: {
              isLogin: false
            }
          });

        case 25:
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["i" /* message */].error(_context3.t2.msg || _context3.t2.message || _context3.t2);

        case 26:
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["f" /* SparkLoading */].hide();

        case 27:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked3, this, [[0, 21]]);
}

function checkLoginAndFetch() {
  var result;
  return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function checkLoginAndFetch$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;

          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["f" /* SparkLoading */].show();
          _context4.t0 = __WEBPACK_IMPORTED_MODULE_7__utils__["d" /* objToCamcelCase */];
          _context4.next = 5;
          return __WEBPACK_IMPORTED_MODULE_4__Apis__["a" /* CheckAndFetch */]().then(function (res) {
            return res.json();
          });

        case 5:
          _context4.t1 = _context4.sent;
          result = (0, _context4.t0)(_context4.t1);

          if (!(result.code === 200)) {
            _context4.next = 14;
            break;
          }

          _context4.next = 10;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({
            type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].LOGIN_SUCCESS,
            payload: {
              isLogin: true,
              userInfo: {
                username: result.username
              }
            }
          });

        case 10:
          _context4.next = 12;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({
            type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].UPDATE_DOC_LIST,
            payload: {
              docs: result.docs
            }
          });

        case 12:
          _context4.next = 16;
          break;

        case 14:
          _context4.next = 16;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({
            type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].LOGIN_FAILURE,
            payload: {
              isFetching: false
            }
          });

        case 16:
          _context4.next = 22;
          break;

        case 18:
          _context4.prev = 18;
          _context4.t2 = _context4['catch'](0);
          _context4.next = 22;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({
            type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].LOGIN_FAILURE,
            payload: {
              isFetching: false
            }
          });

        case 22:
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["f" /* SparkLoading */].hide();

        case 23:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked4, this, [[0, 18]]);
}

function Logout() {
  var result;
  return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function Logout$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.t0 = __WEBPACK_IMPORTED_MODULE_7__utils__["d" /* objToCamcelCase */];
          _context5.next = 4;
          return __WEBPACK_IMPORTED_MODULE_4__Apis__["c" /* Logout */]().then(function (res) {
            return res.json();
          });

        case 4:
          _context5.t1 = _context5.sent;
          result = (0, _context5.t0)(_context5.t1);

          if (!(result.code === 200)) {
            _context5.next = 12;
            break;
          }

          _context5.next = 9;
          return Object(__WEBPACK_IMPORTED_MODULE_1_redux_saga_effects__["put"])({
            type: __WEBPACK_IMPORTED_MODULE_5__actionTypes__["a" /* default */].LOGOUT_SUCCESS
          });

        case 9:
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["i" /* message */].success('登出成功');
          _context5.next = 13;
          break;

        case 12:
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["i" /* message */].error('登出失败');

        case 13:
          _context5.next = 18;
          break;

        case 15:
          _context5.prev = 15;
          _context5.t2 = _context5['catch'](0);

          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["i" /* message */].error('登出失败');

        case 18:
        case 'end':
          return _context5.stop();
      }
    }
  }, _marked5, this, [[0, 15]]);
}

/***/ }),

/***/ "./src/router/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Router; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router_dom__ = __webpack_require__("react-router-dom");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__views_Doc__ = __webpack_require__("./src/views/Doc/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__views_Home__ = __webpack_require__("./src/views/Home/index.js");
var _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/router/index.js';





var Router = function Router() {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'div',
    { className: 'spark-router', __source: {
        fileName: _jsxFileName,
        lineNumber: 10
      }
    },
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_1_react_router_dom__["Switch"],
      {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 11
        }
      },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__["Route"], { exact: true, path: '/', component: __WEBPACK_IMPORTED_MODULE_3__views_Home__["a" /* Home */], __source: {
          fileName: _jsxFileName,
          lineNumber: 12
        }
      }),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__["Route"], { path: '/doc/:docId', component: __WEBPACK_IMPORTED_MODULE_2__views_Doc__["a" /* Doc */], __source: {
          fileName: _jsxFileName,
          lineNumber: 13
        }
      })
    )
  );
};



/***/ }),

/***/ "./src/server.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router_dom__ = __webpack_require__("react-router-dom");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_router_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_express__ = __webpack_require__("express");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom_server__ = __webpack_require__("react-dom/server");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom_server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_dom_server__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__App__ = __webpack_require__("./src/App.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__redux__ = __webpack_require__("./src/redux/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_redux__ = __webpack_require__("react-redux");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__server_app__ = __webpack_require__("./src/server/app.js");
var _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/server.js';









// const App = require('./App');
var assets = __webpack_require__("./build/assets.json");

var server = __WEBPACK_IMPORTED_MODULE_2_express___default()();
Object(__WEBPACK_IMPORTED_MODULE_7__server_app__["a" /* default */])(server);
server.use(__WEBPACK_IMPORTED_MODULE_2_express___default.a.static("/Users/chenjigeng/Project/web/tttt/public")).get('/*', function (req, res) {
  var context = {};
  var markup = Object(__WEBPACK_IMPORTED_MODULE_3_react_dom_server__["renderToString"])(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_6_react_redux__["Provider"],
    { store: __WEBPACK_IMPORTED_MODULE_5__redux__["a" /* default */], __source: {
        fileName: _jsxFileName,
        lineNumber: 21
      }
    },
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      __WEBPACK_IMPORTED_MODULE_1_react_router_dom__["StaticRouter"],
      { context: context, location: req.url, __source: {
          fileName: _jsxFileName,
          lineNumber: 22
        }
      },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__App__["a" /* default */], {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 23
        }
      })
    )
  ));

  if (context.url) {
    res.redirect(context.url);
  } else {
    res.status(200).send('<!doctype html>\n    <html lang="">\n    <head>\n        <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n        <meta charset="utf-8" />\n        <title>Welcome to Sparker</title>\n        <meta name="viewport" content="width=device-width, initial-scale=1">\n        ' + (assets.client.css ? '<link rel="stylesheet" href="' + assets.client.css + '">' : '') + '\n        ' + ( false ? '<script src="' + assets.client.js + '" defer></script>' : '<script src="' + assets.client.js + '" defer crossorigin></script>') + '\n    </head>\n    <body>\n        <div id="root">' + markup + '</div>\n    </body>\n</html>');
  }
});

/* harmony default export */ __webpack_exports__["default"] = (server);

/***/ }),

/***/ "./src/server/app.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {/* harmony export (immutable) */ __webpack_exports__["a"] = initServer;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__router__ = __webpack_require__("./src/server/router/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model__ = __webpack_require__("./src/server/model/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__redis_index__ = __webpack_require__("./src/server/redis/index.js");




var bodyParser = __webpack_require__("body-parser");
var express = __webpack_require__("express");
var path = __webpack_require__("path");
var session = __webpack_require__("express-session");
var redisStore = __webpack_require__("connect-redis")(session);

function initServer(app) {

  // 支持cors
  // app.use(function (req, res, next) {
  //   res.header('Access-Control-Allow-Origin', '*');        
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type');
  //   res.header('Access-Control-Allow-Credentials','true');
  //   next();
  // })

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({
    secret: 'This is sparker server',
    cookie: { maxAge: 60 * 1000 * 60 * 24 * 14 },
    resave: false,
    saveUninitialized: true,
    store: new redisStore({
      client: __WEBPACK_IMPORTED_MODULE_2__redis_index__["a" /* default */]
    })
  }));

  app.use(express.static(path.resolve(__dirname + '../../../build/public')));
  app.use(express.static(path.resolve(__dirname + '../../../build/static')));
  app.use(express.static(path.resolve(__dirname + '../../../build')));

  Object(__WEBPACK_IMPORTED_MODULE_0__router__["a" /* default */])(app);
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, "src/server"))

/***/ }),

/***/ "./src/server/config/index.js":
/***/ (function(module, exports, __webpack_require__) {

var resCodes = __webpack_require__("./src/server/config/responseCodes.js");

var mysqlConfig = {
  host: 'localhost',
  user: 'chenjg',
  password: 'chenjg',
  database: 'sparker'
};

var permissionConstant = {
  'NO_PERMISSION': 0,
  'NO_WRITE': 1,
  'OWNER': 2
};

module.exports = {
  mysqlConfig: mysqlConfig,
  resCodes: resCodes,
  permissionConstant: permissionConstant
};

/***/ }),

/***/ "./src/server/config/responseCodes.js":
/***/ (function(module, exports) {

var codes = {
  'OK': 200,
  'USERNAME_REPEAT': 201,
  'PASSWORD_NO_EQUAL': 202,
  'USERNAME_NO_EXIST': 203,
  'CREATE_DOC_ERROR': 204,
  'NO_LOGIN': 205,
  'EQUAL': 404
};

module.exports = codes;

/***/ }),

/***/ "./src/server/controller/doc.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__("babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_doc__ = __webpack_require__("./src/server/model/doc.js");




var _require = __webpack_require__("./src/server/config/index.js"),
    resCodes = _require.resCodes;

var docCtrl = {};

docCtrl.create = function () {
  var _ref = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(req, res) {
    var result;
    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (req.session.login) {
              _context.next = 4;
              break;
            }

            res.status(200).send({
              code: resCodes.NO_LOGIN,
              msg: '您没有登录'
            });
            return _context.abrupt('return');

          case 4:
            _context.next = 6;
            return __WEBPACK_IMPORTED_MODULE_2__model_doc__["a" /* default */].create(req.session.userId);

          case 6:
            result = _context.sent;

            res.status(200).send({
              code: resCodes.OK,
              docId: result.insertId,
              msg: '创建文档成功'
            });
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](0);

            res.status(200).send({
              code: resCodes.CREATE_DOC_ERROR,
              msg: '创建文档失败'
            });

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 10]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/* harmony default export */ __webpack_exports__["a"] = (docCtrl);

/***/ }),

/***/ "./src/server/controller/user.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__("babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_user__ = __webpack_require__("./src/server/model/user.js");




var _require = __webpack_require__("./src/server/config/index.js"),
    resCodes = _require.resCodes;

var userCtrl = {};

userCtrl.regist = function () {
  var _ref = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(req, res, next) {
    var _req$body, username, password, result;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, username = _req$body.username, password = _req$body.password;
            _context.prev = 1;
            _context.next = 4;
            return __WEBPACK_IMPORTED_MODULE_2__model_user__["a" /* default */].create(username, password);

          case 4:
            result = _context.sent;

            // const docResult = await userModel.fetchUserInfo(result.user_id);    
            req.session.login = true;
            req.session.username = username;
            req.session.userId = result.insertId;
            res.status(200).send({
              code: resCodes.OK,
              msg: '创建成功',
              docs: []
            });
            _context.next = 15;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](1);

            console.log(_context.t0);
            if (_context.t0.code === 'ER_DUP_ENTRY') {
              res.status(200).send({
                code: resCodes.USERNAME_REPEAT,
                msg: '账号重复'
              });
            }

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 11]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

userCtrl.login = function () {
  var _ref2 = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee2(req, res, next) {
    var _req$body2, username, password, result, docResult;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
            _context2.prev = 1;
            _context2.next = 4;
            return __WEBPACK_IMPORTED_MODULE_2__model_user__["a" /* default */].confirm(username, password);

          case 4:
            result = _context2.sent;
            _context2.next = 7;
            return __WEBPACK_IMPORTED_MODULE_2__model_user__["a" /* default */].fetchUserInfo(result.user_id);

          case 7:
            docResult = _context2.sent;

            console.log(req);
            console.log(req.session);
            req.session.login = true;
            req.session.username = username;
            req.session.userId = result.user_id;
            res.status(200).send({
              code: resCodes.OK,
              msg: '登录成功',
              docs: docResult
            });
            _context2.next = 20;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t0 = _context2['catch'](1);

            if (_context2.t0.code === 'NO_EQUAL') {
              res.status(200).send({
                code: resCodes.PASSWORD_NO_EQUAL,
                msg: '密码错误'
              });
            } else if (_context2.t0.code === 'EMPTY') {
              res.status(200).send({
                code: resCodes.USERNAME_NO_EXIST,
                msg: '账号不存在'
              });
            }
            console.log(_context2.t0);

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 16]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

userCtrl.logout = function () {
  var _ref3 = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee3(req, res) {
    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('logout');
            if (req.session) {
              req.session.login = false;
            }
            res.status(200).send({
              code: resCodes.OK,
              msg: '登出成功'
            });

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

userCtrl.check = function () {
  var _ref4 = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee4(req, res) {
    var _req$session, userId, username, docResult;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            if (!req.session.login) {
              _context4.next = 9;
              break;
            }

            _req$session = req.session, userId = _req$session.userId, username = _req$session.username;
            _context4.next = 5;
            return __WEBPACK_IMPORTED_MODULE_2__model_user__["a" /* default */].fetchUserInfo(userId);

          case 5:
            docResult = _context4.sent;

            res.status(200).send({
              code: resCodes.OK,
              msg: '账号已登录',
              docs: docResult,
              username: username
            });
            _context4.next = 10;
            break;

          case 9:
            res.status(200).send({
              code: resCodes.NO_LOGIN,
              msg: '账号未登录'
            });

          case 10:
            _context4.next = 15;
            break;

          case 12:
            _context4.prev = 12;
            _context4.t0 = _context4['catch'](0);

            res.status(200).send({
              code: resCodes.NO_LOGIN,
              msg: _context4.t0.msg || _context4.t0.message || _context4.t0
            });

          case 15:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 12]]);
  }));

  return function (_x9, _x10) {
    return _ref4.apply(this, arguments);
  };
}();

/* harmony default export */ __webpack_exports__["a"] = (userCtrl);

/***/ }),

/***/ "./src/server/model/doc.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__("babel-runtime/core-js/promise");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__("babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_json_stringify__ = __webpack_require__("babel-runtime/core-js/json/stringify");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__permission__ = __webpack_require__("./src/server/model/permission.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__index__ = __webpack_require__("./src/server/model/index.js");





var _this = this;



// const crypto = require('crypto');
var moment = __webpack_require__("moment");

var Constant = __webpack_require__("./src/server/config/index.js");

var docModel = {};

var content = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_json_stringify___default()({
  document: {
    nodes: [{
      object: 'block',
      type: 'paragraph',
      nodes: [{
        object: 'text',
        leaves: [{
          text: 'Hello World'
        }]
      }]
    }]
  }
});

docModel.create = function () {
  var _ref = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(userId) {
    var doc, _ref2, result, prevDocs, docId, newDocs;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            doc = {
              content: content,
              name: '未命名文档',
              create_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
              update_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            };
            _context.prev = 1;
            _context.next = 4;
            return __WEBPACK_IMPORTED_MODULE_5__index__["a" /* default */].$query('Insert Into document Set ?', doc);

          case 4:
            _ref2 = _context.sent;
            result = _ref2.result;
            _context.next = 8;
            return docModel.fetchDocs(userId);

          case 8:
            prevDocs = _context.sent;
            docId = result.insertId;
            newDocs = prevDocs.concat(docId);
            _context.next = 13;
            return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.all([docModel.updateDocs(userId, newDocs.toString()), __WEBPACK_IMPORTED_MODULE_4__permission__["a" /* default */].create(userId, docId, Constant.permissionConstant.OWNER)]);

          case 13:
            return _context.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result));

          case 16:
            _context.prev = 16;
            _context.t0 = _context['catch'](1);
            return _context.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context.t0));

          case 19:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[1, 16]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

docModel.fetchDoc = function () {
  var _ref3 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee2(docId) {
    var _ref4, result;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return __WEBPACK_IMPORTED_MODULE_5__index__["a" /* default */].$query('select * from document where doc_id = ?', [docId]);

          case 3:
            _ref4 = _context2.sent;
            result = _ref4.result;
            return _context2.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2['catch'](0);
            return _context2.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context2.t0));

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this, [[0, 8]]);
  }));

  return function (_x2) {
    return _ref3.apply(this, arguments);
  };
}();

docModel.fetchDocs = function () {
  var _ref5 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee3(userId) {
    var _ref6, result, docs;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return __WEBPACK_IMPORTED_MODULE_5__index__["a" /* default */].$query('select docs from user where user_id = ?', [userId]);

          case 3:
            _ref6 = _context3.sent;
            result = _ref6.result;

            if (result.length) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject({
              code: Constant.resCodes.EQUAL
            }));

          case 7:
            docs = [];

            if (result[0].docs) {
              docs = new Array(result[0].docs);
            }
            return _context3.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(docs));

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3['catch'](0);
            return _context3.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context3.t0));

          case 15:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this, [[0, 12]]);
  }));

  return function (_x3) {
    return _ref5.apply(this, arguments);
  };
}();

docModel.updateDocs = function () {
  var _ref7 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee4(userId, docs) {
    var _ref8, result;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return __WEBPACK_IMPORTED_MODULE_5__index__["a" /* default */].$query('update user set docs = ? where user_id = ?', [docs, userId]);

          case 3:
            _ref8 = _context4.sent;
            result = _ref8.result;
            return _context4.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result));

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4['catch'](0);
            return _context4.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context4.t0));

          case 11:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, _this, [[0, 8]]);
  }));

  return function (_x4, _x5) {
    return _ref7.apply(this, arguments);
  };
}();

docModel.updateDoc = function () {
  var _ref9 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee5(docId, content) {
    var _ref10, result;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return __WEBPACK_IMPORTED_MODULE_5__index__["a" /* default */].$query('update document set content = ? where doc_id = ?', [content, docId]);

          case 3:
            _ref10 = _context5.sent;
            result = _ref10.result;
            return _context5.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result));

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5['catch'](0);
            return _context5.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context5.t0));

          case 11:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, _this, [[0, 8]]);
  }));

  return function (_x6, _x7) {
    return _ref9.apply(this, arguments);
  };
}();

docModel.fetchUserDocs = function () {
  var _ref11 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee6(userId) {
    var docsId, sql, _ref12, result;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return docModel.fetchDocs(userId);

          case 3:
            docsId = _context6.sent;

            if (docsId.length) {
              _context6.next = 6;
              break;
            }

            return _context6.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve([]));

          case 6:
            sql = 'Select * from document where doc_id in (' + docsId.toString() + ')';
            _context6.next = 9;
            return __WEBPACK_IMPORTED_MODULE_5__index__["a" /* default */].$query(sql);

          case 9:
            _ref12 = _context6.sent;
            result = _ref12.result;
            return _context6.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result));

          case 14:
            _context6.prev = 14;
            _context6.t0 = _context6['catch'](0);
            return _context6.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context6.t0));

          case 17:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, _this, [[0, 14]]);
  }));

  return function (_x8) {
    return _ref11.apply(this, arguments);
  };
}();

// export default  docModel;
/* harmony default export */ __webpack_exports__["a"] = (docModel);

/***/ }),

/***/ "./src/server/model/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__("babel-runtime/core-js/promise");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);

var mysql = __webpack_require__("mysql");
var config = __webpack_require__("./src/server/config/index.js");

// mysql 连接
var connection = mysql.createConnection(config.mysqlConfig);

connection.connect(function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('connect');

  console.log('mysql connect');
});

connection.$query = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    connection.query.apply(connection, args.concat([function (err, result, fields) {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        result: result,
        fields: fields
      });
    }]));
  });
};

/* harmony default export */ __webpack_exports__["a"] = (connection);
// export default  connection;

/***/ }),

/***/ "./src/server/model/permission.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__("babel-runtime/core-js/promise");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__("babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__index__ = __webpack_require__("./src/server/model/index.js");




var _this = this;


// const crypto = require('crypto');

var permissionModel = {};

permissionModel.create = function () {
  var _ref = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(userId, docId, permissionRight) {
    var permission, result;
    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            permission = {
              user_id: userId,
              doc_id: docId,
              permission: permissionRight
            };
            _context.next = 4;
            return __WEBPACK_IMPORTED_MODULE_3__index__["a" /* default */].$query('insert into permission set ?', permission);

          case 4:
            result = _context.sent;
            return _context.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result));

          case 8:
            _context.prev = 8;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context.t0));

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this, [[0, 8]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

/* harmony default export */ __webpack_exports__["a"] = (permissionModel);
// export default  permissionModel;

/***/ }),

/***/ "./src/server/model/user.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__("babel-runtime/core-js/promise");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__("babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__doc__ = __webpack_require__("./src/server/model/doc.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__index__ = __webpack_require__("./src/server/model/index.js");




var _this = this;

// const docModel = require('./doc');



var crypto = __webpack_require__("crypto");
// const resCode = require('../config/responseCodes');
// const moment = require('moment');

var secret = 'sprakerUser';

var userModel = {};

userModel.create = function () {
  var _ref = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee(username, password) {
    var cipher, enc, user, _ref2, result;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            cipher = crypto.createCipher('aes192', secret);
            enc = cipher.update(password, 'utf8', 'hex');

            enc += cipher.final('hex');
            user = {
              username: username,
              password: enc
            };
            _context.prev = 4;
            _context.next = 7;
            return __WEBPACK_IMPORTED_MODULE_4__index__["a" /* default */].$query('Insert Into user Set ?', user);

          case 7:
            _ref2 = _context.sent;
            result = _ref2.result;
            return _context.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result));

          case 12:
            _context.prev = 12;
            _context.t0 = _context['catch'](4);
            return _context.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context.t0));

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[4, 12]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

userModel.confirm = function () {
  var _ref3 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee2(username, password) {
    var _ref4, result, pass, decipher, dec;

    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return __WEBPACK_IMPORTED_MODULE_4__index__["a" /* default */].$query('select * from user where username = ?', [username]);

          case 3:
            _ref4 = _context2.sent;
            result = _ref4.result;

            if (result.length) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject({
              code: 'EMPTY'
            }));

          case 7:
            pass = result[0].password;
            decipher = crypto.createDecipher('aes192', secret);
            dec = decipher.update(pass, 'hex', 'utf8'); //编码方式从hex转为utf-8;

            dec += decipher.final('utf8'); //编码方式从utf-8;

            if (!(dec === password)) {
              _context2.next = 15;
              break;
            }

            return _context2.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result[0]));

          case 15:
            return _context2.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject({
              code: 'NO_EQUAL'
            }));

          case 16:
            _context2.next = 21;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2['catch'](0);
            return _context2.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context2.t0));

          case 21:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this, [[0, 18]]);
  }));

  return function (_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

userModel.fetchUserInfo = function () {
  var _ref5 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee3(userId) {
    var result;
    return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return __WEBPACK_IMPORTED_MODULE_3__doc__["a" /* default */].fetchUserDocs(userId);

          case 3:
            result = _context3.sent;
            return _context3.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.resolve(result));

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3['catch'](0);
            return _context3.abrupt('return', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.reject(_context3.t0));

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this, [[0, 7]]);
  }));

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
}();

/* harmony default export */ __webpack_exports__["a"] = (userModel);
// export default  userModel;

/***/ }),

/***/ "./src/server/redis/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__("babel-runtime/core-js/promise");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);

var redis = __webpack_require__("redis");

var client = redis.createClient();

client.sget = function (key) {
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    client.get(key, function (err, value) {
      if (err) {
        reject(err);
        return;
      }
      resolve(value);
    });
  });
};

/* harmony default export */ __webpack_exports__["a"] = (client);

/***/ }),

/***/ "./src/server/router/common.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controller_user__ = __webpack_require__("./src/server/controller/user.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express__ = __webpack_require__("express");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_express__);



var router = __WEBPACK_IMPORTED_MODULE_1_express___default.a.Router();
// const userCtrl = require('../controller/user');

router.post('/login', function (req, res) {
  __WEBPACK_IMPORTED_MODULE_0__controller_user__["a" /* default */].login(req, res);
});

router.post('/logout', function (req, res) {
  console.log('logout');
  __WEBPACK_IMPORTED_MODULE_0__controller_user__["a" /* default */].logout(req, res);
});

router.post('/regist', function (req, res) {
  __WEBPACK_IMPORTED_MODULE_0__controller_user__["a" /* default */].regist(req, res);
});

router.post('/check', function (req, res) {
  __WEBPACK_IMPORTED_MODULE_0__controller_user__["a" /* default */].check(req, res);
});

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),

/***/ "./src/server/router/doc.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controller_doc__ = __webpack_require__("./src/server/controller/doc.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express__ = __webpack_require__("express");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_express__);



var router = __WEBPACK_IMPORTED_MODULE_1_express___default.a.Router();

router.post('/', function (req, res) {
  __WEBPACK_IMPORTED_MODULE_0__controller_doc__["a" /* default */].create(req, res);
});

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),

/***/ "./src/server/router/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__user__ = __webpack_require__("./src/server/router/user.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__doc__ = __webpack_require__("./src/server/router/doc.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common__ = __webpack_require__("./src/server/router/common.js");




function initRouter(app) {
  app.use('/api/', __WEBPACK_IMPORTED_MODULE_2__common__["a" /* default */]);
  app.use('/api/user', __WEBPACK_IMPORTED_MODULE_0__user__["a" /* default */]);
  app.use('/api/doc', __WEBPACK_IMPORTED_MODULE_1__doc__["a" /* default */]);
}

/* harmony default export */ __webpack_exports__["a"] = (initRouter);

/***/ }),

/***/ "./src/server/router/user.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__("express");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__controller_user__ = __webpack_require__("./src/server/controller/user.js");



var router = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router();

router.post('/', function (req, res) {
  __WEBPACK_IMPORTED_MODULE_1__controller_user__["a" /* default */].regist(req, res);
});

router.get('/', function (req, res) {
  res.send('hello');
});

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),

/***/ "./src/server/socket/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__("babel-runtime/core-js/json/stringify");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__("babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__redis__ = __webpack_require__("./src/server/redis/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__model_doc__ = __webpack_require__("./src/server/model/doc.js");





// const http = require('http');
var socket = __webpack_require__("socket.io");
var slate = __webpack_require__("slate");
var Value = slate.Value;

function init(server) {
  var io = socket(server, { origins: '*:*' });
  // io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
  io.set('origins', '*:*');
  io.on('connection', function (socket) {
    var _this = this;

    socket.on('initSocket', function () {
      var _ref = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.mark(function _callee(_ref2) {
        var docId = _ref2.docId;
        var doc, result, value;
        return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // 加入以docId为标识的房间
                socket.join(docId);
                _context.next = 3;
                return __WEBPACK_IMPORTED_MODULE_3__redis__["a" /* default */].sget(docId);

              case 3:
                doc = _context.sent;

                if (!doc) {
                  _context.next = 7;
                  break;
                }

                socket.emit('init', { value: Value.fromJSON(JSON.parse(doc)) });
                return _context.abrupt('return');

              case 7:
                _context.next = 9;
                return __WEBPACK_IMPORTED_MODULE_4__model_doc__["a" /* default */].fetchDoc(docId);

              case 9:
                result = _context.sent;
                value = Value.fromJSON(JSON.parse(result[0].content));

                __WEBPACK_IMPORTED_MODULE_3__redis__["a" /* default */].set(docId, result[0].content);
                socket.emit('init', { value: value });

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    socket.on('update', function () {
      var _ref3 = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.mark(function _callee2(data) {
        var docId, doc, value, content;
        return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                docId = data.docId;
                // 将该文档的修改内容发送给其他正在访问该文档的人

                socket.broadcast.to(docId).emit('updateFromOthers', data);
                _context2.next = 4;
                return __WEBPACK_IMPORTED_MODULE_3__redis__["a" /* default */].sget(docId);

              case 4:
                doc = _context2.sent;
                value = Value.fromJSON(JSON.parse(doc)).change().applyOperations(data.ops).value;
                content = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(value.toJSON());
                // 将更新的内容存入数据库，并且更新缓存数据库的内容

                __WEBPACK_IMPORTED_MODULE_3__redis__["a" /* default */].set(docId, content);
                _context2.next = 10;
                return __WEBPACK_IMPORTED_MODULE_4__model_doc__["a" /* default */].updateDoc(docId, content);

              case 10:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, _this);
      }));

      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());
  });

  return io;
}

/* harmony default export */ __webpack_exports__["default"] = (init);

/***/ }),

/***/ "./src/utils/BlockHotKey.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = BlockHotkey;
function BlockHotkey(options) {
  var type = options.type,
      key = options.key;

  // Return our "plugin" object, containing the `onKeyDown` handler.

  return {
    onKeyDown: function onKeyDown(event, change, editor) {
      // Check that the key pressed matches our `key` option.
      if (!(event.metaKey || event.ctrlKey) || event.key !== key || !event.shiftKey) return;
      // Prevent the default characters from being inserted.
      event.preventDefault();
      var value = editor.value;

      var parentType = value.document.getParent(value.startBlock.key) && value.document.getParent(value.startBlock.key).type;
      if (value.startBlock.type === type) {
        change.setBlock('paragrahp');
      } else if (type === 'order-list') {
        // 该元素不在有序列表里        
        if (!parentType || parentType !== 'numbered-list') {
          change.wrapBlock('numbered-list').setBlock(type);
        } else {
          change.setBlock(type);
        }
      } else if (type === 'unorder-list') {
        // 该元素不在无序列表里
        if (!parentType || parentType !== 'bulleted-list') {
          change.wrapBlock('bulleted-list').setBlock(type);
        } else {
          change.setBlock(type);
        }
      } else if (type === 'check-list-item') {
        change.setBlock(type);
      }
      return false;
    }
  };
}

/***/ }),

/***/ "./src/utils/camcelCase.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = objToCamcelCase;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof__ = __webpack_require__("babel-runtime/helpers/typeof");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof__);

function objToCamcelCase(obj) {
  var newObj = void 0;
  if (Object.prototype.toString.call(obj) === '[object Array]') {
    newObj = [];
  } else if (Object.prototype.toString.call(obj) === '[object Object]') {
    newObj = {};
  }
  for (var key in obj) {
    var newKey = key.replace(/_./gi, function (str) {
      return str[1].toUpperCase();
    });
    if (__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof___default()(obj[key]) === 'object') {
      newObj[newKey] = objToCamcelCase(obj[key]);
    } else {
      newObj[newKey] = obj[key];
    }
  }
  return newObj;
}

/***/ }),

/***/ "./src/utils/fetch.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = myFetch;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__("babel-runtime/helpers/extends");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);

function myFetch(url, options) {
  return fetch(url, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, options, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }));
}

/***/ }),

/***/ "./src/utils/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BlockHotKey__ = __webpack_require__("./src/utils/BlockHotKey.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__BlockHotKey__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__camcelCase__ = __webpack_require__("./src/utils/camcelCase.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_1__camcelCase__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__fetch__ = __webpack_require__("./src/utils/fetch.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_2__fetch__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__markHotkey__ = __webpack_require__("./src/utils/markHotkey.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_3__markHotkey__["a"]; });





/***/ }),

/***/ "./src/utils/markHotkey.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = MarkHotkey;
function MarkHotkey(options) {
  var type = options.type,
      key = options.key;

  // Return our "plugin" object, containing the `onKeyDown` handler.

  return {
    onKeyDown: function onKeyDown(event, change, editor) {
      // Check that the key pressed matches our `key` option.
      if (!(event.metaKey || event.ctrlKey) || event.key !== key) return;
      // Prevent the default characters from being inserted.
      event.preventDefault();
      var value = editor.value;

      var selection = value.selection;
      var startKey = selection.startKey,
          endKey = selection.endKey,
          startOffset = selection.startOffset,
          endOffset = selection.endOffset;

      if (startKey === endKey && startOffset === endOffset) {
        change.select({
          anchorKey: value.startBlock.getFirstText().key,
          anchorOffset: 0,
          focusKey: value.startBlock.getFirstText().key,
          focusOffset: value.startBlock.text.length
        }).toggleMark(type).deselect().select(selection);
      } else {
        change.toggleMark(type);
      }
      return true;
    }
  };
}

/***/ }),

/***/ "./src/views/Doc/Doc.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Doc; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__("babel-runtime/helpers/extends");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_redux__ = __webpack_require__("react-redux");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Component_SparkerEditor__ = __webpack_require__("./src/Component/SparkerEditor/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__Component_Navbar__ = __webpack_require__("./src/Component/Navbar/index.js");







var _dec,
    _class,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/views/Doc/Doc.js';






var Doc = (_dec = Object(__WEBPACK_IMPORTED_MODULE_7_react_redux__["connect"])(function (state) {
  return state;
}, function (dispatch) {
  return {
    onIncrementAsync: function onIncrementAsync() {
      return dispatch({ type: 'INCREMENT_ASYNC' });
    }
  };
}), _dec(_class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_5_babel_runtime_helpers_inherits___default()(Doc, _React$Component);

  function Doc() {
    __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_classCallCheck___default()(this, Doc);

    return __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Doc.__proto__ || __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_get_prototype_of___default()(Doc)).apply(this, arguments));
  }

  __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_createClass___default()(Doc, [{
    key: 'render',
    value: function render() {
      var history = this.props.history;

      return __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(
        'div',
        { className: 'App', __source: {
            fileName: _jsxFileName,
            lineNumber: 18
          }
        },
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_9__Component_Navbar__["a" /* Navbar */], { history: history, __source: {
            fileName: _jsxFileName,
            lineNumber: 19
          }
        }),
        __WEBPACK_IMPORTED_MODULE_6_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__Component_SparkerEditor__["a" /* SparkerEditor */], __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, this.props, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 20
          }
        }))
      );
    }
  }]);

  return Doc;
}(__WEBPACK_IMPORTED_MODULE_6_react___default.a.Component)) || _class);

/***/ }),

/***/ "./src/views/Doc/DocSaga.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export delay */
/* harmony export (immutable) */ __webpack_exports__["a"] = DocSaga;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__("babel-runtime/core-js/promise");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);



var _marked = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(DocSaga);

var delay = function delay(ms) {
  return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (resolve) {
    return setTimeout(resolve, ms);
  });
};

function DocSaga() {
  return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function DocSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return delay(10000);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, this);
}

/***/ }),

/***/ "./src/views/Doc/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Doc__ = __webpack_require__("./src/views/Doc/Doc.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__DocSaga__ = __webpack_require__("./src/views/Doc/DocSaga.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__Doc__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__DocSaga__["a"]; });





/***/ }),

/***/ "./src/views/Home/DocList/CreateDocButton.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateDocButton; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__SparkComponent__ = __webpack_require__("./src/SparkComponent/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Apis__ = __webpack_require__("./src/Apis/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_prop_types__);






var _class,
    _temp2,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/views/Home/DocList/CreateDocButton.js';






var CreateDocButton = (_temp2 = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(CreateDocButton, _React$Component);

  function CreateDocButton() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, CreateDocButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = CreateDocButton.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(CreateDocButton)).call.apply(_ref, [this].concat(args))), _this), _this.handleCreateDoc = function () {
      var history = _this.props.history;

      __WEBPACK_IMPORTED_MODULE_7__Apis__["e" /* createDoc */]().then(function (res) {
        return res.json();
      }).then(function (res) {
        console.log(res);
        history.push('/doc/' + res.docId, { docId: res.docId });
      });
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(CreateDocButton, [{
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'create-doc-button', __source: {
            fileName: _jsxFileName,
            lineNumber: 25
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          __WEBPACK_IMPORTED_MODULE_6__SparkComponent__["a" /* Button */],
          { type: 'primary', onClick: this.handleCreateDoc, __source: {
              fileName: _jsxFileName,
              lineNumber: 26
            }
          },
          '\u65B0\u5EFA\u6587\u6863'
        )
      );
    }
  }]);

  return CreateDocButton;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component), _class.propTypes = {
  history: __WEBPACK_IMPORTED_MODULE_8_prop_types___default.a.object.isRequired
}, _temp2);

/***/ }),

/***/ "./src/views/Home/DocList/DocItem.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DocItem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_moment__ = __webpack_require__("moment");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_moment__);






var _class,
    _temp2,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/views/Home/DocList/DocItem.js';





var DocItem = (_temp2 = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(DocItem, _React$Component);

  function DocItem() {
    var _ref;

    var _temp, _this, _ret;

    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, DocItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (_ref = DocItem.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(DocItem)).call.apply(_ref, [this].concat(args))), _this), _this.handleGoTo = function () {
      var _this$props = _this.props,
          history = _this$props.history,
          doc = _this$props.doc;

      history.push('/doc/' + doc.docId);
    }, _temp), __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(_this, _ret);
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(DocItem, [{
    key: 'render',
    value: function render() {
      var doc = this.props.doc;

      var updateTime = __WEBPACK_IMPORTED_MODULE_7_moment___default()(doc.updateTime).format('YYYY-MM-DD HH:mm');

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'doc-item', onClick: this.handleGoTo, __source: {
            fileName: _jsxFileName,
            lineNumber: 22
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
          'div',
          { className: 'doc-card', __source: {
              fileName: _jsxFileName,
              lineNumber: 23
            }
          },
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement('div', { className: 'doc-logo', __source: {
              fileName: _jsxFileName,
              lineNumber: 24
            }
          }),
          __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
            'div',
            { className: 'doc-content', __source: {
                fileName: _jsxFileName,
                lineNumber: 25
              }
            },
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 26
                }
              },
              __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                'span',
                { className: 'doc-title', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 27
                  }
                },
                doc.name
              )
            ),
            __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 29
                }
              },
              __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
                'span',
                { className: 'doc-time', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 30
                  }
                },
                updateTime
              )
            )
          )
        )
      );
    }
  }]);

  return DocItem;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component), _class.propTypes = {
  doc: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object.isRequired,
  history: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object.isRequired
}, _temp2);

/***/ }),

/***/ "./src/views/Home/DocList/DocList.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DocList; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types__ = __webpack_require__("prop-types");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__DocItem__ = __webpack_require__("./src/views/Home/DocList/DocItem.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__CreateDocButton__ = __webpack_require__("./src/views/Home/DocList/CreateDocButton.js");






var _class,
    _temp,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/views/Home/DocList/DocList.js';


// import { connect } from 'react-redux';



// import './DocList.less';
if (false) {
  require('./DocList.less');
}
var DocList = (_temp = _class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(DocList, _React$Component);

  function DocList() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, DocList);

    return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (DocList.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(DocList)).apply(this, arguments));
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(DocList, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          docs = _props.docs,
          isLogin = _props.commonInfo.isLogin,
          history = _props.history;


      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        {
          className: 'doc-list',
          __source: {
            fileName: _jsxFileName,
            lineNumber: 24
          }
        },
        docs.map(function (doc) {
          return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__DocItem__["a" /* DocItem */], { key: doc.docId, doc: doc, history: history, __source: {
              fileName: _jsxFileName,
              lineNumber: 27
            }
          });
        }),
        isLogin && __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__CreateDocButton__["a" /* CreateDocButton */], { history: history, __source: {
            fileName: _jsxFileName,
            lineNumber: 28
          }
        })
      );
    }
  }]);

  return DocList;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component), _class.propTypes = {
  docs: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.array.isRequired,
  commonInfo: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object.isRequired,
  history: __WEBPACK_IMPORTED_MODULE_6_prop_types___default.a.object.isRequired
}, _temp);

/***/ }),

/***/ "./src/views/Home/DocList/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DocList__ = __webpack_require__("./src/views/Home/DocList/DocList.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__DocList__["a"]; });


/***/ }),

/***/ "./src/views/Home/Home.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Home; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__ = __webpack_require__("babel-runtime/core-js/object/get-prototype-of");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__ = __webpack_require__("babel-runtime/helpers/classCallCheck");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__ = __webpack_require__("babel-runtime/helpers/createClass");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__ = __webpack_require__("babel-runtime/helpers/possibleConstructorReturn");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__ = __webpack_require__("babel-runtime/helpers/inherits");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react__ = __webpack_require__("react");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_redux__ = __webpack_require__("react-redux");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Component__ = __webpack_require__("./src/Component/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__DocList__ = __webpack_require__("./src/views/Home/DocList/index.js");






var _dec,
    _class,
    _jsxFileName = '/Users/chenjigeng/Project/web/tttt/src/views/Home/Home.js';




// import './Home.less';

if (false) {
  require('./Home.less');
}

var Home = (_dec = Object(__WEBPACK_IMPORTED_MODULE_6_react_redux__["connect"])(function (state) {
  return state;
}, function (dispatch) {
  return {
    onIncrementAsync: function onIncrementAsync() {
      return dispatch({ type: 'INCREMENT_ASYNC' });
    }
  };
}), _dec(_class = function (_React$Component) {
  __WEBPACK_IMPORTED_MODULE_4_babel_runtime_helpers_inherits___default()(Home, _React$Component);

  function Home() {
    __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_classCallCheck___default()(this, Home);

    return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_possibleConstructorReturn___default()(this, (Home.__proto__ || __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_get_prototype_of___default()(Home)).apply(this, arguments));
  }

  __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_createClass___default()(Home, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          docs = _props.homeInfo.docs,
          commonInfo = _props.commonInfo,
          history = _props.history;

      return __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(
        'div',
        { className: 'home-body', __source: {
            fileName: _jsxFileName,
            lineNumber: 23
          }
        },
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__Component__["d" /* Navbar */], { history: history, __source: {
            fileName: _jsxFileName,
            lineNumber: 24
          }
        }),
        __WEBPACK_IMPORTED_MODULE_5_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_8__DocList__["a" /* DocList */], { docs: docs, commonInfo: commonInfo, history: history, __source: {
            fileName: _jsxFileName,
            lineNumber: 25
          }
        })
      );
    }
  }]);

  return Home;
}(__WEBPACK_IMPORTED_MODULE_5_react___default.a.Component)) || _class);

/***/ }),

/***/ "./src/views/Home/HomeReducer.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return actionTypes; });
/* harmony export (immutable) */ __webpack_exports__["a"] = HomeReducer;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__("babel-runtime/helpers/extends");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);

var actionTypes = {
  'UPDATE_DOC_LIST': 'UPDATE_DOC_LIST',
  'LOGOUT': 'LOGOUT',
  'LOGOUT_SUCCESS': 'LOGOUT_SUCCESS',
  'CREATE_DOC': 'CREATE_DOC',
  'CREATE_DOC_REQUEST': 'CREATE_DOC_REQUEST',
  'CREATE_DOC_SUCCESS': 'CREATE_DOC_SUCCESS',
  'CREATE_DOC_FAILURE': 'CREATE_DOC_FAILURE'
};

function HomeReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    docs: []
  };
  var action = arguments[1];

  switch (action.type) {
    case actionTypes.UPDATE_DOC_LIST:
      return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, state, {
        docs: action.payload.docs
      });
    case actionTypes.LOGOUT_SUCCESS:
      return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, state, {
        docs: []
      });
    default:
      return state;
  }
}

/***/ }),

/***/ "./src/views/Home/HomeSaga.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = HomeSaga;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);


var _marked = /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(HomeSaga);

function HomeSaga() {
  return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function HomeSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, this);
}

/***/ }),

/***/ "./src/views/Home/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Home__ = __webpack_require__("./src/views/Home/Home.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HomeSaga__ = __webpack_require__("./src/views/Home/HomeSaga.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__Home__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__HomeSaga__["a"]; });





/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./node_modules/razzle/node_modules/webpack/hot/poll.js?300");
module.exports = __webpack_require__("./src/index.js");


/***/ }),

/***/ "babel-runtime/core-js/json/stringify":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/json/stringify");

/***/ }),

/***/ "babel-runtime/core-js/object/get-prototype-of":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/object/get-prototype-of");

/***/ }),

/***/ "babel-runtime/core-js/promise":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/promise");

/***/ }),

/***/ "babel-runtime/helpers/asyncToGenerator":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/asyncToGenerator");

/***/ }),

/***/ "babel-runtime/helpers/classCallCheck":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/classCallCheck");

/***/ }),

/***/ "babel-runtime/helpers/createClass":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/createClass");

/***/ }),

/***/ "babel-runtime/helpers/defineProperty":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/defineProperty");

/***/ }),

/***/ "babel-runtime/helpers/extends":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/extends");

/***/ }),

/***/ "babel-runtime/helpers/inherits":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/inherits");

/***/ }),

/***/ "babel-runtime/helpers/possibleConstructorReturn":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/possibleConstructorReturn");

/***/ }),

/***/ "babel-runtime/helpers/typeof":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/typeof");

/***/ }),

/***/ "babel-runtime/regenerator":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),

/***/ "body-parser":
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "connect-redis":
/***/ (function(module, exports) {

module.exports = require("connect-redis");

/***/ }),

/***/ "crypto":
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "express":
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-session":
/***/ (function(module, exports) {

module.exports = require("express-session");

/***/ }),

/***/ "http":
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "moment":
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),

/***/ "mysql":
/***/ (function(module, exports) {

module.exports = require("mysql");

/***/ }),

/***/ "path":
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "prop-types":
/***/ (function(module, exports) {

module.exports = require("prop-types");

/***/ }),

/***/ "react":
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-dom":
/***/ (function(module, exports) {

module.exports = require("react-dom");

/***/ }),

/***/ "react-dom/server":
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ "react-icons/lib/go/list-ordered":
/***/ (function(module, exports) {

module.exports = require("react-icons/lib/go/list-ordered");

/***/ }),

/***/ "react-icons/lib/go/list-unordered":
/***/ (function(module, exports) {

module.exports = require("react-icons/lib/go/list-unordered");

/***/ }),

/***/ "react-icons/lib/md/format-bold":
/***/ (function(module, exports) {

module.exports = require("react-icons/lib/md/format-bold");

/***/ }),

/***/ "react-icons/lib/md/format-italic":
/***/ (function(module, exports) {

module.exports = require("react-icons/lib/md/format-italic");

/***/ }),

/***/ "react-icons/lib/md/format-underlined":
/***/ (function(module, exports) {

module.exports = require("react-icons/lib/md/format-underlined");

/***/ }),

/***/ "react-icons/lib/md/playlist-add-check":
/***/ (function(module, exports) {

module.exports = require("react-icons/lib/md/playlist-add-check");

/***/ }),

/***/ "react-icons/lib/md/search":
/***/ (function(module, exports) {

module.exports = require("react-icons/lib/md/search");

/***/ }),

/***/ "react-icons/lib/md/strikethrough-s":
/***/ (function(module, exports) {

module.exports = require("react-icons/lib/md/strikethrough-s");

/***/ }),

/***/ "react-redux":
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),

/***/ "react-router-dom":
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),

/***/ "redis":
/***/ (function(module, exports) {

module.exports = require("redis");

/***/ }),

/***/ "redux":
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),

/***/ "redux-saga":
/***/ (function(module, exports) {

module.exports = require("redux-saga");

/***/ }),

/***/ "redux-saga/effects":
/***/ (function(module, exports) {

module.exports = require("redux-saga/effects");

/***/ }),

/***/ "slate":
/***/ (function(module, exports) {

module.exports = require("slate");

/***/ }),

/***/ "slate-drop-or-paste-images":
/***/ (function(module, exports) {

module.exports = require("slate-drop-or-paste-images");

/***/ }),

/***/ "slate-paste-linkify":
/***/ (function(module, exports) {

module.exports = require("slate-paste-linkify");

/***/ }),

/***/ "slate-prism":
/***/ (function(module, exports) {

module.exports = require("slate-prism");

/***/ }),

/***/ "slate-react":
/***/ (function(module, exports) {

module.exports = require("slate-react");

/***/ }),

/***/ "socket.io":
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),

/***/ "socket.io-client":
/***/ (function(module, exports) {

module.exports = require("socket.io-client");

/***/ }),

/***/ "whatwg-fetch":
/***/ (function(module, exports) {

module.exports = require("whatwg-fetch");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map