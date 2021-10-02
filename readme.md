- Fetch API -> json
- Parse API: parseApi(LET, DateTime) -> (lat, lng, alt)
- Plot 3d globe
- Conjuction assesment


- Check the coordinate (Ahmad/Hassan)
- 2nd approach to fetch files with future dates and process to generate simple json (Hassan)
- Filters (size, altitude)

- Select a position in space
    - Show probability of colision
    - Show probability of colision

- Select point on earth -> calculate the time when the debris will pass over this point


curl -c -k https://www.space-track.org/ajaxauth/login -d 'identity=cedarxteam@gmail.com&password=CedarXteam2021Leb&query=https://www.space-track.org/basicspacedata/query/class/gp/predicates/OBJECT_ID,OBJECT_NAME,NORAD_CAT_ID,OBJECT_TYPE,PERIOD,INCLINATION,APOGEE,PERIGEE,ECCENTRICITY,MEAN_MOTION,SEMIMAJOR_AXIS/emptyresult/show/format/json&limit=10'


cedarxteam@gmail.com
CedarXteam2021Leb

curl -c -k https://www.space-track.org/ajaxauth/login -d 'identity=cedarxteam@gmail.com&password=CedarXteam2021Leb&query=https://www.space-track.org/basicspacedata/query/class/gp/predicates/OBJECT_ID,OBJECT_NAME,NORAD_CAT_ID,OBJECT_TYPE,PERIOD,INCLINATION,APOGEE,PERIGEE,ECCENTRICITY,MEAN_MOTION,SEMIMAJOR_AXIS/emptyresult/show/format/json'

curl -c -k https://www.space-track.org/ajaxauth/login -d 'identity=cedarxteam@gmail.com&password=CedarXteam2021Leb&query=https://www.space-track.org/basicspacedata/query/class/gp/predicates/OBJECT_ID,OBJECT_NAME,NORAD_CAT_ID,OBJECT_TYPE,PERIOD,INCLINATION,APOGEE,PERIGEE,ECCENTRICITY,MEAN_MOTION,SEMIMAJOR_AXIS/emptyresult/show/format/json'