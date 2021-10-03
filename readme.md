# Track Space Trash in Real Time

<i>This project is a part of the competition done by https://www.spaceappschallenge.org/</i>

# Introduction

# Technology used
 This project if fully open source, with no licence attached, feel free to do whatever you want, no need to get back to the original author.
it depends heavily on open source libraries, please check each library for it's licence.

Here is a list of the libraries used:
 - Three.js
 - three-globe
 - satellite.js
 - three-interaction.js
 - lodash
 - date-fns

check the package.json file for more detailed info.

# Team members
 - Miriam Matar
 - Manuel Richa
 - Hassan Kassem
 - Emile Zamir
 - Ahmad Moussawi

# Data Source
The data was provided by Space Track, below are simple request example used to download the information

curl -c -k https://www.space-track.org/ajaxauth/login -d 'identity=cedarxteam@gmail.com&password=CedarXteam2021Leb&query=https://www.space-track.org/basicspacedata/query/class/gp/predicates/OBJECT_ID,OBJECT_NAME,NORAD_CAT_ID,OBJECT_TYPE,PERIOD,INCLINATION,APOGEE,PERIGEE,ECCENTRICITY,MEAN_MOTION,SEMIMAJOR_AXIS/emptyresult/show/format/json&limit=10'

curl -c -k https://www.space-track.org/ajaxauth/login -d 'identity=cedarxteam@gmail.com&password=PASSWORD_HERE&query=https://www.space-track.org/basicspacedata/query/class/gp/predicates/OBJECT_ID,OBJECT_NAME,NORAD_CAT_ID,OBJECT_TYPE,PERIOD,INCLINATION,APOGEE,PERIGEE,ECCENTRICITY,MEAN_MOTION,SEMIMAJOR_AXIS/emptyresult/show/format/json'

curl -c -k https://www.space-track.org/ajaxauth/login -d 'identity=cedarxteam@gmail.com&password=PASSWORD_HERE&query=https://www.space-track.org/basicspacedata/query/class/gp/predicates/OBJECT_ID,OBJECT_NAME,NORAD_CAT_ID,OBJECT_TYPE,PERIOD,INCLINATION,APOGEE,PERIGEE,ECCENTRICITY,MEAN_MOTION,SEMIMAJOR_AXIS/emptyresult/show/format/json'