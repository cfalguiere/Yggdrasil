#!/bin/bash -e

cd /vagrant

echo "Starting at $( date )"

echo '######################'
echo 'Updating apt'
echo '######################'

sudo apt-get update
sudo locale-gen en_US.UTF-8
sudo locale-gen fr_FR.UTF-8

echo '######################'
echo 'Installing Proxy Cache'
echo '######################'

sudo apt-get install -y squid
if [ ! -f /etc/squid3/squid.conf.original ]; then
  # avoid rewriting when provision is run again
  sudo cp /etc/squid3/squid.conf /etc/squid3/squid.conf.original
  sudo chmod a-w /etc/squid3/squid.conf.original
  sudo echo http_port 8888 >> /etc/squid3/squid.conf
  sudo sed -i '$a http_port 8888' /etc/squid3/squid.conf

  sudo sed -i '$a http_proxy="http://localhost:8888/"' /etc/environment
  sudo sed -i '$a https_proxy="http://localhost:8888/"' /etc/environment
  sudo sed -i '$a ftp_proxy="http://localhost:8888/"' /etc/environment
  sudo sed -i '$a no_proxy="localhost,127.0.0.1,localaddress,.localdomain.com"' /etc/environment
  sudo sed -i '$a HTTP_PROXY="http://localhost:8888/"' /etc/environment
  sudo sed -i '$a HTTPS_PROXY="http://localhost:8888/"' /etc/environment
  sudo sed -i '$a FTP_PROXY="http://localhost:8888/"' /etc/environment
  sudo sed -i '$a NO_PROXY="localhost,127.0.0.1,localaddress,.localdomain.com"' /etc/environment

  sudo cat >/tmp/95proxies <<'EOT'
Acquire::http::proxy "http://localhost:8888/";
Acquire::ftp::proxy "ftp://localhost:8888/";
Acquire::https::proxy "https://localhost:8888/";
EOT
  sudo mv /tmp/95proxies /etc/apt/apt.conf.d/95proxies
  sudo apt-get update

  sudo service squid3 reload
fi
# sudo cat /var/log/squid3/access.log

echo '######################'
echo 'Installing node packages'
echo '######################'

sudo apt-get -y install git
sudo apt-get -y install nodejs
sudo apt-get install nodejs-legacy
sudo apt-get -y install npm

npm update

echo '######################'
echo 'Installing yeoman'
echo '######################'

npm install -g yo bower grunt-cli karma-cli
npm install -g generator-angular

#npm install --save-dev grunt-shell

npm update

echo '######################'
echo 'Installing http-server'
echo '######################'

# to be able to run npm start and bind eth0 instead of localhost
sudo npm install -g http-server

echo '######################'
echo 'Installing Test tools'
echo '######################'

# get rid of "should be installed with -g" messages
npm install -g jasmine-node

# work around a problem with karma on phantomJS
sudo apt-get -y install libfontconfig

echo '######################'
echo 'Installing Python'
echo '######################'

sudo apt-get -y install python-pip
sudo pip install pylast

export PYTHONIOENCODING=utf-8


echo '######################'
echo 'Installing Docker'
echo '######################'

sudo apt-get install -y docker.io
sudo docker run --rm -v /usr/local/bin:/target jpetazzo/nsenter


echo '######################'

echo "Ending at $( date )"
echo "Run vagrant ssh to connect to the dev environnement, cd /vagrant and use npm commands (check package.json scripts)"


exit




