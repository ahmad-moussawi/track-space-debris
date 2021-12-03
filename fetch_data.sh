LIMIT=5000
FORMAT=json
url="https://www.space-track.org/basicspacedata/query/class/gp/predicates/OBJECT_ID,OBJECT_NAME,COMMENT,PERIOD,ORIGINATOR,CENTER_NAME,OBJECT_TYPE,RCS_SIZE,COUNTRY_CODE,LAUNCH_DATE,TLE_LINE1,TLE_LINE2/RCS_SIZE/%3C%3E/orderby/OBJECT_ID%20desc/format/$FORMAT/limit/$LIMIT"
form_data="identity=cedarxteam@gmail.com&password=CedarXteam2021Leb&query=$url"



curl https://www.space-track.org/ajaxauth/login -d $form_data > "data/data.$FORMAT"