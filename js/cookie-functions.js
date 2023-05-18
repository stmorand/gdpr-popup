let tools; // tools to dynamically add

/* return the content of a cookie */
function getCookie(name){
    if(document.cookie.length === 0)
        return null;

    var regSepCookie = new RegExp('(; )', 'g');
    var cookies = document.cookie.split(regSepCookie);

    for(var i = 0; i < cookies.length; i++){
        var regInfo = new RegExp('=', 'g');
        var infos = cookies[i].split(regInfo);
        if(infos[0] === name){
            return decodeURI(infos[1]);
        }
    }
    return null;
}

/* return the cookies user checked to agree (may not submitted yet though) */
function getAgreedTools() {
    return getCookie('consent')!=null ? getCookie('consent').split('||') : 'no cookie';
}

/* reset the content of cookie consent content */
function resetConsent(consent='') {
    document.cookie = 'consent=' + consent;
}

/* return if the user gave is consent for a certain type of tool */
function isConsent(consentType) {
    return getAgreedTools().includes(consentType)
}

/* a consent is given? it will be removed. Otherwise it will be given */
function toggleConsent(consentType) {
    console.log("***toggleConsent");
    if (isConsent(consentType)) {
        console.log("removeConsent");
        removeConsent(consentType)
    }
    else {
        console.log("giveConsent");
        giveConsent(consentType)
    }
}

/*  give consent for an app type */
/*  "technical","third-party","ads","optional" */
function giveConsent(consentType) {
    if (!isConsent(consentType)) {
        resetConsent(consentType + (getCookie('consent')?"||" + getCookie('consent'):''))
    }
}

/*  remove consent for an app type */
function removeConsent(consentType) {
    if (isConsent(consentType)) {
        let tempAgreedTools = getAgreedTools();
        let consentIndex = tempAgreedTools.indexOf(consentType);
        tempAgreedTools.splice(consentIndex, 1);
        resetConsent(tempAgreedTools.join('||'));
    }
}

/* show the popup */
function showCookiePopup() {
    document.getElementById("cookie-popup").classList.add("cookie-visible");
    document.getElementById("cookie-popup").classList.remove("cookie-hidden");
}
/* hide the popup */
function hideCookiePopup() {
    document.getElementById("cookie-popup").classList.remove("cookie-visible");
    document.getElementById("cookie-popup").classList.add("cookie-hidden");
}

/* If the user didn't submit is consent, or want to show the popup again, the checkboxes are checked according to his previous choices */
function initCheckboxes() {
    for (let i = 0; i < getAgreedTools().length; i++) {
        document.getElementById('chk-'+getAgreedTools()[i]).checked = true;
    }
}

/* After checking and unchecking, the user submit and a cookie is saved to let us know his/her choice */
function confirmConsent() {
    document.cookie = 'consentConfirmed=' + Date.now();
    hideCookiePopup();
    setupTools();
}
/* check if the user gave and confirmed his/her consent */
function isConsentGiven() {
    return getCookie('consentConfirmed')!=null
}

/* retrieve, either by type, or all  */
/* can be "technical", "third-party","ads","optional" or "all" */
function getTools(toolType = "all") {
    return toolType ==="all" ? tools : tools[toolType];
}

/* load the tools included in tools.json */
function loadToolsJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'tools.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

/* function called when loading index page */
function init() {
    giveConsent("technical"); //technical tools must be agreed
    loadToolsJSON(function(response) {
        // Parse JSON string into object
        tools = JSON.parse(response);
        if (Object.keys(tools).length > 0) {
            if (
                (tools["technical"] === null || tools["technical"].length === 0)&&
                (tools["third-party"] === null || tools["third-party"].length === 0)&&
                (tools["ads"] === null || tools["ads"].length === 0)&&
                (tools["optional"] === null || tools["optional"].length === 0)
                ) {
                document.getElementById("cookie-popup").style.display = "none";
            }
            else {
                document.getElementById("chk-technical-container").style.display = (tools["technical"] !== null && tools["technical"].length > 0) ? "block" :"none";
                document.getElementById("chk-third-party-container").style.display = (tools["third-party"] !== null && tools["third-party"].length > 0) ? "block" :"none";
                document.getElementById("chk-ads-container").style.display = (tools["ads"] !== null && tools["ads"].length > 0) ? "block" :"none";
                document.getElementById("chk-optional-container").style.display = (tools["optional"] !== null && tools["optional"].length > 0) ? "block" :"none";
            }
            if (isConsentGiven())
                setupTools();
            else {
                showCookiePopup();
                initCheckboxes();
            }
        }
        getTools();
    });
}

/* When the consent is given the tools provided in tools.json are set up*/
function setupTools() {
    if (isConsent("technical")) {
        for (let i=0; i<tools["technical"].length;i++) {
            setupTool(tools["technical"][i]["position"], tools["technical"][i]["script"])
        }
    }
    if (isConsent("third-party")) {
        for (let i=0; i<tools["third-party"].length;i++) {
            setupTool(tools["third-party"][i]["position"], tools["third-party"][i]["script"])
        }
    }
    if (isConsent("ads")) {
        for (let i=0; i<tools["ads"].length;i++) {
            setupTool(tools["ads"][i]["position"], tools["ads"][i]["script"])
        }
    }
    if (isConsent("optional")) {
        for (let i=0; i<tools["ads"].length;i++) {
            setupTool(tools["optional"][i]["position"], tools["optional"][i]["script"])
        }
    }
}

// function to set up all the agreed tools
// scriptToAdd : script to add (once agreed)
// position : header tag (ht), after body tag (abt), before end body tag (bebt)
function setupTool(position, scriptToAdd) {
    let tempHTML = "<div>" + scriptToAdd + "</div>";

    let range = document.createRange();

    range.selectNode(document.getElementsByTagName("div").item(0));
    let documentFragment = range.createContextualFragment(tempHTML);

    if (documentFragment.hasChildNodes()) {
        let children = documentFragment.firstChild.childNodes;

        for (var i = 0; i < children.length; i++) {
            switch (position) {
                case "abt":
                    document.body.prepend(children[i]);
                    break;
                case "bebt":
                    document.body.appendChild(children[i]);
                    break;
                case "ht":
                default:
                    document.head.appendChild(children[i]);
                    break;
            }
        }
    }
}
