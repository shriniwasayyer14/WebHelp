WebHelp
=======

A framework that the web tools could use to easily provide information about help, demo and new features. The aim is that any new user visiting a tool should become familiar with the tool quickly and should have a low barrier to understand the tool.

Public Methods
==============
## Classes
<dl>
<dt><a href="#[WebHelp]">[WebHelp]</a></dt>
<dd><p>WebHelp</p>
</dd>
</dl>
## Objects
<dl>
<dt><a href="#WebHelp">WebHelp</a> : <code>object</code></dt>
<dd></dd>
</dl>
<a name="[WebHelp]"></a>
## [WebHelp]
WebHelp

**Kind**: global class
**this**: <code>[WebHelp](#WebHelp)</code>
<a name="new_[WebHelp]_new"></a>
### new [WebHelp](WebHelpOptions)
Creates the WebHelp object with the specified settings


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| WebHelpOptions | <code>Object</code> |  | The configuration options for WebHelp |
| [WebHelpOptions.appName] | <code>String</code> | <code>&#x27;DefaultApp&#x27;</code> | The App name that you wish to use for your app |
| [WebHelpOptions.sequencesBaseUrl] | <code>String</code> | <code>&#x27;/WebHelp/&#x27;</code> | The URL you wish to pull your sequence file from |
| [WebHelpOptions.visitedBaseUrl] | <code>String</code> | <code>&#x27;/weblications/etc/getPrefs.epl&#x27;</code> | The URL you wish to pull your   visited sequences from |
| [WebHelpOptions.usesFontAwesome] | <code>Boolean</code> | <code>false</code> | Does your app use Font Awesome ? (Defaults to bootstrap   glyphicons if not) |
| [WebHelpOptions.usesIframes] | <code>Boolean</code> | <code>false</code> | Does your app use iframes ? (Used for some additional   workarounds) |
| [WebHelpOptions.usesFlexbox] | <code>Boolean</code> | <code>false</code> | Does your app use flexbox ? (Used for some additional   workarounds) |

<a name="WebHelp"></a>
## WebHelp : <code>object</code>
**Kind**: global namespace

* [WebHelp](#WebHelp) : <code>object</code>
  * [.showSequenceConsumptionModal()](#WebHelp+showSequenceConsumptionModal)
  * [.getVisitedSequences()](#WebHelp+getVisitedSequences) ? <code>Array</code>
  * [.getSequenceIdForSequenceName(sequenceName)](#WebHelp+getSequenceIdForSequenceName) ? <code>int</code>
  * [.getSequenceNameForSequenceId(sequenceId)](#WebHelp+getSequenceNameForSequenceId) ? <code>String</code>
  * [.isSequenceAlreadyViewed(options)](#WebHelp+isSequenceAlreadyViewed) ? <code>Boolean</code>
  * [.playSequence(nameOrId)](#WebHelp+playSequence)

<a name="WebHelp+showSequenceConsumptionModal"></a>
### webHelp.showSequenceConsumptionModal()
Programmatically trigger the sequence list modal when in consumption mode

**Kind**: instance method of <code>[WebHelp](#WebHelp)</code>
**Access:** public
<a name="WebHelp+getVisitedSequences"></a>
### webHelp.getVisitedSequences() ? <code>Array</code>
Get a list of all visited sequences by sequence ID

**Kind**: instance method of <code>[WebHelp](#WebHelp)</code>
**Returns**: <code>Array</code> - A deep clone of the viewed sequence ID list
**Access:** public
<a name="WebHelp+getSequenceIdForSequenceName"></a>
### webHelp.getSequenceIdForSequenceName(sequenceName) ? <code>int</code>
Get the sequence ID for a given sequence name

**Kind**: instance method of <code>[WebHelp](#WebHelp)</code>
**Returns**: <code>int</code> - The sequence ID The ID of the sequence
**Access:** public

| Param | Type | Description |
| --- | --- | --- |
| sequenceName | <code>String</code> | The name of the sequence |

<a name="WebHelp+getSequenceNameForSequenceId"></a>
### webHelp.getSequenceNameForSequenceId(sequenceId) ? <code>String</code>
Get the sequence name for a given sequence ID

**Kind**: instance method of <code>[WebHelp](#WebHelp)</code>
**Returns**: <code>String</code> - sequenceName The sequence name
**Access:** public

| Param | Type | Description |
| --- | --- | --- |
| sequenceId | <code>int</code> | The sequence ID |

<a name="WebHelp+isSequenceAlreadyViewed"></a>
### webHelp.isSequenceAlreadyViewed(options) ? <code>Boolean</code>
Given a seqence ID or name, check if the sequence has been previously seen or not

**Kind**: instance method of <code>[WebHelp](#WebHelp)</code>
**Returns**: <code>Boolean</code> - Whether the sequence has been previously viewed
**Access:** public

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The options object |
| [options.seqId] | <code>int</code> | The sequence ID for the given sequence |
| [options.seqName] | <code>String</code> | The sequence name for the given sequence |

<a name="WebHelp+playSequence"></a>
### webHelp.playSequence(nameOrId)
Play a sequence programmatically given its identifier (name or ID)

**Kind**: instance method of <code>[WebHelp](#WebHelp)</code>
**this**: <code>[WebHelp](#WebHelp)</code>
**Access:** public

| Param | Type | Description |
| --- | --- | --- |
| nameOrId | <code>String</code> &#124; <code>int</code> | The sequence name or ID for a given sequence - Name preferred |



