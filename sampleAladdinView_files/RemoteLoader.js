/********************************************************************
 * Last edited by: $Author: wjackter $
 *             on: $Date: 2013/06/18 14:53:13 $
 *       Filename: $RCSfile: RemoteLoader.js,v $
 *       Revision: $Revision: 1.27 $
 ********************************************************************
 *
 *  DESCRIPTION: Creates frames to use for loading data without refreshing the page
 *
 *  SYNOPSIS:
 *     1. Create the Loader with a base URL
 *     var Loader = new RemoteLoader('remote1','/weblications/RemoteLoader.epl');
 *
 *     2. Set any global URL paramters
 *     Loader.setUrlParam('portfolio_code','100');
 *
 *     2. Define the dataLoader function.  This is the callback that gets called when
 *     the target page is loaded.  It determines what is done with the contents of
 *     the target page.  The two parameters, content and oArgs are the content* of
 *     the remote file and an object of arguments (think perl hash) that the user
 *     passed to the getRemoteData() method.
 *
 *
 *     Loader.dataLoader    = function(content,oArgs) {
*         document.getElementById(oArgs['id']).innerHTML = content;
*     }
 *
 *     * The content is actually the innerHTML of the RemoteLoaderData div
 *     For more info on the XMLHTTPRequest class go to:
 *     http://msdn.microsoft.com/library/default.asp?url=/library/en-us/xmlsdk30/htm/xmobjpmexmlhttprequest.asp
 *
 *     3. Set up the getRemoteData() method call. which takes an id and an object
 *        of parameters to send to the requested page.
 *     ...
 *     <script>
 *         // We use an object to store the parameters for getRemoteData
 *         // Thing of it as a perl hash...  This allows us to have an
 *         // arbitrary number of named parameters allowing the API to evolve
 *         // without breaking old code
 *         var    [+ $thisObj->{'id'} +]_params              = new Object;
 *
 *         // These get passed into the callback routine along with the resultant xdoc
 *         oParams.callbackArgs     = new Object;
 *         oParams.callbackArgs.id  = '[+ $thisObj->{'id'} +]';
 *
 *         // These are the CGI parameters for the remote file we're loading
 *         oParams.urlParams             = new Object;
 *         oParams.urlParams.compl_tag   = '[+ $thisObj->{'compl_tag'} +]';
 *         oParams.urlParams.compl_chkpt = '[+ $thisObj->{'compl_chkpt'} +]'
 *         oParams.urlParams.key         = '[+ $thisObj->{'key'} +]'
 *         // If you wish to use remote loader in a non-asynchronous way
 *         // Set this to false if you want to call another function that
 *         // checks a value that's set by the remote loader
 *         // This value is set to true by default
 *      oParams.urlParams.asynchronous_call = true
 *
 *         // You can override the baseUrl on a case by case basis
 *         oParams.baseUrl = '/weblications/AlternateRemoteLoader.epl';
 *
 *     </script>
 *     [# set the event handler directly #]
 *     <button onClick='Loader.getRemoteData(event,[+ $thisObj->{'id'} +]_params);' value='Do it'>
 *
 *     [#
 *         Or you can use a function reference. Use a closure to preserve your references.
 *      #]
 *
 *     <div id='obj_1' class='button'>Just Do It!</div>
 *     <script>
 *         document.getElementById('obj_1').onclick = function(evt) {
*                 evt = evt ? evt : event;
*                 Loader.getRemoteData(evt,[+ $thisObj->{'id'} +]_params);
*         }
 *     </script>
 *     ...
 *
 *     4. getRemoteData will load the file .  The epl should call loadDataFromRemote() onLoad
 *        which in turn calls the dataLoader() function you defined above
 *     <script>
 *         function loadFromRemote() {
*             var rrl = new RemoteLoader('[+ $fdat{'RemoteLoaderId'} +]','[+ $fdat{'RemoteLoaderDataWindow'} +]');
*             rrl.loadDataFromRemote(window);
*         }
 *     </script>
 *
 *     6. getRemoteDataElement() will give you the HTML element that contains your loaded data
 *
 */
