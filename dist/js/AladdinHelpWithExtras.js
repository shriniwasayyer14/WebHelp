/*    Last edited by:  $Author: akannan $
 *    on:  $Date: 2010-10-12 17:28:22 +0800 (Tue, 12 Oct 2010) $
 *    Filename:  $Id: manavik.html 436280 2010-10-12 09:28:22Z manavik $
 *    Revision:  $Revision: 436280 $
 *    Description
 */

(function(Da,P,l){var O=function(g){function V(a){var b,c,e={};g.each(a,function(d){if((b=d.match(/^([^A-Z]+?)([A-Z])/))&&-1!=="a aa ai ao as b fn i m o s ".indexOf(b[1]+" "))c=d.replace(b[0],b[2].toLowerCase()),e[c]=d,"o"===b[1]&&V(a[d])});a._hungarianMap=e}function G(a,b,c){a._hungarianMap||V(a);var e;g.each(b,function(d){e=a._hungarianMap[d];if(e!==l&&(c||b[e]===l))"o"===e.charAt(0)?(b[e]||(b[e]={}),g.extend(!0,b[e],b[d]),G(a[e],b[e],c)):b[e]=b[d]})}function O(a){var b=p.defaults.oLanguage,c=a.sZeroRecords;
!a.sEmptyTable&&(c&&"No data available in table"===b.sEmptyTable)&&D(a,a,"sZeroRecords","sEmptyTable");!a.sLoadingRecords&&(c&&"Loading..."===b.sLoadingRecords)&&D(a,a,"sZeroRecords","sLoadingRecords");a.sInfoThousands&&(a.sThousands=a.sInfoThousands);(a=a.sDecimal)&&cb(a)}function db(a){z(a,"ordering","bSort");z(a,"orderMulti","bSortMulti");z(a,"orderClasses","bSortClasses");z(a,"orderCellsTop","bSortCellsTop");z(a,"order","aaSorting");z(a,"orderFixed","aaSortingFixed");z(a,"paging","bPaginate");
z(a,"pagingType","sPaginationType");z(a,"pageLength","iDisplayLength");z(a,"searching","bFilter");if(a=a.aoSearchCols)for(var b=0,c=a.length;b<c;b++)a[b]&&G(p.models.oSearch,a[b])}function eb(a){z(a,"orderable","bSortable");z(a,"orderData","aDataSort");z(a,"orderSequence","asSorting");z(a,"orderDataType","sortDataType")}function fb(a){var a=a.oBrowser,b=g("<div/>").css({position:"absolute",top:0,left:0,height:1,width:1,overflow:"hidden"}).append(g("<div/>").css({position:"absolute",top:1,left:1,width:100,
overflow:"scroll"}).append(g('<div class="test"/>').css({width:"100%",height:10}))).appendTo("body"),c=b.find(".test");a.bScrollOversize=100===c[0].offsetWidth;a.bScrollbarLeft=1!==c.offset().left;b.remove()}function gb(a,b,c,e,d,f){var h,i=!1;c!==l&&(h=c,i=!0);for(;e!==d;)a.hasOwnProperty(e)&&(h=i?b(h,a[e],e,a):a[e],i=!0,e+=f);return h}function Ea(a,b){var c=p.defaults.column,e=a.aoColumns.length,c=g.extend({},p.models.oColumn,c,{nTh:b?b:P.createElement("th"),sTitle:c.sTitle?c.sTitle:b?b.innerHTML:
"",aDataSort:c.aDataSort?c.aDataSort:[e],mData:c.mData?c.mData:e,idx:e});a.aoColumns.push(c);c=a.aoPreSearchCols;c[e]=g.extend({},p.models.oSearch,c[e]);ja(a,e,null)}function ja(a,b,c){var b=a.aoColumns[b],e=a.oClasses,d=g(b.nTh);if(!b.sWidthOrig){b.sWidthOrig=d.attr("width")||null;var f=(d.attr("style")||"").match(/width:\s*(\d+[pxem%]+)/);f&&(b.sWidthOrig=f[1])}c!==l&&null!==c&&(eb(c),G(p.defaults.column,c),c.mDataProp!==l&&!c.mData&&(c.mData=c.mDataProp),c.sType&&(b._sManualType=c.sType),c.className&&
!c.sClass&&(c.sClass=c.className),g.extend(b,c),D(b,c,"sWidth","sWidthOrig"),"number"===typeof c.iDataSort&&(b.aDataSort=[c.iDataSort]),D(b,c,"aDataSort"));var h=b.mData,i=W(h),j=b.mRender?W(b.mRender):null,c=function(a){return"string"===typeof a&&-1!==a.indexOf("@")};b._bAttrSrc=g.isPlainObject(h)&&(c(h.sort)||c(h.type)||c(h.filter));b.fnGetData=function(a,b,c){var e=i(a,b,l,c);return j&&b?j(e,b,a,c):e};b.fnSetData=function(a,b,c){return Q(h)(a,b,c)};"number"!==typeof h&&(a._rowReadObject=!0);a.oFeatures.bSort||
(b.bSortable=!1,d.addClass(e.sSortableNone));a=-1!==g.inArray("asc",b.asSorting);c=-1!==g.inArray("desc",b.asSorting);!b.bSortable||!a&&!c?(b.sSortingClass=e.sSortableNone,b.sSortingClassJUI=""):a&&!c?(b.sSortingClass=e.sSortableAsc,b.sSortingClassJUI=e.sSortJUIAscAllowed):!a&&c?(b.sSortingClass=e.sSortableDesc,b.sSortingClassJUI=e.sSortJUIDescAllowed):(b.sSortingClass=e.sSortable,b.sSortingClassJUI=e.sSortJUI)}function X(a){if(!1!==a.oFeatures.bAutoWidth){var b=a.aoColumns;Fa(a);for(var c=0,e=b.length;c<
e;c++)b[c].nTh.style.width=b[c].sWidth}b=a.oScroll;(""!==b.sY||""!==b.sX)&&Y(a);u(a,null,"column-sizing",[a])}function ka(a,b){var c=Z(a,"bVisible");return"number"===typeof c[b]?c[b]:null}function $(a,b){var c=Z(a,"bVisible"),c=g.inArray(b,c);return-1!==c?c:null}function aa(a){return Z(a,"bVisible").length}function Z(a,b){var c=[];g.map(a.aoColumns,function(a,d){a[b]&&c.push(d)});return c}function Ga(a){var b=a.aoColumns,c=a.aoData,e=p.ext.type.detect,d,f,h,i,j,g,m,o,k;d=0;for(f=b.length;d<f;d++)if(m=
b[d],k=[],!m.sType&&m._sManualType)m.sType=m._sManualType;else if(!m.sType){h=0;for(i=e.length;h<i;h++){j=0;for(g=c.length;j<g;j++){k[j]===l&&(k[j]=v(a,j,d,"type"));o=e[h](k[j],a);if(!o&&h!==e.length-1)break;if("html"===o)break}if(o){m.sType=o;break}}m.sType||(m.sType="string")}}function hb(a,b,c,e){var d,f,h,i,j,n,m=a.aoColumns;if(b)for(d=b.length-1;0<=d;d--){n=b[d];var o=n.targets!==l?n.targets:n.aTargets;g.isArray(o)||(o=[o]);f=0;for(h=o.length;f<h;f++)if("number"===typeof o[f]&&0<=o[f]){for(;m.length<=
o[f];)Ea(a);e(o[f],n)}else if("number"===typeof o[f]&&0>o[f])e(m.length+o[f],n);else if("string"===typeof o[f]){i=0;for(j=m.length;i<j;i++)("_all"==o[f]||g(m[i].nTh).hasClass(o[f]))&&e(i,n)}}if(c){d=0;for(a=c.length;d<a;d++)e(d,c[d])}}function I(a,b,c,e){var d=a.aoData.length,f=g.extend(!0,{},p.models.oRow,{src:c?"dom":"data"});f._aData=b;a.aoData.push(f);for(var b=a.aoColumns,f=0,h=b.length;f<h;f++)c&&Ha(a,d,f,v(a,d,f)),b[f].sType=null;a.aiDisplayMaster.push(d);(c||!a.oFeatures.bDeferRender)&&Ia(a,
d,c,e);return d}function la(a,b){var c;b instanceof g||(b=g(b));return b.map(function(b,d){c=ma(a,d);return I(a,c.data,d,c.cells)})}function v(a,b,c,e){var d=a.iDraw,f=a.aoColumns[c],h=a.aoData[b]._aData,i=f.sDefaultContent,c=f.fnGetData(h,e,{settings:a,row:b,col:c});if(c===l)return a.iDrawError!=d&&null===i&&(R(a,0,"Requested unknown parameter "+("function"==typeof f.mData?"{function}":"'"+f.mData+"'")+" for row "+b,4),a.iDrawError=d),i;if((c===h||null===c)&&null!==i)c=i;else if("function"===typeof c)return c.call(h);
return null===c&&"display"==e?"":c}function Ha(a,b,c,e){a.aoColumns[c].fnSetData(a.aoData[b]._aData,e,{settings:a,row:b,col:c})}function Ja(a){return g.map(a.match(/(\\.|[^\.])+/g),function(a){return a.replace(/\\./g,".")})}function W(a){if(g.isPlainObject(a)){var b={};g.each(a,function(a,c){c&&(b[a]=W(c))});return function(a,c,f,h){var i=b[c]||b._;return i!==l?i(a,c,f,h):a}}if(null===a)return function(a){return a};if("function"===typeof a)return function(b,c,f,h){return a(b,c,f,h)};if("string"===
typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("[")||-1!==a.indexOf("("))){var c=function(a,b,f){var h,i;if(""!==f){i=Ja(f);for(var j=0,g=i.length;j<g;j++){f=i[j].match(ba);h=i[j].match(S);if(f){i[j]=i[j].replace(ba,"");""!==i[j]&&(a=a[i[j]]);h=[];i.splice(0,j+1);i=i.join(".");j=0;for(g=a.length;j<g;j++)h.push(c(a[j],b,i));a=f[0].substring(1,f[0].length-1);a=""===a?h:h.join(a);break}else if(h){i[j]=i[j].replace(S,"");a=a[i[j]]();continue}if(null===a||a[i[j]]===l)return l;a=a[i[j]]}}return a};return function(b,
d){return c(b,d,a)}}return function(b){return b[a]}}function Q(a){if(g.isPlainObject(a))return Q(a._);if(null===a)return function(){};if("function"===typeof a)return function(b,e,d){a(b,"set",e,d)};if("string"===typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("[")||-1!==a.indexOf("("))){var b=function(a,e,d){var d=Ja(d),f;f=d[d.length-1];for(var h,i,j=0,g=d.length-1;j<g;j++){h=d[j].match(ba);i=d[j].match(S);if(h){d[j]=d[j].replace(ba,"");a[d[j]]=[];f=d.slice();f.splice(0,j+1);h=f.join(".");i=0;for(g=
e.length;i<g;i++)f={},b(f,e[i],h),a[d[j]].push(f);return}i&&(d[j]=d[j].replace(S,""),a=a[d[j]](e));if(null===a[d[j]]||a[d[j]]===l)a[d[j]]={};a=a[d[j]]}if(f.match(S))a[f.replace(S,"")](e);else a[f.replace(ba,"")]=e};return function(c,e){return b(c,e,a)}}return function(b,e){b[a]=e}}function Ka(a){return C(a.aoData,"_aData")}function na(a){a.aoData.length=0;a.aiDisplayMaster.length=0;a.aiDisplay.length=0}function oa(a,b,c){for(var e=-1,d=0,f=a.length;d<f;d++)a[d]==b?e=d:a[d]>b&&a[d]--; -1!=e&&c===l&&
a.splice(e,1)}function ca(a,b,c,e){var d=a.aoData[b],f,h=function(c,f){for(;c.childNodes.length;)c.removeChild(c.firstChild);c.innerHTML=v(a,b,f,"display")};if("dom"===c||(!c||"auto"===c)&&"dom"===d.src)d._aData=ma(a,d,e,e===l?l:d._aData).data;else{var i=d.anCells;if(i)if(e!==l)h(i[e],e);else{c=0;for(f=i.length;c<f;c++)h(i[c],c)}}d._aSortData=null;d._aFilterData=null;h=a.aoColumns;if(e!==l)h[e].sType=null;else{c=0;for(f=h.length;c<f;c++)h[c].sType=null;La(d)}}function ma(a,b,c,e){var d=[],f=b.firstChild,
h,i=0,j,n=a.aoColumns,m=a._rowReadObject,e=e||m?{}:[],o=function(a,b){if("string"===typeof a){var c=a.indexOf("@");-1!==c&&(c=a.substring(c+1),Q(a)(e,b.getAttribute(c)))}},a=function(a){if(c===l||c===i)h=n[i],j=g.trim(a.innerHTML),h&&h._bAttrSrc?(Q(h.mData._)(e,j),o(h.mData.sort,a),o(h.mData.type,a),o(h.mData.filter,a)):m?(h._setter||(h._setter=Q(h.mData)),h._setter(e,j)):e[i]=j;i++};if(f)for(;f;){b=f.nodeName.toUpperCase();if("TD"==b||"TH"==b)a(f),d.push(f);f=f.nextSibling}else{d=b.anCells;f=0;for(b=
d.length;f<b;f++)a(d[f])}return{data:e,cells:d}}function Ia(a,b,c,e){var d=a.aoData[b],f=d._aData,h=[],i,j,g,m,o;if(null===d.nTr){i=c||P.createElement("tr");d.nTr=i;d.anCells=h;i._DT_RowIndex=b;La(d);m=0;for(o=a.aoColumns.length;m<o;m++){g=a.aoColumns[m];j=c?e[m]:P.createElement(g.sCellType);h.push(j);if(!c||g.mRender||g.mData!==m)j.innerHTML=v(a,b,m,"display");g.sClass&&(j.className+=" "+g.sClass);g.bVisible&&!c?i.appendChild(j):!g.bVisible&&c&&j.parentNode.removeChild(j);g.fnCreatedCell&&g.fnCreatedCell.call(a.oInstance,
j,v(a,b,m),f,b,m)}u(a,"aoRowCreatedCallback",null,[i,f,b])}d.nTr.setAttribute("role","row")}function La(a){var b=a.nTr,c=a._aData;if(b){c.DT_RowId&&(b.id=c.DT_RowId);if(c.DT_RowClass){var e=c.DT_RowClass.split(" ");a.__rowc=a.__rowc?Ma(a.__rowc.concat(e)):e;g(b).removeClass(a.__rowc.join(" ")).addClass(c.DT_RowClass)}c.DT_RowData&&g(b).data(c.DT_RowData)}}function ib(a){var b,c,e,d,f,h=a.nTHead,i=a.nTFoot,j=0===g("th, td",h).length,n=a.oClasses,m=a.aoColumns;j&&(d=g("<tr/>").appendTo(h));b=0;for(c=
m.length;b<c;b++)f=m[b],e=g(f.nTh).addClass(f.sClass),j&&e.appendTo(d),a.oFeatures.bSort&&(e.addClass(f.sSortingClass),!1!==f.bSortable&&(e.attr("tabindex",a.iTabIndex).attr("aria-controls",a.sTableId),Na(a,f.nTh,b))),f.sTitle!=e.html()&&e.html(f.sTitle),Oa(a,"header")(a,e,f,n);j&&da(a.aoHeader,h);g(h).find(">tr").attr("role","row");g(h).find(">tr>th, >tr>td").addClass(n.sHeaderTH);g(i).find(">tr>th, >tr>td").addClass(n.sFooterTH);if(null!==i){a=a.aoFooter[0];b=0;for(c=a.length;b<c;b++)f=m[b],f.nTf=
a[b].cell,f.sClass&&g(f.nTf).addClass(f.sClass)}}function ea(a,b,c){var e,d,f,h=[],i=[],j=a.aoColumns.length,n;if(b){c===l&&(c=!1);e=0;for(d=b.length;e<d;e++){h[e]=b[e].slice();h[e].nTr=b[e].nTr;for(f=j-1;0<=f;f--)!a.aoColumns[f].bVisible&&!c&&h[e].splice(f,1);i.push([])}e=0;for(d=h.length;e<d;e++){if(a=h[e].nTr)for(;f=a.firstChild;)a.removeChild(f);f=0;for(b=h[e].length;f<b;f++)if(n=j=1,i[e][f]===l){a.appendChild(h[e][f].cell);for(i[e][f]=1;h[e+j]!==l&&h[e][f].cell==h[e+j][f].cell;)i[e+j][f]=1,j++;
for(;h[e][f+n]!==l&&h[e][f].cell==h[e][f+n].cell;){for(c=0;c<j;c++)i[e+c][f+n]=1;n++}g(h[e][f].cell).attr("rowspan",j).attr("colspan",n)}}}}function L(a){var b=u(a,"aoPreDrawCallback","preDraw",[a]);if(-1!==g.inArray(!1,b))B(a,!1);else{var b=[],c=0,e=a.asStripeClasses,d=e.length,f=a.oLanguage,h=a.iInitDisplayStart,i="ssp"==A(a),j=a.aiDisplay;a.bDrawing=!0;h!==l&&-1!==h&&(a._iDisplayStart=i?h:h>=a.fnRecordsDisplay()?0:h,a.iInitDisplayStart=-1);var h=a._iDisplayStart,n=a.fnDisplayEnd();if(a.bDeferLoading)a.bDeferLoading=
!1,a.iDraw++,B(a,!1);else if(i){if(!a.bDestroying&&!jb(a))return}else a.iDraw++;if(0!==j.length){f=i?a.aoData.length:n;for(i=i?0:h;i<f;i++){var m=j[i],o=a.aoData[m];null===o.nTr&&Ia(a,m);m=o.nTr;if(0!==d){var k=e[c%d];o._sRowStripe!=k&&(g(m).removeClass(o._sRowStripe).addClass(k),o._sRowStripe=k)}u(a,"aoRowCallback",null,[m,o._aData,c,i]);b.push(m);c++}}else c=f.sZeroRecords,1==a.iDraw&&"ajax"==A(a)?c=f.sLoadingRecords:f.sEmptyTable&&0===a.fnRecordsTotal()&&(c=f.sEmptyTable),b[0]=g("<tr/>",{"class":d?
e[0]:""}).append(g("<td />",{valign:"top",colSpan:aa(a),"class":a.oClasses.sRowEmpty}).html(c))[0];u(a,"aoHeaderCallback","header",[g(a.nTHead).children("tr")[0],Ka(a),h,n,j]);u(a,"aoFooterCallback","footer",[g(a.nTFoot).children("tr")[0],Ka(a),h,n,j]);e=g(a.nTBody);e.children().detach();e.append(g(b));u(a,"aoDrawCallback","draw",[a]);a.bSorted=!1;a.bFiltered=!1;a.bDrawing=!1}}function M(a,b){var c=a.oFeatures,e=c.bFilter;c.bSort&&kb(a);e?fa(a,a.oPreviousSearch):a.aiDisplay=a.aiDisplayMaster.slice();
!0!==b&&(a._iDisplayStart=0);a._drawHold=b;L(a);a._drawHold=!1}function lb(a){var b=a.oClasses,c=g(a.nTable),c=g("<div/>").insertBefore(c),e=a.oFeatures,d=g("<div/>",{id:a.sTableId+"_wrapper","class":b.sWrapper+(a.nTFoot?"":" "+b.sNoFooter)});a.nHolding=c[0];a.nTableWrapper=d[0];a.nTableReinsertBefore=a.nTable.nextSibling;for(var f=a.sDom.split(""),h,i,j,n,m,o,k=0;k<f.length;k++){h=null;i=f[k];if("<"==i){j=g("<div/>")[0];n=f[k+1];if("'"==n||'"'==n){m="";for(o=2;f[k+o]!=n;)m+=f[k+o],o++;"H"==m?m=b.sJUIHeader:
"F"==m&&(m=b.sJUIFooter);-1!=m.indexOf(".")?(n=m.split("."),j.id=n[0].substr(1,n[0].length-1),j.className=n[1]):"#"==m.charAt(0)?j.id=m.substr(1,m.length-1):j.className=m;k+=o}d.append(j);d=g(j)}else if(">"==i)d=d.parent();else if("l"==i&&e.bPaginate&&e.bLengthChange)h=mb(a);else if("f"==i&&e.bFilter)h=nb(a);else if("r"==i&&e.bProcessing)h=ob(a);else if("t"==i)h=pb(a);else if("i"==i&&e.bInfo)h=qb(a);else if("p"==i&&e.bPaginate)h=rb(a);else if(0!==p.ext.feature.length){j=p.ext.feature;o=0;for(n=j.length;o<
n;o++)if(i==j[o].cFeature){h=j[o].fnInit(a);break}}h&&(j=a.aanFeatures,j[i]||(j[i]=[]),j[i].push(h),d.append(h))}c.replaceWith(d)}function da(a,b){var c=g(b).children("tr"),e,d,f,h,i,j,n,m,o,k;a.splice(0,a.length);f=0;for(j=c.length;f<j;f++)a.push([]);f=0;for(j=c.length;f<j;f++){e=c[f];for(d=e.firstChild;d;){if("TD"==d.nodeName.toUpperCase()||"TH"==d.nodeName.toUpperCase()){m=1*d.getAttribute("colspan");o=1*d.getAttribute("rowspan");m=!m||0===m||1===m?1:m;o=!o||0===o||1===o?1:o;h=0;for(i=a[f];i[h];)h++;
n=h;k=1===m?!0:!1;for(i=0;i<m;i++)for(h=0;h<o;h++)a[f+h][n+i]={cell:d,unique:k},a[f+h].nTr=e}d=d.nextSibling}}}function pa(a,b,c){var e=[];c||(c=a.aoHeader,b&&(c=[],da(c,b)));for(var b=0,d=c.length;b<d;b++)for(var f=0,h=c[b].length;f<h;f++)if(c[b][f].unique&&(!e[f]||!a.bSortCellsTop))e[f]=c[b][f].cell;return e}function qa(a,b,c){u(a,"aoServerParams","serverParams",[b]);if(b&&g.isArray(b)){var e={},d=/(.*?)\[\]$/;g.each(b,function(a,b){var c=b.name.match(d);c?(c=c[0],e[c]||(e[c]=[]),e[c].push(b.value)):
e[b.name]=b.value});b=e}var f,h=a.ajax,i=a.oInstance;if(g.isPlainObject(h)&&h.data){f=h.data;var j=g.isFunction(f)?f(b):f,b=g.isFunction(f)&&j?j:g.extend(!0,b,j);delete h.data}j={data:b,success:function(b){var f=b.error||b.sError;f&&a.oApi._fnLog(a,0,f);a.json=b;u(a,null,"xhr",[a,b]);c(b)},dataType:"json",cache:!1,type:a.sServerMethod,error:function(b,c){var f=a.oApi._fnLog;"parsererror"==c?f(a,0,"Invalid JSON response",1):4===b.readyState&&f(a,0,"Ajax error",7);B(a,!1)}};a.oAjaxData=b;u(a,null,"preXhr",
[a,b]);a.fnServerData?a.fnServerData.call(i,a.sAjaxSource,g.map(b,function(a,b){return{name:b,value:a}}),c,a):a.sAjaxSource||"string"===typeof h?a.jqXHR=g.ajax(g.extend(j,{url:h||a.sAjaxSource})):g.isFunction(h)?a.jqXHR=h.call(i,b,c,a):(a.jqXHR=g.ajax(g.extend(j,h)),h.data=f)}function jb(a){return a.bAjaxDataGet?(a.iDraw++,B(a,!0),qa(a,sb(a),function(b){tb(a,b)}),!1):!0}function sb(a){var b=a.aoColumns,c=b.length,e=a.oFeatures,d=a.oPreviousSearch,f=a.aoPreSearchCols,h,i=[],j,n,m,o=T(a);h=a._iDisplayStart;
j=!1!==e.bPaginate?a._iDisplayLength:-1;var k=function(a,b){i.push({name:a,value:b})};k("sEcho",a.iDraw);k("iColumns",c);k("sColumns",C(b,"sName").join(","));k("iDisplayStart",h);k("iDisplayLength",j);var l={draw:a.iDraw,columns:[],order:[],start:h,length:j,search:{value:d.sSearch,regex:d.bRegex}};for(h=0;h<c;h++)n=b[h],m=f[h],j="function"==typeof n.mData?"function":n.mData,l.columns.push({data:j,name:n.sName,searchable:n.bSearchable,orderable:n.bSortable,search:{value:m.sSearch,regex:m.bRegex}}),
k("mDataProp_"+h,j),e.bFilter&&(k("sSearch_"+h,m.sSearch),k("bRegex_"+h,m.bRegex),k("bSearchable_"+h,n.bSearchable)),e.bSort&&k("bSortable_"+h,n.bSortable);e.bFilter&&(k("sSearch",d.sSearch),k("bRegex",d.bRegex));e.bSort&&(g.each(o,function(a,b){l.order.push({column:b.col,dir:b.dir});k("iSortCol_"+a,b.col);k("sSortDir_"+a,b.dir)}),k("iSortingCols",o.length));b=p.ext.legacy.ajax;return null===b?a.sAjaxSource?i:l:b?i:l}function tb(a,b){var c=b.sEcho!==l?b.sEcho:b.draw,e=b.iTotalRecords!==l?b.iTotalRecords:
b.recordsTotal,d=b.iTotalDisplayRecords!==l?b.iTotalDisplayRecords:b.recordsFiltered;if(c){if(1*c<a.iDraw)return;a.iDraw=1*c}na(a);a._iRecordsTotal=parseInt(e,10);a._iRecordsDisplay=parseInt(d,10);c=ra(a,b);e=0;for(d=c.length;e<d;e++)I(a,c[e]);a.aiDisplay=a.aiDisplayMaster.slice();a.bAjaxDataGet=!1;L(a);a._bInitComplete||sa(a,b);a.bAjaxDataGet=!0;B(a,!1)}function ra(a,b){var c=g.isPlainObject(a.ajax)&&a.ajax.dataSrc!==l?a.ajax.dataSrc:a.sAjaxDataProp;return"data"===c?b.aaData||b[c]:""!==c?W(c)(b):
b}function nb(a){var b=a.oClasses,c=a.sTableId,e=a.oLanguage,d=a.oPreviousSearch,f=a.aanFeatures,h='<input type="search" class="'+b.sFilterInput+'"/>',i=e.sSearch,i=i.match(/_INPUT_/)?i.replace("_INPUT_",h):i+h,b=g("<div/>",{id:!f.f?c+"_filter":null,"class":b.sFilter}).append(g("<label/>").append(i)),f=function(){var b=!this.value?"":this.value;b!=d.sSearch&&(fa(a,{sSearch:b,bRegex:d.bRegex,bSmart:d.bSmart,bCaseInsensitive:d.bCaseInsensitive}),a._iDisplayStart=0,L(a))},h=null!==a.searchDelay?a.searchDelay:
"ssp"===A(a)?400:0,j=g("input",b).val(d.sSearch).attr("placeholder",e.sSearchPlaceholder).bind("keyup.DT search.DT input.DT paste.DT cut.DT",h?ta(f,h):f).bind("keypress.DT",function(a){if(13==a.keyCode)return!1}).attr("aria-controls",c);g(a.nTable).on("search.dt.DT",function(b,c){if(a===c)try{j[0]!==P.activeElement&&j.val(d.sSearch)}catch(f){}});return b[0]}function fa(a,b,c){var e=a.oPreviousSearch,d=a.aoPreSearchCols,f=function(a){e.sSearch=a.sSearch;e.bRegex=a.bRegex;e.bSmart=a.bSmart;e.bCaseInsensitive=
a.bCaseInsensitive};Ga(a);if("ssp"!=A(a)){ub(a,b.sSearch,c,b.bEscapeRegex!==l?!b.bEscapeRegex:b.bRegex,b.bSmart,b.bCaseInsensitive);f(b);for(b=0;b<d.length;b++)vb(a,d[b].sSearch,b,d[b].bEscapeRegex!==l?!d[b].bEscapeRegex:d[b].bRegex,d[b].bSmart,d[b].bCaseInsensitive);wb(a)}else f(b);a.bFiltered=!0;u(a,null,"search",[a])}function wb(a){for(var b=p.ext.search,c=a.aiDisplay,e,d,f=0,h=b.length;f<h;f++){for(var i=[],j=0,g=c.length;j<g;j++)d=c[j],e=a.aoData[d],b[f](a,e._aFilterData,d,e._aData,j)&&i.push(d);
c.length=0;c.push.apply(c,i)}}function vb(a,b,c,e,d,f){if(""!==b)for(var h=a.aiDisplay,e=Pa(b,e,d,f),d=h.length-1;0<=d;d--)b=a.aoData[h[d]]._aFilterData[c],e.test(b)||h.splice(d,1)}function ub(a,b,c,e,d,f){var e=Pa(b,e,d,f),d=a.oPreviousSearch.sSearch,f=a.aiDisplayMaster,h;0!==p.ext.search.length&&(c=!0);h=xb(a);if(0>=b.length)a.aiDisplay=f.slice();else{if(h||c||d.length>b.length||0!==b.indexOf(d)||a.bSorted)a.aiDisplay=f.slice();b=a.aiDisplay;for(c=b.length-1;0<=c;c--)e.test(a.aoData[b[c]]._sFilterRow)||
b.splice(c,1)}}function Pa(a,b,c,e){a=b?a:ua(a);c&&(a="^(?=.*?"+g.map(a.match(/"[^"]+"|[^ ]+/g)||"",function(a){if('"'===a.charAt(0))var b=a.match(/^"(.*)"$/),a=b?b[1]:a;return a.replace('"',"")}).join(")(?=.*?")+").*$");return RegExp(a,e?"i":"")}function ua(a){return a.replace(Xb,"\\$1")}function xb(a){var b=a.aoColumns,c,e,d,f,h,i,g,n,m=p.ext.type.search;c=!1;e=0;for(f=a.aoData.length;e<f;e++)if(n=a.aoData[e],!n._aFilterData){i=[];d=0;for(h=b.length;d<h;d++)c=b[d],c.bSearchable?(g=v(a,e,d,"filter"),
m[c.sType]&&(g=m[c.sType](g)),null===g&&(g=""),"string"!==typeof g&&g.toString&&(g=g.toString())):g="",g.indexOf&&-1!==g.indexOf("&")&&(va.innerHTML=g,g=Yb?va.textContent:va.innerText),g.replace&&(g=g.replace(/[\r\n]/g,"")),i.push(g);n._aFilterData=i;n._sFilterRow=i.join("  ");c=!0}return c}function yb(a){return{search:a.sSearch,smart:a.bSmart,regex:a.bRegex,caseInsensitive:a.bCaseInsensitive}}function zb(a){return{sSearch:a.search,bSmart:a.smart,bRegex:a.regex,bCaseInsensitive:a.caseInsensitive}}
function qb(a){var b=a.sTableId,c=a.aanFeatures.i,e=g("<div/>",{"class":a.oClasses.sInfo,id:!c?b+"_info":null});c||(a.aoDrawCallback.push({fn:Ab,sName:"information"}),e.attr("role","status").attr("aria-live","polite"),g(a.nTable).attr("aria-describedby",b+"_info"));return e[0]}function Ab(a){var b=a.aanFeatures.i;if(0!==b.length){var c=a.oLanguage,e=a._iDisplayStart+1,d=a.fnDisplayEnd(),f=a.fnRecordsTotal(),h=a.fnRecordsDisplay(),i=h?c.sInfo:c.sInfoEmpty;h!==f&&(i+=" "+c.sInfoFiltered);i+=c.sInfoPostFix;
i=Bb(a,i);c=c.fnInfoCallback;null!==c&&(i=c.call(a.oInstance,a,e,d,f,h,i));g(b).html(i)}}function Bb(a,b){var c=a.fnFormatNumber,e=a._iDisplayStart+1,d=a._iDisplayLength,f=a.fnRecordsDisplay(),h=-1===d;return b.replace(/_START_/g,c.call(a,e)).replace(/_END_/g,c.call(a,a.fnDisplayEnd())).replace(/_MAX_/g,c.call(a,a.fnRecordsTotal())).replace(/_TOTAL_/g,c.call(a,f)).replace(/_PAGE_/g,c.call(a,h?1:Math.ceil(e/d))).replace(/_PAGES_/g,c.call(a,h?1:Math.ceil(f/d)))}function ga(a){var b,c,e=a.iInitDisplayStart,
d=a.aoColumns,f;c=a.oFeatures;if(a.bInitialised){lb(a);ib(a);ea(a,a.aoHeader);ea(a,a.aoFooter);B(a,!0);c.bAutoWidth&&Fa(a);b=0;for(c=d.length;b<c;b++)f=d[b],f.sWidth&&(f.nTh.style.width=s(f.sWidth));M(a);d=A(a);"ssp"!=d&&("ajax"==d?qa(a,[],function(c){var f=ra(a,c);for(b=0;b<f.length;b++)I(a,f[b]);a.iInitDisplayStart=e;M(a);B(a,!1);sa(a,c)},a):(B(a,!1),sa(a)))}else setTimeout(function(){ga(a)},200)}function sa(a,b){a._bInitComplete=!0;b&&X(a);u(a,"aoInitComplete","init",[a,b])}function Qa(a,b){var c=
parseInt(b,10);a._iDisplayLength=c;Ra(a);u(a,null,"length",[a,c])}function mb(a){for(var b=a.oClasses,c=a.sTableId,e=a.aLengthMenu,d=g.isArray(e[0]),f=d?e[0]:e,e=d?e[1]:e,d=g("<select/>",{name:c+"_length","aria-controls":c,"class":b.sLengthSelect}),h=0,i=f.length;h<i;h++)d[0][h]=new Option(e[h],f[h]);var j=g("<div><label/></div>").addClass(b.sLength);a.aanFeatures.l||(j[0].id=c+"_length");j.children().append(a.oLanguage.sLengthMenu.replace("_MENU_",d[0].outerHTML));g("select",j).val(a._iDisplayLength).bind("change.DT",
function(){Qa(a,g(this).val());L(a)});g(a.nTable).bind("length.dt.DT",function(b,c,f){a===c&&g("select",j).val(f)});return j[0]}function rb(a){var b=a.sPaginationType,c=p.ext.pager[b],e="function"===typeof c,d=function(a){L(a)},b=g("<div/>").addClass(a.oClasses.sPaging+b)[0],f=a.aanFeatures;e||c.fnInit(a,b,d);f.p||(b.id=a.sTableId+"_paginate",a.aoDrawCallback.push({fn:function(a){if(e){var b=a._iDisplayStart,g=a._iDisplayLength,n=a.fnRecordsDisplay(),m=-1===g,b=m?0:Math.ceil(b/g),g=m?1:Math.ceil(n/
g),n=c(b,g),o,m=0;for(o=f.p.length;m<o;m++)Oa(a,"pageButton")(a,f.p[m],m,n,b,g)}else c.fnUpdate(a,d)},sName:"pagination"}));return b}function Sa(a,b,c){var e=a._iDisplayStart,d=a._iDisplayLength,f=a.fnRecordsDisplay();0===f||-1===d?e=0:"number"===typeof b?(e=b*d,e>f&&(e=0)):"first"==b?e=0:"previous"==b?(e=0<=d?e-d:0,0>e&&(e=0)):"next"==b?e+d<f&&(e+=d):"last"==b?e=Math.floor((f-1)/d)*d:R(a,0,"Unknown paging action: "+b,5);b=a._iDisplayStart!==e;a._iDisplayStart=e;b&&(u(a,null,"page",[a]),c&&L(a));
return b}function ob(a){return g("<div/>",{id:!a.aanFeatures.r?a.sTableId+"_processing":null,"class":a.oClasses.sProcessing}).html(a.oLanguage.sProcessing).insertBefore(a.nTable)[0]}function B(a,b){a.oFeatures.bProcessing&&g(a.aanFeatures.r).css("display",b?"block":"none");u(a,null,"processing",[a,b])}function pb(a){var b=g(a.nTable);b.attr("role","grid");var c=a.oScroll;if(""===c.sX&&""===c.sY)return a.nTable;var e=c.sX,d=c.sY,f=a.oClasses,h=b.children("caption"),i=h.length?h[0]._captionSide:null,
j=g(b[0].cloneNode(!1)),n=g(b[0].cloneNode(!1)),m=b.children("tfoot");c.sX&&"100%"===b.attr("width")&&b.removeAttr("width");m.length||(m=null);c=g("<div/>",{"class":f.sScrollWrapper}).append(g("<div/>",{"class":f.sScrollHead}).css({overflow:"hidden",position:"relative",border:0,width:e?!e?null:s(e):"100%"}).append(g("<div/>",{"class":f.sScrollHeadInner}).css({"box-sizing":"content-box",width:c.sXInner||"100%"}).append(j.removeAttr("id").css("margin-left",0).append("top"===i?h:null).append(b.children("thead"))))).append(g("<div/>",
{"class":f.sScrollBody}).css({overflow:"auto",height:!d?null:s(d),width:!e?null:s(e)}).append(b));m&&c.append(g("<div/>",{"class":f.sScrollFoot}).css({overflow:"hidden",border:0,width:e?!e?null:s(e):"100%"}).append(g("<div/>",{"class":f.sScrollFootInner}).append(n.removeAttr("id").css("margin-left",0).append("bottom"===i?h:null).append(b.children("tfoot")))));var b=c.children(),o=b[0],f=b[1],k=m?b[2]:null;e&&g(f).scroll(function(){var a=this.scrollLeft;o.scrollLeft=a;m&&(k.scrollLeft=a)});a.nScrollHead=
o;a.nScrollBody=f;a.nScrollFoot=k;a.aoDrawCallback.push({fn:Y,sName:"scrolling"});return c[0]}function Y(a){var b=a.oScroll,c=b.sX,e=b.sXInner,d=b.sY,f=b.iBarWidth,h=g(a.nScrollHead),i=h[0].style,j=h.children("div"),n=j[0].style,m=j.children("table"),j=a.nScrollBody,o=g(j),k=j.style,l=g(a.nScrollFoot).children("div"),p=l.children("table"),r=g(a.nTHead),q=g(a.nTable),t=q[0],N=t.style,J=a.nTFoot?g(a.nTFoot):null,u=a.oBrowser,w=u.bScrollOversize,y,v,x,K,z,A=[],B=[],C=[],D,E=function(a){a=a.style;a.paddingTop=
"0";a.paddingBottom="0";a.borderTopWidth="0";a.borderBottomWidth="0";a.height=0};q.children("thead, tfoot").remove();z=r.clone().prependTo(q);y=r.find("tr");x=z.find("tr");z.find("th, td").removeAttr("tabindex");J&&(K=J.clone().prependTo(q),v=J.find("tr"),K=K.find("tr"));c||(k.width="100%",h[0].style.width="100%");g.each(pa(a,z),function(b,c){D=ka(a,b);c.style.width=a.aoColumns[D].sWidth});J&&F(function(a){a.style.width=""},K);b.bCollapse&&""!==d&&(k.height=o[0].offsetHeight+r[0].offsetHeight+"px");
h=q.outerWidth();if(""===c){if(N.width="100%",w&&(q.find("tbody").height()>j.offsetHeight||"scroll"==o.css("overflow-y")))N.width=s(q.outerWidth()-f)}else""!==e?N.width=s(e):h==o.width()&&o.height()<q.height()?(N.width=s(h-f),q.outerWidth()>h-f&&(N.width=s(h))):N.width=s(h);h=q.outerWidth();F(E,x);F(function(a){C.push(a.innerHTML);A.push(s(g(a).css("width")))},x);F(function(a,b){a.style.width=A[b]},y);g(x).height(0);J&&(F(E,K),F(function(a){B.push(s(g(a).css("width")))},K),F(function(a,b){a.style.width=
B[b]},v),g(K).height(0));F(function(a,b){a.innerHTML='<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+C[b]+"</div>";a.style.width=A[b]},x);J&&F(function(a,b){a.innerHTML="";a.style.width=B[b]},K);if(q.outerWidth()<h){v=j.scrollHeight>j.offsetHeight||"scroll"==o.css("overflow-y")?h+f:h;if(w&&(j.scrollHeight>j.offsetHeight||"scroll"==o.css("overflow-y")))N.width=s(v-f);(""===c||""!==e)&&R(a,1,"Possible column misalignment",6)}else v="100%";k.width=s(v);i.width=s(v);J&&(a.nScrollFoot.style.width=
s(v));!d&&w&&(k.height=s(t.offsetHeight+f));d&&b.bCollapse&&(k.height=s(d),b=c&&t.offsetWidth>j.offsetWidth?f:0,t.offsetHeight<j.offsetHeight&&(k.height=s(t.offsetHeight+b)));b=q.outerWidth();m[0].style.width=s(b);n.width=s(b);m=q.height()>j.clientHeight||"scroll"==o.css("overflow-y");u="padding"+(u.bScrollbarLeft?"Left":"Right");n[u]=m?f+"px":"0px";J&&(p[0].style.width=s(b),l[0].style.width=s(b),l[0].style[u]=m?f+"px":"0px");o.scroll();if((a.bSorted||a.bFiltered)&&!a._drawHold)j.scrollTop=0}function F(a,
b,c){for(var e=0,d=0,f=b.length,h,g;d<f;){h=b[d].firstChild;for(g=c?c[d].firstChild:null;h;)1===h.nodeType&&(c?a(h,g,e):a(h,e),e++),h=h.nextSibling,g=c?g.nextSibling:null;d++}}function Fa(a){var b=a.nTable,c=a.aoColumns,e=a.oScroll,d=e.sY,f=e.sX,h=e.sXInner,i=c.length,e=Z(a,"bVisible"),j=g("th",a.nTHead),n=b.getAttribute("width"),m=b.parentNode,o=!1,k,l;for(k=0;k<e.length;k++)l=c[e[k]],null!==l.sWidth&&(l.sWidth=Cb(l.sWidthOrig,m),o=!0);if(!o&&!f&&!d&&i==aa(a)&&i==j.length)for(k=0;k<i;k++)c[k].sWidth=
s(j.eq(k).width());else{i=g(b).clone().empty().css("visibility","hidden").removeAttr("id").append(g(a.nTHead).clone(!1)).append(g(a.nTFoot).clone(!1)).append(g("<tbody><tr/></tbody>"));i.find("tfoot th, tfoot td").css("width","");var p=i.find("tbody tr"),j=pa(a,i.find("thead")[0]);for(k=0;k<e.length;k++)l=c[e[k]],j[k].style.width=null!==l.sWidthOrig&&""!==l.sWidthOrig?s(l.sWidthOrig):"";if(a.aoData.length)for(k=0;k<e.length;k++)o=e[k],l=c[o],g(Db(a,o)).clone(!1).append(l.sContentPadding).appendTo(p);
i.appendTo(m);f&&h?i.width(h):f?(i.css("width","auto"),i.width()<m.offsetWidth&&i.width(m.offsetWidth)):d?i.width(m.offsetWidth):n&&i.width(n);Eb(a,i[0]);if(f){for(k=h=0;k<e.length;k++)l=c[e[k]],d=g(j[k]).outerWidth(),h+=null===l.sWidthOrig?d:parseInt(l.sWidth,10)+d-g(j[k]).width();i.width(s(h));b.style.width=s(h)}for(k=0;k<e.length;k++)if(l=c[e[k]],d=g(j[k]).width())l.sWidth=s(d);b.style.width=s(i.css("width"));i.remove()}n&&(b.style.width=s(n));if((n||f)&&!a._reszEvt)g(Da).bind("resize.DT-"+a.sInstance,
ta(function(){X(a)})),a._reszEvt=!0}function ta(a,b){var c=b!==l?b:200,e,d;return function(){var b=this,h=+new Date,g=arguments;e&&h<e+c?(clearTimeout(d),d=setTimeout(function(){e=l;a.apply(b,g)},c)):e?(e=h,a.apply(b,g)):e=h}}function Cb(a,b){if(!a)return 0;var c=g("<div/>").css("width",s(a)).appendTo(b||P.body),e=c[0].offsetWidth;c.remove();return e}function Eb(a,b){var c=a.oScroll;if(c.sX||c.sY)c=!c.sX?c.iBarWidth:0,b.style.width=s(g(b).outerWidth()-c)}function Db(a,b){var c=Fb(a,b);if(0>c)return null;
var e=a.aoData[c];return!e.nTr?g("<td/>").html(v(a,c,b,"display"))[0]:e.anCells[b]}function Fb(a,b){for(var c,e=-1,d=-1,f=0,h=a.aoData.length;f<h;f++)c=v(a,f,b,"display")+"",c=c.replace(Zb,""),c.length>e&&(e=c.length,d=f);return d}function s(a){return null===a?"0px":"number"==typeof a?0>a?"0px":a+"px":a.match(/\d$/)?a+"px":a}function Gb(){if(!p.__scrollbarWidth){var a=g("<p/>").css({width:"100%",height:200,padding:0})[0],b=g("<div/>").css({position:"absolute",top:0,left:0,width:200,height:150,padding:0,
overflow:"hidden",visibility:"hidden"}).append(a).appendTo("body"),c=a.offsetWidth;b.css("overflow","scroll");a=a.offsetWidth;c===a&&(a=b[0].clientWidth);b.remove();p.__scrollbarWidth=c-a}return p.__scrollbarWidth}function T(a){var b,c,e=[],d=a.aoColumns,f,h,i,j;b=a.aaSortingFixed;c=g.isPlainObject(b);var n=[];f=function(a){a.length&&!g.isArray(a[0])?n.push(a):n.push.apply(n,a)};g.isArray(b)&&f(b);c&&b.pre&&f(b.pre);f(a.aaSorting);c&&b.post&&f(b.post);for(a=0;a<n.length;a++){j=n[a][0];f=d[j].aDataSort;
b=0;for(c=f.length;b<c;b++)h=f[b],i=d[h].sType||"string",n[a]._idx===l&&(n[a]._idx=g.inArray(n[a][1],d[h].asSorting)),e.push({src:j,col:h,dir:n[a][1],index:n[a]._idx,type:i,formatter:p.ext.type.order[i+"-pre"]})}return e}function kb(a){var b,c,e=[],d=p.ext.type.order,f=a.aoData,h=0,g,j=a.aiDisplayMaster,n;Ga(a);n=T(a);b=0;for(c=n.length;b<c;b++)g=n[b],g.formatter&&h++,Hb(a,g.col);if("ssp"!=A(a)&&0!==n.length){b=0;for(c=j.length;b<c;b++)e[j[b]]=b;h===n.length?j.sort(function(a,b){var c,d,h,g,i=n.length,
j=f[a]._aSortData,l=f[b]._aSortData;for(h=0;h<i;h++)if(g=n[h],c=j[g.col],d=l[g.col],c=c<d?-1:c>d?1:0,0!==c)return"asc"===g.dir?c:-c;c=e[a];d=e[b];return c<d?-1:c>d?1:0}):j.sort(function(a,b){var c,h,g,i,j=n.length,l=f[a]._aSortData,p=f[b]._aSortData;for(g=0;g<j;g++)if(i=n[g],c=l[i.col],h=p[i.col],i=d[i.type+"-"+i.dir]||d["string-"+i.dir],c=i(c,h),0!==c)return c;c=e[a];h=e[b];return c<h?-1:c>h?1:0})}a.bSorted=!0}function Ib(a){for(var b,c,e=a.aoColumns,d=T(a),a=a.oLanguage.oAria,f=0,h=e.length;f<h;f++){c=
e[f];var g=c.asSorting;b=c.sTitle.replace(/<.*?>/g,"");var j=c.nTh;j.removeAttribute("aria-sort");c.bSortable&&(0<d.length&&d[0].col==f?(j.setAttribute("aria-sort","asc"==d[0].dir?"ascending":"descending"),c=g[d[0].index+1]||g[0]):c=g[0],b+="asc"===c?a.sSortAscending:a.sSortDescending);j.setAttribute("aria-label",b)}}function Ta(a,b,c,e){var d=a.aaSorting,f=a.aoColumns[b].asSorting,h=function(a,b){var c=a._idx;c===l&&(c=g.inArray(a[1],f));return c+1<f.length?c+1:b?null:0};"number"===typeof d[0]&&
(d=a.aaSorting=[d]);c&&a.oFeatures.bSortMulti?(c=g.inArray(b,C(d,"0")),-1!==c?(b=h(d[c],!0),null===b?d.splice(c,1):(d[c][1]=f[b],d[c]._idx=b)):(d.push([b,f[0],0]),d[d.length-1]._idx=0)):d.length&&d[0][0]==b?(b=h(d[0]),d.length=1,d[0][1]=f[b],d[0]._idx=b):(d.length=0,d.push([b,f[0]]),d[0]._idx=0);M(a);"function"==typeof e&&e(a)}function Na(a,b,c,e){var d=a.aoColumns[c];Ua(b,{},function(b){!1!==d.bSortable&&(a.oFeatures.bProcessing?(B(a,!0),setTimeout(function(){Ta(a,c,b.shiftKey,e);"ssp"!==A(a)&&B(a,
!1)},0)):Ta(a,c,b.shiftKey,e))})}function wa(a){var b=a.aLastSort,c=a.oClasses.sSortColumn,e=T(a),d=a.oFeatures,f,h;if(d.bSort&&d.bSortClasses){d=0;for(f=b.length;d<f;d++)h=b[d].src,g(C(a.aoData,"anCells",h)).removeClass(c+(2>d?d+1:3));d=0;for(f=e.length;d<f;d++)h=e[d].src,g(C(a.aoData,"anCells",h)).addClass(c+(2>d?d+1:3))}a.aLastSort=e}function Hb(a,b){var c=a.aoColumns[b],e=p.ext.order[c.sSortDataType],d;e&&(d=e.call(a.oInstance,a,b,$(a,b)));for(var f,h=p.ext.type.order[c.sType+"-pre"],g=0,j=a.aoData.length;g<
j;g++)if(c=a.aoData[g],c._aSortData||(c._aSortData=[]),!c._aSortData[b]||e)f=e?d[g]:v(a,g,b,"sort"),c._aSortData[b]=h?h(f):f}function xa(a){if(a.oFeatures.bStateSave&&!a.bDestroying){var b={time:+new Date,start:a._iDisplayStart,length:a._iDisplayLength,order:g.extend(!0,[],a.aaSorting),search:yb(a.oPreviousSearch),columns:g.map(a.aoColumns,function(b,e){return{visible:b.bVisible,search:yb(a.aoPreSearchCols[e])}})};u(a,"aoStateSaveParams","stateSaveParams",[a,b]);a.oSavedState=b;a.fnStateSaveCallback.call(a.oInstance,
a,b)}}function Jb(a){var b,c,e=a.aoColumns;if(a.oFeatures.bStateSave){var d=a.fnStateLoadCallback.call(a.oInstance,a);if(d&&d.time&&(b=u(a,"aoStateLoadParams","stateLoadParams",[a,d]),-1===g.inArray(!1,b)&&(b=a.iStateDuration,!(0<b&&d.time<+new Date-1E3*b)&&e.length===d.columns.length))){a.oLoadedState=g.extend(!0,{},d);a._iDisplayStart=d.start;a.iInitDisplayStart=d.start;a._iDisplayLength=d.length;a.aaSorting=[];g.each(d.order,function(b,c){a.aaSorting.push(c[0]>=e.length?[0,c[1]]:c)});g.extend(a.oPreviousSearch,
zb(d.search));b=0;for(c=d.columns.length;b<c;b++){var f=d.columns[b];e[b].bVisible=f.visible;g.extend(a.aoPreSearchCols[b],zb(f.search))}u(a,"aoStateLoaded","stateLoaded",[a,d])}}}function ya(a){var b=p.settings,a=g.inArray(a,C(b,"nTable"));return-1!==a?b[a]:null}function R(a,b,c,e){c="DataTables warning: "+(null!==a?"table id="+a.sTableId+" - ":"")+c;e&&(c+=". For more information about this error, please see http://datatables.net/tn/"+e);if(b)Da.console&&console.log&&console.log(c);else if(a=p.ext,
"alert"==(a.sErrMode||a.errMode))alert(c);else throw Error(c);}function D(a,b,c,e){g.isArray(c)?g.each(c,function(c,f){g.isArray(f)?D(a,b,f[0],f[1]):D(a,b,f)}):(e===l&&(e=c),b[c]!==l&&(a[e]=b[c]))}function Kb(a,b,c){var e,d;for(d in b)b.hasOwnProperty(d)&&(e=b[d],g.isPlainObject(e)?(g.isPlainObject(a[d])||(a[d]={}),g.extend(!0,a[d],e)):a[d]=c&&"data"!==d&&"aaData"!==d&&g.isArray(e)?e.slice():e);return a}function Ua(a,b,c){g(a).bind("click.DT",b,function(b){a.blur();c(b)}).bind("keypress.DT",b,function(a){13===
a.which&&(a.preventDefault(),c(a))}).bind("selectstart.DT",function(){return!1})}function x(a,b,c,e){c&&a[b].push({fn:c,sName:e})}function u(a,b,c,e){var d=[];b&&(d=g.map(a[b].slice().reverse(),function(b){return b.fn.apply(a.oInstance,e)}));null!==c&&g(a.nTable).trigger(c+".dt",e);return d}function Ra(a){var b=a._iDisplayStart,c=a.fnDisplayEnd(),e=a._iDisplayLength;b>=c&&(b=c-e);b-=b%e;if(-1===e||0>b)b=0;a._iDisplayStart=b}function Oa(a,b){var c=a.renderer,e=p.ext.renderer[b];return g.isPlainObject(c)&&
c[b]?e[c[b]]||e._:"string"===typeof c?e[c]||e._:e._}function A(a){return a.oFeatures.bServerSide?"ssp":a.ajax||a.sAjaxSource?"ajax":"dom"}function Va(a,b){var c=[],c=Lb.numbers_length,e=Math.floor(c/2);b<=c?c=U(0,b):a<=e?(c=U(0,c-2),c.push("ellipsis"),c.push(b-1)):(a>=b-1-e?c=U(b-(c-2),b):(c=U(a-1,a+2),c.push("ellipsis"),c.push(b-1)),c.splice(0,0,"ellipsis"),c.splice(0,0,0));c.DT_el="span";return c}function cb(a){g.each({num:function(b){return za(b,a)},"num-fmt":function(b){return za(b,a,Wa)},"html-num":function(b){return za(b,
a,Aa)},"html-num-fmt":function(b){return za(b,a,Aa,Wa)}},function(b,c){w.type.order[b+a+"-pre"]=c;b.match(/^html\-/)&&(w.type.search[b+a]=w.type.search.html)})}function Mb(a){return function(){var b=[ya(this[p.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return p.ext.internal[a].apply(this,b)}}var p,w,q,r,t,Xa={},Nb=/[\r\n]/g,Aa=/<.*?>/g,$b=/^[\w\+\-]/,ac=/[\w\+\-]$/,Xb=RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\$|\\^|\\-)","g"),Wa=/[',$\u00a3\u20ac\u00a5%\u2009\u202F]/g,
H=function(a){return!a||!0===a||"-"===a?!0:!1},Ob=function(a){var b=parseInt(a,10);return!isNaN(b)&&isFinite(a)?b:null},Pb=function(a,b){Xa[b]||(Xa[b]=RegExp(ua(b),"g"));return"string"===typeof a&&"."!==b?a.replace(/\./g,"").replace(Xa[b],"."):a},Ya=function(a,b,c){var e="string"===typeof a;b&&e&&(a=Pb(a,b));c&&e&&(a=a.replace(Wa,""));return H(a)||!isNaN(parseFloat(a))&&isFinite(a)},Qb=function(a,b,c){return H(a)?!0:!(H(a)||"string"===typeof a)?null:Ya(a.replace(Aa,""),b,c)?!0:null},C=function(a,
b,c){var e=[],d=0,f=a.length;if(c!==l)for(;d<f;d++)a[d]&&a[d][b]&&e.push(a[d][b][c]);else for(;d<f;d++)a[d]&&e.push(a[d][b]);return e},ha=function(a,b,c,e){var d=[],f=0,h=b.length;if(e!==l)for(;f<h;f++)a[b[f]][c]&&d.push(a[b[f]][c][e]);else for(;f<h;f++)d.push(a[b[f]][c]);return d},U=function(a,b){var c=[],e;b===l?(b=0,e=a):(e=b,b=a);for(var d=b;d<e;d++)c.push(d);return c},Rb=function(a){for(var b=[],c=0,e=a.length;c<e;c++)a[c]&&b.push(a[c]);return b},Ma=function(a){var b=[],c,e,d=a.length,f,h=0;
e=0;a:for(;e<d;e++){c=a[e];for(f=0;f<h;f++)if(b[f]===c)continue a;b.push(c);h++}return b},z=function(a,b,c){a[b]!==l&&(a[c]=a[b])},ba=/\[.*?\]$/,S=/\(\)$/,va=g("<div>")[0],Yb=va.textContent!==l,Zb=/<.*?>/g;p=function(a){this.$=function(a,b){return this.api(!0).$(a,b)};this._=function(a,b){return this.api(!0).rows(a,b).data()};this.api=function(a){return a?new q(ya(this[w.iApiIndex])):new q(this)};this.fnAddData=function(a,b){var c=this.api(!0),e=g.isArray(a)&&(g.isArray(a[0])||g.isPlainObject(a[0]))?
c.rows.add(a):c.row.add(a);(b===l||b)&&c.draw();return e.flatten().toArray()};this.fnAdjustColumnSizing=function(a){var b=this.api(!0).columns.adjust(),c=b.settings()[0],e=c.oScroll;a===l||a?b.draw(!1):(""!==e.sX||""!==e.sY)&&Y(c)};this.fnClearTable=function(a){var b=this.api(!0).clear();(a===l||a)&&b.draw()};this.fnClose=function(a){this.api(!0).row(a).child.hide()};this.fnDeleteRow=function(a,b,c){var e=this.api(!0),a=e.rows(a),d=a.settings()[0],g=d.aoData[a[0][0]];a.remove();b&&b.call(this,d,g);
(c===l||c)&&e.draw();return g};this.fnDestroy=function(a){this.api(!0).destroy(a)};this.fnDraw=function(a){this.api(!0).draw(!a)};this.fnFilter=function(a,b,c,e,d,g){d=this.api(!0);null===b||b===l?d.search(a,c,e,g):d.column(b).search(a,c,e,g);d.draw()};this.fnGetData=function(a,b){var c=this.api(!0);if(a!==l){var e=a.nodeName?a.nodeName.toLowerCase():"";return b!==l||"td"==e||"th"==e?c.cell(a,b).data():c.row(a).data()||null}return c.data().toArray()};this.fnGetNodes=function(a){var b=this.api(!0);
return a!==l?b.row(a).node():b.rows().nodes().flatten().toArray()};this.fnGetPosition=function(a){var b=this.api(!0),c=a.nodeName.toUpperCase();return"TR"==c?b.row(a).index():"TD"==c||"TH"==c?(a=b.cell(a).index(),[a.row,a.columnVisible,a.column]):null};this.fnIsOpen=function(a){return this.api(!0).row(a).child.isShown()};this.fnOpen=function(a,b,c){return this.api(!0).row(a).child(b,c).show().child()[0]};this.fnPageChange=function(a,b){var c=this.api(!0).page(a);(b===l||b)&&c.draw(!1)};this.fnSetColumnVis=
function(a,b,c){a=this.api(!0).column(a).visible(b);(c===l||c)&&a.columns.adjust().draw()};this.fnSettings=function(){return ya(this[w.iApiIndex])};this.fnSort=function(a){this.api(!0).order(a).draw()};this.fnSortListener=function(a,b,c){this.api(!0).order.listener(a,b,c)};this.fnUpdate=function(a,b,c,e,d){var g=this.api(!0);c===l||null===c?g.row(b).data(a):g.cell(b,c).data(a);(d===l||d)&&g.columns.adjust();(e===l||e)&&g.draw();return 0};this.fnVersionCheck=w.fnVersionCheck;var b=this,c=a===l,e=this.length;
c&&(a={});this.oApi=this.internal=w.internal;for(var d in p.ext.internal)d&&(this[d]=Mb(d));this.each(function(){var d={},d=1<e?Kb(d,a,!0):a,h=0,i,j=this.getAttribute("id"),n=!1,m=p.defaults;if("table"!=this.nodeName.toLowerCase())R(null,0,"Non-table node initialisation ("+this.nodeName+")",2);else{db(m);eb(m.column);G(m,m,!0);G(m.column,m.column,!0);G(m,d);var o=p.settings,h=0;for(i=o.length;h<i;h++){if(o[h].nTable==this){i=d.bRetrieve!==l?d.bRetrieve:m.bRetrieve;if(c||i)return o[h].oInstance;if(d.bDestroy!==
l?d.bDestroy:m.bDestroy){o[h].oInstance.fnDestroy();break}else{R(o[h],0,"Cannot reinitialise DataTable",3);return}}if(o[h].sTableId==this.id){o.splice(h,1);break}}if(null===j||""===j)this.id=j="DataTables_Table_"+p.ext._unique++;var k=g.extend(!0,{},p.models.oSettings,{nTable:this,oApi:b.internal,oInit:d,sDestroyWidth:g(this)[0].style.width,sInstance:j,sTableId:j});o.push(k);k.oInstance=1===b.length?b:g(this).dataTable();db(d);d.oLanguage&&O(d.oLanguage);d.aLengthMenu&&!d.iDisplayLength&&(d.iDisplayLength=
g.isArray(d.aLengthMenu[0])?d.aLengthMenu[0][0]:d.aLengthMenu[0]);d=Kb(g.extend(!0,{},m),d);D(k.oFeatures,d,"bPaginate bLengthChange bFilter bSort bSortMulti bInfo bProcessing bAutoWidth bSortClasses bServerSide bDeferRender".split(" "));D(k,d,["asStripeClasses","ajax","fnServerData","fnFormatNumber","sServerMethod","aaSorting","aaSortingFixed","aLengthMenu","sPaginationType","sAjaxSource","sAjaxDataProp","iStateDuration","sDom","bSortCellsTop","iTabIndex","fnStateLoadCallback","fnStateSaveCallback",
"renderer","searchDelay",["iCookieDuration","iStateDuration"],["oSearch","oPreviousSearch"],["aoSearchCols","aoPreSearchCols"],["iDisplayLength","_iDisplayLength"],["bJQueryUI","bJUI"]]);D(k.oScroll,d,[["sScrollX","sX"],["sScrollXInner","sXInner"],["sScrollY","sY"],["bScrollCollapse","bCollapse"]]);D(k.oLanguage,d,"fnInfoCallback");x(k,"aoDrawCallback",d.fnDrawCallback,"user");x(k,"aoServerParams",d.fnServerParams,"user");x(k,"aoStateSaveParams",d.fnStateSaveParams,"user");x(k,"aoStateLoadParams",
d.fnStateLoadParams,"user");x(k,"aoStateLoaded",d.fnStateLoaded,"user");x(k,"aoRowCallback",d.fnRowCallback,"user");x(k,"aoRowCreatedCallback",d.fnCreatedRow,"user");x(k,"aoHeaderCallback",d.fnHeaderCallback,"user");x(k,"aoFooterCallback",d.fnFooterCallback,"user");x(k,"aoInitComplete",d.fnInitComplete,"user");x(k,"aoPreDrawCallback",d.fnPreDrawCallback,"user");j=k.oClasses;d.bJQueryUI?(g.extend(j,p.ext.oJUIClasses,d.oClasses),d.sDom===m.sDom&&"lfrtip"===m.sDom&&(k.sDom='<"H"lfr>t<"F"ip>'),k.renderer)?
g.isPlainObject(k.renderer)&&!k.renderer.header&&(k.renderer.header="jqueryui"):k.renderer="jqueryui":g.extend(j,p.ext.classes,d.oClasses);g(this).addClass(j.sTable);if(""!==k.oScroll.sX||""!==k.oScroll.sY)k.oScroll.iBarWidth=Gb();!0===k.oScroll.sX&&(k.oScroll.sX="100%");k.iInitDisplayStart===l&&(k.iInitDisplayStart=d.iDisplayStart,k._iDisplayStart=d.iDisplayStart);null!==d.iDeferLoading&&(k.bDeferLoading=!0,h=g.isArray(d.iDeferLoading),k._iRecordsDisplay=h?d.iDeferLoading[0]:d.iDeferLoading,k._iRecordsTotal=
h?d.iDeferLoading[1]:d.iDeferLoading);var r=k.oLanguage;g.extend(!0,r,d.oLanguage);""!==r.sUrl&&(g.ajax({dataType:"json",url:r.sUrl,success:function(a){O(a);G(m.oLanguage,a);g.extend(true,r,a);ga(k)},error:function(){ga(k)}}),n=!0);null===d.asStripeClasses&&(k.asStripeClasses=[j.sStripeOdd,j.sStripeEven]);var h=k.asStripeClasses,q=g("tbody tr:eq(0)",this);-1!==g.inArray(!0,g.map(h,function(a){return q.hasClass(a)}))&&(g("tbody tr",this).removeClass(h.join(" ")),k.asDestroyStripes=h.slice());var o=
[],s,h=this.getElementsByTagName("thead");0!==h.length&&(da(k.aoHeader,h[0]),o=pa(k));if(null===d.aoColumns){s=[];h=0;for(i=o.length;h<i;h++)s.push(null)}else s=d.aoColumns;h=0;for(i=s.length;h<i;h++)Ea(k,o?o[h]:null);hb(k,d.aoColumnDefs,s,function(a,b){ja(k,a,b)});if(q.length){var t=function(a,b){return a.getAttribute("data-"+b)?b:null};g.each(ma(k,q[0]).cells,function(a,b){var c=k.aoColumns[a];if(c.mData===a){var e=t(b,"sort")||t(b,"order"),d=t(b,"filter")||t(b,"search");if(e!==null||d!==null){c.mData=
{_:a+".display",sort:e!==null?a+".@data-"+e:l,type:e!==null?a+".@data-"+e:l,filter:d!==null?a+".@data-"+d:l};ja(k,a)}}})}var v=k.oFeatures;d.bStateSave&&(v.bStateSave=!0,Jb(k,d),x(k,"aoDrawCallback",xa,"state_save"));if(d.aaSorting===l){o=k.aaSorting;h=0;for(i=o.length;h<i;h++)o[h][1]=k.aoColumns[h].asSorting[0]}wa(k);v.bSort&&x(k,"aoDrawCallback",function(){if(k.bSorted){var a=T(k),b={};g.each(a,function(a,c){b[c.src]=c.dir});u(k,null,"order",[k,a,b]);Ib(k)}});x(k,"aoDrawCallback",function(){(k.bSorted||
A(k)==="ssp"||v.bDeferRender)&&wa(k)},"sc");fb(k);h=g(this).children("caption").each(function(){this._captionSide=g(this).css("caption-side")});i=g(this).children("thead");0===i.length&&(i=g("<thead/>").appendTo(this));k.nTHead=i[0];i=g(this).children("tbody");0===i.length&&(i=g("<tbody/>").appendTo(this));k.nTBody=i[0];i=g(this).children("tfoot");if(0===i.length&&0<h.length&&(""!==k.oScroll.sX||""!==k.oScroll.sY))i=g("<tfoot/>").appendTo(this);0===i.length||0===i.children().length?g(this).addClass(j.sNoFooter):
0<i.length&&(k.nTFoot=i[0],da(k.aoFooter,k.nTFoot));if(d.aaData)for(h=0;h<d.aaData.length;h++)I(k,d.aaData[h]);else(k.bDeferLoading||"dom"==A(k))&&la(k,g(k.nTBody).children("tr"));k.aiDisplay=k.aiDisplayMaster.slice();k.bInitialised=!0;!1===n&&ga(k)}});b=null;return this};var Sb=[],y=Array.prototype,bc=function(a){var b,c,e=p.settings,d=g.map(e,function(a){return a.nTable});if(a){if(a.nTable&&a.oApi)return[a];if(a.nodeName&&"table"===a.nodeName.toLowerCase())return b=g.inArray(a,d),-1!==b?[e[b]]:
null;if(a&&"function"===typeof a.settings)return a.settings().toArray();"string"===typeof a?c=g(a):a instanceof g&&(c=a)}else return[];if(c)return c.map(function(){b=g.inArray(this,d);return-1!==b?e[b]:null}).toArray()};q=function(a,b){if(!this instanceof q)throw"DT API must be constructed as a new object";var c=[],e=function(a){(a=bc(a))&&c.push.apply(c,a)};if(g.isArray(a))for(var d=0,f=a.length;d<f;d++)e(a[d]);else e(a);this.context=Ma(c);b&&this.push.apply(this,b.toArray?b.toArray():b);this.selector=
{rows:null,cols:null,opts:null};q.extend(this,this,Sb)};p.Api=q;q.prototype={concat:y.concat,context:[],each:function(a){for(var b=0,c=this.length;b<c;b++)a.call(this,this[b],b,this);return this},eq:function(a){var b=this.context;return b.length>a?new q(b[a],this[a]):null},filter:function(a){var b=[];if(y.filter)b=y.filter.call(this,a,this);else for(var c=0,e=this.length;c<e;c++)a.call(this,this[c],c,this)&&b.push(this[c]);return new q(this.context,b)},flatten:function(){var a=[];return new q(this.context,
a.concat.apply(a,this.toArray()))},join:y.join,indexOf:y.indexOf||function(a,b){for(var c=b||0,e=this.length;c<e;c++)if(this[c]===a)return c;return-1},iterator:function(a,b,c,e){var d=[],f,h,g,j,n,m=this.context,o,k,p=this.selector;"string"===typeof a&&(e=c,c=b,b=a,a=!1);h=0;for(g=m.length;h<g;h++){var r=new q(m[h]);if("table"===b)f=c.call(r,m[h],h),f!==l&&d.push(f);else if("columns"===b||"rows"===b)f=c.call(r,m[h],this[h],h),f!==l&&d.push(f);else if("column"===b||"column-rows"===b||"row"===b||"cell"===
b){k=this[h];"column-rows"===b&&(o=Ba(m[h],p.opts));j=0;for(n=k.length;j<n;j++)f=k[j],f="cell"===b?c.call(r,m[h],f.row,f.column,h,j):c.call(r,m[h],f,h,j,o),f!==l&&d.push(f)}}return d.length||e?(a=new q(m,a?d.concat.apply([],d):d),b=a.selector,b.rows=p.rows,b.cols=p.cols,b.opts=p.opts,a):this},lastIndexOf:y.lastIndexOf||function(a,b){return this.indexOf.apply(this.toArray.reverse(),arguments)},length:0,map:function(a){var b=[];if(y.map)b=y.map.call(this,a,this);else for(var c=0,e=this.length;c<e;c++)b.push(a.call(this,
this[c],c));return new q(this.context,b)},pluck:function(a){return this.map(function(b){return b[a]})},pop:y.pop,push:y.push,reduce:y.reduce||function(a,b){return gb(this,a,b,0,this.length,1)},reduceRight:y.reduceRight||function(a,b){return gb(this,a,b,this.length-1,-1,-1)},reverse:y.reverse,selector:null,shift:y.shift,sort:y.sort,splice:y.splice,toArray:function(){return y.slice.call(this)},to$:function(){return g(this)},toJQuery:function(){return g(this)},unique:function(){return new q(this.context,
Ma(this))},unshift:y.unshift};q.extend=function(a,b,c){if(b&&(b instanceof q||b.__dt_wrapper)){var e,d,f,h=function(a,b,c){return function(){var e=b.apply(a,arguments);q.extend(e,e,c.methodExt);return e}};e=0;for(d=c.length;e<d;e++)f=c[e],b[f.name]="function"===typeof f.val?h(a,f.val,f):g.isPlainObject(f.val)?{}:f.val,b[f.name].__dt_wrapper=!0,q.extend(a,b[f.name],f.propExt)}};q.register=r=function(a,b){if(g.isArray(a))for(var c=0,e=a.length;c<e;c++)q.register(a[c],b);else for(var d=a.split("."),
f=Sb,h,i,c=0,e=d.length;c<e;c++){h=(i=-1!==d[c].indexOf("()"))?d[c].replace("()",""):d[c];var j;a:{j=0;for(var n=f.length;j<n;j++)if(f[j].name===h){j=f[j];break a}j=null}j||(j={name:h,val:{},methodExt:[],propExt:[]},f.push(j));c===e-1?j.val=b:f=i?j.methodExt:j.propExt}};q.registerPlural=t=function(a,b,c){q.register(a,c);q.register(b,function(){var a=c.apply(this,arguments);return a===this?this:a instanceof q?a.length?g.isArray(a[0])?new q(a.context,a[0]):a[0]:l:a})};r("tables()",function(a){var b;
if(a){b=q;var c=this.context;if("number"===typeof a)a=[c[a]];else var e=g.map(c,function(a){return a.nTable}),a=g(e).filter(a).map(function(){var a=g.inArray(this,e);return c[a]}).toArray();b=new b(a)}else b=this;return b});r("table()",function(a){var a=this.tables(a),b=a.context;return b.length?new q(b[0]):a});t("tables().nodes()","table().node()",function(){return this.iterator("table",function(a){return a.nTable},1)});t("tables().body()","table().body()",function(){return this.iterator("table",
function(a){return a.nTBody},1)});t("tables().header()","table().header()",function(){return this.iterator("table",function(a){return a.nTHead},1)});t("tables().footer()","table().footer()",function(){return this.iterator("table",function(a){return a.nTFoot},1)});t("tables().containers()","table().container()",function(){return this.iterator("table",function(a){return a.nTableWrapper},1)});r("draw()",function(a){return this.iterator("table",function(b){M(b,!1===a)})});r("page()",function(a){return a===
l?this.page.info().page:this.iterator("table",function(b){Sa(b,a)})});r("page.info()",function(){if(0===this.context.length)return l;var a=this.context[0],b=a._iDisplayStart,c=a._iDisplayLength,e=a.fnRecordsDisplay(),d=-1===c;return{page:d?0:Math.floor(b/c),pages:d?1:Math.ceil(e/c),start:b,end:a.fnDisplayEnd(),length:c,recordsTotal:a.fnRecordsTotal(),recordsDisplay:e}});r("page.len()",function(a){return a===l?0!==this.context.length?this.context[0]._iDisplayLength:l:this.iterator("table",function(b){Qa(b,
a)})});var Tb=function(a,b,c){"ssp"==A(a)?M(a,b):(B(a,!0),qa(a,[],function(c){na(a);for(var c=ra(a,c),e=0,h=c.length;e<h;e++)I(a,c[e]);M(a,b);B(a,!1)}));if(c){var e=new q(a);e.one("draw",function(){c(e.ajax.json())})}};r("ajax.json()",function(){var a=this.context;if(0<a.length)return a[0].json});r("ajax.params()",function(){var a=this.context;if(0<a.length)return a[0].oAjaxData});r("ajax.reload()",function(a,b){return this.iterator("table",function(c){Tb(c,!1===b,a)})});r("ajax.url()",function(a){var b=
this.context;if(a===l){if(0===b.length)return l;b=b[0];return b.ajax?g.isPlainObject(b.ajax)?b.ajax.url:b.ajax:b.sAjaxSource}return this.iterator("table",function(b){g.isPlainObject(b.ajax)?b.ajax.url=a:b.ajax=a})});r("ajax.url().load()",function(a,b){return this.iterator("table",function(c){Tb(c,!1===b,a)})});var Za=function(a,b){var c=[],e,d,f,h,i,j;e=typeof a;if(!a||"string"===e||"function"===e||a.length===l)a=[a];f=0;for(h=a.length;f<h;f++){d=a[f]&&a[f].split?a[f].split(","):[a[f]];i=0;for(j=
d.length;i<j;i++)(e=b("string"===typeof d[i]?g.trim(d[i]):d[i]))&&e.length&&c.push.apply(c,e)}return c},$a=function(a){a||(a={});a.filter&&!a.search&&(a.search=a.filter);return{search:a.search||"none",order:a.order||"current",page:a.page||"all"}},ab=function(a){for(var b=0,c=a.length;b<c;b++)if(0<a[b].length)return a[0]=a[b],a.length=1,a.context=[a.context[b]],a;a.length=0;return a},Ba=function(a,b){var c,e,d,f=[],h=a.aiDisplay;c=a.aiDisplayMaster;var i=b.search;e=b.order;d=b.page;if("ssp"==A(a))return"removed"===
i?[]:U(0,c.length);if("current"==d){c=a._iDisplayStart;for(e=a.fnDisplayEnd();c<e;c++)f.push(h[c])}else if("current"==e||"applied"==e)f="none"==i?c.slice():"applied"==i?h.slice():g.map(c,function(a){return-1===g.inArray(a,h)?a:null});else if("index"==e||"original"==e){c=0;for(e=a.aoData.length;c<e;c++)"none"==i?f.push(c):(d=g.inArray(c,h),(-1===d&&"removed"==i||0<=d&&"applied"==i)&&f.push(c))}return f};r("rows()",function(a,b){a===l?a="":g.isPlainObject(a)&&(b=a,a="");var b=$a(b),c=this.iterator("table",
function(c){var d=b;return Za(a,function(a){var b=Ob(a);if(b!==null&&!d)return[b];var i=Ba(c,d);if(b!==null&&g.inArray(b,i)!==-1)return[b];if(!a)return i;if(typeof a==="function")return g.map(i,function(b){var d=c.aoData[b];return a(b,d._aData,d.nTr)?b:null});b=Rb(ha(c.aoData,i,"nTr"));return a.nodeName&&g.inArray(a,b)!==-1?[a._DT_RowIndex]:g(b).filter(a).map(function(){return this._DT_RowIndex}).toArray()})},1);c.selector.rows=a;c.selector.opts=b;return c});r("rows().nodes()",function(){return this.iterator("row",
function(a,b){return a.aoData[b].nTr||l},1)});r("rows().data()",function(){return this.iterator(!0,"rows",function(a,b){return ha(a.aoData,b,"_aData")},1)});t("rows().cache()","row().cache()",function(a){return this.iterator("row",function(b,c){var e=b.aoData[c];return"search"===a?e._aFilterData:e._aSortData},1)});t("rows().invalidate()","row().invalidate()",function(a){return this.iterator("row",function(b,c){ca(b,c,a)})});t("rows().indexes()","row().index()",function(){return this.iterator("row",
function(a,b){return b},1)});t("rows().remove()","row().remove()",function(){var a=this;return this.iterator("row",function(b,c,e){var d=b.aoData;d.splice(c,1);for(var f=0,h=d.length;f<h;f++)null!==d[f].nTr&&(d[f].nTr._DT_RowIndex=f);g.inArray(c,b.aiDisplay);oa(b.aiDisplayMaster,c);oa(b.aiDisplay,c);oa(a[e],c,!1);Ra(b)})});r("rows.add()",function(a){var b=this.iterator("table",function(b){var c,f,h,g=[];f=0;for(h=a.length;f<h;f++)c=a[f],c.nodeName&&"TR"===c.nodeName.toUpperCase()?g.push(la(b,c)[0]):
g.push(I(b,c));return g},1),c=this.rows(-1);c.pop();c.push.apply(c,b.toArray());return c});r("row()",function(a,b){return ab(this.rows(a,b))});r("row().data()",function(a){var b=this.context;if(a===l)return b.length&&this.length?b[0].aoData[this[0]]._aData:l;b[0].aoData[this[0]]._aData=a;ca(b[0],this[0],"data");return this});r("row().node()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]].nTr||null:null});r("row.add()",function(a){a instanceof g&&a.length&&(a=a[0]);
var b=this.iterator("table",function(b){return a.nodeName&&"TR"===a.nodeName.toUpperCase()?la(b,a)[0]:I(b,a)});return this.row(b[0])});var bb=function(a,b){var c=a.context;c.length&&(c=c[0].aoData[b!==l?b:a[0]],c._details&&(c._details.remove(),c._detailsShow=l,c._details=l))},Ub=function(a,b){var c=a.context;if(c.length&&a.length){var e=c[0].aoData[a[0]];if(e._details){(e._detailsShow=b)?e._details.insertAfter(e.nTr):e._details.detach();var d=c[0],f=new q(d),h=d.aoData;f.off("draw.dt.DT_details column-visibility.dt.DT_details destroy.dt.DT_details");
0<C(h,"_details").length&&(f.on("draw.dt.DT_details",function(a,b){d===b&&f.rows({page:"current"}).eq(0).each(function(a){a=h[a];a._detailsShow&&a._details.insertAfter(a.nTr)})}),f.on("column-visibility.dt.DT_details",function(a,b){if(d===b)for(var c,e=aa(b),f=0,g=h.length;f<g;f++)c=h[f],c._details&&c._details.children("td[colspan]").attr("colspan",e)}),f.on("destroy.dt.DT_details",function(a,b){if(d===b)for(var c=0,e=h.length;c<e;c++)h[c]._details&&bb(f,c)}))}}};r("row().child()",function(a,b){var c=
this.context;if(a===l)return c.length&&this.length?c[0].aoData[this[0]]._details:l;if(!0===a)this.child.show();else if(!1===a)bb(this);else if(c.length&&this.length){var e=c[0],c=c[0].aoData[this[0]],d=[],f=function(a,b){if(a.nodeName&&"tr"===a.nodeName.toLowerCase())d.push(a);else{var c=g("<tr><td/></tr>").addClass(b);g("td",c).addClass(b).html(a)[0].colSpan=aa(e);d.push(c[0])}};if(g.isArray(a)||a instanceof g)for(var h=0,i=a.length;h<i;h++)f(a[h],b);else f(a,b);c._details&&c._details.remove();c._details=
g(d);c._detailsShow&&c._details.insertAfter(c.nTr)}return this});r(["row().child.show()","row().child().show()"],function(){Ub(this,!0);return this});r(["row().child.hide()","row().child().hide()"],function(){Ub(this,!1);return this});r(["row().child.remove()","row().child().remove()"],function(){bb(this);return this});r("row().child.isShown()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]]._detailsShow||!1:!1});var cc=/^(.+):(name|visIdx|visible)$/,Vb=function(a,
b,c,e,d){for(var c=[],e=0,f=d.length;e<f;e++)c.push(v(a,d[e],b));return c};r("columns()",function(a,b){a===l?a="":g.isPlainObject(a)&&(b=a,a="");var b=$a(b),c=this.iterator("table",function(c){var d=a,f=b,h=c.aoColumns,i=C(h,"sName"),j=C(h,"nTh");return Za(d,function(a){var b=Ob(a);if(a==="")return U(h.length);if(b!==null)return[b>=0?b:h.length+b];if(typeof a==="function"){var d=Ba(c,f);return g.map(h,function(b,f){return a(f,Vb(c,f,0,0,d),j[f])?f:null})}var k=typeof a==="string"?a.match(cc):"";if(k)switch(k[2]){case "visIdx":case "visible":b=
parseInt(k[1],10);if(b<0){var l=g.map(h,function(a,b){return a.bVisible?b:null});return[l[l.length+b]]}return[ka(c,b)];case "name":return g.map(i,function(a,b){return a===k[1]?b:null})}else return g(j).filter(a).map(function(){return g.inArray(this,j)}).toArray()})},1);c.selector.cols=a;c.selector.opts=b;return c});t("columns().header()","column().header()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].nTh},1)});t("columns().footer()","column().footer()",function(){return this.iterator("column",
function(a,b){return a.aoColumns[b].nTf},1)});t("columns().data()","column().data()",function(){return this.iterator("column-rows",Vb,1)});t("columns().dataSrc()","column().dataSrc()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].mData},1)});t("columns().cache()","column().cache()",function(a){return this.iterator("column-rows",function(b,c,e,d,f){return ha(b.aoData,f,"search"===a?"_aFilterData":"_aSortData",c)},1)});t("columns().nodes()","column().nodes()",function(){return this.iterator("column-rows",
function(a,b,c,e,d){return ha(a.aoData,d,"anCells",b)},1)});t("columns().visible()","column().visible()",function(a,b){return this.iterator("column",function(c,e){if(a===l)return c.aoColumns[e].bVisible;var d=c.aoColumns,f=d[e],h=c.aoData,i,j,n;if(a!==l&&f.bVisible!==a){if(a){var m=g.inArray(!0,C(d,"bVisible"),e+1);i=0;for(j=h.length;i<j;i++)n=h[i].nTr,d=h[i].anCells,n&&n.insertBefore(d[e],d[m]||null)}else g(C(c.aoData,"anCells",e)).detach();f.bVisible=a;ea(c,c.aoHeader);ea(c,c.aoFooter);if(b===l||
b)X(c),(c.oScroll.sX||c.oScroll.sY)&&Y(c);u(c,null,"column-visibility",[c,e,a]);xa(c)}})});t("columns().indexes()","column().index()",function(a){return this.iterator("column",function(b,c){return"visible"===a?$(b,c):c},1)});r("columns.adjust()",function(){return this.iterator("table",function(a){X(a)},1)});r("column.index()",function(a,b){if(0!==this.context.length){var c=this.context[0];if("fromVisible"===a||"toData"===a)return ka(c,b);if("fromData"===a||"toVisible"===a)return $(c,b)}});r("column()",
function(a,b){return ab(this.columns(a,b))});r("cells()",function(a,b,c){g.isPlainObject(a)&&(typeof a.row!==l?(c=b,b=null):(c=a,a=null));g.isPlainObject(b)&&(c=b,b=null);if(null===b||b===l)return this.iterator("table",function(b){var e=a,d=$a(c),f=b.aoData,h=Ba(b,d),d=Rb(ha(f,h,"anCells")),i=g([].concat.apply([],d)),j,m=b.aoColumns.length,n,p,r,q,s,t;return Za(e,function(a){var c=typeof a==="function";if(a===null||a===l||c){n=[];p=0;for(r=h.length;p<r;p++){j=h[p];for(q=0;q<m;q++){s={row:j,column:q};
if(c){t=b.aoData[j];a(s,v(b,j,q),t.anCells[q])&&n.push(s)}else n.push(s)}}return n}return g.isPlainObject(a)?[a]:i.filter(a).map(function(a,b){j=b.parentNode._DT_RowIndex;return{row:j,column:g.inArray(b,f[j].anCells)}}).toArray()})});var e=this.columns(b,c),d=this.rows(a,c),f,h,i,j,n,m=this.iterator("table",function(a,b){f=[];h=0;for(i=d[b].length;h<i;h++){j=0;for(n=e[b].length;j<n;j++)f.push({row:d[b][h],column:e[b][j]})}return f},1);g.extend(m.selector,{cols:b,rows:a,opts:c});return m});t("cells().nodes()",
"cell().node()",function(){return this.iterator("cell",function(a,b,c){return(a=a.aoData[b].anCells)?a[c]:l},1)});r("cells().data()",function(){return this.iterator("cell",function(a,b,c){return v(a,b,c)},1)});t("cells().cache()","cell().cache()",function(a){a="search"===a?"_aFilterData":"_aSortData";return this.iterator("cell",function(b,c,e){return b.aoData[c][a][e]},1)});t("cells().render()","cell().render()",function(a){return this.iterator("cell",function(b,c,e){return v(b,c,e,a)},1)});t("cells().indexes()",
"cell().index()",function(){return this.iterator("cell",function(a,b,c){return{row:b,column:c,columnVisible:$(a,c)}},1)});t("cells().invalidate()","cell().invalidate()",function(a){return this.iterator("cell",function(b,c,e){ca(b,c,a,e)})});r("cell()",function(a,b,c){return ab(this.cells(a,b,c))});r("cell().data()",function(a){var b=this.context,c=this[0];if(a===l)return b.length&&c.length?v(b[0],c[0].row,c[0].column):l;Ha(b[0],c[0].row,c[0].column,a);ca(b[0],c[0].row,"data",c[0].column);return this});
r("order()",function(a,b){var c=this.context;if(a===l)return 0!==c.length?c[0].aaSorting:l;"number"===typeof a?a=[[a,b]]:g.isArray(a[0])||(a=Array.prototype.slice.call(arguments));return this.iterator("table",function(b){b.aaSorting=a.slice()})});r("order.listener()",function(a,b,c){return this.iterator("table",function(e){Na(e,a,b,c)})});r(["columns().order()","column().order()"],function(a){var b=this;return this.iterator("table",function(c,e){var d=[];g.each(b[e],function(b,c){d.push([c,a])});
c.aaSorting=d})});r("search()",function(a,b,c,e){var d=this.context;return a===l?0!==d.length?d[0].oPreviousSearch.sSearch:l:this.iterator("table",function(d){d.oFeatures.bFilter&&fa(d,g.extend({},d.oPreviousSearch,{sSearch:a+"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===e?!0:e}),1)})});t("columns().search()","column().search()",function(a,b,c,e){return this.iterator("column",function(d,f){var h=d.aoPreSearchCols;if(a===l)return h[f].sSearch;d.oFeatures.bFilter&&(g.extend(h[f],
{sSearch:a+"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===e?!0:e}),fa(d,d.oPreviousSearch,1))})});r("state()",function(){return this.context.length?this.context[0].oSavedState:null});r("state.clear()",function(){return this.iterator("table",function(a){a.fnStateSaveCallback.call(a.oInstance,a,{})})});r("state.loaded()",function(){return this.context.length?this.context[0].oLoadedState:null});r("state.save()",function(){return this.iterator("table",function(a){xa(a)})});p.versionCheck=
p.fnVersionCheck=function(a){for(var b=p.version.split("."),a=a.split("."),c,e,d=0,f=a.length;d<f;d++)if(c=parseInt(b[d],10)||0,e=parseInt(a[d],10)||0,c!==e)return c>e;return!0};p.isDataTable=p.fnIsDataTable=function(a){var b=g(a).get(0),c=!1;g.each(p.settings,function(a,d){if(d.nTable===b||d.nScrollHead===b||d.nScrollFoot===b)c=!0});return c};p.tables=p.fnTables=function(a){return g.map(p.settings,function(b){if(!a||a&&g(b.nTable).is(":visible"))return b.nTable})};p.util={throttle:ta,escapeRegex:ua};
p.camelToHungarian=G;r("$()",function(a,b){var c=this.rows(b).nodes(),c=g(c);return g([].concat(c.filter(a).toArray(),c.find(a).toArray()))});g.each(["on","one","off"],function(a,b){r(b+"()",function(){var a=Array.prototype.slice.call(arguments);a[0].match(/\.dt\b/)||(a[0]+=".dt");var e=g(this.tables().nodes());e[b].apply(e,a);return this})});r("clear()",function(){return this.iterator("table",function(a){na(a)})});r("settings()",function(){return new q(this.context,this.context)});r("data()",function(){return this.iterator("table",
function(a){return C(a.aoData,"_aData")}).flatten()});r("destroy()",function(a){a=a||!1;return this.iterator("table",function(b){var c=b.nTableWrapper.parentNode,e=b.oClasses,d=b.nTable,f=b.nTBody,h=b.nTHead,i=b.nTFoot,j=g(d),f=g(f),l=g(b.nTableWrapper),m=g.map(b.aoData,function(a){return a.nTr}),o;b.bDestroying=!0;u(b,"aoDestroyCallback","destroy",[b]);a||(new q(b)).columns().visible(!0);l.unbind(".DT").find(":not(tbody *)").unbind(".DT");g(Da).unbind(".DT-"+b.sInstance);d!=h.parentNode&&(j.children("thead").detach(),
j.append(h));i&&d!=i.parentNode&&(j.children("tfoot").detach(),j.append(i));j.detach();l.detach();b.aaSorting=[];b.aaSortingFixed=[];wa(b);g(m).removeClass(b.asStripeClasses.join(" "));g("th, td",h).removeClass(e.sSortable+" "+e.sSortableAsc+" "+e.sSortableDesc+" "+e.sSortableNone);b.bJUI&&(g("th span."+e.sSortIcon+", td span."+e.sSortIcon,h).detach(),g("th, td",h).each(function(){var a=g("div."+e.sSortJUIWrapper,this);g(this).append(a.contents());a.detach()}));!a&&c&&c.insertBefore(d,b.nTableReinsertBefore);
f.children().detach();f.append(m);j.css("width",b.sDestroyWidth).removeClass(e.sTable);(o=b.asDestroyStripes.length)&&f.children().each(function(a){g(this).addClass(b.asDestroyStripes[a%o])});c=g.inArray(b,p.settings);-1!==c&&p.settings.splice(c,1)})});p.version="1.10.4";p.settings=[];p.models={};p.models.oSearch={bCaseInsensitive:!0,sSearch:"",bRegex:!1,bSmart:!0};p.models.oRow={nTr:null,anCells:null,_aData:[],_aSortData:null,_aFilterData:null,_sFilterRow:null,_sRowStripe:"",src:null};p.models.oColumn=
{idx:null,aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bVisible:null,_sManualType:null,_bAttrSrc:!1,fnCreatedCell:null,fnGetData:null,fnSetData:null,mData:null,mRender:null,nTh:null,nTf:null,sClass:null,sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:"std",sSortingClass:null,sSortingClassJUI:null,sTitle:null,sType:null,sWidth:null,sWidthOrig:null};p.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:[],ajax:null,aLengthMenu:[10,25,50,100],aoColumns:null,
aoColumnDefs:null,aoSearchCols:[],asStripeClasses:null,bAutoWidth:!0,bDeferRender:!1,bDestroy:!1,bFilter:!0,bInfo:!0,bJQueryUI:!1,bLengthChange:!0,bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollCollapse:!1,bServerSide:!1,bSort:!0,bSortMulti:!0,bSortCellsTop:!1,bSortClasses:!0,bStateSave:!1,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(a){return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,this.oLanguage.sThousands)},fnHeaderCallback:null,fnInfoCallback:null,
fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnServerData:null,fnServerParams:null,fnStateLoadCallback:function(a){try{return JSON.parse((-1===a.iStateDuration?sessionStorage:localStorage).getItem("DataTables_"+a.sInstance+"_"+location.pathname))}catch(b){}},fnStateLoadParams:null,fnStateLoaded:null,fnStateSaveCallback:function(a,b){try{(-1===a.iStateDuration?sessionStorage:localStorage).setItem("DataTables_"+a.sInstance+"_"+location.pathname,JSON.stringify(b))}catch(c){}},fnStateSaveParams:null,
iStateDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iTabIndex:0,oClasses:{},oLanguage:{oAria:{sSortAscending:": activate to sort column ascending",sSortDescending:": activate to sort column descending"},oPaginate:{sFirst:"First",sLast:"Last",sNext:"Next",sPrevious:"Previous"},sEmptyTable:"No data available in table",sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",sInfoEmpty:"Showing 0 to 0 of 0 entries",sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sDecimal:"",
sThousands:",",sLengthMenu:"Show _MENU_ entries",sLoadingRecords:"Loading...",sProcessing:"Processing...",sSearch:"Search:",sSearchPlaceholder:"",sUrl:"",sZeroRecords:"No matching records found"},oSearch:g.extend({},p.models.oSearch),sAjaxDataProp:"data",sAjaxSource:null,sDom:"lfrtip",searchDelay:null,sPaginationType:"simple_numbers",sScrollX:"",sScrollXInner:"",sScrollY:"",sServerMethod:"GET",renderer:null};V(p.defaults);p.defaults.column={aDataSort:null,iDataSort:-1,asSorting:["asc","desc"],bSearchable:!0,
bSortable:!0,bVisible:!0,fnCreatedCell:null,mData:null,mRender:null,sCellType:"td",sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,sType:null,sWidth:null};V(p.defaults.column);p.models.oSettings={oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,bSortMulti:null,bSortClasses:null,bStateSave:null},oScroll:{bCollapse:null,iBarWidth:0,sX:null,sXInner:null,sY:null},
oLanguage:{fnInfoCallback:null},oBrowser:{bScrollOversize:!1,bScrollbarLeft:!1},ajax:null,aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aoColumns:[],aoHeader:[],aoFooter:[],oPreviousSearch:{},aoPreSearchCols:[],aaSorting:null,aaSortingFixed:[],asStripeClasses:null,asDestroyStripes:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],
sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bDeferLoading:!1,bInitialised:!1,aoOpenRows:[],sDom:null,searchDelay:null,sPaginationType:"two_button",iStateDuration:0,aoStateSave:[],aoStateLoad:[],oSavedState:null,oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,bAjaxDataGet:!0,jqXHR:null,json:l,oAjaxData:l,fnServerData:null,aoServerParams:[],sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,
_iRecordsTotal:0,_iRecordsDisplay:0,bJUI:null,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return"ssp"==A(this)?1*this._iRecordsTotal:this.aiDisplayMaster.length},fnRecordsDisplay:function(){return"ssp"==A(this)?1*this._iRecordsDisplay:this.aiDisplay.length},fnDisplayEnd:function(){var a=this._iDisplayLength,b=this._iDisplayStart,c=b+a,e=this.aiDisplay.length,d=this.oFeatures,f=d.bPaginate;return d.bServerSide?!1===f||-1===a?b+e:
Math.min(b+a,this._iRecordsDisplay):!f||c>e||-1===a?e:c},oInstance:null,sInstance:null,iTabIndex:0,nScrollHead:null,nScrollFoot:null,aLastSort:[],oPlugins:{}};p.ext=w={classes:{},errMode:"alert",feature:[],search:[],internal:{},legacy:{ajax:null},pager:{},renderer:{pageButton:{},header:{}},order:{},type:{detect:[],search:{},order:{}},_unique:0,fnVersionCheck:p.fnVersionCheck,iApiIndex:0,oJUIClasses:{},sVersion:p.version};g.extend(w,{afnFiltering:w.search,aTypes:w.type.detect,ofnSearch:w.type.search,
oSort:w.type.order,afnSortData:w.order,aoFeatures:w.feature,oApi:w.internal,oStdClasses:w.classes,oPagination:w.pager});g.extend(p.ext.classes,{sTable:"dataTable",sNoFooter:"no-footer",sPageButton:"paginate_button",sPageButtonActive:"current",sPageButtonDisabled:"disabled",sStripeOdd:"odd",sStripeEven:"even",sRowEmpty:"dataTables_empty",sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",
sSortAsc:"sorting_asc",sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_asc_disabled",sSortableDesc:"sorting_desc_disabled",sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sFilterInput:"",sLengthSelect:"",sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",sHeaderTH:"",sFooterTH:"",sSortJUIAsc:"",
sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",sSortIcon:"",sJUIHeader:"",sJUIFooter:""});var Ca="",Ca="",E=Ca+"ui-state-default",ia=Ca+"css_right ui-icon ui-icon-",Wb=Ca+"fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix";g.extend(p.ext.oJUIClasses,p.ext.classes,{sPageButton:"fg-button ui-button "+E,sPageButtonActive:"ui-state-disabled",sPageButtonDisabled:"ui-state-disabled",sPaging:"dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_",
sSortAsc:E+" sorting_asc",sSortDesc:E+" sorting_desc",sSortable:E+" sorting",sSortableAsc:E+" sorting_asc_disabled",sSortableDesc:E+" sorting_desc_disabled",sSortableNone:E+" sorting_disabled",sSortJUIAsc:ia+"triangle-1-n",sSortJUIDesc:ia+"triangle-1-s",sSortJUI:ia+"carat-2-n-s",sSortJUIAscAllowed:ia+"carat-1-n",sSortJUIDescAllowed:ia+"carat-1-s",sSortJUIWrapper:"DataTables_sort_wrapper",sSortIcon:"DataTables_sort_icon",sScrollHead:"dataTables_scrollHead "+E,sScrollFoot:"dataTables_scrollFoot "+E,
sHeaderTH:E,sFooterTH:E,sJUIHeader:Wb+" ui-corner-tl ui-corner-tr",sJUIFooter:Wb+" ui-corner-bl ui-corner-br"});var Lb=p.ext.pager;g.extend(Lb,{simple:function(){return["previous","next"]},full:function(){return["first","previous","next","last"]},simple_numbers:function(a,b){return["previous",Va(a,b),"next"]},full_numbers:function(a,b){return["first","previous",Va(a,b),"next","last"]},_numbers:Va,numbers_length:7});g.extend(!0,p.ext.renderer,{pageButton:{_:function(a,b,c,e,d,f){var h=a.oClasses,i=
a.oLanguage.oPaginate,j,l,m=0,o=function(b,e){var k,p,r,q,s=function(b){Sa(a,b.data.action,true)};k=0;for(p=e.length;k<p;k++){q=e[k];if(g.isArray(q)){r=g("<"+(q.DT_el||"div")+"/>").appendTo(b);o(r,q)}else{l=j="";switch(q){case "ellipsis":b.append("<span>&hellip;</span>");break;case "first":j=i.sFirst;l=q+(d>0?"":" "+h.sPageButtonDisabled);break;case "previous":j=i.sPrevious;l=q+(d>0?"":" "+h.sPageButtonDisabled);break;case "next":j=i.sNext;l=q+(d<f-1?"":" "+h.sPageButtonDisabled);break;case "last":j=
i.sLast;l=q+(d<f-1?"":" "+h.sPageButtonDisabled);break;default:j=q+1;l=d===q?h.sPageButtonActive:""}if(j){r=g("<a>",{"class":h.sPageButton+" "+l,"aria-controls":a.sTableId,"data-dt-idx":m,tabindex:a.iTabIndex,id:c===0&&typeof q==="string"?a.sTableId+"_"+q:null}).html(j).appendTo(b);Ua(r,{action:q},s);m++}}}};try{var k=g(P.activeElement).data("dt-idx");o(g(b).empty(),e);k!==null&&g(b).find("[data-dt-idx="+k+"]").focus()}catch(p){}}}});g.extend(p.ext.type.detect,[function(a,b){var c=b.oLanguage.sDecimal;
return Ya(a,c)?"num"+c:null},function(a){if(a&&!(a instanceof Date)&&(!$b.test(a)||!ac.test(a)))return null;var b=Date.parse(a);return null!==b&&!isNaN(b)||H(a)?"date":null},function(a,b){var c=b.oLanguage.sDecimal;return Ya(a,c,!0)?"num-fmt"+c:null},function(a,b){var c=b.oLanguage.sDecimal;return Qb(a,c)?"html-num"+c:null},function(a,b){var c=b.oLanguage.sDecimal;return Qb(a,c,!0)?"html-num-fmt"+c:null},function(a){return H(a)||"string"===typeof a&&-1!==a.indexOf("<")?"html":null}]);g.extend(p.ext.type.search,
{html:function(a){return H(a)?a:"string"===typeof a?a.replace(Nb," ").replace(Aa,""):""},string:function(a){return H(a)?a:"string"===typeof a?a.replace(Nb," "):a}});var za=function(a,b,c,e){if(0!==a&&(!a||"-"===a))return-Infinity;b&&(a=Pb(a,b));a.replace&&(c&&(a=a.replace(c,"")),e&&(a=a.replace(e,"")));return 1*a};g.extend(w.type.order,{"date-pre":function(a){return Date.parse(a)||0},"html-pre":function(a){return H(a)?"":a.replace?a.replace(/<.*?>/g,"").toLowerCase():a+""},"string-pre":function(a){return H(a)?
"":"string"===typeof a?a.toLowerCase():!a.toString?"":a.toString()},"string-asc":function(a,b){return a<b?-1:a>b?1:0},"string-desc":function(a,b){return a<b?1:a>b?-1:0}});cb("");g.extend(!0,p.ext.renderer,{header:{_:function(a,b,c,e){g(a.nTable).on("order.dt.DT",function(d,f,h,g){if(a===f){d=c.idx;b.removeClass(c.sSortingClass+" "+e.sSortAsc+" "+e.sSortDesc).addClass(g[d]=="asc"?e.sSortAsc:g[d]=="desc"?e.sSortDesc:c.sSortingClass)}})},jqueryui:function(a,b,c,e){g("<div/>").addClass(e.sSortJUIWrapper).append(b.contents()).append(g("<span/>").addClass(e.sSortIcon+
" "+c.sSortingClassJUI)).appendTo(b);g(a.nTable).on("order.dt.DT",function(d,f,g,i){if(a===f){d=c.idx;b.removeClass(e.sSortAsc+" "+e.sSortDesc).addClass(i[d]=="asc"?e.sSortAsc:i[d]=="desc"?e.sSortDesc:c.sSortingClass);b.find("span."+e.sSortIcon).removeClass(e.sSortJUIAsc+" "+e.sSortJUIDesc+" "+e.sSortJUI+" "+e.sSortJUIAscAllowed+" "+e.sSortJUIDescAllowed).addClass(i[d]=="asc"?e.sSortJUIAsc:i[d]=="desc"?e.sSortJUIDesc:c.sSortingClassJUI)}})}}});p.render={number:function(a,b,c,e){return{display:function(d){var f=
0>d?"-":"",d=Math.abs(parseFloat(d)),g=parseInt(d,10),d=c?b+(d-g).toFixed(c).substring(2):"";return f+(e||"")+g.toString().replace(/\B(?=(\d{3})+(?!\d))/g,a)+d}}}};g.extend(p.ext.internal,{_fnExternApiFunc:Mb,_fnBuildAjax:qa,_fnAjaxUpdate:jb,_fnAjaxParameters:sb,_fnAjaxUpdateDraw:tb,_fnAjaxDataSrc:ra,_fnAddColumn:Ea,_fnColumnOptions:ja,_fnAdjustColumnSizing:X,_fnVisibleToColumnIndex:ka,_fnColumnIndexToVisible:$,_fnVisbleColumns:aa,_fnGetColumns:Z,_fnColumnTypes:Ga,_fnApplyColumnDefs:hb,_fnHungarianMap:V,
_fnCamelToHungarian:G,_fnLanguageCompat:O,_fnBrowserDetect:fb,_fnAddData:I,_fnAddTr:la,_fnNodeToDataIndex:function(a,b){return b._DT_RowIndex!==l?b._DT_RowIndex:null},_fnNodeToColumnIndex:function(a,b,c){return g.inArray(c,a.aoData[b].anCells)},_fnGetCellData:v,_fnSetCellData:Ha,_fnSplitObjNotation:Ja,_fnGetObjectDataFn:W,_fnSetObjectDataFn:Q,_fnGetDataMaster:Ka,_fnClearTable:na,_fnDeleteIndex:oa,_fnInvalidate:ca,_fnGetRowElements:ma,_fnCreateTr:Ia,_fnBuildHead:ib,_fnDrawHead:ea,_fnDraw:L,_fnReDraw:M,
_fnAddOptionsHtml:lb,_fnDetectHeader:da,_fnGetUniqueThs:pa,_fnFeatureHtmlFilter:nb,_fnFilterComplete:fa,_fnFilterCustom:wb,_fnFilterColumn:vb,_fnFilter:ub,_fnFilterCreateSearch:Pa,_fnEscapeRegex:ua,_fnFilterData:xb,_fnFeatureHtmlInfo:qb,_fnUpdateInfo:Ab,_fnInfoMacros:Bb,_fnInitialise:ga,_fnInitComplete:sa,_fnLengthChange:Qa,_fnFeatureHtmlLength:mb,_fnFeatureHtmlPaginate:rb,_fnPageChange:Sa,_fnFeatureHtmlProcessing:ob,_fnProcessingDisplay:B,_fnFeatureHtmlTable:pb,_fnScrollDraw:Y,_fnApplyToChildren:F,
_fnCalculateColumnWidths:Fa,_fnThrottle:ta,_fnConvertToWidth:Cb,_fnScrollingWidthAdjust:Eb,_fnGetWidestNode:Db,_fnGetMaxLenString:Fb,_fnStringToCss:s,_fnScrollBarWidth:Gb,_fnSortFlatten:T,_fnSort:kb,_fnSortAria:Ib,_fnSortListener:Ta,_fnSortAttachListener:Na,_fnSortingClasses:wa,_fnSortData:Hb,_fnSaveState:xa,_fnLoadState:Jb,_fnSettingsFromNode:ya,_fnLog:R,_fnMap:D,_fnBindAction:Ua,_fnCallbackReg:x,_fnCallbackFire:u,_fnLengthOverflow:Ra,_fnRenderer:Oa,_fnDataSource:A,_fnRowAttributes:La,_fnCalculateEnd:function(){}});
g.fn.dataTable=p;g.fn.dataTableSettings=p.settings;g.fn.dataTableExt=p.ext;g.fn.DataTable=function(a){return g(this).dataTable(a).api()};g.each(p,function(a,b){g.fn.DataTable[a]=b});return g.fn.dataTable};"function"===typeof define&&define.amd?define("datatables",["jquery"],O):"object"===typeof exports?O(require("jquery")):jQuery&&!jQuery.fn.dataTable&&O(jQuery)})(window,document);
;
(function (root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    factory(exports);
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports'], factory);
  } else {
    // Browser globals
    factory(root);
  }
} (this, function (exports) {
  //Default config/variables
  var VERSION = '1.0.0';

  /**
   * IntroJs main class
   *
   * @class IntroJs
   */
  function IntroJs(obj) {
    this._targetElement = obj;

    this._options = {
      /* Next button label in tooltip box */
      nextLabel: 'Next &rarr;',
      /* Previous button label in tooltip box */
      prevLabel: '&larr; Back',
      /* Skip button label in tooltip box */
      skipLabel: 'Skip',
      /* Done button label in tooltip box */
      doneLabel: 'Done',
      /* Default tooltip box position */
      tooltipPosition: 'bottom',
      /* Next CSS class for tooltip boxes */
      tooltipClass: '',
      /* CSS class that is added to the helperLayer */
      highlightClass: '',
      /* Close introduction when pressing Escape button? */
      exitOnEsc: true,
      /* Close introduction when clicking on overlay layer? */
      exitOnOverlayClick: true,
      /* Show step numbers in introduction? */
      showStepNumbers: true,
      /* Let user use keyboard to navigate the tour? */
      keyboardNavigation: true,
      /* Show tour control buttons? */
      showButtons: true,
      /* Show tour bullets? */
      showBullets: true,
      /* Show tour progress? */
      showProgress: false,
      /* Scroll to highlighted element? */
      scrollToElement: true,
      /* Set the overlay opacity */
      overlayOpacity: 0.8,
      /* Precedence of positions, when auto is enabled */
      positionPrecedence: ["bottom", "top", "right", "left"],
      /* Disable an interaction with element? */
      disableInteraction: false
    };
  }

  /**
   * Initiate a new introduction/guide from an element in the page
   *
   * @api private
   * @method _introForElement
   * @param {Object} targetElm
   * @returns {Boolean} Success or not?
   */
  function _introForElement(targetElm) {
    var introItems = [],
        self = this;

    if (this._options.steps) {
      //use steps passed programmatically
      var allIntroSteps = [];

      for (var i = 0, stepsLength = this._options.steps.length; i < stepsLength; i++) {
        var currentItem = _cloneObject(this._options.steps[i]);
        //set the step
        currentItem.step = introItems.length + 1;
        //use querySelector function only when developer used CSS selector
        if (typeof(currentItem.element) === 'string') {
          //grab the element with given selector from the page
          currentItem.element = document.querySelector(currentItem.element);
        }

        //intro without element
        if (typeof(currentItem.element) === 'undefined' || currentItem.element == null) {
          var floatingElementQuery = document.querySelector(".introjsFloatingElement");

          if (floatingElementQuery == null) {
            floatingElementQuery = document.createElement('div');
            floatingElementQuery.className = 'introjsFloatingElement';

            document.body.appendChild(floatingElementQuery);
          }

          currentItem.element  = floatingElementQuery;
          currentItem.position = 'floating';
        }

        if (currentItem.element != null) {
          introItems.push(currentItem);
        }
      }

    } else {
      //use steps from data-* annotations
      var allIntroSteps = targetElm.querySelectorAll('*[data-intro]');
      //if there's no element to intro
      if (allIntroSteps.length < 1) {
        return false;
      }

      //first add intro items with data-step
      for (var i = 0, elmsLength = allIntroSteps.length; i < elmsLength; i++) {
        var currentElement = allIntroSteps[i];
        var step = parseInt(currentElement.getAttribute('data-step'), 10);

        if (step > 0) {
          introItems[step - 1] = {
            element: currentElement,
            intro: currentElement.getAttribute('data-intro'),
            step: parseInt(currentElement.getAttribute('data-step'), 10),
            tooltipClass: currentElement.getAttribute('data-tooltipClass'),
            highlightClass: currentElement.getAttribute('data-highlightClass'),
            position: currentElement.getAttribute('data-position') || this._options.tooltipPosition
          };
        }
      }

      //next add intro items without data-step
      //todo: we need a cleanup here, two loops are redundant
      var nextStep = 0;
      for (var i = 0, elmsLength = allIntroSteps.length; i < elmsLength; i++) {
        var currentElement = allIntroSteps[i];

        if (currentElement.getAttribute('data-step') == null) {

          while (true) {
            if (typeof introItems[nextStep] == 'undefined') {
              break;
            } else {
              nextStep++;
            }
          }

          introItems[nextStep] = {
            element: currentElement,
            intro: currentElement.getAttribute('data-intro'),
            step: nextStep + 1,
            tooltipClass: currentElement.getAttribute('data-tooltipClass'),
            highlightClass: currentElement.getAttribute('data-highlightClass'),
            position: currentElement.getAttribute('data-position') || this._options.tooltipPosition
          };
        }
      }
    }

    //removing undefined/null elements
    var tempIntroItems = [];
    for (var z = 0; z < introItems.length; z++) {
      introItems[z] && tempIntroItems.push(introItems[z]);  // copy non-empty values to the end of the array
    }

    introItems = tempIntroItems;

    //Ok, sort all items with given steps
    introItems.sort(function (a, b) {
      return a.step - b.step;
    });

    //set it to the introJs object
    self._introItems = introItems;

    //add overlay layer to the page
    if(_addOverlayLayer.call(self, targetElm)) {
      //then, start the show
      _nextStep.call(self);

      var skipButton     = targetElm.querySelector('.introjs-skipbutton'),
          nextStepButton = targetElm.querySelector('.introjs-nextbutton');

      self._onKeyDown = function(e) {
        if (e.keyCode === 27 && self._options.exitOnEsc == true) {
          //escape key pressed, exit the intro
          _exitIntro.call(self, targetElm);
          //check if any callback is defined
          if (self._introExitCallback != undefined) {
            self._introExitCallback.call(self);
          }
        } else if(e.keyCode === 37) {
          //left arrow
          _previousStep.call(self);
        } else if (e.keyCode === 39) {
          //right arrow
          _nextStep.call(self);
        } else if (e.keyCode === 13) {
          //srcElement === ie
          var target = e.target || e.srcElement;
          if (target && target.className.indexOf('introjs-prevbutton') > 0) {
            //user hit enter while focusing on previous button
            _previousStep.call(self);
          } else if (target && target.className.indexOf('introjs-skipbutton') > 0) {
            //user hit enter while focusing on skip button
            _exitIntro.call(self, targetElm);
          } else {
            //default behavior for responding to enter
            _nextStep.call(self);
          }

          //prevent default behaviour on hitting Enter, to prevent steps being skipped in some browsers
          if(e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
      };

      self._onResize = function(e) {
        _setHelperLayerPosition.call(self, document.querySelector('.introjs-helperLayer'));
        _setHelperLayerPosition.call(self, document.querySelector('.introjs-tooltipReferenceLayer'));
      };

      if (window.addEventListener) {
        if (this._options.keyboardNavigation) {
          window.addEventListener('keydown', self._onKeyDown, true);
        }
        //for window resize
        window.addEventListener('resize', self._onResize, true);
      } else if (document.attachEvent) { //IE
        if (this._options.keyboardNavigation) {
          document.attachEvent('onkeydown', self._onKeyDown);
        }
        //for window resize
        document.attachEvent('onresize', self._onResize);
      }
    }
    return false;
  }

 /*
   * makes a copy of the object
   * @api private
   * @method _cloneObject
  */
  function _cloneObject(object) {
      if (object == null || typeof (object) != 'object' || typeof (object.nodeType) != 'undefined') {
          return object;
      }
      var temp = {};
      for (var key in object) {
          temp[key] = _cloneObject(object[key]);
      }
      return temp;
  }
  /**
   * Go to specific step of introduction
   *
   * @api private
   * @method _goToStep
   */
  function _goToStep(step) {
    //because steps starts with zero
    this._currentStep = step - 2;
    if (typeof (this._introItems) !== 'undefined') {
      _nextStep.call(this);
    }
  }

  /**
   * Go to next step on intro
   *
   * @api private
   * @method _nextStep
   */
  function _nextStep() {
    this._direction = 'forward';

    if (typeof (this._currentStep) === 'undefined') {
      this._currentStep = 0;
    } else {
      ++this._currentStep;
    }

    if ((this._introItems.length) <= this._currentStep) {
      //end of the intro
      //check if any callback is defined
      if (typeof (this._introCompleteCallback) === 'function') {
        this._introCompleteCallback.call(this);
      }
      _exitIntro.call(this, this._targetElement);
      return;
    }

    var nextStep = this._introItems[this._currentStep];
    if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
      this._introBeforeChangeCallback.call(this, nextStep.element);
    }

    _showElement.call(this, nextStep);
  }

  /**
   * Go to previous step on intro
   *
   * @api private
   * @method _nextStep
   */
  function _previousStep() {
    this._direction = 'backward';

    if (this._currentStep === 0) {
      return false;
    }

    var nextStep = this._introItems[--this._currentStep];
    if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
      this._introBeforeChangeCallback.call(this, nextStep.element);
    }

    _showElement.call(this, nextStep);
  }

  /**
   * Exit from intro
   *
   * @api private
   * @method _exitIntro
   * @param {Object} targetElement
   */
  function _exitIntro(targetElement) {
    //remove overlay layer from the page
    var overlayLayer = targetElement.querySelector('.introjs-overlay');

    //return if intro already completed or skipped
    if (overlayLayer == null) {
      return;
    }

    //for fade-out animation
    overlayLayer.style.opacity = 0;
    setTimeout(function () {
      if (overlayLayer.parentNode) {
        overlayLayer.parentNode.removeChild(overlayLayer);
      }
    }, 500);

    //remove all helper layers
    var helperLayer = targetElement.querySelector('.introjs-helperLayer');
    if (helperLayer) {
      helperLayer.parentNode.removeChild(helperLayer);
    }

    var referenceLayer = targetElement.querySelector('.introjs-tooltipReferenceLayer');
    if (referenceLayer) {
      referenceLayer.parentNode.removeChild(referenceLayer);
	}
    //remove disableInteractionLayer
    var disableInteractionLayer = targetElement.querySelector('.introjs-disableInteraction');
    if (disableInteractionLayer) {
      disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
    }

    //remove intro floating element
    var floatingElement = document.querySelector('.introjsFloatingElement');
    if (floatingElement) {
      floatingElement.parentNode.removeChild(floatingElement);
    }

    //remove `introjs-showElement` class from the element
    var showElement = document.querySelector('.introjs-showElement');
    if (showElement) {
      showElement.className = showElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, ''); // This is a manual trim.
    }

    //remove `introjs-fixParent` class from the elements
    var fixParents = document.querySelectorAll('.introjs-fixParent');
    if (fixParents && fixParents.length > 0) {
      for (var i = fixParents.length - 1; i >= 0; i--) {
        fixParents[i].className = fixParents[i].className.replace(/introjs-fixParent/g, '').replace(/^\s+|\s+$/g, '');
      };
    }

    //clean listeners
    if (window.removeEventListener) {
      window.removeEventListener('keydown', this._onKeyDown, true);
    } else if (document.detachEvent) { //IE
      document.detachEvent('onkeydown', this._onKeyDown);
    }

    //set the step to zero
    this._currentStep = undefined;
  }

  /**
   * Render tooltip box in the page
   *
   * @api private
   * @method _placeTooltip
   * @param {Object} targetElement
   * @param {Object} tooltipLayer
   * @param {Object} arrowLayer
   */
  function _placeTooltip(targetElement, tooltipLayer, arrowLayer, helperNumberLayer) {
    var tooltipCssClass = '',
        currentStepObj,
        tooltipOffset,
        targetElementOffset;

    //reset the old style
    tooltipLayer.style.top        = null;
    tooltipLayer.style.right      = null;
    tooltipLayer.style.bottom     = null;
    tooltipLayer.style.left       = null;
    tooltipLayer.style.marginLeft = null;
    tooltipLayer.style.marginTop  = null;

    arrowLayer.style.display = 'inherit';

    if (typeof(helperNumberLayer) != 'undefined' && helperNumberLayer != null) {
      helperNumberLayer.style.top  = null;
      helperNumberLayer.style.left = null;
    }

    //prevent error when `this._currentStep` is undefined
    if (!this._introItems[this._currentStep]) return;

    //if we have a custom css class for each step
    currentStepObj = this._introItems[this._currentStep];
    if (typeof (currentStepObj.tooltipClass) === 'string') {
      tooltipCssClass = currentStepObj.tooltipClass;
    } else {
      tooltipCssClass = this._options.tooltipClass;
    }

    tooltipLayer.className = ('introjs-tooltip ' + tooltipCssClass).replace(/^\s+|\s+$/g, '');

    //custom css class for tooltip boxes
    var tooltipCssClass = this._options.tooltipClass;

    currentTooltipPosition = this._introItems[this._currentStep].position;
    if ((currentTooltipPosition == "auto" || this._options.tooltipPosition == "auto")) {
      if (currentTooltipPosition != "floating") { // Floating is always valid, no point in calculating
        currentTooltipPosition = _determineAutoPosition.call(this, targetElement, tooltipLayer, currentTooltipPosition)
      }
    }
    var targetOffset = _getOffset(targetElement)
    var tooltipHeight = _getOffset(tooltipLayer).height
    var windowSize = _getWinSize()
    switch (currentTooltipPosition) {
      case 'top':
        tooltipLayer.style.left = '15px';
        tooltipLayer.style.top = '-' + (tooltipHeight + 10) + 'px';
        arrowLayer.className = 'introjs-arrow bottom';
        break;
      case 'right':
        tooltipLayer.style.left = (_getOffset(targetElement).width + 20) + 'px';
        if (targetOffset.top + tooltipHeight > windowSize.height) {
          // In this case, right would have fallen below the bottom of the screen.
          // Modify so that the bottom of the tooltip connects with the target
          arrowLayer.className = "introjs-arrow left-bottom";
          tooltipLayer.style.top = "-" + (tooltipHeight - targetOffset.height - 20) + "px"
        }
        arrowLayer.className = 'introjs-arrow left';
        break;
      case 'left':
        if (this._options.showStepNumbers == true) {
          tooltipLayer.style.top = '15px';
        }

        if (targetOffset.top + tooltipHeight > windowSize.height) {
          // In this case, left would have fallen below the bottom of the screen.
          // Modify so that the bottom of the tooltip connects with the target
          tooltipLayer.style.top = "-" + (tooltipHeight - targetOffset.height - 20) + "px"
          arrowLayer.className = 'introjs-arrow right-bottom';
        } else {
          arrowLayer.className = 'introjs-arrow right';
        }
        tooltipLayer.style.right = (targetOffset.width + 20) + 'px';


        break;
      case 'floating':
        arrowLayer.style.display = 'none';

        //we have to adjust the top and left of layer manually for intro items without element
        tooltipOffset = _getOffset(tooltipLayer);

        tooltipLayer.style.left   = '50%';
        tooltipLayer.style.top    = '50%';
        tooltipLayer.style.marginLeft = '-' + (tooltipOffset.width / 2)  + 'px';
        tooltipLayer.style.marginTop  = '-' + (tooltipOffset.height / 2) + 'px';

        if (typeof(helperNumberLayer) != 'undefined' && helperNumberLayer != null) {
          helperNumberLayer.style.left = '-' + ((tooltipOffset.width / 2) + 18) + 'px';
          helperNumberLayer.style.top  = '-' + ((tooltipOffset.height / 2) + 18) + 'px';
        }

        break;
      case 'bottom-right-aligned':
        arrowLayer.className      = 'introjs-arrow top-right';
        tooltipLayer.style.right  = '0px';
        tooltipLayer.style.bottom = '-' + (_getOffset(tooltipLayer).height + 10) + 'px';
        break;
      case 'bottom-middle-aligned':
        targetElementOffset = _getOffset(targetElement);
        tooltipOffset       = _getOffset(tooltipLayer);

        arrowLayer.className      = 'introjs-arrow top-middle';
        tooltipLayer.style.left   = (targetElementOffset.width / 2 - tooltipOffset.width / 2) + 'px';
        tooltipLayer.style.bottom = '-' + (tooltipOffset.height + 10) + 'px';
        break;
      case 'bottom-left-aligned':
      // Bottom-left-aligned is the same as the default bottom
      case 'bottom':
      // Bottom going to follow the default behavior
      default:
        tooltipLayer.style.bottom = '-' + (_getOffset(tooltipLayer).height + 10) + 'px';
        tooltipLayer.style.left = (_getOffset(targetElement).width / 2 - _getOffset(tooltipLayer).width / 2) + 'px';

        arrowLayer.className = 'introjs-arrow top';
        break;
    }
  }

  /**
   * Determines the position of the tooltip based on the position precedence and availability
   * of screen space.
   *
   * @param {Object} targetElement
   * @param {Object} tooltipLayer
   * @param {Object} desiredTooltipPosition
   *
   */
  function _determineAutoPosition(targetElement, tooltipLayer, desiredTooltipPosition) {

    // Take a clone of position precedence. These will be the available
    var possiblePositions = this._options.positionPrecedence.slice()

    var windowSize = _getWinSize()
    var tooltipHeight = _getOffset(tooltipLayer).height + 10
    var tooltipWidth = _getOffset(tooltipLayer).width + 20
    var targetOffset = _getOffset(targetElement)

    // If we check all the possible areas, and there are no valid places for the tooltip, the element
    // must take up most of the screen real estate. Show the tooltip floating in the middle of the screen.
    var calculatedPosition = "floating"

    // Check if the width of the tooltip + the starting point would spill off the right side of the screen
    // If no, neither bottom or top are valid
    if (targetOffset.left + tooltipWidth > windowSize.width || ((targetOffset.left + (targetOffset.width / 2)) - tooltipWidth) < 0) {
      _removeEntry(possiblePositions, "bottom")
      _removeEntry(possiblePositions, "top");
    } else {
      // Check for space below
      if ((targetOffset.height + targetOffset.top + tooltipHeight) > windowSize.height) {
        _removeEntry(possiblePositions, "bottom")
      }

      // Check for space above
      if (targetOffset.top - tooltipHeight < 0) {
        _removeEntry(possiblePositions, "top");
      }
    }

    // Check for space to the right
    if (targetOffset.width + targetOffset.left + tooltipWidth > windowSize.width) {
      _removeEntry(possiblePositions, "right");
    }

    // Check for space to the left
    if (targetOffset.left - tooltipWidth < 0) {
      _removeEntry(possiblePositions, "left");
    }

    // At this point, our array only has positions that are valid. Pick the first one, as it remains in order
    if (possiblePositions.length > 0) {
      calculatedPosition = possiblePositions[0];
    }

    // If the requested position is in the list, replace our calculated choice with that
    if (desiredTooltipPosition && desiredTooltipPosition != "auto") {
      if (possiblePositions.indexOf(desiredTooltipPosition) > -1) {
        calculatedPosition = desiredTooltipPosition
      }
    }

    return calculatedPosition
  }

  /**
   * Remove an entry from a string array if it's there, does nothing if it isn't there.
   *
   * @param {Array} stringArray
   * @param {String} stringToRemove
   */
  function _removeEntry(stringArray, stringToRemove) {
    if (stringArray.indexOf(stringToRemove) > -1) {
      stringArray.splice(stringArray.indexOf(stringToRemove), 1);
    }
  }

  /**
   * Update the position of the helper layer on the screen
   *
   * @api private
   * @method _setHelperLayerPosition
   * @param {Object} helperLayer
   */
  function _setHelperLayerPosition(helperLayer) {
    if (helperLayer) {
      //prevent error when `this._currentStep` in undefined
      if (!this._introItems[this._currentStep]) return;

      var currentElement  = this._introItems[this._currentStep],
          elementPosition = _getOffset(currentElement.element),
          widthHeightPadding = 10;

      if (currentElement.position == 'floating') {
        widthHeightPadding = 0;
      }

      //set new position to helper layer
      helperLayer.setAttribute('style', 'width: ' + (elementPosition.width  + widthHeightPadding)  + 'px; ' +
                                        'height:' + (elementPosition.height + widthHeightPadding)  + 'px; ' +
                                        'top:'    + (elementPosition.top    - 5)   + 'px;' +
                                        'left: '  + (elementPosition.left   - 5)   + 'px;');

    }
  }

  /**
   * Add disableinteraction layer and adjust the size and position of the layer
   *
   * @api private
   * @method _disableInteraction
   */
  function _disableInteraction () {
    var disableInteractionLayer = document.querySelector('.introjs-disableInteraction');
    if (disableInteractionLayer === null) {
      disableInteractionLayer = document.createElement('div');
      disableInteractionLayer.className = 'introjs-disableInteraction';
      this._targetElement.appendChild(disableInteractionLayer);
    }

    _setHelperLayerPosition.call(this, disableInteractionLayer);
  }

  /**
   * Show an element on the page
   *
   * @api private
   * @method _showElement
   * @param {Object} targetElement
   */
  function _showElement(targetElement) {

    if (typeof (this._introChangeCallback) !== 'undefined') {
      this._introChangeCallback.call(this, targetElement.element);
    }

    var self = this,
        oldHelperLayer = document.querySelector('.introjs-helperLayer'),
        oldReferenceLayer = document.querySelector('.introjs-tooltipReferenceLayer'),
        highlightClass = 'introjs-helperLayer',
        elementPosition = _getOffset(targetElement.element);

    //check for a current step highlight class
    if (typeof (targetElement.highlightClass) === 'string') {
      highlightClass += (' ' + targetElement.highlightClass);
    }
    //check for options highlight class
    if (typeof (this._options.highlightClass) === 'string') {
      highlightClass += (' ' + this._options.highlightClass);
    }

    if (oldHelperLayer != null) {
      var oldHelperNumberLayer = oldReferenceLayer.querySelector('.introjs-helperNumberLayer'),
          oldtooltipLayer      = oldReferenceLayer.querySelector('.introjs-tooltiptext'),
          oldArrowLayer        = oldReferenceLayer.querySelector('.introjs-arrow'),
          oldtooltipContainer  = oldReferenceLayer.querySelector('.introjs-tooltip'),
          skipTooltipButton    = oldReferenceLayer.querySelector('.introjs-skipbutton'),
          prevTooltipButton    = oldReferenceLayer.querySelector('.introjs-prevbutton'),
          nextTooltipButton    = oldReferenceLayer.querySelector('.introjs-nextbutton');

      //update or reset the helper highlight class
      oldHelperLayer.className = highlightClass;
      //hide the tooltip
      oldtooltipContainer.style.opacity = 0;
      oldtooltipContainer.style.display = "none";

      if (oldHelperNumberLayer != null) {
        var lastIntroItem = this._introItems[(targetElement.step - 2 >= 0 ? targetElement.step - 2 : 0)];

        if (lastIntroItem != null && (this._direction == 'forward' && lastIntroItem.position == 'floating') || (this._direction == 'backward' && targetElement.position == 'floating')) {
          oldHelperNumberLayer.style.opacity = 0;
        }
      }

      //set new position to helper layer
      _setHelperLayerPosition.call(self, oldHelperLayer);
      _setHelperLayerPosition.call(self, oldReferenceLayer);

      //remove `introjs-fixParent` class from the elements
      var fixParents = document.querySelectorAll('.introjs-fixParent');
      if (fixParents && fixParents.length > 0) {
        for (var i = fixParents.length - 1; i >= 0; i--) {
          fixParents[i].className = fixParents[i].className.replace(/introjs-fixParent/g, '').replace(/^\s+|\s+$/g, '');
        };
      }

      //remove old classes
      var oldShowElement = document.querySelector('.introjs-showElement');
      oldShowElement.className = oldShowElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, '');

      //we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and `width` calculation
      if (self._lastShowElementTimer) {
        clearTimeout(self._lastShowElementTimer);
      }
      self._lastShowElementTimer = setTimeout(function() {
        //set current step to the label
        if (oldHelperNumberLayer != null) {
          oldHelperNumberLayer.innerHTML = targetElement.step;
        }
        //set current tooltip text
        oldtooltipLayer.innerHTML = targetElement.intro;
        //set the tooltip position
        oldtooltipContainer.style.display = "block";
        _placeTooltip.call(self, targetElement.element, oldtooltipContainer, oldArrowLayer, oldHelperNumberLayer);

        //change active bullet
        oldReferenceLayer.querySelector('.introjs-bullets li > a.active').className = '';
        oldReferenceLayer.querySelector('.introjs-bullets li > a[data-stepnumber="' + targetElement.step + '"]').className = 'active';

        oldReferenceLayer.querySelector('.introjs-progress .introjs-progressbar').setAttribute('style', 'width:' + _getProgress.call(self) + '%;');

        //show the tooltip
        oldtooltipContainer.style.opacity = 1;
        if (oldHelperNumberLayer) oldHelperNumberLayer.style.opacity = 1;

        //reset button focus
        if (nextTooltipButton.tabIndex === -1) {
          //tabindex of -1 means we are at the end of the tour - focus on skip / done
          skipTooltipButton.focus();
        } else {
          //still in the tour, focus on next
          nextTooltipButton.focus();
        }
      }, 350);

    } else {
      var helperLayer       = document.createElement('div'),
          referenceLayer    = document.createElement('div'),
          arrowLayer        = document.createElement('div'),
          tooltipLayer      = document.createElement('div'),
          tooltipTextLayer  = document.createElement('div'),
          bulletsLayer      = document.createElement('div'),
          progressLayer     = document.createElement('div'),
          buttonsLayer      = document.createElement('div');

      helperLayer.className = highlightClass;
      referenceLayer.className = 'introjs-tooltipReferenceLayer';

      //set new position to helper layer
      _setHelperLayerPosition.call(self, helperLayer);
      _setHelperLayerPosition.call(self, referenceLayer);

      //add helper layer to target element
      this._targetElement.appendChild(helperLayer);
      this._targetElement.appendChild(referenceLayer);

      arrowLayer.className = 'introjs-arrow';

      tooltipTextLayer.className = 'introjs-tooltiptext';
      tooltipTextLayer.innerHTML = targetElement.intro;

      bulletsLayer.className = 'introjs-bullets';

      if (this._options.showBullets === false) {
        bulletsLayer.style.display = 'none';
      }


      var ulContainer = document.createElement('ul');

      for (var i = 0, stepsLength = this._introItems.length; i < stepsLength; i++) {
        var innerLi    = document.createElement('li');
        var anchorLink = document.createElement('a');

        anchorLink.onclick = function() {
          self.goToStep(this.getAttribute('data-stepnumber'));
        };

        if (i === (targetElement.step-1)) anchorLink.className = 'active';

        anchorLink.href = 'javascript:void(0);';
        anchorLink.innerHTML = "&nbsp;";
        anchorLink.setAttribute('data-stepnumber', this._introItems[i].step);

        innerLi.appendChild(anchorLink);
        ulContainer.appendChild(innerLi);
      }

      bulletsLayer.appendChild(ulContainer);

      progressLayer.className = 'introjs-progress';

      if (this._options.showProgress === false) {
        progressLayer.style.display = 'none';
      }
      var progressBar = document.createElement('div');
      progressBar.className = 'introjs-progressbar';
      progressBar.setAttribute('style', 'width:' + _getProgress.call(this) + '%;');

      progressLayer.appendChild(progressBar);

      buttonsLayer.className = 'introjs-tooltipbuttons';
      if (this._options.showButtons === false) {
        buttonsLayer.style.display = 'none';
      }

      tooltipLayer.className = 'introjs-tooltip';
      tooltipLayer.appendChild(tooltipTextLayer);
      tooltipLayer.appendChild(bulletsLayer);
      tooltipLayer.appendChild(progressLayer);

      //add helper layer number
      if (this._options.showStepNumbers == true) {
        var helperNumberLayer = document.createElement('span');
        helperNumberLayer.className = 'introjs-helperNumberLayer';
        helperNumberLayer.innerHTML = targetElement.step;
        referenceLayer.appendChild(helperNumberLayer);
      }

      tooltipLayer.appendChild(arrowLayer);
      referenceLayer.appendChild(tooltipLayer);

      //next button
      var nextTooltipButton = document.createElement('a');

      nextTooltipButton.onclick = function() {
        if (self._introItems.length - 1 != self._currentStep) {
          _nextStep.call(self);
        }
      };

      nextTooltipButton.href = 'javascript:void(0);';
      nextTooltipButton.innerHTML = this._options.nextLabel;

      //previous button
      var prevTooltipButton = document.createElement('a');

      prevTooltipButton.onclick = function() {
        if (self._currentStep != 0) {
          _previousStep.call(self);
        }
      };

      prevTooltipButton.href = 'javascript:void(0);';
      prevTooltipButton.innerHTML = this._options.prevLabel;

      //skip button
      var skipTooltipButton = document.createElement('a');
      skipTooltipButton.className = 'introjs-button introjs-skipbutton';
      skipTooltipButton.href = 'javascript:void(0);';
      skipTooltipButton.innerHTML = this._options.skipLabel;

      skipTooltipButton.onclick = function() {
        if (self._introItems.length - 1 == self._currentStep && typeof (self._introCompleteCallback) === 'function') {
          self._introCompleteCallback.call(self);
        }

        if (self._introItems.length - 1 != self._currentStep && typeof (self._introExitCallback) === 'function') {
          self._introExitCallback.call(self);
        }

        _exitIntro.call(self, self._targetElement);
      };

      buttonsLayer.appendChild(skipTooltipButton);

      //in order to prevent displaying next/previous button always
      if (this._introItems.length > 1) {
        buttonsLayer.appendChild(prevTooltipButton);
        buttonsLayer.appendChild(nextTooltipButton);
      }

      tooltipLayer.appendChild(buttonsLayer);

      //set proper position
      _placeTooltip.call(self, targetElement.element, tooltipLayer, arrowLayer, helperNumberLayer);
    }

    //disable interaction
    if (this._options.disableInteraction === true) {
      _disableInteraction.call(self);
    }

    prevTooltipButton.removeAttribute('tabIndex');
    nextTooltipButton.removeAttribute('tabIndex');

    if (this._currentStep == 0 && this._introItems.length > 1) {
      prevTooltipButton.className = 'introjs-button introjs-prevbutton introjs-disabled';
      prevTooltipButton.tabIndex = '-1';
      nextTooltipButton.className = 'introjs-button introjs-nextbutton';
      skipTooltipButton.innerHTML = this._options.skipLabel;
    } else if (this._introItems.length - 1 == this._currentStep || this._introItems.length == 1) {
      skipTooltipButton.innerHTML = this._options.doneLabel;
      prevTooltipButton.className = 'introjs-button introjs-prevbutton';
      nextTooltipButton.className = 'introjs-button introjs-nextbutton introjs-disabled';
      nextTooltipButton.tabIndex = '-1';
    } else {
      prevTooltipButton.className = 'introjs-button introjs-prevbutton';
      nextTooltipButton.className = 'introjs-button introjs-nextbutton';
      skipTooltipButton.innerHTML = this._options.skipLabel;
    }

    //Set focus on "next" button, so that hitting Enter always moves you onto the next step
    nextTooltipButton.focus();

    //add target element position style
    targetElement.element.className += ' introjs-showElement';

    var currentElementPosition = _getPropValue(targetElement.element, 'position');
    if (currentElementPosition !== 'absolute' &&
        currentElementPosition !== 'relative') {
      //change to new intro item
      targetElement.element.className += ' introjs-relativePosition';
    }

    var parentElm = targetElement.element.parentNode;
    while (parentElm != null) {
      if (parentElm.tagName.toLowerCase() === 'body') break;

      //fix The Stacking Contenxt problem.
      //More detail: https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context
      var zIndex = _getPropValue(parentElm, 'z-index');
      var opacity = parseFloat(_getPropValue(parentElm, 'opacity'));
      var transform = _getPropValue(parentElm, 'transform') || _getPropValue(parentElm, '-webkit-transform') || _getPropValue(parentElm, '-moz-transform') || _getPropValue(parentElm, '-ms-transform') || _getPropValue(parentElm, '-o-transform');
      if (/[0-9]+/.test(zIndex) || opacity < 1 || transform !== 'none') {
        parentElm.className += ' introjs-fixParent';
      }

      parentElm = parentElm.parentNode;
    }

    if (!_elementInViewport(targetElement.element) && this._options.scrollToElement === true) {
      var rect = targetElement.element.getBoundingClientRect(),
        winHeight = _getWinSize().height,
        top = rect.bottom - (rect.bottom - rect.top),
        bottom = rect.bottom - winHeight;

      //Scroll up
      if (top < 0 || targetElement.element.clientHeight > winHeight) {
        window.scrollBy(0, top - 30); // 30px padding from edge to look nice

      //Scroll down
      } else {
        window.scrollBy(0, bottom + 100); // 70px + 30px padding from edge to look nice
      }
    }

    if (typeof (this._introAfterChangeCallback) !== 'undefined') {
      this._introAfterChangeCallback.call(this, targetElement.element);
    }
  }

  /**
   * Get an element CSS property on the page
   * Thanks to JavaScript Kit: http://www.javascriptkit.com/dhtmltutors/dhtmlcascade4.shtml
   *
   * @api private
   * @method _getPropValue
   * @param {Object} element
   * @param {String} propName
   * @returns Element's property value
   */
  function _getPropValue (element, propName) {
    var propValue = '';
    if (element.currentStyle) { //IE
      propValue = element.currentStyle[propName];
    } else if (document.defaultView && document.defaultView.getComputedStyle) { //Others
      propValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propName);
    }

    //Prevent exception in IE
    if (propValue && propValue.toLowerCase) {
      return propValue.toLowerCase();
    } else {
      return propValue;
    }
  }

  /**
   * Provides a cross-browser way to get the screen dimensions
   * via: http://stackoverflow.com/questions/5864467/internet-explorer-innerheight
   *
   * @api private
   * @method _getWinSize
   * @returns {Object} width and height attributes
   */
  function _getWinSize() {
    if (window.innerWidth != undefined) {
      return { width: window.innerWidth, height: window.innerHeight };
    } else {
      var D = document.documentElement;
      return { width: D.clientWidth, height: D.clientHeight };
    }
  }

  /**
   * Add overlay layer to the page
   * http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
   *
   * @api private
   * @method _elementInViewport
   * @param {Object} el
   */
  function _elementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      (rect.bottom+80) <= window.innerHeight && // add 80 to get the text right
      rect.right <= window.innerWidth
    );
  }

  /**
   * Add overlay layer to the page
   *
   * @api private
   * @method _addOverlayLayer
   * @param {Object} targetElm
   */
  function _addOverlayLayer(targetElm) {
    var overlayLayer = document.createElement('div'),
        styleText = '',
        self = this;

    //set css class name
    overlayLayer.className = 'introjs-overlay';

    //check if the target element is body, we should calculate the size of overlay layer in a better way
    if (targetElm.tagName.toLowerCase() === 'body') {
      styleText += 'top: 0;bottom: 0; left: 0;right: 0;position: fixed;';
      overlayLayer.setAttribute('style', styleText);
    } else {
      //set overlay layer position
      var elementPosition = _getOffset(targetElm);
      if (elementPosition) {
        styleText += 'width: ' + elementPosition.width + 'px; height:' + elementPosition.height + 'px; top:' + elementPosition.top + 'px;left: ' + elementPosition.left + 'px;';
        overlayLayer.setAttribute('style', styleText);
      }
    }

    targetElm.appendChild(overlayLayer);

    overlayLayer.onclick = function() {
      if (self._options.exitOnOverlayClick == true) {
        _exitIntro.call(self, targetElm);

        //check if any callback is defined
        if (self._introExitCallback != undefined) {
          self._introExitCallback.call(self);
        }
      }
    };

    setTimeout(function() {
      styleText += 'opacity: ' + self._options.overlayOpacity.toString() + ';';
      overlayLayer.setAttribute('style', styleText);
    }, 10);

    return true;
  }

  /**
   * Get an element position on the page
   * Thanks to `meouw`: http://stackoverflow.com/a/442474/375966
   *
   * @api private
   * @method _getOffset
   * @param {Object} element
   * @returns Element's position info
   */
  function _getOffset(element) {
    var elementPosition = {};

    //set width
    elementPosition.width = element.offsetWidth;

    //set height
    elementPosition.height = element.offsetHeight;

    //calculate element top and left
    var _x = 0;
    var _y = 0;
    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
      _x += element.offsetLeft;
      _y += element.offsetTop;
      element = element.offsetParent;
    }
    //set top
    elementPosition.top = _y;
    //set left
    elementPosition.left = _x;

    return elementPosition;
  }

  /**
   * Gets the current progress percentage
   *
   * @api private
   * @method _getProgress
   * @returns current progress percentage
   */
  function _getProgress() {
    // Steps are 0 indexed
    var currentStep = parseInt((this._currentStep + 1), 10);
    return ((currentStep / this._introItems.length) * 100);
  }

  /**
   * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
   * via: http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
   *
   * @param obj1
   * @param obj2
   * @returns obj3 a new object based on obj1 and obj2
   */
  function _mergeOptions(obj1,obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
  }

  var introJs = function (targetElm) {
    if (typeof (targetElm) === 'object') {
      //Ok, create a new instance
      return new IntroJs(targetElm);

    } else if (typeof (targetElm) === 'string') {
      //select the target element with query selector
      var targetElement = document.querySelector(targetElm);

      if (targetElement) {
        return new IntroJs(targetElement);
      } else {
        throw new Error('There is no element with given selector.');
      }
    } else {
      return new IntroJs(document.body);
    }
  };

  /**
   * Current IntroJs version
   *
   * @property version
   * @type String
   */
  introJs.version = VERSION;

  //Prototype
  introJs.fn = IntroJs.prototype = {
    clone: function () {
      return new IntroJs(this);
    },
    setOption: function(option, value) {
      this._options[option] = value;
      return this;
    },
    setOptions: function(options) {
      this._options = _mergeOptions(this._options, options);
      return this;
    },
    start: function () {
      _introForElement.call(this, this._targetElement);
      return this;
    },
    goToStep: function(step) {
      _goToStep.call(this, step);
      return this;
    },
    nextStep: function() {
      _nextStep.call(this);
      return this;
    },
    previousStep: function() {
      _previousStep.call(this);
      return this;
    },
    exit: function() {
      _exitIntro.call(this, this._targetElement);
      return this;
    },
    refresh: function() {
      _setHelperLayerPosition.call(this, document.querySelector('.introjs-helperLayer'));
      _setHelperLayerPosition.call(this, document.querySelector('.introjs-tooltipReferenceLayer'));
      return this;
    },
    onbeforechange: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introBeforeChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onbeforechange was not a function');
      }
      return this;
    },
    onchange: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onchange was not a function.');
      }
      return this;
    },
    onafterchange: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introAfterChangeCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onafterchange was not a function');
      }
      return this;
    },
    oncomplete: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introCompleteCallback = providedCallback;
      } else {
        throw new Error('Provided callback for oncomplete was not a function.');
      }
      return this;
    },
    onexit: function(providedCallback) {
      if (typeof (providedCallback) === 'function') {
        this._introExitCallback = providedCallback;
      } else {
        throw new Error('Provided callback for onexit was not a function.');
      }
      return this;
    }
  };

  exports.introJs = introJs;
  return introJs;
}));
;
(function ( $ ) {

	$.fn.BootSideMenu = function( options ) {

		var oldCode, newCode, side;

		newCode = "";

		var settings = $.extend({
			side:"left",
			autoClose:true
		}, options );

		side = settings.side;
		autoClose = settings.autoClose;

		this.addClass("container sidebar");

		if(side=="left"){
			this.addClass("sidebar-left");
		}else if(side=="right"){
			this.addClass("sidebar-right");
		}else{
			this.addClass("sidebar-left");	
		}

		oldCode = this.html();

		newCode += "<div class=\"row\">\n";
		newCode += "	<div class=\"sidebar-row\" data-side=\""+side+"\">\n"+ oldCode+" </div>\n";
		newCode += "</div>";
		newCode += "<div class=\"toggler\">\n";
		newCode += "	<span class=\"glyphicon glyphicon-chevron-right\">&nbsp;</span> <span class=\"glyphicon glyphicon-chevron-left\">&nbsp;</span>\n";
		newCode += "</div>\n";

		this.html(newCode);

		if(autoClose){
			$(this).find(".toggler").trigger("click");
		}

	};

	$(document).on('click', '.sidebar .list-group-item', function(){
		$('.sidebar .list-group-item').each(function(){
			$(this).removeClass('active');
		});
		$(this).addClass('active');
	});


	$(document).on('click', '.sidebar .list-group-item', function(event){
		var idToToggle, this_offset, this_x, this_y, href, side;
		event.preventDefault();
		href = $(this).attr('href');

		if(href.substr(0,1)=='#'){

			idToToggle = href.substr(1,href.length); 

			if(searchSubMenu(idToToggle)){

				this_offset = $(this).offset();
				side = $(this).parent().parent().attr('data-side');

				if(side=='left'){
					this_x = $(this).width() + 10;
					this_y = this_offset.top +1;
					$('#'+idToToggle).css('left', this_x);
					$('#'+idToToggle).css('top', this_y);			
				}else if(side=='right'){
					this_x = $(this).width()+10;
					this_y = this_offset.top +1;
					$('#'+idToToggle).css('right', this_x);
					$('#'+idToToggle).css('top', this_y);			
				}

				$('#'+idToToggle).fadeIn();

			}else{
				$('.submenu').fadeOut();
			}
		}
	});


	$(document).on('click','.toggler', function(){
		var toggler = $(this);
		var container = toggler.parent();
		var listaClassi = container[0].classList;
		var side = getSide(listaClassi);
		var containerWidth = container.width();
		var status = container.attr('data-status');
		if(!status){
			status = "opened";
		}
		doAnimation(container, containerWidth, side, status);
	});

	/*Cerca un div con classe submenu e id uguale a quello passato*/
	function searchSubMenu(id){
		var found = false;
		$('.submenu').each(function(){
			var thisId = $(this).attr('id');
			if(id==thisId){
				found = true;
			}
		});
		return found;
	}

//restituisce il lato del sidebar in base alla classe che trova settata
function getSide(listaClassi){
	var side;
	for(var i = 0; i<listaClassi.length; i++){
		if(listaClassi[i]=='sidebar-left'){
			side = "left";
			break;
		}else if(listaClassi[i]=='sidebar-right'){
			side = "right";
			break;
		}else{
			side = null;
		}
	}
	return side;
}
//esegue l'animazione
function doAnimation(container, containerWidth, sidebarSide, sidebarStatus){
	var toggler = container.children()[1];
	if(sidebarStatus=="opened"){
		if(sidebarSide=="left"){
			container.animate({
				left:-(containerWidth+2)
			});
			toggleArrow(toggler, "left");
		}else if(sidebarSide=="right"){
			container.animate({
				right:- (containerWidth +2)
			});
			toggleArrow(toggler, "right");
		}
		container.attr('data-status', 'closed');
	}else{
		if(sidebarSide=="left"){
			container.animate({
				left:0
			});
			toggleArrow(toggler, "right");
		}else if(sidebarSide=="right"){
			container.animate({
				right:0
			});
			toggleArrow(toggler, "left");
		}
		container.attr('data-status', 'opened');

	}

}

function toggleArrow(toggler, side){
	if(side=="left"){
		$(toggler).children(".glyphicon-chevron-right").css('display', 'block');
		$(toggler).children(".glyphicon-chevron-left").css('display', 'none');
	}else if(side=="right"){
		$(toggler).children(".glyphicon-chevron-left").css('display', 'block');
		$(toggler).children(".glyphicon-chevron-right").css('display', 'none');
	}
}

}( jQuery ));

