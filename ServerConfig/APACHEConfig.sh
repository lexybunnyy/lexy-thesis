## APACHE Config
## 
## http://api.jquery.com/jquery.getjson/
## ForceCORS
## file:///home/oem/git/project/WebPage/prepare_page.html

##--- telepítés
sudo apt-get install apache2
sudo apt-get install libapache2-mod-proxy-html
sudo apt-get install libxml2-dev
sudo a2enmod proxy proxy_http

##-- fájl 
## cd /etc/apache2/sites-available/
## sudo cp 000-default.conf szakdoli.conf
sudo cp /home/oem/git/project/ServerConfig/szakdoli.conf /etc/apache2/sites-available/szakdoli.conf  
## sudo subl szakdoli.conf

##-- inicializálás és restart
sudo a2ensite szakdoli.conf
sudo /etc/init.d/apache2 restart

##-- ami lényeges benne - nagygép infói
## szakdoli.conf: 
## DocumentRoot /home/oem/git/project/WebPage/
## ProxyPass /API http://192.168.1.103:8082
## %%erl httpServer:start(8082).
## %%http://192.168.1.103:8086/prepare_page.html
## %%http://192.168.1.103:8086/API

## https://www.a2hosting.com/kb/developer-corner/apache-web-server/modifying-http-headers

## ez már nem kell - csak hotfix lett volna
## Header Name	Header Value
## Access-Control-Allow-Origin	http://192.168.1.103:8082
## Access-Control-Allow-Methods	POST, GET, OPTIONS
## Access-Control-Allow-Headers	X-PINGOTHER
## Access-Control-Max-Age	1728000
## Origin	http://192.168.1.103:8082