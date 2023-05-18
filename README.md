# gdpr-popup
GDPR popup is a script that helps manage GDPR consent

* tools.json contains the tools that need the user consent.
* Each tool can be categorized as technical, third-party, ads or optionnal
* Each tool is defined by :
    * name : identifier (chosen by you) 
    * script : script to add after user consent is given
    * position : where to add the script in the page source code
      * header tag (ht), 
      * after body tag (abt), 
      * before end body tag (bebt)


Style
Style can be customized via scss/theme.scss (ie. css/theme.css)