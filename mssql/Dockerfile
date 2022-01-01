FROM mcr.microsoft.com/mssql/server:2019-latest
USER root
RUN apt-get -y update  && \
  apt-get install -y curl && \
  curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
  apt-get install -y dos2unix
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN dos2unix *
RUN chmod +x /usr/src/app/import-databases.sh
EXPOSE 1433
USER mssql
ENTRYPOINT /bin/bash ./entrypoint.sh