if (typeof(getType) == 'undefined') {
    alert("RemoteLoader requires the js_utils.js library");
}


/*    This supports the iFrame based retrieval.
 We need to keep a global list of callback routines so that
 the iFrame knows what callback to call.  These ids are
 used as indexes into RL_CALLBACKARGS
 */
if (document.RL_IDS == null) {
    document.RL_IDS = 0;
}


/*
 RemoteLoader Constructor
 Params:
 id      - An identifier for the RemoteLoader object
 This supports having multiple RemoteLoaders
 associated with one DOM element
 baseUrl - The base url (not including any cgi params)
 of the file we wish to load
 Returns:
 RemoteLoader object

 */
function RemoteLoader(id, baseUrl) {

    return this._init(id, baseUrl);
    ;
}

/*
 Object Initializer
 Params:  See constructor
 Returns: See constructor
 */
RemoteLoader.prototype._init = function (id, baseUrl) {

    // Check for and return a cached version of this RemoteLoader
    if (document.RL_LOADERS == null) {
        document.RL_LOADERS = new Array();
    } else {
        var rl = document.RL_LOADERS != null ? document.RL_LOADERS[id] : null;
        if (rl != null) {
            return rl;
        }
    }
    this.debug = false;
    this.id = id;
    this.baseUrl = baseUrl;
    this.doc = document;
    this.urlParams = new Object;
    this.callbackArgs = new Object;
    this.framesInitialized = false;
    this.METHOD = 'GET';

    // Save the object in cache
    document.RL_LOADERS[id] = this;

    return this;
}

// dataLoader() stub method
// This should always be overridden so it pops an alert if it's not
RemoteLoader.prototype.dataLoader = function (xdoc, key) {
    alert("dataLoader() is not defined for this RemoteLoader. \nTrying to load with key '" + key + "'.");
}


/*
 setUrlParam()
 Adds a param to the list of CGI variables

 Params:  sName  - name of parameter
 sValue - value of parameter
 Returns: nothing
 */
RemoteLoader.prototype.setUrlParam = function (sName, sValue) {
    this.urlParams[sName] = sValue;
}

/*
 getUrlParam()
 Gets the value of a CGI param

 Params:  sName  - name of parameter
 Returns: value of a single parameter
 */
RemoteLoader.prototype.getUrlParam = function (sName) {
    return this.urlParams[sName];
}

/*
 getUrlParams()
 Returns the urlParams object (think perl hash)

 Params:  none
 Returns: urlParams object
 */
RemoteLoader.prototype.getUrlParams = function () {
    return this.urlParams;
}

/*
 setCallbackArg()
 Adds a param to the list of CGI variables

 Params:  sName  - name of parameter
 sValue - value of parameter
 Returns: nothing
 */
RemoteLoader.prototype.setCallbackArg = function (sName, sValue) {
    this.callbackArgs[sName] = sValue;
}

/*
 getCallbackArg()
 Gets the value of a CGI param

 Params:  sName  - name of parameter
 Returns: value of a single parameter
 */
RemoteLoader.prototype.getCallbackArg = function (sName) {
    return this.callbackArgs[sName];
}

/*
 getCallbackArgs()
 Returns the callbackArgs object (think perl hash)

 Params:  none
 Returns: callbackArgs object
 */
RemoteLoader.prototype.getCallbackArgs = function () {
    return this.callbackArgs;
}

/////////////////////////////////////////////////////////////////////

/*
 getRemoteData()
 Initiates the retrieval of the remote file

 Params:  evt - Either an event object or the id of the target element
 paramsObject - An object (hash) of parameters itself consisiting of
 - baseUrl - String override of this.baseUrl
 - urlParams - Object of CGI param/values to include in url
 - callbackArgs - Object of param/values to pass into to the callback
 Returns: nothing
 */
RemoteLoader.prototype.getRemoteData = function (evt, params) {
    if (typeof evt == "string") {
        if (this.debug) {
            alert('evt\n\n' + evt);
        }
        elem = document.getElementById(evt);
    } else {
        evt = evt ? evt : event ? event : null;
        elem = (evt.target) ? evt.target : (evt.srcElement) ? evt.srcElement : evt.toElement;
    }
    this.retrieveData(elem, params);
}

