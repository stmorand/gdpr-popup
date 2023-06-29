# gdpr-popup
GDPR popup is a script that helps manage GDPR consent
https://portfolio.morand.pro/gdpr-popup/

## author
[Stephan] https://stephanmorand.com

## stored cookies 
The script stores 2 cookies on the user end :
* consent : list of cookie types the user pre-consent (checked)
* consentConfirmed : status that indicates if the consent was submitted.

No other cookies should be stored before consent is confirmed, unless technical
 
## list of tools that need consent
* tools.json contains the tools that need the user consent.
* Each tool can be categorized as technical, third-party, ads or optionnal
* Each tool is defined by :
    * name : identifier (chosen by you) 
    * script : script to add after user consent is given
    * position : where to add the script in the page source code
      * header tag (ht), 
      * after body tag (abt), 
      * before end body tag (bebt)
         
      `{
        "name": "RQ",
        "position": "ht",
        "script": "<script>console.log('required tag')</script>"
        }`

## style
Style can be customized via scss/cookie-theme.scss (ie. css/cookie-theme.css)
