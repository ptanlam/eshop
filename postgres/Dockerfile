FROM postgres:14.1-alpine
USER root
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN chmod +x /usr/src/app/import-databases.sh
USER postgres
ENTRYPOINT /bin/bash /usr/src/app/entrypoint.sh

EXPOSE 5432
CMD [ "postgres" ]