;
(function ($) {

    "use strict";
    $.fn.rowReordering = function (options) {

        function _fnStartProcessingMode(oTable) {
            ///<summary>
            ///Function that starts "Processing" mode i.e. shows "Processing..." dialog while some action is executing(Default function)
            ///</summary>

            if (oTable.fnSettings().oFeatures.bProcessing) {
                $(".dataTables_processing").css('visibility', 'visible');
            }
        }

        function _fnEndProcessingMode(oTable) {
            ///<summary>
            ///Function that ends the "Processing" mode and returns the table in the normal state(Default function)
            ///</summary>

            if (oTable.fnSettings().oFeatures.bProcessing) {
                $(".dataTables_processing").css('visibility', 'hidden');
            }
        }

        ///Not used
        function fnGetStartPosition(oTable, sSelector) {
            var iStart = 1000000;
            $(sSelector, oTable).each(function () {
                iPosition = parseInt(oTable.fnGetData(this, properties.iIndexColumn));
                if (iPosition < iStart)
                    iStart = iPosition;
            });
            return iStart;
        }

        function fnCancelSorting(oTable, tbody, properties, iLogLevel, sMessage) {
            tbody.sortable('cancel');
            if(iLogLevel<=properties.iLogLevel){
                if(sMessage!= undefined){
                    properties.fnAlert(sMessage, "");
                }else{
                    properties.fnAlert("Row cannot be moved", "");
                }
            }
            properties.fnEndProcessingMode(oTable);
        }

        function fnGetState(oTable, sSelector, id) {

            var tr = $("#" + id, oTable);
            var iCurrentPosition = oTable.fnGetData(tr[0], properties.iIndexColumn);
            var iNewPosition = -1; // fnGetStartPosition(sSelector);
            var sDirection;
            var trPrevious = tr.prev(sSelector);
            if (trPrevious.length > 0) {
                iNewPosition = parseInt(oTable.fnGetData(trPrevious[0], properties.iIndexColumn));
                if (iNewPosition < iCurrentPosition) {
                    iNewPosition = iNewPosition + 1;
                }
            } else {
                var trNext = tr.next(sSelector);
                if (trNext.length > 0) {
                    iNewPosition = parseInt(oTable.fnGetData(trNext[0], properties.iIndexColumn));
                    if (iNewPosition > iCurrentPosition)//moved back
                        iNewPosition = iNewPosition - 1;
                }
            }
            if (iNewPosition < iCurrentPosition)
                sDirection = "back";
            else
                sDirection = "forward";

            return { sDirection: sDirection, iCurrentPosition: iCurrentPosition, iNewPosition: iNewPosition };

        }

        function fnMoveRows(oTable, sSelector, iCurrentPosition, iNewPosition, sDirection, id, sGroup) {
            var iStart = iCurrentPosition;
            var iEnd = iNewPosition;
            if (sDirection == "back") {
                iStart = iNewPosition;
                iEnd = iCurrentPosition;
            }

            $(oTable.fnGetNodes()).each(function () {
                if (sGroup != "" && $(this).attr("data-group") != sGroup)
                    return;
                var tr = this;
                var iRowPosition = parseInt(oTable.fnGetData(tr, properties.iIndexColumn));
                if (iStart <= iRowPosition && iRowPosition <= iEnd) {
                    if (tr.id == id) {
                        oTable.fnUpdate(iNewPosition,
                            oTable.fnGetPosition(tr), // get row position in current model
                            properties.iIndexColumn,
                            false); // false = defer redraw until all row updates are done
                    } else {
                        if (sDirection == "back") {
                            oTable.fnUpdate(iRowPosition + 1,
                                oTable.fnGetPosition(tr), // get row position in current model
                                properties.iIndexColumn,
                                false); // false = defer redraw until all row updates are done
                        } else {
                            oTable.fnUpdate(iRowPosition - 1,
                                oTable.fnGetPosition(tr), // get row position in current model
                                properties.iIndexColumn,
                                false); // false = defer redraw until all row updates are done
                        }
                    }
                }
            });

            var oSettings = oTable.fnSettings();

            //Standing Redraw Extension
            //Author: 	Jonathan Hoguet
            //http://datatables.net/plug-ins/api#fnStandingRedraw
            if (oSettings.oFeatures.bServerSide === false) {
                var before = oSettings._iDisplayStart;
                oSettings.oApi._fnReDraw(oSettings);
                //iDisplayStart has been reset to zero - so lets change it back
                oSettings._iDisplayStart = before;
                oSettings.oApi._fnCalculateEnd(oSettings);
            }
            //draw the 'current' page
            oSettings.oApi._fnDraw(oSettings);
        }

        function _fnAlert(message, type) { alert(message); }

        var defaults = {
            iIndexColumn: 0,
            iStartPosition: 1,
            sURL: null,
            sRequestType: "POST",
            iGroupingLevel: 0,
            fnAlert: _fnAlert,
            fnSuccess: jQuery.noop,
            iLogLevel: 1,
            sDataGroupAttribute: "data-group",
            fnStartProcessingMode: _fnStartProcessingMode,
            fnEndProcessingMode: _fnEndProcessingMode,
            fnUpdateAjaxRequest: jQuery.noop
        };

        var properties = $.extend(defaults, options);

        var iFrom, iTo;

        // Return a helper with preserved width of cells (see Issue 9)
        var tableFixHelper = function(e, tr)
        {
            var $originals = tr.children();
            var $helper = tr.clone();
            $helper.children().each(function(index)
            {
                // Set helper cell sizes to match the original sizes
                $(this).width($originals.eq(index).width())
            });
            return $helper;
        };

        return this.each(function () {

            var oTable = $(this).dataTable();

            var aaSortingFixed = (oTable.fnSettings().aaSortingFixed == null ? new Array() : oTable.fnSettings().aaSortingFixed);
            aaSortingFixed.push([properties.iIndexColumn, "asc"]);

            oTable.fnSettings().aaSortingFixed = aaSortingFixed;


            for (var i = 0; i < oTable.fnSettings().aoColumns.length; i++) {
                oTable.fnSettings().aoColumns[i].bSortable = false;
                /*for(var j=0; j<aaSortingFixed.length; j++)
                 {
                 if( i == aaSortingFixed[j][0] )
                 oTable.fnSettings().aoColumns[i].bSortable = false;
                 }*/
            }
            oTable.fnDraw();

            $("tbody", oTable).disableSelection().sortable({
                cursor: "move",
                helper: tableFixHelper,
                update: function (event, ui) {
                    var $dataTable = oTable;
                    var tbody = $(this);
                    var sSelector = "tbody tr";
                    var sGroup = "";
                    if (properties.bGroupingUsed) {
                        sGroup = $(ui.item).attr(properties.sDataGroupAttribute);
                        if(sGroup==null || sGroup==undefined){
                            fnCancelSorting($dataTable, tbody, properties, 3, "Grouping row cannot be moved");
                            return;
                        }
                        sSelector = "tbody tr[" + properties.sDataGroupAttribute + " ='" + sGroup + "']";
                    }

                    var oState = fnGetState($dataTable, sSelector, ui.item.context.id);
                    if(oState.iNewPosition == -1)
                    {
                        fnCancelSorting($dataTable, tbody, properties,2);
                        return;
                    }

                    if (properties.sURL != null) {
                        properties.fnStartProcessingMode($dataTable);
                        var oAjaxRequest = {
                            url: properties.sURL,
                            type: properties.sRequestType,
                            data: { id: ui.item.context.id,
                                fromPosition: oState.iCurrentPosition,
                                toPosition: oState.iNewPosition,
                                direction: oState.sDirection,
                                group: sGroup
                            },
                            success: function (data) {
                                properties.fnSuccess(data);
                                fnMoveRows($dataTable, sSelector, oState.iCurrentPosition, oState.iNewPosition, oState.sDirection, ui.item.context.id, sGroup);
                                properties.fnEndProcessingMode($dataTable);
                            },
                            error: function (jqXHR) {
                                fnCancelSorting($dataTable, tbody, properties, 1, jqXHR.statusText);
                            }
                        };
                        properties.fnUpdateAjaxRequest(oAjaxRequest, properties, $dataTable);
                        $.ajax(oAjaxRequest);
                    } else {
                        fnMoveRows($dataTable, sSelector, oState.iCurrentPosition, oState.iNewPosition, oState.sDirection, ui.item.context.id, sGroup);
                    }

                }
            });

        });

    };
})(jQuery);;
// Created: 2008-06-04 
// Updated: 2012-05-21
// REQUIRES: jquery 1.7.x

