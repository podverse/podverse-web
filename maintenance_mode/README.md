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

### Create Let's Encrypt cert on Digital Ocean

Read more at <https://certbot-dns-digitalocean.readthedocs.io/en/stable/>

This proccess assumes that the user will be using Digital Ocean API key and DNS to validate Let's Encrypt

#### VPS API key

Skipping the how to generate steps

Note: Replace `0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff` wit real key

```bash
APIKEY='0000111122223333444455556666777788889999aaaabbbbccccddddeeeeffff'
mkdir ~/.secrets/certbot/
echo "dns_digitalocean_token = ${APIKEY}" > ~/.secrets/certbot/digitalocean.ini
chmod 600 ~/.secrets/certbot/digitalocean.ini
```

#### Run certbot

```bash
certbot certonly \
  --dns-digitalocean \
  --dns-digitalocean-credentials ~/.secrets/certbot/digitalocean.ini \
  -d podverse.fm \
  -d '*.podverse.fm' \
  -d '*.stage.podverse.fm' \
```

#### Validate certbot files

The conf files expect the files to be at the following locations

```text
/etc/letsencrypt/live/podverse.fm/fullchain.pem;
/etc/letsencrypt/live/podverse.fm/privkey.pem;
```

Validate with something like

```bash
ls -ahl /etc/letsencrypt/live/podverse.fm/fullchain.pem;
ls -ahl /etc/letsencrypt/live/podverse.fm/privkey.pem;
```
