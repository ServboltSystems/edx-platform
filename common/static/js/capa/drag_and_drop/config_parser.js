(function (requirejs, require, define) {
define(['logme'], function (logme) {
    return configParser;

    function configParser(state, config) {
        state.config = {
            'draggables': [],
            'baseImage': '',
            'targets': [],
            'onePerTarget': null, // Specified by user. No default.
            'targetOutline': true,
            'autoResize': false,
            'separateLabels': false,
            'labelBgColor': '#d6d6d6',
            'individualTargets': null, // Depends on 'targets'.
            'foundErrors': false // Whether or not we find errors while processing the config.
        };

        getDraggables(state, config);
        getBaseImage(state, config);
        getTargets(state, config);
        getOnePerTarget(state, config);
        getTargetOutline(state, config);
        getLabelBgColor(state, config);
        getAutoResize(state, config);

        setIndividualTargets(state);

        if (state.config.foundErrors !== false) {
            return false;
        }

        return true;
    }

    function getDraggables(state, config) {
        if (config.hasOwnProperty('draggables') === false) {
            logme('ERROR: "config" does not have a property "draggables".');
            state.config.foundErrors = true;
        } else if ($.isArray(config.draggables) === true) {
            config.draggables.every(function (draggable) {
                if (processDraggable(state, draggable) !== true) {
                    state.config.foundErrors = true;

                    // Exit immediately from .every() call.
                    return false;
                }

                // Continue to next .every() call.
                return true;
            });
        } else {
            logme('ERROR: The type of config.draggables is no supported.');
            state.config.foundErrors = true;
        }
    }

    function getBaseImage(state, config) {
        if (config.hasOwnProperty('base_image') === false) {
            logme('ERROR: "config" does not have a property "base_image".');
            state.config.foundErrors = true;
        } else if (typeof config.base_image === 'string') {
            state.config.baseImage = config.base_image;
        } else {
            logme('ERROR: Property config.base_image is not of type "string".');
            state.config.foundErrors = true;
        }
    }

    function getTargets(state, config) {
        if (config.hasOwnProperty('targets') === false) {
            // It is possible that no "targets" were specified. This is not an error.
            // In this case the default value of "[]" (empty array) will be used.
            // Draggables can be positioned anywhere on the image, and the server will
            // get an answer in the form of (x, y) coordinates for each draggable.
        } else if ($.isArray(config.targets) === true) {
            config.targets.every(function (target) {
                if (processTarget(state, target) !== true) {
                    state.config.foundErrors = true;

                    // Exit immediately from .every() call.
                    return false;
                }

                // Continue to next .every() call.
                return true;
            });
        } else {
            logme('ERROR: Property config.targets is not of a supported type.');
            state.config.foundErrors = true;
        }
    }

    function getOnePerTarget(state, config) {
        if (config.hasOwnProperty('one_per_target') === false) {
            logme('ERROR: "config" does not have a property "one_per_target".');
            state.config.foundErrors = true;
        } else if (typeof config.one_per_target === 'string') {
            if (config.one_per_target.toLowerCase() === 'true') {
                state.config.onePerTarget = true;
            } else if (config.one_per_target.toLowerCase() === 'false') {
                state.config.onePerTarget = false;
            } else {
                logme('ERROR: Property config.one_per_target can either be "true", or "false".');
                state.config.foundErrors = true;
            }
        } else {
            logme('ERROR: Property config.one_per_target is not of a supported type.');
            state.config.foundErrors = true;
        }
    }

    function getTargetOutline(state, config) {
        // It is possible that no "target_outline" was specified. This is not an error.
        // In this case the default value of 'true' (boolean) will be used.

        if (config.hasOwnProperty('target_outline') === true) {
            if (typeof config.target_outline === 'string') {
                if (config.target_outline.toLowerCase() === 'true') {
                    state.config.targetOutline = true;
                } else if (config.target_outline.toLowerCase() === 'false') {
                    state.config.targetOutline = false;
                } else {
                    logme('ERROR: Property config.target_outline can either be "true", or "false".');
                    state.config.foundErrors = true;
                }
            } else {
                logme('ERROR: Property config.target_outline is not of a supported type.');
                state.config.foundErrors = true;
            }
        }
    }

    function getLabelBgColor(state, config) {
        // It is possible that no "label_bg_color" was specified. This is not an error.
        // In this case the default value of '#d6d6d6' (string) will be used.

        if (config.hasOwnProperty('label_bg_color') === true) {
            if (typeof config.label_bg_color === 'string') {
                state.config.labelBgColor = config.label_bg_color;
            } else {
                logme('ERROR: Property config.label_bg_color is not of a supported type.');
            }
        }
    }

    function setIndividualTargets(state) {
        if (state.config.targets.length === 0) {
            state.config.individualTargets = false;
        } else {
            state.config.individualTargets = true;
        }
    }

    function getAutoResize(state, config) {
        // It is possible that no "auto_resize" was specified. This is not an error.
        // In this case the default value of 'true' (boolean) will be used.

        if (config.hasOwnProperty('auto_resize') === true) {
            if (typeof config.auto_resize === 'string') {
                if (config.auto_resize.toLowerCase() === 'true') {
                    state.config.autoResize = true;
                } else if (config.auto_resize.toLowerCase() === 'false') {
                    state.config.autoResize = false;
                } else {
                    logme('ERROR: Property config.auto_resize can either be "true", or "false".');
                    state.config.foundErrors = true;
                }
            } else {
                logme('ERROR: Property config.auto_resize is not of a supported type.');
                state.config.foundErrors = true;
            }
        }
    }

    function getSeparateLabels(state, config) {
        // It is possible that no "auto_resize" was specified. This is not an error.
        // In this case the default value of 'true' (boolean) will be used.

        if (config.hasOwnProperty('separate_labels') === true) {
            if (typeof config.separate_labels === 'string') {
                if (config.separate_labels.toLowerCase() === 'true') {
                    state.config.separateLabels = true;
                } else if (config.separate_labels.toLowerCase() === 'false') {
                    state.config.separateLabels = false;
                } else {
                    logme('ERROR: Property config.separate_labels can either be "true", or "false".');
                    state.config.foundErrors = true;
                }
            } else {
                logme('ERROR: Property config.separate_labels is not of a supported type.');
                state.config.foundErrors = true;
            }
        }
    }

    function isMathJax(str) {
        
        // Check string on MathJAx tags ( "\(", "\)", '[mathjaxinline]', 
        // '[/mathjaxinline]', "\[", "\]", '[mathjax]', '[/mathjax]').
        // If MathJax tags are present at the start or end of string, function 
        // return true. Otherwise, false will be returned.
        
        if(/^(\\[\(\[]|\[mathjax(inline)?\]).*(\\[\)\]]|\[\/mathjax(inline)?\])$/.test(str)){
          
          return true;  
        }
        
        return false;
    }

    function processDraggable(state, obj) {
        var mathJax;
        
        if (
            (attrIsString(obj, 'id') === false) ||
            (attrIsString(obj, 'icon') === false) ||
            (attrIsString(obj, 'label') === false) ||

            (attrIsBoolean(obj, 'can_reuse', false) === false) ||

            (obj.hasOwnProperty('target_fields') === false)
        ) {
            return false;
        }

        // Check that all targets in the 'target_fields' property are proper target objects.
        // We will be testing the return value from .every() call (it can be 'true' or 'false').
        if (obj.target_fields.every(
            function (targetObj) {
                return processTarget(state, targetObj, false);
            }
        ) === false) {
            return false;
        }

        // The short label will be used when the draggable is in the slider. If the actual
        // label is longer than 11 characters, then we will show only the first 9, followed
        // by "...".
        
        mathJax = isMathJax(obj.label);

        if (obj.label.length > 11 && !mathJax) {
            obj.shortLabel = obj.label.substring(0, 9) + '...';
        } else {
            obj.shortLabel = obj.label;
            obj.isMathJax = mathJax;
        }

        state.config.draggables.push(obj);

        return true;
    }

    // We need 'pushToState' parameter in order to simply test an object for the fact that it is a
    // proper target (without pushing it to the 'state' object). When
    //
    //     pushToState === false
    //
    // the object being tested is not going to be pushed to 'state'. The function will onyl return
    // 'true' or 'false.
    function processTarget(state, obj, pushToState) {
        if (
            (attrIsString(obj, 'id') === false) ||

            (attrIsInteger(obj, 'w') === false) ||
            (attrIsInteger(obj, 'h') === false) ||

            (attrIsInteger(obj, 'x') === false) ||
            (attrIsInteger(obj, 'y') === false) ||

            (attrIsString(obj, 'type') === false)
        ) {
            return false;
        }

        obj.type = obj.type.toLowerCase();

        if (
            (obj.type !== 'grid') &&
            (obj.type !== 'normal')
        ) {

        }

        // If this targets if of type 'grid', we need to make sure that
        // attributes 'row' and 'col' are sepecified, are integers, and that they are
        // equal to or greater than 1.
        if (obj.type === 'grid') {
            if (
                (attrIsInteger(obj, 'col') === false) ||
                (attrIsInteger(obj, 'row') === false)
            ) {
                return false;
            }

            if ((obj.col < 1) || (obj.row < 1)) {
                return false;
            }
        }

        if (pushToState !== false) {
            state.config.targets.push(obj);
        }

        return true;
    }

    function attrIsString(obj, attr) {
        if (obj.hasOwnProperty(attr) === false) {
            logme('ERROR: Attribute "obj.' + attr + '" is not present.');

            return false;
        } else if (typeof obj[attr] !== 'string') {
            logme('ERROR: Attribute "obj.' + attr + '" is not a string.');

            return false;
        }

        return true;
    }

    function attrIsInteger(obj, attr) {
        var tempInt;

        if (obj.hasOwnProperty(attr) === false) {
            logme('ERROR: Attribute "obj.' + attr + '" is not present.');

            return false;
        }

        tempInt = parseInt(obj[attr], 10);

        if (isFinite(tempInt) === false) {
            logme('ERROR: Attribute "obj.' + attr + '" is not an integer.');

            return false;
        }

        obj[attr] = tempInt;

        return true;
    }

    function attrIsBoolean(obj, attr, defaultVal) {
        if (obj.hasOwnProperty(attr) === false) {
            if (defaultVal === undefined) {
                logme('ERROR: Attribute "obj.' + attr + '" is not present.');

                return false;
            } else {
                obj[attr] = defaultVal;

                return true;
            }
        }

        if (obj[attr] === '') {
            obj[attr] = defaultVal;
        } else if ((obj[attr] === 'false') || (obj[attr] === false)) {
            obj[attr] = false;
        } else if ((obj[attr] === 'true') || (obj[attr] === true)) {
            obj[attr] = true;
        } else {
            logme('ERROR: Attribute "obj.' + attr + '" is not a boolean.');

            return false;
        }

        return true;
    }
}); // End-of: define(['logme'], function (logme) {
}(RequireJS.requirejs, RequireJS.require, RequireJS.define)); // End-of: (function (requirejs, require, define) {
