# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # use ubuntu trusty64 box (v14)
  config.vm.box = "ubuntu/trusty64"

  # give a hostname to the box
  config.vm.hostname = "node-toolbox"

  # forward http-server port to guest
  # Dev http-server
  config.vm.network "forwarded_port", guest: 8000, host: 8000
  # Karma http-server
  config.vm.network "forwarded_port", guest: 9876, host: 9876
  # http-server runningin docker container
  config.vm.network "forwarded_port", guest: 80, host: 1080
  #  grunt serve
  config.vm.network "forwarded_port", guest: 9000, host: 9000
  #  livereload
  config.vm.network "forwarded_port", guest: 35729, host: 35729
  # Karma http-server with yeoman
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  # node server
  config.vm.network "forwarded_port", guest: 1337, host: 1337


  config.vm.provider "virtualbox" do |v|
    v.memory = 1024
  end

  # fix annoying messages about stdin
  config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"

  # run the installation script
  config.vm.provision "shell", path: "./install-env.bash"
  #config.vm.provision "shell", inline: "bash /vagrant/install-env.bash 2>&1 | tee /vagrant/install-env.log"

end
