# Maintenance Mode

## Makefile

Run

```bash
make local_up_maintenance_mode
```

## VPS host

### Needed

* nginx
* Let's encrypt

### Ubunt update

```bash
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
sudo reboot
```

### Ubuntu app install

```bash
sudo apt install -y nginx
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-digitalocean
```

### Add conf files

Note: Expected path to files `/opt/podverse-ops/projects/podverse-web/maintenance_mode`

```bash
Maintenance_Mode_path=/opt/podverse-ops/projects/podverse-web/maintenance_mode
cp -r ${Maintenance_Mode_path}/conf.d/* /etc/nginx/conf.d/
```

### Add html files

Note: Expected path to files `/opt/podverse-ops/projects/podverse-web/maintenance_mode`

```bash
Maintenance_Mode_path=/opt/podverse-ops/projects/podverse-web/maintenance_mode
cp -r ${Maintenance_Mode_path}/html/* /usr/share/nginx/html/
```