;(function( $ ){

// add the jquery instance method
$.fn.drag = function( str, arg, opts ){
	// figure out the event type
	var type = typeof str == "string" ? str : "",
	// figure out the event handler...
	fn = $.isFunction( str ) ? str : $.isFunction( arg ) ? arg : null;
	// fix the event type
	if ( type.indexOf("drag") !== 0 ) 
		type = "drag"+ type;
	// were options passed
	opts = ( str == fn ? arg : opts ) || {};
	// trigger or bind event handler
	return fn ? this.bind( type, opts, fn ) : this.trigger( type );
};

// local refs (increase compression)
var $event = $.event, 
$special = $event.special,
// configure the drag special event 
drag = $special.drag = {
	
	// these are the default settings
	defaults: {
		which: 1, // mouse button pressed to start drag sequence
		distance: 0, // distance dragged before dragstart
		not: ':input', // selector to suppress dragging on target elements
		handle: null, // selector to match handle target elements
		relative: false, // true to use "position", false to use "offset"
		drop: true, // false to suppress drop events, true or selector to allow
		click: false // false to suppress click events after dragend (no proxy)
	},
	
	// the key name for stored drag data
	datakey: "dragdata",
	
	// prevent bubbling for better performance
	noBubble: true,
	
	// count bound related events
	add: function( obj ){ 
		// read the interaction data
		var data = $.data( this, drag.datakey ),
		// read any passed options 
		opts = obj.data || {};
		// count another realted event
		data.related += 1;
		// extend data options bound with this event
		// don't iterate "opts" in case it is a node 
		$.each( drag.defaults, function( key, def ){
			if ( opts[ key ] !== undefined )
				data[ key ] = opts[ key ];
		});
	},
	
	// forget unbound related events
	remove: function(){
		$.data( this, drag.datakey ).related -= 1;
	},
	
	// configure interaction, capture settings
	setup: function(){
		// check for related events
		if ( $.data( this, drag.datakey ) ) 
			return;
		// initialize the drag data with copied defaults
		var data = $.extend({ related:0 }, drag.defaults );
		// store the interaction data
		$.data( this, drag.datakey, data );
		// bind the mousedown event, which starts drag interactions
		$event.add( this, "touchstart mousedown", drag.init, data );
		// prevent image dragging in IE...
		if ( this.attachEvent ) 
			this.attachEvent("ondragstart", drag.dontstart ); 
	},
	
	// destroy configured interaction
	teardown: function(){
		var data = $.data( this, drag.datakey ) || {};
		// check for related events
		if ( data.related ) 
			return;
		// remove the stored data
		$.removeData( this, drag.datakey );
		// remove the mousedown event
		$event.remove( this, "touchstart mousedown", drag.init );
		// enable text selection
		drag.textselect( true ); 
		// un-prevent image dragging in IE...
		if ( this.detachEvent ) 
			this.detachEvent("ondragstart", drag.dontstart ); 
	},
		
	// initialize the interaction
	init: function( event ){ 
		// sorry, only one touch at a time
		if ( drag.touched ) 
			return;
		// the drag/drop interaction data
		var dd = event.data, results;
		// check the which directive
		if ( event.which != 0 && dd.which > 0 && event.which != dd.which ) 
			return; 
		// check for suppressed selector
		if ( $( event.target ).is( dd.not ) ) 
			return;
		// check for handle selector
		if ( dd.handle && !$( event.target ).closest( dd.handle, event.currentTarget ).length ) 
			return;

		drag.touched = event.type == 'touchstart' ? this : null;
		dd.propagates = 1;
		dd.mousedown = this;
		dd.interactions = [ drag.interaction( this, dd ) ];
		dd.target = event.target;
		dd.pageX = event.pageX;
		dd.pageY = event.pageY;
		dd.dragging = null;
		// handle draginit event... 
		results = drag.hijack( event, "draginit", dd );
		// early cancel
		if ( !dd.propagates )
			return;
		// flatten the result set
		results = drag.flatten( results );
		// insert new interaction elements
		if ( results && results.length ){
			dd.interactions = [];
			$.each( results, function(){
				dd.interactions.push( drag.interaction( this, dd ) );
			});
		}
		// remember how many interactions are propagating
		dd.propagates = dd.interactions.length;
		// locate and init the drop targets
		if ( dd.drop !== false && $special.drop ) 
			$special.drop.handler( event, dd );
		// disable text selection
		drag.textselect( false ); 
		// bind additional events...
		if ( drag.touched )
			$event.add( drag.touched, "touchmove touchend", drag.handler, dd );
		else 
			$event.add( document, "mousemove mouseup", drag.handler, dd );
		// helps prevent text selection or scrolling
		if ( !drag.touched || dd.live )
			return false;
	},	
	
	// returns an interaction object
	interaction: function( elem, dd ){
		var offset = $( elem )[ dd.relative ? "position" : "offset" ]() || { top:0, left:0 };
		return {
			drag: elem, 
			callback: new drag.callback(), 
			droppable: [],
			offset: offset
		};
	},
	
	// handle drag-releatd DOM events
	handler: function( event ){ 
		// read the data before hijacking anything
		var dd = event.data;	
		// handle various events
		switch ( event.type ){
			// mousemove, check distance, start dragging
			case !dd.dragging && 'touchmove': 
				event.preventDefault();
			case !dd.dragging && 'mousemove':
				//  drag tolerance, x� + y� = distance�
				if ( Math.pow(  event.pageX-dd.pageX, 2 ) + Math.pow(  event.pageY-dd.pageY, 2 ) < Math.pow( dd.distance, 2 ) ) 
					break; // distance tolerance not reached
				event.target = dd.target; // force target from "mousedown" event (fix distance issue)
				drag.hijack( event, "dragstart", dd ); // trigger "dragstart"
				if ( dd.propagates ) // "dragstart" not rejected
					dd.dragging = true; // activate interaction
			// mousemove, dragging
			case 'touchmove':
				event.preventDefault();
			case 'mousemove':
				if ( dd.dragging ){
					// trigger "drag"		
					drag.hijack( event, "drag", dd );
					if ( dd.propagates ){
						// manage drop events
						if ( dd.drop !== false && $special.drop )
							$special.drop.handler( event, dd ); // "dropstart", "dropend"							
						break; // "drag" not rejected, stop		
					}
					event.type = "mouseup"; // helps "drop" handler behave
				}
			// mouseup, stop dragging
			case 'touchend': 
			case 'mouseup': 
			default:
				if ( drag.touched )
					$event.remove( drag.touched, "touchmove touchend", drag.handler ); // remove touch events
				else 
					$event.remove( document, "mousemove mouseup", drag.handler ); // remove page events	
				if ( dd.dragging ){
					if ( dd.drop !== false && $special.drop )
						$special.drop.handler( event, dd ); // "drop"
					drag.hijack( event, "dragend", dd ); // trigger "dragend"	
				}
				drag.textselect( true ); // enable text selection
				// if suppressing click events...
				if ( dd.click === false && dd.dragging )
					$.data( dd.mousedown, "suppress.click", new Date().getTime() + 5 );
				dd.dragging = drag.touched = false; // deactivate element	
				break;
		}
	},
		
	// re-use event object for custom events
	hijack: function( event, type, dd, x, elem ){
		// not configured
		if ( !dd ) 
			return;
		// remember the original event and type
		var orig = { event:event.originalEvent, type:event.type },
		// is the event drag related or drog related?
		mode = type.indexOf("drop") ? "drag" : "drop",
		// iteration vars
		result, i = x || 0, ia, $elems, callback,
		len = !isNaN( x ) ? x : dd.interactions.length;
		// modify the event type
		event.type = type;
		// remove the original event
		event.originalEvent = null;
		// initialize the results
		dd.results = [];
		// handle each interacted element
		do if ( ia = dd.interactions[ i ] ){
			// validate the interaction
			if ( type !== "dragend" && ia.cancelled )
				continue;
			// set the dragdrop properties on the event object
			callback = drag.properties( event, dd, ia );
			// prepare for more results
			ia.results = [];
			// handle each element
			$( elem || ia[ mode ] || dd.droppable ).each(function( p, subject ){
				// identify drag or drop targets individually
				callback.target = subject;
				// force propagtion of the custom event
				event.isPropagationStopped = function(){ return false; };
				// handle the event	
				result = subject ? $event.dispatch.call( subject, event, callback ) : null;
				// stop the drag interaction for this element
				if ( result === false ){
					if ( mode == "drag" ){
						ia.cancelled = true;
						dd.propagates -= 1;
					}
					if ( type == "drop" ){
						ia[ mode ][p] = null;
					}
				}
				// assign any dropinit elements
				else if ( type == "dropinit" )
					ia.droppable.push( drag.element( result ) || subject );
				// accept a returned proxy element 
				if ( type == "dragstart" )
					ia.proxy = $( drag.element( result ) || ia.drag )[0];
				// remember this result	
				ia.results.push( result );
				// forget the event result, for recycling
				delete event.result;
				// break on cancelled handler
				if ( type !== "dropinit" )
					return result;
			});	
			// flatten the results	
			dd.results[ i ] = drag.flatten( ia.results );	
			// accept a set of valid drop targets
			if ( type == "dropinit" )
				ia.droppable = drag.flatten( ia.droppable );
			// locate drop targets
			if ( type == "dragstart" && !ia.cancelled )
				callback.update(); 
		}
		while ( ++i < len )
		// restore the original event & type
		event.type = orig.type;
		event.originalEvent = orig.event;
		// return all handler results
		return drag.flatten( dd.results );
	},
		
	// extend the callback object with drag/drop properties...
	properties: function( event, dd, ia ){		
		var obj = ia.callback;
		// elements
		obj.drag = ia.drag;
		obj.proxy = ia.proxy || ia.drag;
		// starting mouse position
		obj.startX = dd.pageX;
		obj.startY = dd.pageY;
		// current distance dragged
		obj.deltaX = event.pageX - dd.pageX;
		obj.deltaY = event.pageY - dd.pageY;
		// original element position
		obj.originalX = ia.offset.left;
		obj.originalY = ia.offset.top;
		// adjusted element position
		obj.offsetX = obj.originalX + obj.deltaX; 
		obj.offsetY = obj.originalY + obj.deltaY;
		// assign the drop targets information
		obj.drop = drag.flatten( ( ia.drop || [] ).slice() );
		obj.available = drag.flatten( ( ia.droppable || [] ).slice() );
		return obj;	
	},
	
	// determine is the argument is an element or jquery instance
	element: function( arg ){
		if ( arg && ( arg.jquery || arg.nodeType == 1 ) )
			return arg;
	},
	
	// flatten nested jquery objects and arrays into a single dimension array
	flatten: function( arr ){
		return $.map( arr, function( member ){
			return member && member.jquery ? $.makeArray( member ) : 
				member && member.length ? drag.flatten( member ) : member;
		});
	},
	
	// toggles text selection attributes ON (true) or OFF (false)
	textselect: function( bool ){ 
		$( document )[ bool ? "unbind" : "bind" ]("selectstart", drag.dontstart )
			.css("MozUserSelect", bool ? "" : "none" );
		// .attr("unselectable", bool ? "off" : "on" )
		document.unselectable = bool ? "off" : "on"; 
	},
	
	// suppress "selectstart" and "ondragstart" events
	dontstart: function(){ 
		return false; 
	},
	
	// a callback instance contructor
	callback: function(){}
	
};

// callback methods
drag.callback.prototype = {
	update: function(){
		if ( $special.drop && this.available.length )
			$.each( this.available, function( i ){
				$special.drop.locate( this, i );
			});
	}
};

// patch $.event.$dispatch to allow suppressing clicks
var $dispatch = $event.dispatch;
$event.dispatch = function( event ){
	if ( $.data( this, "suppress."+ event.type ) - new Date().getTime() > 0 ){
		$.removeData( this, "suppress."+ event.type );
		return;
	}
	return $dispatch.apply( this, arguments );
};

// event fix hooks for touch events...
var touchHooks = 
$event.fixHooks.touchstart = 
$event.fixHooks.touchmove = 
$event.fixHooks.touchend =
$event.fixHooks.touchcancel = {
	props: "clientX clientY pageX pageY screenX screenY".split( " " ),
	filter: function( event, orig ) {
		if ( orig ){
			var touched = ( orig.touches && orig.touches[0] )
				|| ( orig.changedTouches && orig.changedTouches[0] )
				|| null; 
			// iOS webkit: touchstart, touchmove, touchend
			if ( touched ) 
				$.each( touchHooks.props, function( i, prop ){
					event[ prop ] = touched[ prop ];
				});
		}
		return event;
	}
};

// share the same special event configuration with related events...
$special.draginit = $special.dragstart = $special.dragend = drag;

})( jQuery );;
;window.Modernizr=function(a,b,c){function D(a){j.cssText=a}function E(a,b){return D(n.join(a+";")+(b||""))}function F(a,b){return typeof a===b}function G(a,b){return!!~(""+a).indexOf(b)}function H(a,b){for(var d in a){var e=a[d];if(!G(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function I(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:F(f,"function")?f.bind(d||b):f}return!1}function J(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+p.join(d+" ")+d).split(" ");return F(b,"string")||F(b,"undefined")?H(e,b):(e=(a+" "+q.join(d+" ")+d).split(" "),I(e,b,c))}function K(){e.input=function(c){for(var d=0,e=c.length;d<e;d++)u[c[d]]=c[d]in k;return u.list&&(u.list=!!b.createElement("datalist")&&!!a.HTMLDataListElement),u}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),e.inputtypes=function(a){for(var d=0,e,f,h,i=a.length;d<i;d++)k.setAttribute("type",f=a[d]),e=k.type!=="text",e&&(k.value=l,k.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(f)&&k.style.WebkitAppearance!==c?(g.appendChild(k),h=b.defaultView,e=h.getComputedStyle&&h.getComputedStyle(k,null).WebkitAppearance!=="textfield"&&k.offsetHeight!==0,g.removeChild(k)):/^(search|tel)$/.test(f)||(/^(url|email)$/.test(f)?e=k.checkValidity&&k.checkValidity()===!1:e=k.value!=l)),t[a[d]]=!!e;return t}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k=b.createElement("input"),l=":)",m={}.toString,n=" -webkit- -moz- -o- -ms- ".split(" "),o="Webkit Moz O ms",p=o.split(" "),q=o.toLowerCase().split(" "),r={svg:"http://www.w3.org/2000/svg"},s={},t={},u={},v=[],w=v.slice,x,y=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},z=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b).matches;var d;return y("@media "+b+" { #"+h+" { position: absolute; } }",function(b){d=(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle)["position"]=="absolute"}),d},A=function(){function d(d,e){e=e||b.createElement(a[d]||"div"),d="on"+d;var f=d in e;return f||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(d,""),f=F(e[d],"function"),F(e[d],"undefined")||(e[d]=c),e.removeAttribute(d))),e=null,f}var a={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return d}(),B={}.hasOwnProperty,C;!F(B,"undefined")&&!F(B.call,"undefined")?C=function(a,b){return B.call(a,b)}:C=function(a,b){return b in a&&F(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=w.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(w.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(w.call(arguments)))};return e}),s.flexbox=function(){return J("flexWrap")},s.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},s.canvastext=function(){return!!e.canvas&&!!F(b.createElement("canvas").getContext("2d").fillText,"function")},s.webgl=function(){return!!a.WebGLRenderingContext},s.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:y(["@media (",n.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},s.geolocation=function(){return"geolocation"in navigator},s.postmessage=function(){return!!a.postMessage},s.websqldatabase=function(){return!!a.openDatabase},s.indexedDB=function(){return!!J("indexedDB",a)},s.hashchange=function(){return A("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},s.history=function(){return!!a.history&&!!history.pushState},s.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},s.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},s.rgba=function(){return D("background-color:rgba(150,255,150,.5)"),G(j.backgroundColor,"rgba")},s.hsla=function(){return D("background-color:hsla(120,40%,100%,.5)"),G(j.backgroundColor,"rgba")||G(j.backgroundColor,"hsla")},s.multiplebgs=function(){return D("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(j.background)},s.backgroundsize=function(){return J("backgroundSize")},s.borderimage=function(){return J("borderImage")},s.borderradius=function(){return J("borderRadius")},s.boxshadow=function(){return J("boxShadow")},s.textshadow=function(){return b.createElement("div").style.textShadow===""},s.opacity=function(){return E("opacity:.55"),/^0.55$/.test(j.opacity)},s.cssanimations=function(){return J("animationName")},s.csscolumns=function(){return J("columnCount")},s.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return D((a+"-webkit- ".split(" ").join(b+a)+n.join(c+a)).slice(0,-a.length)),G(j.backgroundImage,"gradient")},s.cssreflections=function(){return J("boxReflect")},s.csstransforms=function(){return!!J("transform")},s.csstransforms3d=function(){var a=!!J("perspective");return a&&"webkitPerspective"in g.style&&y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},s.csstransitions=function(){return J("transition")},s.fontface=function(){var a;return y('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&g.indexOf(d.split(" ")[0])===0}),a},s.generatedcontent=function(){var a;return y(["#",h,"{font:0/0 a}#",h,':after{content:"',l,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},s.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c},s.audio=function(){var a=b.createElement("audio"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(d){}return c},s.localstorage=function(){try{return localStorage.setItem(h,h),localStorage.removeItem(h),!0}catch(a){return!1}},s.sessionstorage=function(){try{return sessionStorage.setItem(h,h),sessionStorage.removeItem(h),!0}catch(a){return!1}},s.webworkers=function(){return!!a.Worker},s.applicationcache=function(){return!!a.applicationCache},s.svg=function(){return!!b.createElementNS&&!!b.createElementNS(r.svg,"svg").createSVGRect},s.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==r.svg},s.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(m.call(b.createElementNS(r.svg,"animate")))},s.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(m.call(b.createElementNS(r.svg,"clipPath")))};for(var L in s)C(s,L)&&(x=L.toLowerCase(),e[x]=s[L](),v.push((e[x]?"":"no-")+x));return e.input||K(),e.addTest=function(a,b){if(typeof a=="object")for(var d in a)C(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},D(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._prefixes=n,e._domPrefixes=q,e._cssomPrefixes=p,e.mq=z,e.hasEvent=A,e.testProp=function(a){return H([a])},e.testAllProps=J,e.testStyles=y,e.prefixed=function(a,b,c){return b?J(a,b,c):J(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+v.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
;


function initWebHelp(WebHelpOptions) {
    var helpIconPosition = '.ai-header .ai-header-title';
    var showIntroOnLoad = true;

    if (WebHelpOptions) {
        helpIconPosition = WebHelpOptions.helpIconPosition || helpIconPosition;
        showIntroOnLoad = (typeof WebHelpOptions.showIntroOnLoad != 'undefined') ? WebHelpOptions.showIntroOnLoad : showIntroOnLoad;
    }
    var parameters = getWindowParameters();

    var addWebHelpContainerFunc = function () {
        var webHelpContent = getWebHelpContainerHTML();
        jQuery("body").append(webHelpContent);
    };

    var addHelpIconFunc = function () {
        createNewNavigationButton(helpIconPosition);
    };

    var showIntroOnStartup = function () {
        var availableSequences = retrieveLocalStorage();
        if(showIntroOnLoad) {
            if (availableSequences['Introduction']) {
                playSequence('Introduction');
            }
        }
    };
    var showHelpConsumptionMode = function () {
        addHelpIconFunc();
        moveTableDivsToModal();
        showIntroOnStartup();
    };

    var showHelpCreationMode = function () {
        jQuery('#webHelpMainContent').BootSideMenu({
            side: "right", // left or right
            autoClose: true // auto close when page loads
        });
        setUpAddEditTable();
        var currentTitleHTML = jQuery(helpIconPosition).html();
        currentTitleHTML += "[Edit mode]";
        var elem;
        if(jQuery(helpIconPosition) && jQuery(helpIconPosition).length > 1) {
            elem = jQuery(helpIconPosition)[0];
        } else {
            elem = jQuery(helpIconPosition);
        }
        jQuery(elem).html(currentTitleHTML);
    };

    var loadAllSequences = function () {
        return populateCurrentSequences();
    };

    var addBadgeToHelpIcon = function (numNewSequences) {
        setNewSequenceCountBadgeOnHelpIcon(numNewSequences);
    };

    addWebHelpContainerFunc();
    var sequenceCounterObject = loadAllSequences();
    if (parameters['create'] != undefined) {
        //setElementsToScale();
        showHelpCreationMode();
    } else {
        showHelpConsumptionMode();
        addBadgeToHelpIcon(sequenceCounterObject.numNewSequences);
    }
}

function getWebHelpContainerHTML() {
    var webHelpElementsHTML = "<div id=\"webHelpMainContent\">\r\n    " +
        "<div class=\"tabbable\"> <!-- Only required for left\/right tabs -->\r\n        " +
        "<ul class=\"nav nav-tabs\">\r\n            " +
        "<li class=\"active\"><a href=\"#popularSequences\" data-toggle=\"tab\">Popular<\/a><\/li>\r\n            " +
        "<li><a href=\"#whatsNew\" data-toggle=\"tab\">What\'s New?<!--<span class=\"badge\" id=\"newItemsBadge\"\/>--><\/a>\r\n            " +
        "<li><a href=\"#availableSequences\" data-toggle=\"tab\">Topics<\/a><\/li>\r\n            " +
        "<li><a href=\"#addSequence\" data-toggle=\"tab\">Add\/Edit Sequence<\/a><\/li>\r\n        " +
        "<\/ul>\r\n        " +
        "<div class=\"tab-content\">\r\n            " +
        "<div class=\"tab-pane active\" id=\"popularSequences\">\r\n                " +
        "<div id=\"popularSequencesContent\">\r\n                    No popular items yet!\r\n                <\/div>\r\n            " +
        "<\/div>\r\n            <div class=\"tab-pane\" id=\"whatsNew\">\r\n                " +
        "<div id=\"whatsNewContent\">\r\n                    No new items yet!\r\n                <\/div>\r\n            " +
        "<\/div>\r\n            " +
        "<div class=\"tab-pane\" id=\"availableSequences\">\r\n                " +
        "<div id=\"availableSequencesContent\">\r\n                    Placeholder where you can search for existing sequences\r\n                <\/div>\r\n            " +
        "<\/div>\r\n            " +
        "<div class=\"tab-pane\" id=\"addSequence\">\r\n                " +
        "<div class=\"well\">\r\n                    " +
        "<section contenteditable=\"true\">\r\n                        " +
        "<div><input type=\"text\" id=\"sequenceTitleSetter\" value=\"Sequence title\"\/>\r\n\r\n                            " +
        "<div class=\"checkbox\"><label for=\"markAsNewSequence\"> <input type=\"checkbox\"\r\n                                                                                         id=\"markAsNewSequence\"> Mark as\r\n                                new\r\n                                sequence<\/label><\/div>\r\n                        " +
        "<\/div>\r\n                        " +
        "<table id=\"stepsTable\" class=\"table table-bordered table-hover\">\r\n                        " +
        "<\/table>\r\n                    " +
        "<\/section>\r\n                   " +
        "<button type=\"button\" id=\'sequencePreviewButton\' class=\"btn btn-default centered actionButton\"\r\n                            aria-label=\"Left Align\"\r\n                            style=\"margin-top:20px;\" onclick=\"preview();\">\r\n                        <span class=\"fa fa-play-circle-o\" aria-hidden=\"true\"><\/span> Preview\r\n                    <\/button>\r\n                    " +
        "<button type=\"button\" id=\'sequenceSaveButton\' class=\"btn btn-default centered\"\r\n                            aria-label=\"Left Align\"\r\n                            style=\"margin-top:20px;\"\r\n                            onclick=\"save();\">\r\n                        <span class=\"fa fa-floppy-o\" aria-hidden=\"true\"><\/span> Save\r\n                    <\/button>\r\n                    " +
        "<button type=\"button\" id=\'clearStepsButton\' class=\"btn btn-default centered\"\r\n                            aria-label=\"Left Align\"\r\n                            style=\"margin-top:20px;\"\r\n                            onclick=\"clearStepsInSequence();\">\r\n                        <span class=\"fa fa-refresh\" aria-hidden=\"true\"><\/span> Clear\r\n                    <\/button>\r\n                " +
        "<\/div>\r\n                " +
        "<div class=\"well\">Available actions:\r\n                    " +
        "<div class=\"well-sm\">\r\n                        " +
        "<button data-toggle=\"tooltip\" data-placement=\"top\"\r\n                                title=\"Click and drag over elements on the page to select them\"\r\n                                class=\"btn btn-success\" role=\"button\"\r\n                                id=\"startDragDropButton\"\r\n                                onClick=\"startSelectionOfElement(true);\"><span class=\"fa fa-plus\"><\/span> Add element\r\n                            step\r\n                        <\/button>\r\n                        " +
        "<button class=\"btn btn-info\" role=\"button\"\r\n                                id=\"startEmptyStepButton\"\r\n                                onClick=\"startSelectionOfElement(false);\"><span class=\"fa fa-plus\"><\/span> Add page step\r\n                        <\/button>\r\n                        " +
        "<button class=\"btn btn-danger\" id=\"cancelDragDropButton\"\r\n                                role=\"button\"\r\n                                onClick=\"jQueryDragSelector.off();\"><span class=\"fa fa-times\"><\/span> Cancel\r\n                        <\/button>\r\n                    " +
        "<\/div>\r\n                " +
        "<\/div>\r\n                " +
        "<div class=\"alert alert-danger\" id=\"noElementsSelectedDiv\" style=\"display: none;\">\r\n                    " +
        "<button type=\"button\" class=\"close\" onclick=\"jQuery(\'#noElementsSelectedDiv\').hide();\"\r\n                            aria-label=\"Close\"><span\r\n                            aria-hidden=\"true\">&times;<\/span><\/button>\r\n                    No elements were selected, please try again\r\n                <\/div>\r\n                " +
        "<div class=\"alert alert-danger\" id=\"noStepsInPreviewDiv\" style=\"display: none;\">\r\n                    <button type=\"button\" class=\"close\" onclick=\"jQuery(\'#noStepsInPreviewDiv\').hide();\"\r\n                            aria-label=\"Close\"><span\r\n                            aria-hidden=\"true\">&times;<\/span><\/button>\r\n                    No steps to preview. Please add steps.\r\n                <\/div>\r\n            " +
        "<\/div>\r\n        " +
        "<\/div>\r\n    " +
        "<\/div>\r\n" +
        "<\/div>\r\n" +
        "<div id=\"contentConsumptionModal\" class=\"modal\">\r\n    " +
        "<div class=\"modal-dialog\">\r\n        " +
        "<div class=\"modal-content\" style=\"width: 800px;\">\r\n            " +
        "<div class=\"modal-header ai-modal-title\">\r\n                " +
        "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span\r\n                        aria-hidden=\"true\">&times;<\/span><\/button>\r\n                " +
        "What would you like to learn?\r\n            " +
        "<\/div>\r\n            " +
        "<div class=\"modal-body\"><\/div>\r\n            " +
        "<div class=\"modal-footer\">\r\n                <button data-dismiss=\"modal\" class=\"btn btn-default\">Close<\/button>\r\n            <\/div>\r\n        " +
        "<\/div>\r\n    " +
        "<\/div>\r\n" +
        "<\/div>";
    return webHelpElementsHTML;
}

function moveTableDivsToModal() {
    jQuery("#webHelpMainContent").appendTo("#contentConsumptionModal .modal-body");
    jQuery('.nav-tabs a[href=#addSequence]').hide();
}

function createNewNavigationButton(navbarButtonElement, addTextToNavbar) {
    var dropdownButtonHtml = '<button class="btn light" id="contentConsumptionNavButton" >' +
        '<i class="fa fa-info-circle"></i>';

    if (addTextToNavbar) {
        dropdownButtonHtml += 'App Help';
    }

    dropdownButtonHtml += '</button>';

    //Add to navbar if need be
    if ((jQuery('.ai-navbar').length > 0) && (jQuery(navbarButtonElement + ':last-of-type').hasClass('nav-right'))) {
        jQuery(navbarButtonElement + ':last-of-type').after(dropdownButtonHtml);
        jQuery('#contentConsumptionNavButton').addClass('nav-right');
    } else {
        jQuery(navbarButtonElement).after(dropdownButtonHtml);
    }

    jQuery('#contentConsumptionNavButton').click(function (event) {
        event.preventDefault();
        jQuery('#contentConsumptionModal').modal('show');
    });

    jQuery('#contentConsumptionNavButton').attr('title', 'App Help');

}

function setUpAddEditTable() {
    var t = jQuery("#stepsTable").dataTable({
            "sDom": "",
            "language": {
                "emptyTable": "New steps will show up here!"
            },
            "aoColumns": [
                {
                    "sTitle": "",
                    "sWidth": "10%"
                },
                {
                    "sTitle": "Step",
                    "sWidth": "25%"
                },
                {
                    "sTitle": "Attribute",
                    "sWidth": "7%",
                    "sClass": "invisibleColumnInStepsTable"
                    /*Needs to be invisible, datatables bVisible false removes it from the DOM altogether*/
                },
                {
                    "sTitle": "Value",
                    "sWidth": "8%",
                    "sClass": "invisibleColumnInStepsTable"
                },
                {
                    "sTitle": "Content",
                    "sWidth": "50%"
                }
            ]
        }
    ).rowReordering();
    makeEditable();
}

function setNewSequenceCountBadgeOnHelpIcon(numNewSequences) {
    var $helpIcon = jQuery('#contentConsumptionNavButton');
    if (numNewSequences > 0) {
        $helpIcon.attr('data-badge', numNewSequences);
    } else {
        $helpIcon.removeAttr('data-badge');
    }
}

function startSelectionOfElement(elementSelection) {

    /* Close the sidemenu if it is open*/
    var status = jQuery('#webHelpMainContent').attr("data-status");
    if(elementSelection && status === "opened") {
        jQuery(".toggler").trigger("click");
    }

    if (elementSelection) {
        jQueryDragSelector.on();
        jQuery("#startDragDropButton").tooltip({
            trigger: 'manual'
        }).tooltip("show");
        setTimeout(function () {
            jQuery("#startDragDropButton").tooltip('hide');
        }, 3000);
    } else {
        createStepForThisElement([]);
    }
}

function createStepForThisElement(arrayOfElems) {
    var t = jQuery("#stepsTable").DataTable();
    var elemText = "";
    var elemType = "";
    for (var i = 0; i < arrayOfElems.length; i++) {
        elemText += arrayOfElems[i].value + "&";
        elemType += arrayOfElems[i].attribute + "&";
    }
    elemText = elemText.substring(0, elemText.length - 1);
    elemType = elemType.substring(0, elemType.length - 1);
    t.row.add([
        "<span class='fa fa-times' aria-hidden='true' onclick='removeThisStep()'></span>",
        "Editable title",
        elemType,
        elemText,
        "Editable content"])
        .draw();
    makeEditable();
}

function removeThisStep() {
    var t = jQuery("#stepsTable").DataTable();
    t.row(jQuery(event.target).parents('tr')).remove().draw();
}

function alertNoSelection() {
    jQuery('#noElementsSelectedDiv').show();
    jQueryDragSelector.on();
}

function preview() {
    //destroyAndRedrawTable(); //Doesn't respect row reordering
    var previewSteps = getCurrentTablePreviewSteps();

    if (previewSteps) {
        var preview = introJs();
        preview.setOptions({
            steps: previewSteps,
            showProgress: true,
            showBullets: false,
            tooltipPosition: 'auto'
        });
        jQuery('.toggler').trigger('click'); //Close the side menu
        setTimeout(function () {
            preview.start();
        }, 500);
    }
}

function save() {

    var sequenceTitle = jQuery("#sequenceTitleSetter").val().trim();
    var stepsToSave = getCurrentTablePreviewSteps();
    if (stepsToSave) {
        var testObject = {};
        testObject[sequenceTitle] = {
            "sequenceTitle": sequenceTitle,
            "appName": "Test App",
            //"url": "WebHelp",
            "data": stepsToSave,
            "isNew": jQuery('#markAsNewSequence').is(':checked')
        };

        // Put the object into storage
        var WebHelpName = 'WebHelp.' + appNameForWebHelp;
        if (localStorage.getItem(WebHelpName)) {
            var localStorageObject = JSON.parse(localStorage.getItem(WebHelpName));
            localStorageObject[sequenceTitle] = testObject[sequenceTitle];
            localStorage.setItem(WebHelpName, JSON.stringify(localStorageObject));
        } else {
            localStorage.setItem(WebHelpName, JSON.stringify(testObject));
        }

        jQuery("#sequenceSaveButton").attr('title', 'Saved!').tooltip({
            trigger: 'manual'
        }).tooltip("show");
        setTimeout(function () {
            jQuery("#sequenceSaveButton").tooltip('hide').attr('title', '');
        }, 500);

        var sequences = populateCurrentSequences();
        setNewSequenceCountBadgeOnHelpIcon(sequences.numNewSequences);
    }
}

function getCurrentTablePreviewSteps() {
    var tableHasData = !((jQuery("#stepsTable td").length <= 0) || ((jQuery("#stepsTable td").length === 1) && (jQuery("#stepsTable td").hasClass('dataTables_empty'))));
    if (!tableHasData) {
        jQuery('#noStepsInPreviewDiv').show();
        return false;
    }

    var previewSteps = [];

    var tableRows = jQuery("#stepsTable tr");
    var rows = [];

    jQuery.each(tableRows, function (index, element) {
        var cells = jQuery(element).find('td');
        if (cells.length > 0) {
            var thisRow = [];
            for (var n = 0; n < cells.length; n++) {
                thisRow.push(jQuery(cells[n]).text());
            }
            rows.push(thisRow);
        }
    });

    for (var n = 0; n < rows.length; n++) {
        var elemAttribVal = rows[n][3];
        var elemAttribType = rows[n][2];
        var stepTitle = rows[n][1];
        var content = rows[n][4];
        if (elemAttribVal) {
            var elem = "";
            if(elemAttribType != 'CSSPath') {
                elem = "[" + elemAttribType + "=\'" + elemAttribVal + "\']";
            } else {
                elem = elemAttribVal;
            }
            previewSteps.push({
                element: elem,
                intro: '<div><h3>' + stepTitle + '</h3><p>' + content + '</p></div>',
                position: 'bottom'
            });
        } else {
            previewSteps.push({
                intro: '<div><h3>' + stepTitle + '</h3><p>' + content + '</p></div>'
            });
        }
    }

    return previewSteps;
}

function populateCurrentSequences() {
    var isCreator = (getWindowParameters()['create'] != undefined) ? true : false;
    var retrievedHtml = '';
    var retrievedNewHtml = '';
    var retrievedPopularHtml = '';
    var retrievedSequences = retrieveLocalStorage();
    var numNewSequences = 0;
    if (retrievedSequences) {
        retrievedHtml += '<table id="availableSequencesList">';
        retrievedPopularHtml += '<table id="popularSequencesList">';
        jQuery.each(retrievedSequences, function (key, value) {
            var thisElement = "<tr>" +
                "<td><span class='fa fa-play-circle-o' aria-hidden='true' onclick='playThisSequence()'></span></td>" +
                "<td>" + key + "</td>" +
                "<td><span class='fa fa-edit' aria-hidden='true' onclick='editThisSequence()'></td>" +
                "<td><span class='fa fa-times' aria-hidden='true' onclick='removeThisSequence()'></td>" +
                "<td>" + JSON.stringify(value) + "</td>" +
                "</tr>";
            retrievedHtml += thisElement;
            retrievedPopularHtml += thisElement;
            if (value.isNew) {
                if (retrievedNewHtml === '') {
                    retrievedNewHtml += '<table id="newSequencesList">';
                }
                retrievedNewHtml += "<tr>" +
                "<td><span class='fa fa-play-circle-o' aria-hidden='true' onclick='playThisSequence()'></span></td>" +
                "<td>" + key + "</td>" +
                "<td><span class='fa fa-edit' aria-hidden='true' onclick='editThisSequence()'></td>" +
                "<td><span class='fa fa-times' aria-hidden='true' onclick='removeThisSequence()'></td>" +
                "<td>" + JSON.stringify(value) + "</td>" +
                "</tr>";
                retrievedSequences[key]['isNew'] = false;
                numNewSequences += 1;
            }
        });
        retrievedHtml += '</table>';
        retrievedPopularHtml += '</table>';
        if (retrievedNewHtml != '') {
            retrievedNewHtml += '</table>';
        }
        localStorage.setItem('WebHelp', JSON.stringify(retrievedSequences));
        jQuery('#availableSequencesContent').html(retrievedHtml);
        jQuery('#popularSequencesContent').html(retrievedPopularHtml);
        //listFilter(jQuery('#availableSequencesHeader'), jQuery('#availableSequencesList'));

        var t = jQuery("#availableSequencesList").dataTable({
                "sDom": '<"top"f<"clear">>', //It should be a searchable table
                "oLanguage": {
                    "sSearch": "Search title and content: "
                },
                "aoColumns": [
                    {
                        "sTitle": "",
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": "Topic"
                    },
                    {
                        "sTitle": "",
                        "sWidth": "10%",
                        "bVisible": isCreator
                    },
                    {
                        "sTitle": "",
                        "sWidth": "10%",
                        "bVisible": isCreator
                    },
                    {
                        "sTitle": "Data",
                        "bVisible": false,
                        "bSearchable": true
                    }
                ]
            }
        );

        var p = jQuery("#popularSequencesList").dataTable({
                "sDom": '<"top"f<"clear">>', //It should be a searchable table
                "oLanguage": {
                    "sSearch": "Search title and content: "
                },
                "aoColumns": [
                    {
                        "sTitle": "",
                        "sWidth": "10%"
                    },
                    {
                        "sTitle": "Topic"
                    },
                    {
                        "sTitle": "",
                        "sWidth": "10%",
                        "bVisible": false
                    },
                    {
                        "sTitle": "",
                        "sWidth": "10%",
                        "bVisible": false
                    },
                    {
                        "sTitle": "Data",
                        "bVisible": false,
                        "bSearchable": true
                    }
                ]
            }
        );

        if (retrievedNewHtml != '') {
            jQuery('#whatsNewContent').html(retrievedNewHtml);
            var a = jQuery("#newSequencesList").dataTable({
                    "sDom": '<"top"f<"clear">>', //It should be a searchable table
                    "oLanguage": {
                        "sSearch": "Search title and content: "
                    },
                    "aoColumns": [
                        {
                            "sTitle": "",
                            "sWidth": "10%"
                        },
                        {
                            "sTitle": "Topic"
                        },
                        {
                            "sTitle": "",
                            "sWidth": "10%",
                            "bVisible": false
                        },
                        {
                            "sTitle": "",
                            "sWidth": "10%",
                            "bVisible": false
                        },
                        {
                            "sTitle": "Data",
                            "bVisible": false,
                            "bSearchable": true
                        }
                    ]
                }
            );
        }
        jQuery('td .fa-play-circle-o').attr('title', 'Play!');
        jQuery('td .fa-edit').attr('title', 'Edit');
        jQuery('td .fa-times').attr('title', 'Delete');

        //Convert all the tables to bootstrap-tables
        jQuery('#webHelpMainContent table.dataTable').addClass('table table-hover table-striped table-bordered');
        return {
            numNewSequences: numNewSequences
        }
    }
}

function retrieveLocalStorage() {
    var WebHelpName = 'WebHelp.' + appNameForWebHelp;
    if (localStorage.getItem(WebHelpName)) {
        return JSON.parse(localStorage.getItem(WebHelpName));
    } else {
        return {};
    }
}

function makeEditable() {
    jQuery("#stepsTable").tableEdit({
        columnsTr: "1,4"
    });
}

function clearStepsInSequence() {
    //Destroy and reinitialize the table to get the edited data
    jQuery("#stepsTable").DataTable().clear().draw();
}

function playSequence(sequenceName) {
    var stepsForThisSequence = retrieveLocalStorage()[sequenceName];
    if (stepsForThisSequence.isNew) {
        removeThisSequenceAsNew(sequenceName);
    }
    var play = introJs();
    play.setOptions({
        steps: stepsForThisSequence.data,
        showProgress: true,
        showBullets: false
    });
    jQuery('.toggler').trigger('click'); //Close the side menu
    if (jQuery('#contentConsumptionModal').is(':visible')) {
        jQuery('#contentConsumptionModal').modal('hide');
    }
    play.start();
}

function playThisSequence() {
    var t = jQuery("#" + jQuery('.dataTable:visible').attr('id')).DataTable();
    //t.row(jQuery(event.target).parents('tr')).remove().draw();
    var sequenceName = [t.row(jQuery(event.target).parents('tr')).data()[1]];
    playSequence(sequenceName);
}

function removeThisSequenceAsNew(sequenceName) {
    var allStoredSteps = retrieveLocalStorage();
    delete allStoredSteps[sequenceName].isNew;
    var WebHelpName = 'WebHelp.' + appNameForWebHelp;
    localStorage.setItem(WebHelpName, JSON.stringify(allStoredSteps));
    var sequences = populateCurrentSequences();
    setNewSequenceCountBadgeOnHelpIcon(sequences.numNewSequences);
}

function editThisSequence() {
    var t = jQuery("#availableSequencesList").DataTable();
    var thisSequenceTitle = t.row(jQuery(event.target).parents('tr')).data()[1];
    //t.row(jQuery(event.target).parents('tr')).remove().draw();
    var stepsForThisSequence = retrieveLocalStorage()[thisSequenceTitle];
    var stepsTable = jQuery("#stepsTable").DataTable();
    stepsTable.clear().draw();
    jQuery.each(stepsForThisSequence.data, function (index, element) {
        var title = jQuery(element.intro).children('h3').text() || '';
        var text = jQuery(element.intro).children('p').text() || '';
        var elementId = element.element || '';
        elementId = elementId.replace(/(\[|\])/g, '');
        var elementAttr = elementId;
        if (elementId.split('#').length > 1) {
            elementId = elementId.split('#')[1];
        } else if (elementId.split('=').length > 1) {
            var splitArray = elementId.split('=');
            elementId = splitArray[1].replace(/\'/g, '');
            elementAttr = splitArray[0];
        }
        stepsTable.row.add([
            "<span class='fa fa-times' aria-hidden='true' onclick='removeThisStep()'></span>",
            title,
            elementAttr,
            elementId,
            text])
            .draw();
    });
    makeEditable();
    jQuery('#sequenceTitleSetter').val(thisSequenceTitle);
    jQuery('.nav-tabs a[href=#addSequence]').tab('show');
}

function removeThisSequence() {
    var t = jQuery("#availableSequencesList").DataTable();
    var storedSteps = retrieveLocalStorage();
    delete storedSteps[t.row(jQuery(event.target).parents('tr')).data()[1]];

    var WebHelpName = 'WebHelp.' + appNameForWebHelp;
    localStorage.setItem(WebHelpName, JSON.stringify(storedSteps));
    var sequences = populateCurrentSequences();
    setNewSequenceCountBadgeOnHelpIcon(sequences.numNewSequences);
}

function getWindowParameters() {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], pair[1]];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
};
var jQueryDragSelector = {
    on: function () {
        var self = this;
        if (!this.isOn) {
            /*
             * Drag and drop jQuery enhancements under MIT license
             * http://threedubmedia.com/code/event/drag
             * http://threedubmedia.com/code/event/drop
             */
            jQuery(document)
                .drag("start", function (ev, dd) {
                    return jQuery('<div class="selection" />')
                        .css('opacity', .5)
                        .css('z-index', 999999999999)
                        .appendTo(document.body);
                })
                .drag(function (ev, dd) {
                    jQuery(dd.proxy).css({
                        top: Math.min(ev.pageY, dd.startY),
                        left: Math.min(ev.pageX, dd.startX),
                        height: Math.abs(ev.pageY - dd.startY),
                        width: Math.abs(ev.pageX - dd.startX)
                    });
                })
                .drag("end", function (ev, dd) {
                    jQuery(dd.proxy).remove();
                    jQuery('.dragSelectedElement').popover('destroy');
                    jQuery('.fadedDragSelectedElement').removeClass('fadedDragSelectedElement');

                    var selectionBoundingRect = {
                        top: (dd.offsetY < 0) ? dd.startY + dd.offsetY : dd.startY,
                        bottom: (dd.offsetY < 0) ? dd.startY : dd.startY + dd.offsetY,
                        left: (dd.offsetX < 0) ? dd.startX + dd.offsetX : dd.startX,
                        right: (dd.offsetX < 0) ? dd.startX : dd.startX + dd.offsetX
                    };

                    self.rectangleSelect('div, input, textarea, button, a, ul, li, tr, td, span', selectionBoundingRect);

                    /*Make sure only the biggest parent element is selected*/
                    var selectedDivs = [];
                    jQuery.each(jQuery('.dragSelectedElement'), function (index, element) {
                        jQuery(element).children().removeClass('dragSelectedElement');
                        if (index > 0) {
                            jQuery(element).removeClass('dragSelectedElement');
                        }
                    });
                    jQuery(jQuery('.dragSelectedElement')[0]).addClass('fadedDragSelectedElement');

                    //jQuery('.dragSelectedElement').addClass('fadedDragSelectedElement');

                    if (jQuery('.dragSelectedElement').length > 0) {
                        /*
                         * Just show the tooltip on one element even if multiple elements are selected
                         * The faded element CSS will make it clear which elements are selected
                         */
                        jQuery(jQuery('.dragSelectedElement')[0])
                            .popover({
                                html: true,
                                trigger: 'manual',
                                placement: 'auto top',
                                container: 'body', /*Show on top of all elements*/
                                content: '<div>Go ahead with this selection ?</div>' +
                                '<div class="btn-group">' +
                                '<button type="button" class="btn btn-success" onclick="jQueryDragSelector.confirmSelection(true)">Yes</button>' +
                                '<button class="btn btn-danger" onclick="jQueryDragSelector.confirmSelection(false)" type="button">No</button>' +
                                '</div>'
                            })
                            .popover('show');
                        /*TODO: I need to find a better way than binding global onclick events to the buttons*/
                    } else {
                        alertNoSelection();
                    }
                });

            this.isOn = true;
        }
    },
    isOn: false,
    selectedObjects: [],
    confirmSelection: function (confirmBoolean) {
        jQuery(jQuery('.dragSelectedElement')[0]).popover('destroy');
        var arrayOfObjects = [];
        /* Open the side-menu if it is closed*/
        var status = jQuery('#webHelpMainContent').attr("data-status");
        if(status === "closed") {
            jQuery(".toggler").trigger("click");
        }

        if (confirmBoolean) {
            jQuery.each(jQuery('.dragSelectedElement'), function (index, element) {
                jQuery(element).removeClass('dragSelectedElement fadedDragSelectedElement');
                if (index > 0) { /*Allow only one element for now*/
                    return true; //continue
                }
                var objectForArray = {
                    'attribute': '',
                    'value': ''
                };
                if (element.id) {
                    objectForArray.attribute = 'id';
                    objectForArray.value = element.id.replace(/:/g, '\\:');
                } else if ((jQuery(element).children().length === 1) && (jQuery(element).children()[0].id)) {
                    objectForArray.attribute = 'id';
                    objectForArray.value = jQuery(element).children()[0].id.replace(/:/g, '\\:');
                } else if (element.name || jQuery(element).attr('name')) {
                    objectForArray.attribute = 'name';
                    objectForArray.value = element.name || jQuery(element).attr('name');
                } else if ((jQuery(element).children().length === 1) && (jQuery(element).children()[0].name || jQuery(jQuery(element).children()[0]).attr('name'))) {
                    objectForArray.attribute = 'name';
                    objectForArray.value = jQuery(element).children()[0].name || jQuery(jQuery(element).children()[0]).attr('name');
                } else if (element.className) {
                    var jQueryClassName = '.' + element.className.split(/\s+/).join('.');
                    if (jQuery(jQueryClassName).length === 1) {
                        objectForArray.attribute = 'class';
                        objectForArray.value = element.className;
                    } else {
                        objectForArray.attribute = 'CSSPath';
                        objectForArray.value = jQuery(element).getPath();
                    }
                } else {
                    objectForArray.attribute = 'CSSPath';
                    objectForArray.value = jQuery(element).getPath();
                }
                arrayOfObjects.push(objectForArray);
            });
            createStepForThisElement(arrayOfObjects);
        } else {
            jQuery('.dragSelectedElement').removeClass('dragSelectedElement fadedDragSelectedElement');
        }

        this.selectedObjects = arrayOfObjects;
        this.off();
    },
    off: function () {
        if (this.isOn) {
            jQuery(document).unbind("draginit").unbind("dragstart").unbind("drag").unbind("dragend");
            jQuery('div, input, textarea, button, a, ul, li, tr, td, span').unbind("drop");
            this.isOn = false;
        }
    },
    rectangleSelect: function (selector, selectionBoundingRect) {
        var elements = [];
        jQuery(selector).each(function () {
            var $this = jQuery(this);
            var elemBoundingRect = $this.get(0).getBoundingClientRect();
            if ((selectionBoundingRect.top > elemBoundingRect.top)
                || (selectionBoundingRect.left > elemBoundingRect.left)
                || (selectionBoundingRect.right < elemBoundingRect.right)
                || (selectionBoundingRect.bottom < elemBoundingRect.bottom)) {
                //The element is not contained
                return true; //continue
            }

            //If we reach this point, the element is contained in the selection rectangle
            if ($this.hasClass("dragSelectedElement")) {
                $this.removeClass("dragSelectedElement");

                /*
                 * Drop action goes from biggest to smallest element
                 * Once we remove the selected class from the parent, we add it to the children (if any)
                 * so that they get toggled out in the next round
                 */
                $this.children().addClass("dragSelectedElement");
            } else {
                $this.addClass("dragSelectedElement");
            }
        });
    }
};




;
jQuery.fn.extend({
    getPath: function () {
        var path, node = this;
        while (node.length) {
            var realNode = node[0], name = realNode.localName;
            if (!name) break;
            name = name.toLowerCase();

            var parent = node.parent();

            var sameTagSiblings = parent.children(name);
            if (sameTagSiblings.length > 1) {
                allSiblings = parent.children();
                var index = allSiblings.index(realNode) + 1;
                if (index > 1) {
                    name += ':nth-child(' + index + ')';
                }
            }

            path = name + (path ? '>' + path : '');
            node = parent;
        }

        return path;
    }
});

jQuery.fn.xpathEvaluate = function (xpathExpression) {
    // NOTE: vars not declared local for debug purposes
    $this = this.first(); // Don't make me deal with multiples before coffee

    // Evaluate xpath and retrieve matching nodes
    xpathResult = this[0].evaluate(xpathExpression, this[0], null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    result = [];
    while (elem = xpathResult.iterateNext()) {
        result.push(elem);
    }

    $result = jQuery([]).pushStack( result );
    return $result;
};
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
;
/*
 * @Version: 0.1
 * @Release: 2014-02-19
 */

$.fn.tableEdit = function(settings, callback, activeMasks) {
    /*
     *
     * Settings default
     *
     */

    var defaults = {
        classTd: "tdEdit", //class to cell editable
        columnsTr: null, //index td editable, if null all td editables Ex.: "1,2,3,4,5"
        classBtEdit: "btEdit", //class of button for click event

        enableDblClick: true,

        textBtSave: "Save", //text button save
        textBtEdit: "Edit", //text button edit

        callBackObject: null, //receive object
        callback: function(){}, //return object with of values change
        activeMasks: function(){} //use to call function enable masks

    }; //cells editables

    //load settings
    settings = $.extend(defaults, settings);

    return this.each(function() {

        //if columnsTr is not null, split to array.
        var tdsIndex = (settings.columnsTr != null) ? settings.columnsTr.split(",") : null;
        //get all rows
        var trsTable = $(this).find("tbody tr");

        //funtion verify exists index
        function inArray(needle, haystack) {
            var length = haystack.length;
            for (var i = 0; i < length; i++) {
                if (haystack[i] == needle)
                    return true;
            }
            return false;
        }

        //loop in all rows
        for (k = 0; k < trsTable.length; k++) {
            element = $(trsTable)[k];
            tdsLine = $(element).find("td");

            $.each(tdsLine, function(index, td) {
                //if cell not have button edit
                if ($(td).find("." + settings.classBtEdit).length == 0) {
                    /*
                     * insert class edition
                     * for all columns or columns in tdsIndex
                     */
                    if (tdsIndex == null) {
                        $(td).addClass(settings.classTd);
                    } else {
                        if (inArray(index, tdsIndex)) {
                            $(td).addClass(settings.classTd);
                        }
                    }
                }
            });
        };

        //return create new input text
        function mountNewInput(cell) {

            var element = document.createElement("input");
            //get string in attribute ref
            var attrsString = $(cell).attr("ref");
            if(attrsString != null){
                //split attributes
                var attrsArray = attrsString.split(",");

                var currentObj;
                for(n=0; n < attrsArray.length; n++){
                    //separate name of attribute and value attribute
                    currentObj = attrsArray[n].split(":");
                    $(element).attr($.trim(currentObj[0]), $.trim(currentObj[1]));
                }
            }else{
                indexCell = $(cell).parent().children().index($(cell));
                element.setAttribute("name", "column_"+indexCell);
                element.setAttribute("type", "text");
            }

            element.setAttribute("value", $(cell).text());
            $(element).addClass("edit_from_te");
            return element;
        }

        //insert input in cell
        function editTr(tr) {
            var cells = $(tr).find("." + settings.classTd);

            $.each($(cells), function(index, cell) {
                newInput = mountNewInput($(cell));
                $(cell).html("");
                $(cell).append(newInput);
            });
            settings.activeMasks.call(this);
        }

        //insert input in cell
        function editTd(cell) {
            newInput = mountNewInput($(cell));
            $(cell).html("");
            $(cell).append(newInput).find("input").focus();
            settings.activeMasks.call(this);
        }

        //save values of inputs and create a object with values
        function saveTr(tr) {
            var cells = $(tr).find("." + settings.classTd);
            var callBackObject = {};
            $.each($(cells), function(index, cell) {
                input = $(cell).find('input');
                if(typeof($(input).attr("name")) != "undefined"){
                    newValue = $.trim($(input).val());
                    callBackObject[$(input).attr("name")] = newValue;
                    $(cell).html("");
                    $(cell).append(newValue);
                }
            });
            settings.callBackObject = callBackObject;
        }

        //return object created in saveTr()
        function getCallback(){
            settings.callback(settings.callBackObject);//how can I send var a,b here
        }

        //change buttons, save to edit and edit to save
        function changeBt(bt)
        {
            var hasClass = $(bt).hasClass(settings.classBtEdit);
            $(bt).attr("class", "").addClass( ((hasClass) ? "btSave" : settings.classBtEdit) );

            $(bt).text(((hasClass) ? settings.textBtSave : settings.textBtEdit));
            $(bt).val(((hasClass) ? settings.textBtSave : settings.textBtEdit));
        }

        //event click in button
        function clickEvent() {

            var element_clicked = $(this);
            element_verify = element_clicked;

            //search tr, element by element
            while ($(element_verify).is("tr") == false) {
                element_verify = $(element_verify).parent();
            }

/*            //if save button, call function save
            if ($(this).hasClass("btSave")) {
                saveTr(element_verify);
                getCallback();
            } else {
                //if edit button, call function save
                editTr(element_verify);
            }*/
            saveTr(element_verify);
        }

        //edit cell with double click
        function dblClickEvent(){
            //if enableDblClick is true
            if(settings.enableDblClick){
                elementBt = $(this).parent().find("."+settings.classBtEdit);
                changeBt(elementBt);
                editTd($(this));
            }
        }

        //bind to click's
        $("." + settings.classTd).bind("focusout", clickEvent);
        $("." + settings.classTd).bind("dblclick", dblClickEvent);
    });
}
;
