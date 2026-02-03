# Option ngixn and ssl sertificate
``` 
server {
    server_name bolto.itstep.click;
    client_max_body_size 200M;
    location / {
        proxy_pass http://127.0.0.1:3589;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

systemctl restart nginx

certbot

docker compose pull

docker compose up -d







