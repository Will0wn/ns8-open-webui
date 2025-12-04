FROM scratch
ADD imageroot /
LABEL org.nethserver.rootfull="0"
LABEL org.nethserver.tcp-ports-demand="1"
LABEL org.nethserver.images="ghcr.io/open-webui/open-webui:latest"

