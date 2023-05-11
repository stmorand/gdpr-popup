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
    alert(getAgreedTools());
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

function initCheckboxes() {
    for (let i = 0; i < getAgreedTools().length; i++) {
        document.getElementById('chk-'+getAgreedTools()[i]).checked = true;
    }
}
