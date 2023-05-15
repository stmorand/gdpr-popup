let tools;
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
function getAgreedTools() {
    return getCookie('consent')!=null ? getCookie('consent').split('||') : 'no cookie';
}

function resetConsent(consent='') {
    document.cookie = 'consent=' + consent;
}

function isConsent(consentType) {
    return getAgreedTools().includes(consentType)
}

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
        resetConsent(consentType + "||" + getCookie('consent'))
    }
}

function removeConsent(consentType) {
    if (isConsent(consentType)) {
        let tempAgreedTools = getAgreedTools();
        let consentIndex = tempAgreedTools.indexOf(consentType);
        tempAgreedTools.splice(consentIndex, 1);
        resetConsent(tempAgreedTools.join('||'));
    }
}

function showCookiePopup() {
    document.getElementById("cookie-popup").style.display = 'block';
}

function initCheckboxes() {
    for (let i = 0; i < getAgreedTools().length; i++) {
        document.getElementById('chk-'+getAgreedTools()[i]).checked = true;
    }
}

function confirmConsent() {
    document.cookie = 'consentConfirmed=' + Date.now();
    setupTools();
}
function isConsentGiven() {
    return getCookie('consentConfirmed')!=null
}

/* retrieve, either by type, or all  */
/* can be "technical", "third-party","ads","optional" or "all" */
function getTools(toolType = "all") {
    console.log(tools);
}

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

function init() {
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
        }
        getTools();
    });
}

/* When the consent is given the tools provided in tools folder are setup*/
function setupTools() {
    console.log("setting up the tools");
}