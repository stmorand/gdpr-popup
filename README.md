# gdpr-popup
GDPR popup is a script that manage GDPR consent from a developer point of view

* tools.json contains the tools that need the user consent.
* Each tool has a matching json file within the tools folder and needs :
    * id : unique id -> tools/[id].json  
    * script : script to add once agreed 
    * position : before body tag (bbt), after body tag (abt), after end body tag (aebt)
