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
    document.getElementById("cookie-popup").classList.add("cookie-visible");
    document.getElementById("cookie-popup").classList.remove("cookie-hidden");
}
function hideCookiePopup() {
    document.getElementById("cookie-popup").classList.remove("cookie-visible");
    document.getElementById("cookie-popup").classList.add("cookie-hidden");
}

function initCheckboxes() {
    for (let i = 0; i < getAgreedTools().length; i++) {
        document.getElementById('chk-'+getAgreedTools()[i]).checked = true;
    }
}

function confirmConsent() {
    document.cookie = 'consentConfirmed=' + Date.now();
    hideCookiePopup();
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
    giveConsent("technical");
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

/* When the consent is given the tools provided in tools folder are setup*/
function setupTools() {
    console.log("setting up the tools");
    if (isConsent("technical")) {
        console.log("setting up the technical tools");
        for (let i=0; i<tools["technical"].length;i++) {
            setupTool(tools["technical"][i]["position"], tools["technical"][i]["script"])
        }
    }
    if (isConsent("third-party")) {
        console.log("setting up the third-party tools");
        for (let i=0; i<tools["third-party"].length;i++) {
            setupTool(tools["third-party"][i]["position"], tools["third-party"][i]["script"])
        }
    }
    if (isConsent("ads")) {
        console.log("setting up the ads tools");
        for (let i=0; i<tools["ads"].length;i++) {
            setupTool(tools["ads"][i]["position"], tools["ads"][i]["script"])
        }
    }
    if (isConsent("optional")) {
        console.log("setting up the optional tools");
        for (let i=0; i<tools["ads"].length;i++) {
            setupTool(tools["optional"][i]["position"], tools["optional"][i]["script"])
        }
    }
}
// scriptToAdd : script to add (once agreed)
// position : header tag (ht), after body tag (abt), before end body tag (bebt)
function setupTool(position, scriptToAdd) {
    let tempHTML = "<div>" + scriptToAdd + "</div>";

    let range = document.createRange();
// fait que le parent de la première div du document devient le nœud de contexte
    range.selectNode(document.getElementsByTagName("div").item(0));
    let documentFragment = range.createContextualFragment(tempHTML);


    if (documentFragment.hasChildNodes()) {
        let children = documentFragment.firstChild.childNodes;

        for (var i = 0; i < children.length; i++) {
            // faire quelque chose avec chaque enfant[i]
            // NOTE: La liste est en ligne, l'ajout ou la suppression des enfants changera la liste
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
