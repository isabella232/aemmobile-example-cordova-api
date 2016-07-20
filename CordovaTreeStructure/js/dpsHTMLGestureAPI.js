(function() {
	'use strict';

	var internal = internal || {};

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2015 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

/*global adobeDPSHTMLNative:true, adobeDPSHTMLNativeInitialized:true, internal */
var APIVersion = 0, APIRevision = 0;

/** Run a callback after the native API is ready.
 *
 * The callback is passed a number of milliseconds if it is delayed.
 *
 * Returns the result of the function if the API is ready,
 * otherwise it returns the defaultReturnValue provided.
 */
function waitForAdobeDPSHTMLNative(callbackFunction, defaultReturnValue) {
	if (waitForAdobeDPSHTMLNative.pendingCallbacks == null) {
		try {
			return callbackFunction(0);
		} catch (error) {
			console.error(error);
		}
	} else {
		waitForAdobeDPSHTMLNative.pendingCallbacks.push({ callback: callbackFunction, time: Date.now() });
	}

	return defaultReturnValue;
}

waitForAdobeDPSHTMLNative.pendingCallbacks = [];

/** initializes the native API after it is set on the window.
 *
 * Calls setAPIVersion with the current APIVersion and APIRevision.
 * Then checks if adobeDPSHTMLNative.waitForInitialization is set,
 * if it is, it expects or waits for a global function adobeDPSHTMLNativeInitialized(callback)
 * to be set on the window, which will run a callback
 * which finally opens the gates on waitForAdobeDPSHTMLNative and runs the callbacks.
 *
 * If waitForInitialization is not set, then the callbacks are run immediately.
 *
 * The first callback should be invoking the customize('adobeDPSHTML') code.
 */
function initializeNativeAPI() {
	function runPendingCallbacks() {
		var pendingCallbacks = waitForAdobeDPSHTMLNative.pendingCallbacks,
			now;

		waitForAdobeDPSHTMLNative.pendingCallbacks = null;

		if (pendingCallbacks.length > 0) {
			now = Date.now();
			pendingCallbacks.forEach(function(info) {
				var callbackFunction = info.callback,
					delay = Math.min(1, now - info.time);

				try {
					callbackFunction(delay);
				} catch (error) {
					console.error(error);
				}
			});
		}
	}

	if (typeof adobeDPSHTMLNative.setAPIVersion === 'function') {
		adobeDPSHTMLNative.setAPIVersion(APIVersion, APIRevision);
	}

	if (adobeDPSHTMLNative.waitForInitialization) {
		if (window.adobeDPSHTMLNativeInitialized) {
			adobeDPSHTMLNativeInitialized(function() {
				runPendingCallbacks();
			});
		} else {
			Object.defineProperty(window, 'adobeDPSHTMLNativeInitialized', {
				set: function(adobeDPSHTMLNativeInitialized) {
					delete window.adobeDPSHTMLNativeInitialized;
					window.adobeDPSHTMLNativeInitialized = adobeDPSHTMLNativeInitialized;

					adobeDPSHTMLNativeInitialized(function() {
						runPendingCallbacks();
					});
				},
				configurable: true
			});
		}
	} else {
		runPendingCallbacks();
	}
}

/* if adobeDPSHTMLNative is still unset, then we wait for it to be set
 * before calling initializeNativeAPI(), if it is set, we can begin
 * initialization immediately.
 */
if (typeof adobeDPSHTMLNative === 'undefined') {
	Object.defineProperty(window, 'adobeDPSHTMLNative', {
		get: function() {
			return undefined;
		},
		set: function(value) {
			if (!value) {
				return;
			}

			delete window.adobeDPSHTMLNative;

			window.adobeDPSHTMLNative = value;

			initializeNativeAPI();
		},
		configurable: true,
		enumerable: true
	});
} else {
	initializeNativeAPI();
}

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2015 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

/*global internal */
internal.SignalBinding = (function() {
	'use strict';

	function SignalBinding(signal, listener, isOnce, listenerContext, priority) {

		this._listener = listener;

		this._isOnce = isOnce;

		this.context = listenerContext;

		this._signal = signal;

		this._priority = priority || 0;

		this.active = true;

		this.params = null;
	}

	SignalBinding.prototype.execute = function(paramsArr) {
		var handlerReturn,
			params,
			context;

		if (this.active && !!this._listener) {
			params = this.params? this.params.concat(paramsArr) : paramsArr;
			context = (this.context !== undefined) ? this.context : window;
			handlerReturn = this._listener.apply(context, params);
			if (this._isOnce) {
				this.detach();
			}
		}
		return handlerReturn;
	};

	SignalBinding.prototype.detach = function() {
		return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
	};

	SignalBinding.prototype.isBound = function() {
		return (!!this._signal && !!this._listener);
	};

	SignalBinding.prototype.getListener = function() {
		return this._listener;
	};

	SignalBinding.prototype._destroy = function() {
		delete this._signal;
		delete this._listener;
		delete this.context;
	};

	SignalBinding.prototype.isOnce = function() {
		return this._isOnce;
	};

	SignalBinding.prototype.toString = function() {
		return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
	};

	return SignalBinding;
})();

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2015 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

/*global internal, SignalBinding */
internal.Signal = (function() {
	'use strict';

	function Signal() {
		this._bindings = [];

		this._prevParams = null;

		this.memorize = false;

		this._shouldPropagate = true;

		this.active = true;
	}

	Signal.prototype._registerListener = function(listener, isOnce, listenerContext, priority) {
		var prevIndex = this._indexOfListener(listener, listenerContext),
			binding;

		if (prevIndex !== -1) {
			binding = this._bindings[prevIndex];
			if (binding.isOnce() !== isOnce) {
				throw new Error('You cannot add' + (isOnce? '' : 'Once') + '() then add' + (!isOnce? '' : 'Once') + '() the same listener without removing the relationship first.');
			}
		} else {
			binding = new internal.SignalBinding(this, listener, isOnce, listenerContext, priority);
			this._addBinding(binding);
		}

		if (this.memorize && this._prevParams) {
			binding.execute(this._prevParams);
		}

		return binding;
	};

	Signal.prototype._addBinding = function(binding) {
		//simplified insertion sort
		var n = this._bindings.length;
		do { --n; } while (this._bindings[n] && binding._priority <= this._bindings[n]._priority);
		this._bindings.splice(n + 1, 0, binding);
	};

	Signal.prototype._indexOfListener = function(listener, context) {
		var n = this._bindings.length,
			cur;
		while (n--) {
			cur = this._bindings[n];
			if (cur._listener === listener && cur.context === context) {
				return n;
			}
		}
		return -1;
	};

	Signal.prototype.has = function(listener, context) {
		return this._indexOfListener(listener, context) !== -1;
	};

	Signal.prototype.add = function(listener, listenerContext, priority) {
		this.validateListener(listener, 'add');
		return this._registerListener(listener, false, listenerContext, priority);
	};

	Signal.prototype.addOnce = function(listener, listenerContext, priority) {
		this.validateListener(listener, 'addOnce');
		return this._registerListener(listener, true, listenerContext, priority);
	};

	Signal.prototype.remove = function(listener, context) {
		this.validateListener(listener, 'remove');

		var i = this._indexOfListener(listener, context);
		if (i !== -1) {
			this._bindings[i]._destroy(); //no reason to a SignalBinding exist if it isn't attached to a signal
			this._bindings.splice(i, 1);
		}
		return listener;
	};

	Signal.prototype.removeAll = function() {
		var n = this._bindings.length;
		while (n--) {
			this._bindings[n]._destroy();
		}
		this._bindings.length = 0;
	};

	Signal.prototype.getNumListeners = function() {
		return this._bindings.length;
	};

	Signal.prototype.halt = function() {
		this._shouldPropagate = false;
	};

	Signal.prototype.dispatch = function() {
		if (!this.active) {
			return;
		}

		var paramsArr = Array.prototype.slice.call(arguments),
			n = this._bindings.length,
			bindings;

		if (this.memorize) {
			this._prevParams = paramsArr;
		}

		if (!n) {
			//should come after memorize
			return;
		}

		bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch
		this._shouldPropagate = true; //in case `halt` was called before dispatch or during the previous dispatch.

		//execute all callbacks until end of the list or until a callback returns `false` or stops propagation
		//reverse loop since listeners with higher priority will be added at the end of the list
		do { n--; } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
	};

	Signal.prototype.forget = function() {
		this._prevParams = null;
	};

	Signal.prototype.dispose = function() {
		this.removeAll();
		delete this._bindings;
		delete this._prevParams;
	};

	Signal.prototype.toString = function() {
		return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
	};

	Signal.prototype.validateListener = function(listener, fnName) {
		if (typeof listener !== 'function') {
			throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
		}
	};

	return Signal;
})();

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2015 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

/*global adobeDPSHTMLNative, internal, Signal */
internal.adobeDPSHTML = (function() {
	'use strict';

	var eventsToSuppress = {
		click: true,
		mouseup: true,
		touchend: true,
		mousemove: true,
		touchmove: true
	}, eventsToRelinquish = {
		touchdown: true,
		mousedown: true
	};

	function adobeDPSHTML() {
	}

	adobeDPSHTML.prototype.addEventHandlers = function(element, eventsMap, eventHandler, onCapture) {
		if (typeof element.addEventListener === 'function') {
			for (var eventName in eventsMap) {
				if (eventsMap.hasOwnProperty(eventName)) {
					console.log('- adding handler {%s} for element {%s}', eventName, element.tagName);
					element.addEventListener(eventName, eventHandler, onCapture);
				}
			}
		}
	};

	adobeDPSHTML.prototype.removeEventHandlers = function(element, eventsMap, eventHandler, onCapture) {
		if (typeof element.removeEventListener === 'function') {
			for (var eventName in eventsMap) {
				if (eventsMap.hasOwnProperty(eventName)) {
					console.log('- removing handler {%s} for element {%s}', eventName, element.tagName);
					element.removeEventListener(eventName, eventHandler, onCapture);
				}
			}
		}
	};

	// TODO: remove pre-defined logic.
	adobeDPSHTML.prototype.disableNavigationForElement = function(element) {
		/**
		* Add a disableViewerNavigation on the element.
		* This can be used to check whether navigation is enabled for that object
		*/
		element.disableViewerNavigation = true;

		console.log('disableNavigation for element {%s}', element.tagName);
		this.addEventHandlers(element, eventsToSuppress, this.suppressEventFromViewer);
		this.removeEventHandlers(element, eventsToRelinquish, this.relinquishCurrentGesture);
	};

	// TODO: remove pre-defined logic.
	adobeDPSHTML.prototype.enableNavigationForElement = function(element) {
		/**
		* Set disableViewerNavigation on the element to false.
		* This can be used to check whether navigation is enabled for that object
		*/
		element.disableViewerNavigation = false;

		console.log('enableNavigation for element {%s}', element.tagName);
		this.removeEventHandlers(element, eventsToSuppress, this.suppressEventFromViewer);
		this.addEventHandlers(element, eventsToRelinquish, this.relinquishCurrentGesture);
	};

	/**
	 * Signal to be called when navigation has completed.
	 * Timing of signal firing is platform-specific.
	 * On some platforms, this signal may fire before
	 * completion of setViewerNavigationEnabled().
	 */
	adobeDPSHTML.prototype.navigationChangedSignal = new internal.Signal();
	adobeDPSHTML.prototype.navigationChangedSignal.memorize = true;

	/**
	 * Enables the viewer navigation paradigm for the parameterized element,
	 * meaning navigation on the element will be handled by the viewer.
	 *
	 * By default, viewer navigation is enabled.
	 * This call will have no effect when viewer navigation is already enabled.
	 */
	adobeDPSHTML.prototype.enableNavigation = function(elements) {
		var elementList,
			elementIndex = 0,
			element;

		if (Array.isArray(elements)) {
			elementList = elements;
		} else {
			elementList = [elements];
		}

		if (typeof elements === 'undefined') {
			console.log('enableNavigation for all content');
			return this.setViewerNavigationEnabled(true);
		} else {
			for (elementIndex; elementIndex < elementList.length; elementIndex++) {
				element = elementList[elementIndex];
				this.enableNavigationForElement(element);
			}
		}
	};

	/**
	 * Disables the viewer navigation paradigm for this page context,
	 * meaning navigation on this page content will NOT be handled by the viewer.
	 * Instead the content will need to handle navigation,
	 * using the other methods within this API.
	 *
	 * By default, viewer navigation is enabled.
	 * This call will have no effect when viewer navigation is already disabled.
	 */
	adobeDPSHTML.prototype.disableNavigation = function(elements) {
		var elementList,
			elementIndex = 0,
			element;

		if (Array.isArray(elements)) {
			elementList = elements;
		} else {
			elementList = [elements];
		}

		if (typeof elements === 'undefined') {
			console.log('disableNavigation for all content');
			return this.setViewerNavigationEnabled(false);
		} else {
			for (elementIndex; elementIndex < elementList.length; elementIndex++) {
				element = elementList[elementIndex];
				this.disableNavigationForElement(element);
			}
		}
	};

	/**
	 * viewer-level event suppression for the parameter object.
	 * Viewer-level event suppression means that the event will be reported
	 * to the viewer as already consumed, so the viewer should not respond
	 * to the event.
	 * Viewer-level event suppression has no impact on how the HTML/JS
	 * content handles the event.
	 */
	adobeDPSHTML.prototype.suppressEventFromViewer = function(event) {
		if (!event.ADOBEDMPNS) {
			event.ADOBEDMPNS = {};
		}
		// We set this flag here, and then the JavaScript
		// bridge looks for it before forwarding events
		// to the Viewer.
		event.ADOBEDMPNS.suppressEventFromViewer = true;
	};

	/**
	 * Relinquish control of the current gesture to the DPS (2015) Viewer. DPS (2015) Viewer should then
	 * respond to the current gesture. (Not supported in the Windows viewer)
	 */
	adobeDPSHTML.prototype.relinquishCurrentGesture = function() {
		return adobeDPSHTMLNative.relinquishCurrentGesture();
	};

	adobeDPSHTML.prototype.setViewerNavigationEnabled = function(enabled) {
		return adobeDPSHTMLNative.setViewerNavigationEnabled(enabled);
	};

	/**
	 * The navigation paradigm for this page context.
	 * When false, the viewer’s default gesture-based navigation is turned off,
	 * and navigation will instead be left to this page context.
	 * When false, this page context will need to use the navigation API
	 * described below to allow navigation away from HTML/JS content.
	 *
	 * By default, viewer navigation is enabled (true).
	 * Returns enabled Whether viewer navigation is enabled. Default is true.
	 */
	adobeDPSHTML.prototype.isNavigationEnabled = function() {
		return adobeDPSHTMLNative.isViewerNavigationEnabled();
	};

	/**
	 * Instruct DPS (2015) Viewer to toggle navigation UI. Navigation UI typically includes a HUD.
	 */
	adobeDPSHTML.prototype.toggleNavigationUI = function() {
		return adobeDPSHTMLNative.toggleNavigationUI();
	};

	return adobeDPSHTML;
})();

/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2015 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

/* global internal, waitForAdobeDPSHTMLNative */
internal.Gesture = (function() {
	'use strict';

	var internalGesture = new internal.adobeDPSHTML();

	function Gesture() {}

	/**
	 * Enables the viewer navigation paradigm for the parameterized element,
	 * meaning navigation on the element will be handled by the viewer.
	 *
	 * By default, viewer navigation is enabled.
	 * This call will have no effect when viewer navigation is already enabled.
	 */
	Gesture.prototype.enableNavigation = function(elements) {
		return waitForAdobeDPSHTMLNative(function() {
			internalGesture.enableNavigation(elements);
		});
	};

	/**
	 * Disables the viewer navigation paradigm for this page context,
	 * meaning navigation on this page content will NOT be handled by the viewer.
	 * Instead the content will need to handle navigation,
	 * using the other methods within this API.
	 *
	 * By default, viewer navigation is enabled.
	 * This call will have no effect when viewer navigation is already disabled.
	 */
	Gesture.prototype.disableNavigation = function(elements) {
		return waitForAdobeDPSHTMLNative(function() {
			internalGesture.disableNavigation(elements);
		});
	};

	/**
	 * Relinquish control of the current gesture to the DPS (2015) Viewer.
	 * DPS (2015) Viewer should then respond to the current gesture.
	 *
	 * Not supported in the Windows viewer.
	 */
	Gesture.prototype.relinquishCurrentGesture = function() {
		return waitForAdobeDPSHTMLNative(function() {
			internalGesture.relinquishCurrentGesture();
		});
	};

	/**
	 * Instruct DPS (2015) Viewer to toggle navigation UI.
	 * Navigation UI typically includes a HUD.
	 */
	Gesture.prototype.toggleNavigationUI = function() {
		return waitForAdobeDPSHTMLNative(function() {
			internalGesture.toggleNavigationUI();
		});
	};

	/**
	 * The navigation paradigm for this page context.
	 * When false, the viewer’s default gesture-based navigation is turned off,
	 * and navigation will instead be left to this page context.
	 * When false, this page context will need to use the navigation API
	 * described below to allow navigation away from HTML/JS content.
	 *
	 * By default, viewer navigation is enabled (true).
	 * Returns enabled Whether viewer navigation is enabled. Default is true.
	 */
	Gesture.prototype.isNavigationEnabled = function() {
		return waitForAdobeDPSHTMLNative(function() {
			return internalGesture.isNavigationEnabled();
		}, true);
	};

	/**
	 * Signal to be called when navigation has completed.
	 * Timing of signal firing is platform-specific.
	 * On some platforms, this signal may fire before
	 * completion of setViewerNavigationEnabled().
	 */
	Gesture.prototype.navigationChangedSignal = internalGesture.navigationChangedSignal;

	return Gesture;
}());


	waitForAdobeDPSHTMLNative(function() {
		if (typeof adobeDPSHTMLNative.customize === 'function') {
			var customizeCode = adobeDPSHTMLNative.customize('internal'),
				customizeAction = new Function('internal', customizeCode);
			customizeAction(internal);
		}
	});

	window.adobeDPS = window.adobeDPS || {};
	window.adobeDPS.Gesture = new internal.Gesture();
}());