RemoteLoader.prototype.retrieveData = function (elem, params) {
    if (params == null) {
        params = new Object;
    }
    if (this.debug) {
        alert('getRemoteData(params)\n\n' + params);
    }
    var baseUrl = params.baseUrl ? params.baseUrl : this.baseUrl;
    var urlParams = params.urlParams ? params.urlParams : this.urlParams ? this.urlParams : new Object;
    var callbackArgs = params.callbackArgs ? params.callbackArgs : this.callbackArgs ? this.callbackArgs : new Object;

    if (this.debug) {
        alert('getRemoteData(params)\n\n' + params);
    }
    if (elem == null) {
        elem = params.elem;
        if (elem == null) {
            if (this.debug) {
                alert('NOT_READY ' + params.elem);
            }
            return 'NOT_READY';
        }
    }

    if (this.debug) {
        alert(urlParams + "\n\n" + params);
    }

    // Long Web process for chassis will break without this wrapper.
    // It sets some HTTP-EQUIV values that lwp4chassis needs to avoid
    // some ie behavioral odditities
    if (!this.no_url_substitution) {
        urlParams.filename = baseUrl;
        baseUrl = "/weblications/RemoteLoader/RemoteLoader.epl";
    }
//    alert(baseUrl);
    // //////////////////////////////////////////////////////////////
//    alert('RemoteLoader\n' +this.id + 'localdata\n' + elem.getAttribute(this.id + 'localdata'));
    if (elem.getAttribute(this.id + 'localdata') == null) {

        // Get the Global URL paramters from this RemoteLoader object
        var globalUrlParams = this.getUrlParams();
        for (m in globalUrlParams) {
            urlParams[m] = globalUrlParams[m];
        }

        this.loadRemoteFile(baseUrl, urlParams, callbackArgs);
    }
}

/*
 loadRemoteFile()
 Does the heavy lifting:
 - Adds urlParams to the baseUrl
 - Sets up the callback function with arguments
 - Determines the appropriate method of retrival and executes

 Params:
 baseUrl - String override of this.baseUrl
 urlParams - Object of CGI param/values to include in url
 callbackArgs - Object of param/values to pass into to the callback
 Returns: false on error
 */

RemoteLoader.prototype.loadRemoteFile = function (baseUrl, urlParams, callbackArgs) {
    var ajaxURL = urlParams.filename || baseUrl;
    try {
        delete urlParams.filename;
    } catch (exp) {
        // Nothing to log, just using try / catch as a safety net to remove the filename property
    }
    var aUrlParams = new Array();
    var asynchronousCall = true;
    // Get any URL paramters passed into the method
    for (m in urlParams) {
        // getType is in js_utils.js
        if (getType(urlParams[m]) == 'Array') {
            for (var i = 0; i < urlParams[m].length; i++) {
                aUrlParams.push(m + "=" + urlParams[m][i]);
            }
        } else {
            aUrlParams.push(m + "=" + urlParams[m]);
            if (m == 'asynchronous_call') {
                asynchronousCall = false;
            }
        }
    }
    var params = '';
    if (aUrlParams.length > 0) {
        params = aUrlParams.join('&');
    }
    var callback = this.dataLoader;

    if (ajaxURL.charAt(0) !== "/") {
        ajaxURL = "/" + ajaxURL;
    }
    if (this.METHOD == 'GET') {
        if (params) {
            ajaxURL += "?" + params;
        }
    }
    var xmlhttp = false;
    // JScript gives us Conditional compilation, we can cope with old IE versions.
    // and security blocked creation of the objects.
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }

    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    no_url_substitution = this.no_url_substitution;
    suppressErrors = this.suppressErrors;
    xmlhttp.onreadystatechange = function () {
//        document.getElementById('status').innerHTML += "<br>xmlhttp.readyState = " + xmlhttp.readyState;
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status != '200') {
                if (!suppressErrors) {
                    alert("Error return status: " + xmlhttp.status + " - [" + ajaxURL + "] Please check the error log ");
                }

                xmlhttp = null;
                return false;
            }

            var content = no_url_substitution ? xmlhttp : xmlhttp.responseText;
            if (content.charAt && content.charAt(content.length - 1).search(/\n/) === 0) {
                content = content.substring(0, content.length - 1);
            }
            callback(content, callbackArgs);

            xmlhttp = null; //this seals off a substantial memory leak in IE
        }
    }
    xmlhttp.open(this.METHOD, ajaxURL, asynchronousCall);

    if (this.METHOD == 'POST') {
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }

    try {
        xmlhttp.send(params);
    } catch (e) {
        alert('Error: ' + e.message);
    }
}


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
// Used if the browser doesn't support the XMLHTTPRequest object
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/*
 loadFrame()
 Gets the iFrame object, adds some params to the url
 and sets the iFrames src to the url (thus loading the document)

 Params:
 fullUrl - String of the baseUrl + URL params
 reqId - Unique, global request Id
 Returns: false if ther is no frame, true if there is a frame
 */
