FROM mongo:4.2
ADD ./mongo-tools.sh /mongo-tools.sh
ADD ./setup.sh /setup.sh

RUN apt-get update && apt-get install -y netcat-openbsd

ENTRYPOINT ["/bin/bash", "/setup.sh"]
