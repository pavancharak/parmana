FROM nginx:alpine

# Static dashboard only, HTML/CSS/JS plus pre-generated JSON. No backend,
# no secrets, no OpenAI key anywhere in this image, so nothing here can
# spend real money regardless of how the deployed URL gets used.
COPY web/ /usr/share/nginx/html/

EXPOSE 80