RemoteLoader.prototype.loadFrame = function (fullUrl, reqId) {
    var frame = this.getFrame(fullUrl, reqId);
    if (frame == null) {
        return false;
    }
    fullUrl += fullUrl.match(/\?/) ? '&' : '?';
    fullUrl += 'frameId=' + frame.id;
    fullUrl += '&reqId=' + reqId;
    frame.src = fullUrl;

    // register the frame and up the frame count
    this.frames[reqId] = frame;
    this.frame_cnt++;

    return true;
}

/*
 getFrame()
 Gets the frame indicated by reqId if it is in use,
 else gets a frame from the pool, else creates a new
 frame if not frame_max_cnt

 Params:
 fullUrl - String of the baseUrl + URL params
 reqId - Unique, global request Id
 Returns: a frame, or null if all frames are busy
 */
RemoteLoader.prototype.getFrame = function (fullUrl, reqId) {
    // If all frames are busy, we exit
    if (this.frame_cnt == this.frame_max_cnt) {
        return null;
    }

    // Get the frame if it's already defined;
    var frame = this.frames[reqId] ? this.frames[reqId] : null;

    // Get a free frame from the pool
    if (frame == null) {
        frame = this.pool.shift();
    }

    // No busy frames and no free frames equals no frames at all
    // so create a new one
    if (frame == null) {
        var div = document.createElement('div');
        div.id = reqId + '_DIV';
        div.style.display = 'none';
        document.body.appendChild(div);

        frame = document.createElement('iframe');
        frame.id = reqId;
        frame.name = frame.id;
        div.appendChild(frame);
    }
    return frame;
}

/*
 loadDataFromRemote()
 iFrames implementation only supports loading of epls
 The epl calls loadDataFromRemote() onLoad which then
 determines the appropriate callback function and calls
 it with the appropriate callback arguments and content
 of the loaded epl

 Params:
 win - reference to the loaded epl's window object
 Returns: nothing
 */
RemoteLoader.prototype.loadDataFromRemote = function (win) {
    // Using the index of '?' in the href we get the
    // Query string and parse it to return the arguments
    // that were passed to the remote loader
    var idx = win.location.href.indexOf('?');
    var aUrlArgs = new Array();
    if (idx != -1) {
        var pairs = win.location.href.substring(idx + 1, win.location.href.length).split('&');
        for (var i = 0; i < pairs.length; i++) {
            nameVal = pairs[i].split('=');
            aUrlArgs[i] = nameVal[1];
            aUrlArgs[nameVal[0]] = nameVal[1];
        }
    }
    var oArgs = document.RL_CALLBACKARGS[aUrlArgs['reqId']];
    var s = '';
    for (var i in oArgs) {
        s += i + " = " + oArgs[i] + "\n";
    }

    // Make sure we've got our (i)frame
    if (this.frames[aUrlArgs['reqId']] == null) {
        return;
    }

    // call the callback with the data and arguments
    this.dataLoader(win.document.getElementById('RemoteLoaderData').innerHTML, oArgs);
    this.pool.push(this.frames[oArgs['frameId']]);
    this.frame_cnt--;
}
