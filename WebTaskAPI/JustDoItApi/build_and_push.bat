@echo off

REM ==== API ====
docker build -t bolto-api .
docker tag bolto-api:latest novakvova/bolto-api:latest
docker push novakvova/bolto-api:latest

echo DONE
pause
