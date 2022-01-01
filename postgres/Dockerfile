FROM postgres:14.1-alpine
USER root
COPY . .
RUN chmod +x import-databases.sh
USER postgres

EXPOSE 5432
CMD [ "postgres" ]