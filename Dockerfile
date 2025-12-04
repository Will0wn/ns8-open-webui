FROM scratch
ADD imageroot /
LABEL org.nethserver.rootfull="0"
LABEL org.nethserver.tcp_ports_demand="1"
LABEL org.nethserver.images="ghcr.io/open-webui/open-webui:latest"

