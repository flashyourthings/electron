FROM balenablocks/aarch64-balena-electron-env:v1.2.9

COPY package.json package-lock.json ./
RUN npm i --production
RUN npm i electron
COPY index.js index.html renderer.js ./
COPY .xserverrc /root/.xserverrc
COPY .xinitrc /root/.xinitrc
